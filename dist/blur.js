// Select all elements with the class "blur"
const blurElements = document.querySelectorAll(".blur");

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

// Iterate over each blur element and apply styles and animations
blurElements.forEach(element => {
    // Generate a unique ID for each blur element to scope animations
    const uniqueId = "blur-" + Math.random().toString(36).substring(2, 6);
    element.setAttribute("blur-id", uniqueId);

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

    // Special handling for blur-amount as it modifies the filter property
    if (element.hasAttribute("blur-amount")) {
        stylesToApply.filter = `blur(${element.getAttribute("blur-amount")})`;
    }

    // Handle custom CSS properties from blur-custom
    if (element.hasAttribute("blur-custom")) {
        const customStyles = element.getAttribute("blur-custom");
        customStyles.split(';').forEach(style => {
            if (style.trim()) {
                const [property, value] = style.split(':');
                if (property && value) {
                    // Convert property to camelCase before adding it to the styles object
                    const camelCaseProperty = property.trim().replace(/-(\w)/g, (_, letter) => letter.toUpperCase());
                    stylesToApply[camelCaseProperty] = value.trim();
                }
            }
        });
    }

    // Construct CSS text
    let cssText = "";
    for (const style in stylesToApply) {
        cssText += `${style.replace(/([A-Z])/g, '-$1').toLowerCase()}: ${stylesToApply[style]}; `;
    }
    element.style.cssText = cssText;

    // --- Post-cssText Modifications (effects that append or have specific logic) ---

    // Grain effect (appends to background)
    if (element.getAttribute("blur-grain") === "true") {
        element.style.background += // Use += as cssText would overwrite if 'background' was set again
            ", url(\"data:image/svg+xml,%3Csvg viewBox='0 0 250 250' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E\")";
    }

    // Pointer events
    const pointerEventsValue = element.getAttribute("blur-pointer-events");
    if (pointerEventsValue === "true") {
        element.style.pointerEvents = "all";
    } else if (pointerEventsValue === "false") {
        element.style.pointerEvents = "none";
    }

    // User select
    const userSelectValue = element.getAttribute("blur-user-select");
    if (userSelectValue === "true" || userSelectValue === "false") {
        const selectValue = userSelectValue === "true" ? "auto" : "none";
        element.style.userSelect = selectValue;
        element.style.webkitUserSelect = selectValue; // Safari, Chrome
        element.style.MozUserSelect = selectValue; // Firefox
        element.style.msUserSelect = selectValue; // IE/Edge
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

            const animationName = `${type}Animation${uniqueId}`;
            animationsToApply.push(`${animationName} ${duration} ${timingFunction} ${repetitions}`);

            let keyframes = "";
            switch (type) {
                case "scale":
                    element.style.transformOrigin = "center"; // Ensure scaling is from the center
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
                case "animate": // This refers to animating the blur filter itself
                    keyframes = `@keyframes ${animationName} { 50% { filter: blur(${value}); } }`;
                    break;
            }
            // Add keyframes to the shared style element
            if (keyframes) {
                styleElement.sheet.insertRule(keyframes, styleElement.sheet.cssRules.length);
            }
        }
    });

    if (animationsToApply.length > 0) {
        element.style.animation = animationsToApply.join(", ");
    }

    // --- Interactions ---
    const interactionType = element.getAttribute("blur-interaction");
    if (interactionType) {
        element.style.animationPlayState = 'paused'; // Start animations paused for interaction

        const setupInteraction = (event, playOn, pauseOn) => {
            element.addEventListener(playOn, () => element.style.animationPlayState = 'running');
            if (pauseOn) {
                element.addEventListener(pauseOn, () => element.style.animationPlayState = 'paused');
            }
        };

        switch (interactionType) {
            case 'hover':
                setupInteraction('hover', 'mouseenter', 'mouseleave');
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
                });
                observer.observe(element);
                break;
        }
    }
});