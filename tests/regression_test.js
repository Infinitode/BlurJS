(() => {
    const cases = [];
    const reducedMotion = () => matchMedia("(prefers-reduced-motion: reduce)").matches;
    const afterMutations = () => new Promise(resolve => setTimeout(resolve, 0));

    function test(name, markup, run, options = {}) {
        cases.push({ name, markup, run, ...options });
    }

    function equal(actual, expected, label = "Value") {
        const matches = expected instanceof RegExp ? expected.test(actual) :
            typeof expected === "object" && expected !== null ? JSON.stringify(actual) === JSON.stringify(expected) :
                actual === expected;
        if (!matches) throw new Error(`${label}: expected ${expected instanceof RegExp ? expected : JSON.stringify(expected)}, got ${JSON.stringify(actual)}`);
    }

    function css(element, property, expected) {
        const actual = element.ownerDocument.defaultView.getComputedStyle(element).getPropertyValue(property);
        equal(actual, expected, `${element.id || element.tagName} ${property}`);
    }

    function dispatch(element, type) {
        element.dispatchEvent(new element.ownerDocument.defaultView.Event(type));
    }

    async function eventually(assertion) {
        const deadline = performance.now() + 2500;
        while (true) {
            try {
                return assertion();
            } catch (error) {
                if (performance.now() >= deadline) throw error;
                await new Promise(resolve => setTimeout(resolve, 25));
            }
        }
    }

    async function withTimeout(promise, message) {
        let timer;
        try {
            return await Promise.race([promise, new Promise((_, reject) => {
                timer = setTimeout(() => reject(new Error(message)), 5000);
            })]);
        } finally {
            clearTimeout(timer);
        }
    }

    async function runInFrame(filename, scenario) {
        const frame = document.createElement("iframe");
        frame.title = "Isolated regression test";
        frame.tabIndex = -1;
        frame.setAttribute("aria-hidden", "true");
        const script = `<script src="../dist/${filename}"></script>`;
        const setup = scenario.setup ? `(${scenario.setup})();` : "";
        const ready = new Promise(resolve => frame.addEventListener("load", resolve, { once: true }));
        frame.srcdoc = `<!doctype html><head><script>
            window.fixtureErrors = [];
            addEventListener("error", event => fixtureErrors.push(event.message || "Resource failed to load"), true);
            ${setup}
            </script>${scenario.inHead ? script : ""}</head>
            <body>${scenario.markup}${scenario.inHead ? "" : script}</body>`;
        document.body.append(frame);
        try {
            await withTimeout(ready, "Test iframe did not load");
            const win = frame.contentWindow;
            const doc = frame.contentDocument;
            const select = selector => {
                const element = doc.querySelector(selector);
                if (!element) throw new Error(`Missing element: ${selector}`);
                return element;
            };
            const keyframes = () => Array.from(doc.styleSheets).flatMap(sheet =>
                Array.from(sheet.cssRules).filter(rule => rule.type === win.CSSRule.KEYFRAMES_RULE).map(rule => rule.name));
            const loadAgain = () => new Promise((resolve, reject) => {
                const extra = doc.createElement("script");
                extra.src = `../dist/${filename}`;
                extra.onload = resolve;
                extra.onerror = () => reject(new Error("Duplicate script did not load"));
                doc.body.append(extra);
            });
            await withTimeout(scenario.run({ win, doc, select, keyframes, loadAgain }), "Test timed out");
            equal(win.fixtureErrors, [], "Browser errors");
        } finally {
            frame.remove();
        }
    }

    test("preserves inline styles and parses custom CSS", `
        <div id="default" class="blur" blur-width="not-a-length"></div>
        <div id="custom" class="blur" style="width: 70px; height: 62px; outline: 2px solid teal;"
             blur-width="100px" blur-amount="8px" blur-mix-blend-mode="multiply"
             blur-custom='--Accent: rebeccapurple; color: var(--Accent); width: 90px !important;
                          background-image: url("data:image/svg+xml;charset=utf-8,%3Csvg/%3E");'></div>
    `, ({ select }) => {
        const defaults = select("#default");
        css(defaults, "position", "absolute");
        css(defaults, "width", "50px");
        css(defaults, "height", "50px");
        css(defaults, "filter", "blur(25px)");
        css(defaults, "background-color", "rgb(255, 0, 0)");
        const custom = select("#custom");
        css(custom, "width", "90px");
        css(custom, "height", "62px");
        css(custom, "outline-style", "solid");
        css(custom, "color", "rgb(102, 51, 153)");
        css(custom, "background-image", /data:image\/svg\+xml;charset=utf-8,%3Csvg\/%3E/i);
        css(custom, "filter", "blur(8px)");
        css(custom, "mix-blend-mode", "multiply");
        equal(custom.style.getPropertyPriority("width"), "important", "Custom width priority");
    });

    test("layers translucent grain over colors and gradients", `
        <div id="color" class="blur" blur-grain="true" blur-background="tomato"></div>
        <div id="gradient" class="blur" blur-grain="true"
             blur-custom="background: linear-gradient(teal, purple) left / 50% no-repeat;"></div>
    `, ({ select }) => {
        css(select("#color"), "background-color", "rgb(255, 99, 71)");
        css(select("#color"), "background-image", /^url\("data:image\/svg\+xml/);
        css(select("#gradient"), "background-image", /^url\("data:image\/svg\+xml.*linear-gradient\(/);
        css(select("#gradient"), "background-size", /^auto, 50%( auto)?$/);
    });

    test("composes translation, scale, rotation and the author transform", `
        <div class="blur" blur-interaction="click" blur-translate-x="20px" blur-translate-y="40px"
             blur-scale="1.5" blur-rotate="90deg"
             style="translate: 5px 7px; transform: rotate(10deg); transform-origin: left top;"></div>
    `, async ({ select, win }) => {
        const blur = select(".blur");
        const animations = blur.getAnimations();
        equal(animations.length, 4);
        await Promise.all(animations.map(animation => animation.ready));
        equal(animations.map(animation => animation.playState), Array(4).fill("paused"));
        for (const animation of animations) animation.currentTime = 500;
        css(blur, "translate", "25px 47px");
        css(blur, "scale", "1.5");
        css(blur, "rotate", "90deg");
        const matrix = new win.DOMMatrixReadOnly(win.getComputedStyle(blur).transform);
        equal(Math.round(matrix.a * 10000) / 10000, 0.9848);
        css(blur, "transform-origin", "0px 0px");
        blur.click();
        equal(animations.map(animation => animation.playState), Array(4).fill("running"));
    }, { skip: () => reducedMotion() || !CSS.supports("animation-composition", "add") || !CSS.supports("translate", "0px") });

    test("keeps single-axis movement without additive composition", `
        <div class="blur" blur-translate-y="-20px" blur-interaction="click"></div>
    `, async ({ select, win }) => {
        const blur = select(".blur");
        const [animation] = blur.getAnimations();
        await animation.ready;
        animation.currentTime = 500;
        equal(new win.DOMMatrixReadOnly(win.getComputedStyle(blur).transform).m42, -20);
    }, {
        skip: reducedMotion,
        setup: () => {
            const supports = CSS.supports.bind(CSS);
            CSS.supports = (...args) => args[0] !== "animation-composition" && supports(...args);
        }
    });

    test("deduplicates identical keyframes but keeps opposite values separate", `
        <div id="plus" class="blur" blur-translate-x="+5px"></div>
        <div id="minus" class="blur" blur-translate-x="-5px"></div>
        <div id="repeat" class="blur" blur-translate-x="+5px"
             blur-translate-x-duration="2s" blur-translate-x-delay="300ms"></div>
    `, ({ select, keyframes }) => {
        equal(keyframes().length, 2);
        equal(select("#plus").style.animationName === select("#minus").style.animationName, false);
        equal(select("#repeat").style.animationName, select("#plus").style.animationName);
        css(select("#repeat"), "animation-duration", "2s");
        css(select("#repeat"), "animation-delay", "0.3s");
    });

    test("isolates malformed animation targets and options", `
        <div class="blur" style="--Duration: 2s" blur-scale="2" blur-scale-duration="fast"
             blur-scale-delay="400ms" blur-scale-timing="ease, linear" blur-scale-repetitions="inherit"
             blur-opacity="0.5" blur-opacity-duration="var(--Duration, 1s)"
             blur-opacity-timing="cubic-bezier(0.2, 0.4, 0.6, 1)" blur-opacity-repetitions="3"
             blur-rotate="not-an-angle" blur-translate-x="8px 9px"></div>
    `, ({ select, keyframes }) => {
        const blur = select(".blur");
        equal(keyframes().length, CSS.supports("scale", "2") ? 2 : 1);
        if (!CSS.supports("scale", "2")) return;
        css(blur, "animation-duration", /^1s,\s*2s$/);
        css(blur, "animation-delay", /^0\.4s,\s*0s$/);
        css(blur, "animation-iteration-count", /^infinite,\s*3$/);
        css(blur, "animation-timing-function", /^linear,\s*cubic-bezier\(/);
    });

    test("initializes from the head and handles nested insertion without duplicate handlers", `
        <div id="click" class="blur" blur-scale="2" blur-interaction="click"></div>
    `, async ({ doc, select, loadAgain, keyframes }) => {
        const click = select("#click");
        css(click, "animation-play-state", "paused");
        await loadAgain();
        const wrapper = doc.createElement("section");
        wrapper.innerHTML = '<div id="hover" class="blur" blur-scale="2" blur-interaction="hover"></div>';
        doc.body.append(wrapper);
        const transient = doc.createElement("div");
        transient.className = "blur";
        transient.setAttribute("blur-rotate", "45deg");
        doc.body.append(transient);
        transient.remove();
        await afterMutations();
        const hover = select("#hover");
        dispatch(hover, "mouseenter");
        css(hover, "animation-play-state", "running");
        dispatch(hover, "mouseleave");
        css(hover, "animation-play-state", "paused");
        click.click();
        css(click, "animation-play-state", "running");
        equal(transient.hasAttribute("style"), false);
        equal(keyframes().length, CSS.supports("scale", "2") ? 1 : 0);
    }, { inHead: true });

    test("shares a scroll observer and releases targets on removal and mode change", `
        <section id="row" style="position: relative; height: 100px;">
            <div id="visible" class="blur" blur-top="0" blur-opacity="0.5" blur-interaction="scroll"></div>
        </section>
        <div style="height: 200vh;"></div>
        <section style="position: relative; height: 100px;">
            <div id="below" class="blur" blur-top="0" blur-opacity="0.5" blur-interaction="scroll"></div>
        </section>
    `, async ({ select, doc, win }) => {
        const visible = select("#visible");
        const below = select("#below");
        await eventually(() => css(visible, "animation-play-state", "running"));
        css(below, "animation-play-state", "paused");
        below.scrollIntoView();
        await eventually(() => css(below, "animation-play-state", "running"));
        css(visible, "animation-play-state", "paused");
        const row = select("#row");
        row.remove();
        await afterMutations();
        equal(win.scrollTracking.unobserved, ["visible"]);
        doc.body.prepend(row);
        win.scrollTo(0, 0);
        await eventually(() => css(visible, "animation-play-state", "running"));
        below.setAttribute("blur-interaction", "click");
        await afterMutations();
        css(below, "animation-play-state", "paused");
        equal(win.scrollTracking, { instances: 1, observed: ["visible", "below", "visible"], unobserved: ["visible", "below"] });
    }, {
        skip: () => !window.IntersectionObserver,
        setup: () => {
            const tracking = window.scrollTracking = { instances: 0, observed: [], unobserved: [] };
            window.IntersectionObserver = class extends IntersectionObserver {
                constructor(...args) {
                    super(...args);
                    tracking.instances++;
                }
                observe(element) {
                    tracking.observed.push(element.id);
                    super.observe(element);
                }
                unobserve(element) {
                    tracking.unobserved.push(element.id);
                    super.unobserve(element);
                }
            };
        }
    });

    test("ignores unknown interactions and falls back without IntersectionObserver", `
        <div id="unknown" class="blur" blur-opacity="0.5" blur-interaction="typo"></div>
        <div id="unsupported" class="blur" blur-opacity="0.5" blur-interaction="scroll"></div>
    `, ({ select }) => {
        css(select("#unknown"), "animation-play-state", "running");
        css(select("#unsupported"), "animation-play-state", "running");
    }, { setup: () => { window.IntersectionObserver = undefined; } });

    test("keeps the static effect under the browser's motion preference", `
        <div class="blur" blur-opacity="0.5" blur-background="teal"></div>
    `, ({ select, keyframes }) => {
        const blur = select(".blur");
        css(blur, "animation-name", reducedMotion() ? "none" : keyframes()[0]);
        css(blur, "background-color", "rgb(0, 128, 128)");
        css(blur, "filter", "blur(25px)");
    });

    test("applies live styling and clears removed attributes without leaving stale CSS", `
        <div class="blur" style="width: 70px; outline: 2px solid teal"></div>
    `, async ({ select }) => {
        const blur = select(".blur");
        css(blur, "width", "70px");
        blur.setAttribute("blur-width", "120px");
        blur.setAttribute("blur-height", "90px");
        blur.setAttribute("blur-amount", "5px");
        blur.setAttribute("blur-background", "tomato");
        blur.setAttribute("blur-grain", "true");
        blur.setAttribute("blur-custom", "--Tint: teal; color: var(--Tint); width: 88px !important;");
        await afterMutations();
        css(blur, "width", "88px");
        css(blur, "height", "90px");
        css(blur, "filter", "blur(5px)");
        css(blur, "color", "rgb(0, 128, 128)");
        css(blur, "background-image", /^url\(/);
        blur.removeAttribute("blur-custom");
        blur.removeAttribute("blur-amount");
        blur.removeAttribute("blur-grain");
        await afterMutations();
        css(blur, "width", "120px");
        css(blur, "filter", "blur(25px)");
        css(blur, "background-image", "none");
        css(blur, "outline-style", "solid");
        equal(blur.style.getPropertyValue("--Tint"), "");
        blur.removeAttribute("blur-width");
        await afterMutations();
        css(blur, "width", "70px");
    });

    test("toggles the blur class and keeps author inline edits across cleanup", `
        <div id="target" blur-width="140px" blur-opacity="0.5" style="width: 72px; --Spacing: 6px"></div>
        <div id="empty"></div>
    `, async ({ select, keyframes }) => {
        const target = select("#target");
        target.classList.add("blur");
        await afterMutations();
        css(target, "width", "140px");
        target.style.setProperty("margin", "var(--Spacing)");
        target.style.setProperty("outline", "1px solid green", "important");
        target.style.width = "84px";
        target.setAttribute("blur-background", "teal");
        await afterMutations();
        css(target, "width", "140px");
        css(target, "margin-top", "6px");
        target.classList.remove("blur");
        await afterMutations();
        equal(target.style.width, "84px");
        equal(target.style.margin, "var(--Spacing)");
        equal(target.style.getPropertyPriority("outline"), "important");
        equal(target.style.position, "");
        equal(target.style.animationName, "");
        equal(keyframes(), []);
        const empty = select("#empty");
        empty.classList.add("blur");
        await afterMutations();
        css(empty, "width", "50px");
        empty.classList.remove("blur");
        await afterMutations();
        equal(empty.getAttribute("style"), null);
    });

    test("rewires interactions without duplicating handlers or losing the play state on styling edits", `
        <div class="blur" blur-opacity="0.5" blur-interaction="click"></div>
    `, async ({ select }) => {
        const blur = select(".blur");
        blur.click();
        blur.setAttribute("blur-height", "80px");
        await afterMutations();
        css(blur, "animation-play-state", "running");
        blur.setAttribute("blur-interaction", "hover");
        await afterMutations();
        dispatch(blur, "mouseleave");
        blur.click();
        css(blur, "animation-play-state", "paused");
        dispatch(blur, "mouseenter");
        css(blur, "animation-play-state", "running");
        blur.removeAttribute("blur-interaction");
        await afterMutations();
        dispatch(blur, "mouseleave");
        css(blur, "animation-play-state", "running");
        blur.classList.remove("blur");
        await afterMutations();
        blur.click();
        equal(blur.hasAttribute("style"), false);
    });

    test("reclaims keyframes only when the last user releases them", `
        <div id="a" class="blur" blur-opacity="0.5"></div>
        <div id="b" class="blur" blur-opacity="0.5"></div>
    `, async ({ select, keyframes }) => {
        const a = select("#a");
        const b = select("#b");
        const shared = a.style.animationName;
        equal(keyframes(), [shared]);
        equal(b.style.animationName, shared);
        a.setAttribute("blur-opacity-duration", "3s");
        await afterMutations();
        css(a, "animation-duration", "3s");
        equal(a.style.animationName, shared);
        a.setAttribute("blur-opacity", "0.3");
        await afterMutations();
        const changed = a.style.animationName;
        equal(changed === shared, false);
        equal(keyframes(), [shared, changed]);
        b.remove();
        await afterMutations();
        equal(keyframes(), [changed]);
        a.removeAttribute("blur-opacity");
        await afterMutations();
        equal(keyframes(), []);
        css(a, "animation-name", "none");
        equal(a.hasAttribute("data-blurjs-animated"), false);
    });

    test("retains shared rules during DOM moves and a same-batch handoff", `
        <section><div class="blur" blur-opacity="0.5" blur-interaction="click"></div></section>
        <section id="destination"></section>
    `, async ({ select, doc, keyframes }) => {
        const original = select(".blur");
        const name = original.style.animationName;
        original.click();
        select("#destination").append(original);
        await afterMutations();
        equal(keyframes(), [name]);
        css(original, "animation-play-state", "running");
        original.click();
        css(original, "animation-play-state", "paused");
        const parent = original.parentElement;
        const replacement = doc.createElement("div");
        replacement.className = "blur";
        replacement.setAttribute("blur-opacity", "0.5");
        parent.remove();
        original.classList.remove("blur");
        doc.body.append(replacement);
        await afterMutations();
        equal(original.hasAttribute("style"), false);
        equal(keyframes(), [name]);
        equal(replacement.style.animationName, name);
    });

    test("keeps keyframe usage bounded across repeated live editing", `
        <div class="blur" blur-opacity="0.5"></div>
    `, async ({ select, keyframes }) => {
        const blur = select(".blur");
        const initial = blur.style.animationName;
        for (let step = 1; step <= 12; step++) {
            blur.setAttribute("blur-opacity", String(step / 100));
            blur.setAttribute("blur-opacity", String(step / 20));
            await afterMutations();
            equal(keyframes(), [blur.style.animationName]);
        }
        blur.setAttribute("blur-opacity", "0.5");
        await afterMutations();
        equal(keyframes(), [blur.style.animationName]);
        equal(blur.style.animationName === initial, false);
        blur.remove();
        await afterMutations();
        equal(keyframes(), []);
    });

    async function run() {
        const results = document.getElementById("results");
        const summary = document.getElementById("summary");
        const totals = { pass: 0, fail: 0, skip: 0 };
        for (const filename of ["blur.js", "blur.min.js"]) {
            for (const scenario of cases) {
                const row = document.createElement("li");
                let result = "pass";
                let message = "";
                try {
                    if (scenario.skip && scenario.skip()) result = "skip";
                    else await runInFrame(filename, scenario);
                } catch (error) {
                    result = "fail";
                    message = ` — ${error.message}`;
                }
                totals[result]++;
                row.dataset.result = result;
                row.textContent = `${result.toUpperCase()} ${filename}: ${scenario.name}${message}`;
                results.append(row);
            }
        }
        summary.textContent = `${totals.pass} passed, ${totals.fail} failed, ${totals.skip} skipped`;
        summary.dataset.status = totals.fail ? "failed" : "passed";
    }

    run();
})();
