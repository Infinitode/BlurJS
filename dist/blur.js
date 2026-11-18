(function() {
    const instance = Symbol.for("BlurJS.initialized");
    if (document[instance]) return;
    document[instance] = true;

    const defaultStyles = "position: absolute; background: red; border-radius: 5rem 2rem 5rem 50%; " +
        "width: 50px; height: 50px; z-index: 99; filter: blur(25px);";
    const styleAttributes = [
        ["blur-width", "width"], ["blur-height", "height"], ["blur-background", "background"],
        ["blur-z-index", "z-index"], ["blur-top", "top"], ["blur-left", "left"],
        ["blur-right", "right"], ["blur-bottom", "bottom"], ["blur-border-radius", "border-radius"],
        ["blur-mix-blend-mode", "mix-blend-mode"]
    ];
    const grainImage = "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 250 250' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' opacity='.22' filter='url(%23noiseFilter)'/%3E%3C/svg%3E\")";
    const cssWideKeyword = /^(inherit|initial|unset|revert|revert-layer)$/;
    const canComposeTranslate = typeof CSS !== "undefined" && CSS.supports("translate", "0px") &&
        CSS.supports("animation-composition", "add");
    const animationTargets = [
        ["scale", "scale", value => value],
        ["rotate", "rotate", value => value],
        ["translate-x", canComposeTranslate ? "translate" : "transform", value => translationTarget(value, "X")],
        ["translate-y", canComposeTranslate ? "translate" : "transform", value => translationTarget(value, "Y")],
        ["opacity", "opacity", value => value],
        ["animate", "filter", value => `blur(${value})`]
    ];
    const animationOptions = [
        ["animation-duration", "duration", "1s"],
        ["animation-timing-function", "timing", "linear"],
        ["animation-delay", "delay", "0s"],
        ["animation-iteration-count", "repetitions", "infinite"]
    ];
    const watchedAttributes = [
        "class", "blur-amount", "blur-custom", "blur-grain", "blur-pointer-events", "blur-user-select", "blur-interaction",
        ...styleAttributes.map(([attribute]) => attribute),
        ...animationTargets.flatMap(([type]) => [
            `blur-${type}`, ...animationOptions.map(([, suffix]) => `blur-${type}-${suffix}`)
        ])
    ];
    const activeElements = new WeakMap();
    const keyframes = new Map();
    const unusedKeyframes = new Set();
    const interactionEvents = { hover: ["mouseenter", "mouseleave"], click: ["click"], scroll: [] };
    const styles = document.createElement("div").style;
    const parser = document.createElement("div").style;
    const authorStyles = document.createElement("div").style;
    const previousStyles = document.createElement("div").style;
    const currentStyles = document.createElement("div").style;
    // A small, bounded cache avoids reparsing repeated attribute values.
    const parsedValues = new Map();
    const parsedValueLimit = 64;
    let animationStyle;
    let nextKeyframeId = 0;
    let scrollObserver;

    // Assign attribute values as single CSS values, and parse custom CSS as a declaration list.
    function getStyleText(element, authorCss) {
        let css = defaultStyles + authorCss;
        for (const [attribute, property] of styleAttributes) {
            const value = parseValue(property, element.getAttribute(attribute));
            if (value) css += `${property}: ${value};`;
        }
        const blurAmount = element.getAttribute("blur-amount");
        if (blurAmount) {
            const filter = parseValue("filter", `blur(${blurAmount})`);
            if (filter) css += `filter: ${filter};`;
        }
        const custom = element.getAttribute("blur-custom");
        if (custom) {
            styles.cssText = custom;
            css += styles.cssText;
        }

        if (element.getAttribute("blur-grain") === "true") {
            styles.cssText = css;
            const background = styles.getPropertyValue("background");
            // A background color is only valid in the final layer; the grain goes on top.
            if (background && !cssWideKeyword.test(background)) {
                styles.setProperty("background", `${grainImage}, ${background}`, styles.getPropertyPriority("background"));
                css = styles.cssText;
            }
        }

        const pointerEvents = element.getAttribute("blur-pointer-events");
        if (pointerEvents === "true") css += "pointer-events: all;";
        if (pointerEvents === "false") css += "pointer-events: none;";
        const userSelect = element.getAttribute("blur-user-select");
        if (userSelect === "true" || userSelect === "false") {
            const value = userSelect === "true" ? "auto" : "none";
            css += `-webkit-user-select: ${value}; -moz-user-select: ${value}; -ms-user-select: ${value}; user-select: ${value};`;
        }
        return css;
    }

    function parseValue(property, value) {
        if (!value) return "";
        const key = `${property}:${value}`;
        const cached = parsedValues.get(key);
        if (cached !== undefined) return cached;
        parser.removeProperty(property);
        parser.setProperty(property, value);
        const output = parser.getPropertyValue(property);
        if (parsedValues.size === parsedValueLimit) parsedValues.delete(parsedValues.keys().next().value);
        parsedValues.set(key, output);
        return output;
    }

    function translationTarget(value, axis) {
        const transform = `translate${axis}(${value})`;
        if (!canComposeTranslate) return transform;
        // Each axis takes one distance, not a full multi-axis translate value.
        if (!parseValue("transform", transform)) return "";
        return axis === "X" ? `${value} 0px` : `0px ${value}`;
    }

    function getAnimationSheet() {
        if (!animationStyle) {
            animationStyle = document.createElement("style");
            if (!document.getElementById("blur-styles")) animationStyle.id = "blur-styles";
            document.head.appendChild(animationStyle);
            if (animationStyle.sheet) {
                animationStyle.sheet.insertRule(`@media (prefers-reduced-motion: reduce) {
                    [data-blurjs-animated] { animation-name: none !important; }
                }`, 0);
            }
        }
        return animationStyle.sheet;
    }

    function getKeyframe(type, property, toTarget, value) {
        const key = `${type}:${value}`;
        if (keyframes.has(key)) return keyframes.get(key);
        const target = parseValue(property, toTarget(value));
        if (!target) return null;
        const sheet = getAnimationSheet();
        if (!sheet) return null;

        const name = `blurjs-${type}-${++nextKeyframeId}`;
        const index = sheet.insertRule(`@keyframes ${name} { 50% {} }`, sheet.cssRules.length);
        const rule = sheet.cssRules[index];
        rule.cssRules[0].style.setProperty(property, target);
        const frame = { key, name, rule, users: 0 };
        keyframes.set(key, frame);
        return frame;
    }

    function replaceKeyframes(state, frames) {
        for (const frame of frames) {
            if (frame.users++ === 0) unusedKeyframes.delete(frame);
        }
        for (const frame of state.frames) {
            if (--frame.users === 0) unusedKeyframes.add(frame);
        }
        state.frames = frames;
    }

    function reclaimKeyframes() {
        if (!unusedKeyframes.size) return;
        const unusedRules = new Set();
        for (const frame of unusedKeyframes) {
            keyframes.delete(frame.key);
            unusedRules.add(frame.rule);
        }
        unusedKeyframes.clear();

        // Delete in reverse so the remaining rule indices don't need to be tracked.
        const sheet = animationStyle.sheet;
        if (!sheet) return;
        for (let index = sheet.cssRules.length - 1; index >= 0 && unusedRules.size; index--) {
            if (unusedRules.delete(sheet.cssRules[index])) sheet.deleteRule(index);
        }
    }

    // Options accept one CSS value per animation, including functions that contain commas.
    function getAnimationOption(property, value, fallback) {
        const parsed = parseValue(property, value);
        if (!parsed || cssWideKeyword.test(parsed)) return fallback;
        let depth = 0;
        for (const character of parsed) {
            if (character === "(") depth++;
            if (character === ")") depth--;
            if (character === "," && depth === 0) return fallback;
        }
        return parsed;
    }

    function getAnimations(element) {
        const frames = [];
        const compositions = [];
        const options = animationOptions.map(() => []);

        for (const [type, property, toTarget] of animationTargets) {
            const attribute = `blur-${type}`;
            const value = (element.getAttribute(attribute) || "").trim();
            if (!value) continue;
            const frame = getKeyframe(type, property, toTarget, value);
            if (!frame) continue;

            frames.push(frame);
            compositions.push(property === "translate" ? "add" : "replace");
            animationOptions.forEach(([option, suffix, fallback], i) => {
                options[i].push(getAnimationOption(option, element.getAttribute(`${attribute}-${suffix}`), fallback));
            });
        }
        if (!frames.length) return { frames, css: "" };

        let css = `animation: none; animation-name: ${frames.map(frame => frame.name).join(", ")};`;
        animationOptions.forEach(([property], i) => { css += `${property}: ${options[i].join(", ")};`; });
        if (canComposeTranslate) css += `animation-composition: ${compositions.join(", ")};`;
        return { frames, css };
    }

    function isInDocument(element) {
        return element.getRootNode() === document;
    }

    // Reapply only author changes when rebuilding the blur, never our previous declarations.
    function captureStyleEdits(element, state) {
        const inline = element.getAttribute("style");
        if (inline === state.appliedStyle) return;

        if (!inline || !element.style.length) {
            state.authorStyle = inline;
            state.authorCss = "";
            return;
        }

        previousStyles.cssText = state.appliedStyle;
        currentStyles.cssText = inline;
        authorStyles.cssText = state.authorCss;
        const previous = new Set(Array.from(previousStyles));
        const current = new Set(Array.from(currentStyles));
        const unchanged = [];
        for (const property of new Set([...previous, ...current])) {
            if (previous.has(property) === current.has(property) &&
                currentStyles.getPropertyValue(property) === previousStyles.getPropertyValue(property) &&
                currentStyles.getPropertyPriority(property) === previousStyles.getPropertyPriority(property)) {
                unchanged.push(property);
            } else {
                authorStyles.removeProperty(property);
            }
        }
        for (const property of unchanged) currentStyles.removeProperty(property);
        // Keep changed declarations serialized by the browser, including new var() shorthands.
        state.authorCss = authorStyles.cssText + currentStyles.cssText;
        state.authorStyle = state.authorCss || (state.authorStyle === null ? null : "");
    }

    function setPlaying(element, state, playing) {
        if (state.playing === playing) return;
        captureStyleEdits(element, state);
        state.playing = playing;
        element.style.animationPlayState = playing ? "running" : "paused";
        state.appliedStyle = element.getAttribute("style");
    }

    function handleInteraction(event) {
        const element = event.currentTarget;
        const state = activeElements.get(element);
        if (!state) return;
        const playing = event.type === "click" ? !state.playing : event.type === "mouseenter";
        setPlaying(element, state, playing);
    }

    function observeScroll(element) {
        if (!scrollObserver) {
            scrollObserver = new IntersectionObserver(entries => {
                for (const { target, isIntersecting } of entries) {
                    const state = activeElements.get(target);
                    if (state && state.interaction === "scroll" && isInDocument(target)) {
                        setPlaying(target, state, isIntersecting);
                    }
                }
            });
        }
        scrollObserver.observe(element);
    }

    function setInteraction(element, state, interaction) {
        if (state.interaction === interaction) return;
        if (state.interaction === "scroll") scrollObserver.unobserve(element);
        for (const event of interactionEvents[state.interaction] || []) {
            element.removeEventListener(event, handleInteraction);
        }
        state.interaction = interaction;
        state.playing = interaction === "hover" && element.matches(":hover");
        if (interaction === "scroll") observeScroll(element);
        for (const event of interactionEvents[interaction] || []) element.addEventListener(event, handleInteraction);
    }

    function getInteraction(element) {
        const value = element.getAttribute("blur-interaction");
        if (value === "hover" || value === "click" || (value === "scroll" && typeof IntersectionObserver === "function")) {
            return value;
        }
        return null;
    }

    function reconcileElement(element, refresh = false) {
        let state = activeElements.get(element);
        const enabled = element.style && element.classList.contains("blur") && isInDocument(element);
        if (!enabled) {
            if (!state) return;
            captureStyleEdits(element, state);
            setInteraction(element, state, null);
            replaceKeyframes(state, []);
            activeElements.delete(element);
            element.removeAttribute("data-blurjs-animated");
            if (state.authorStyle === null) element.removeAttribute("style");
            else element.setAttribute("style", state.authorStyle);
            return;
        }
        if (!state) {
            const authorStyle = element.getAttribute("style");
            state = { authorStyle, authorCss: element.style.cssText, appliedStyle: authorStyle,
                frames: [], interaction: null, playing: false };
            activeElements.set(element, state);
        } else if (!refresh) {
            return;
        }

        captureStyleEdits(element, state);
        setInteraction(element, state, getInteraction(element));
        const animations = getAnimations(element);
        replaceKeyframes(state, animations.frames);
        element.style.cssText = getStyleText(element, state.authorCss) + animations.css;
        if (state.interaction) element.style.animationPlayState = state.playing ? "running" : "paused";
        state.appliedStyle = element.getAttribute("style");
        element.toggleAttribute("data-blurjs-animated", animations.frames.length > 0);
    }

    function handleMutations(records) {
        const pending = new Map();
        function enqueue(element, refresh = false) {
            if (refresh || !pending.has(element)) pending.set(element, refresh);
        }
        function collect(node, added) {
            if (node.nodeType !== Node.ELEMENT_NODE || isInDocument(node) !== added) return;
            if (activeElements.has(node) || node.classList.contains("blur")) enqueue(node);
            for (const element of node.querySelectorAll(".blur")) enqueue(element);
        }
        for (const record of records) {
            if (record.type === "attributes") {
                const element = record.target;
                if (activeElements.has(element) || element.classList.contains("blur")) {
                    enqueue(element, record.attributeName !== "class");
                }
            } else {
                for (const node of record.addedNodes) collect(node, true);
                for (const node of record.removedNodes) collect(node, false);
            }
        }
        // Use final DOM state so moves and repeated edits don't tear down effects mid-batch.
        for (const [element, refresh] of pending) reconcileElement(element, refresh);
        reclaimKeyframes();
    }

    function start() {
        const observer = new MutationObserver(handleMutations);
        observer.observe(document, { attributes: true, attributeFilter: watchedAttributes, childList: true, subtree: true });

        const version = document.body && document.body.getAttribute("blur-version");
        if (version) console.log(`BlurJS version ${version} is running.`);
        const startTime = performance.now();
        const elements = document.querySelectorAll(".blur");
        for (const element of elements) reconcileElement(element);
        if (elements.length) {
            console.log(`BlurJS: Processed ${elements.length} elements in ${(performance.now() - startTime).toFixed(2)}ms`);
        }
    }

    if (!document.body && document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", start, { once: true });
    } else {
        start();
    }
})();
