(function() {
    const startTime = performance.now();

    // Select all elements with the class "blur"
    const blurElements = document.querySelectorAll(".blur");

    if (blurElements.length === 0) return;

    // Get or create the style element for BlurJS keyframes
    let styleElement = document.getElementById("blur-styles");
    if (!styleElement) {
        styleElement = document.createElement("style");
        styleElement.id = "blur-styles";
        document.head.appendChild(styleElement);
    }

    // --- Version Information ---
    const blurVersion = document.body.getAttribute("blur-version");
    if (blurVersion) {
        console.log(`BlurJS version ${blurVersion} is running.`);
    }

    // Keyframe registry to avoid duplicate animations
    const keyframeRegistry = new Set();

    // Iterate over each blur element and apply styles and animations
    blurElements.forEach(element => {
        // --- Style Accumulation ---
        let stylesToApply = {
            position: "absolute",
            background: "red", // Default background color
            borderRadius: "5rem 2rem 5rem 50%", // Default border radius
            width: "50px", // Default width
            height: "50px", // Default height
            zIndex: "99", // Default z-index
            filter: "blur(25px)" // Default blur amount
        };

        // Attribute mapping for direct style properties
        const styleAttributes = {
            "blur-width": "width",
            "blur-height": "height",
            "blur-background": "background",
            "blur-z-index": "zIndex",
            "blur-top": "top",
            "blur-left": "left",
            "blur-right": "right",
            "blur-bottom": "bottom",
            "blur-border-radius": "borderRadius"
        };

        for (const attr in styleAttributes) {
            if (element.hasAttribute(attr)) {
                stylesToApply[styleAttributes[attr]] = element.getAttribute(attr);
            }
        }

        // Special handling for blur-amount
        if (element.hasAttribute("blur-amount")) {
            stylesToApply.filter = `blur(${element.getAttribute("blur-amount")})`;
        }

        // Handle custom CSS properties
        if (element.hasAttribute("blur-custom")) {
            const customStyles = element.getAttribute("blur-custom");
            customStyles.split(';').forEach(style => {
                const trimmed = style.trim();
                if (trimmed) {
                    const separatorIndex = trimmed.indexOf(':');
                    if (separatorIndex !== -1) {
                        const property = trimmed.substring(0, separatorIndex).trim();
                        const value = trimmed.substring(separatorIndex + 1).trim();
                        const camelCaseProperty = property.replace(/-(\w)/g, (_, letter) => letter.toUpperCase());
                        stylesToApply[camelCaseProperty] = value;
                    }
                }
            });
        }

        // Grain effect
        if (element.getAttribute("blur-grain") === "true") {
            const grainUrl = "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 250 250' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E\")";
            stylesToApply.background = (stylesToApply.background || "red") + ", " + grainUrl;
        }

        // Pointer events
        const pointerEventsValue = element.getAttribute("blur-pointer-events");
        if (pointerEventsValue === "true") stylesToApply.pointerEvents = "all";
        else if (pointerEventsValue === "false") stylesToApply.pointerEvents = "none";

        // User select
        const userSelectValue = element.getAttribute("blur-user-select");
        if (userSelectValue === "true" || userSelectValue === "false") {
            const selectValue = userSelectValue === "true" ? "auto" : "none";
            stylesToApply.userSelect = selectValue;
            stylesToApply.webkitUserSelect = selectValue;
            stylesToApply.MozUserSelect = selectValue;
            stylesToApply.msUserSelect = selectValue;
        }

        // --- Animations ---
        const animationTypes = ["scale", "translate-x", "translate-y", "opacity", "animate"];
        let animationsToApply = [];

        animationTypes.forEach(type => {
            const baseAttribute = `blur-${type}`;
            if (element.hasAttribute(baseAttribute)) {
                const value = element.getAttribute(baseAttribute);
                const duration = element.getAttribute(`${baseAttribute}-duration`) || "1s";
                const repetitions = element.getAttribute(`${baseAttribute}-repetitions`) || "infinite";
                const timingFunction = element.getAttribute(`${baseAttribute}-timing`) || "linear";

                // Animation name based on type and value for deduplication
                const safeValue = value.replace(/[^a-z0-9]/gi, '-');
                const animationName = `blur-${type}-${safeValue}`;

                animationsToApply.push(`${animationName} ${duration} ${timingFunction} ${repetitions}`);

                if (!keyframeRegistry.has(animationName)) {
                    let keyframes = "";
                    switch (type) {
                        case "scale":
                            stylesToApply.transformOrigin = "center";
                            keyframes = `@keyframes ${animationName} { 50% { transform: scale(${value}); } }`;
                            break;
                        case "translate-x":
                            keyframes = `@keyframes ${animationName} { 50% { transform: translateX(${value}); } }`;
                            break;
                        case "translate-y":
                            keyframes = `@keyframes ${animationName} { 50% { transform: translateY(${value}); } }`;
                            break;
                        case "opacity":
                            keyframes = `@keyframes ${animationName} { 50% { opacity: ${value}; } }`;
                            break;
                        case "animate":
                            keyframes = `@keyframes ${animationName} { 50% { filter: blur(${value}); } }`;
                            break;
                    }
                    if (keyframes) {
                        try {
                            styleElement.sheet.insertRule(keyframes, styleElement.sheet.cssRules.length);
                            keyframeRegistry.add(animationName);
                        } catch (e) {
                            console.error("BlurJS: Failed to insert rule", keyframes, e);
                        }
                    }
                }
            }
        });

        if (animationsToApply.length > 0) {
            stylesToApply.animation = animationsToApply.join(", ");
        }

        // --- Interactions ---
        const interactionType = element.getAttribute("blur-interaction");
        if (interactionType) {
            stylesToApply.animationPlayState = 'paused';

            // We apply listeners after setting cssText
            setTimeout(() => {
                switch (interactionType) {
                    case 'hover':
                        element.addEventListener('mouseenter', () => element.style.animationPlayState = 'running');
                        element.addEventListener('mouseleave', () => element.style.animationPlayState = 'paused');
                        break;
                    case 'click':
                        element.addEventListener('click', () => {
                            element.style.animationPlayState = element.style.animationPlayState === 'paused' ? 'running' : 'paused';
                        });
                        break;
                    case 'scroll':
                        const observer = new IntersectionObserver(entries => {
                            entries.forEach(entry => {
                                element.style.animationPlayState = entry.isIntersecting ? 'running' : 'paused';
                            });
                        }, { threshold: 0.1 });
                        observer.observe(element);
                        break;
                }
            }, 0);
        }

        // Final style application (batched)
        let cssText = "";
        for (const style in stylesToApply) {
            const cssProp = style.replace(/([A-Z])/g, '-$1').toLowerCase();
            cssText += `${cssProp}: ${stylesToApply[style]}; `;
        }
        element.style.cssText = cssText;
    });

    const endTime = performance.now();
    console.log(`BlurJS: Processed ${blurElements.length} elements in ${(endTime - startTime).toFixed(2)}ms`);
})();
