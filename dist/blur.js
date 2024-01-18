var blurs = document.querySelectorAll(".blur");

for (element of blurs) {
    // Generate a random 4 letter ID
    const id = Math.random().toString(36).substring(2, 6);

    // Set the ID on the element
    element.setAttribute("blur-id", id);
    
    element.style.position = "absolute";
    element.style.background = "red";
    element.style.borderRadius = "5rem 2rem 5rem 50%";
    element.style.width = "50px";
    element.style.height = "50px";
    element.style.zIndex = "99";
    element.style.filter = "blur(25px)";

    if (element.getAttribute("blur-width")) {
        element.style.width = element.getAttribute("blur-width");
    }

    if (element.getAttribute("blur-height")) {
        element.style.height = element.getAttribute("blur-height");
    }

    if (element.getAttribute("blur-amount")) {
        element.style.filter = `blur(${element.getAttribute("blur-amount")})`;
    }

    if (element.getAttribute("blur-background")) {
        element.style.background = element.getAttribute("blur-background");
    }

    if (element.getAttribute("blur-z-index")) {
        element.style.zIndex = element.getAttribute("blur-z-index");
    }

    if (element.getAttribute("blur-top")) {
        element.style.top = element.getAttribute("blur-top");
    }

    if (element.getAttribute("blur-left")) {
        element.style.left = element.getAttribute("blur-left");
    }

    if (element.getAttribute("blur-right")) {
        element.style.right = element.getAttribute("blur-right");
    }

    if (element.getAttribute("blur-bottom")) {
        element.style.bottom = element.getAttribute("blur-bottom");
    }

    if (element.getAttribute("blur-border-radius")) {
        element.style.borderRadius = element.getAttribute("blur-border-radius");
    }

    if (element.getAttribute("blur-grain") === "true") {
        element.style.background += ', url("data:image/svg+xml,%3Csvg viewBox=\'0 0 250 250\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.65\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")';
    }

    // Animation properties
    if (element.getAttribute("blur-scale")) {
        const scaleValue = element.getAttribute("blur-scale");
        const animationDuration = element.getAttribute("blur-scale-duration") || "1s";
        const animationRepetitions = element.getAttribute("blur-scale-repetitions") || "infinite";

        // Add animation directly to the style tag
        if(element.style.animation !== ''){
            element.style.animation += `, scaleAnimation${id} ${animationDuration} ${animationRepetitions}`;
        }else{
            element.style.animation = `scaleAnimation${id} ${animationDuration} ${animationRepetitions}`;
        }
        element.style.transformOrigin = "center";

        // Create a style element
        const styleElement = document.createElement('style');
        document.head.appendChild(styleElement);
        
        // Add keyframes directly to the style tag
        var animation = `
            @keyframes scaleAnimation${id} {
                50% {
                    transform: scale(${scaleValue});
                }
            }
            `;

        // Set keyframes in the style element
        styleElement.innerHTML = animation;
    }

    if (element.getAttribute("blur-translate-x")) {
        const translateXValue = element.getAttribute("blur-translate-x");
        const animationDuration = element.getAttribute("blur-translate-x-duration") || "1s";
        const animationRepetitions = element.getAttribute("blur-translate-x-repetitions") || "infinite";

        // Add animation directly to the style tag
        if(element.style.animation !== ''){
            element.style.animation += `, translateXAnimation${id} ${animationDuration} ${animationRepetitions}`;
        }else{
            element.style.animation = `translateXAnimation${id} ${animationDuration} ${animationRepetitions}`;
        }

        // Create a style element
        const styleElement = document.createElement('style');
        document.head.appendChild(styleElement);
        
        // Add keyframes directly to the style tag
        var animation = `
        @keyframes translateXAnimation${id} {
            50% {
                transform: translateX(${translateXValue});
            }
        }
        `;

        // Set keyframes in the style element
        styleElement.innerHTML = animation;
    }

    if (element.getAttribute("blur-translate-y")) {
        const translateYValue = element.getAttribute("blur-translate-y");
        const animationDuration = element.getAttribute("blur-translate-y-duration") || "1s";
        const animationRepetitions = element.getAttribute("blur-translate-y-repetitions") || "infinite";

        // Add animation directly to the style tag
        if(element.style.animation !== ''){
            element.style.animation += `, translateYAnimation${id} ${animationDuration} ${animationRepetitions}`;
        }else{
            element.style.animation = `translateYAnimation${id} ${animationDuration} ${animationRepetitions}`;
        }

        // Create a style element
        const styleElement = document.createElement('style');
        document.head.appendChild(styleElement);
        
        // Add keyframes directly to the style tag
        var animation = `
        @keyframes translateYAnimation${id} {
            50% {
                transform: translateY(${translateYValue});
            }
        }
        `;

        // Set keyframes in the style element
        styleElement.innerHTML = animation;
    }

    if (element.getAttribute("blur-opacity")) {
        const opacityValue = element.getAttribute("blur-opacity");
        const animationDuration = element.getAttribute("blur-opacity-duration") || "1s";
        const animationRepetitions = element.getAttribute("blur-opacity-repetitions") || "infinite";

        // Add animation directly to the style tag
        if(element.style.animation !== ''){
            element.style.animation += `, opacityAnimation${id} ${animationDuration} ${animationRepetitions}`;
        }else{
            element.style.animation = `opacityAnimation${id} ${animationDuration} ${animationRepetitions}`;
        }

        // Create a style element
        const styleElement = document.createElement('style');
        document.head.appendChild(styleElement);

        // Add keyframes directly to the style tag
        var animation = `
            @keyframes opacityAnimation${id} {
                50% {
                    opacity: ${opacityValue};
                }
            }
        `;

        // Set keyframes in the style element
        styleElement.innerHTML = animation;
    }

    if (element.getAttribute("blur-animate")) {
        const targetBlurAmount = element.getAttribute("blur-animate");
        const animationDuration = element.getAttribute("blur-animate-duration") || "1s";
        const animationRepetitions = element.getAttribute("blur-animate-repetitions") || "infinite";

        // Add animation directly to the style tag
        if(element.style.animation !== ''){
            element.style.animation += `, blurAnimation${id} ${animationDuration} ${animationRepetitions}`;
        }else{
            element.style.animation = `blurAnimation${id} ${animationDuration} ${animationRepetitions}`;
        }

        // Create a style element
        const styleElement = document.createElement('style');
        document.head.appendChild(styleElement);

        // Add keyframes directly to the style tag
        var animation = `
            @keyframes blurAnimation${id} {
                50% {
                    filter: blur(${targetBlurAmount});
                }
            }
        `;

        // Set keyframes in the style element
        styleElement.innerHTML = animation;
    }
}
