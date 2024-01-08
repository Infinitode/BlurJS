// View LICENSE file for this project's license.

// Get all blurs in the HTML page
var blurs = document.querySelectorAll('.blur');

for(element of blurs){
    // Default blur styling
    element.style.position = 'absolute';
    element.style.backgroundColor = 'red';
    element.style.borderRadius = '5rem 2rem 5rem 50%';
    element.style.width = '50px';
    element.style.height = '50px';
    element.style.zIndex = '99';
    element.style.top = '0';
    element.style.left = '0';
    element.style.filter = 'blur(25px)';

    // Attribute checks
    if(element.getAttribute('blur-width')){
        element.style.width = element.getAttribute('blur-width');
    }
    if(element.getAttribute('blur-height')){
        element.style.height = element.getAttribute('blur-height');
    }
    if(element.getAttribute('blur-amount')){
        element.style.filter = `blur(${element.getAttribute('blur-amount')})`;
    }
    if(element.getAttribute('blur-color')){
        element.style.backgroundColor = element.getAttribute('blur-color');
    }
    if(element.getAttribute('blur-z-index')){
        element.style.zIndex = element.getAttribute('blur-x-index');
    }
    if(element.getAttribute('blur-top')){
        element.style.top = element.getAttribute('blur-top');
    }
    if(element.getAttribute('blur-left')){
        element.style.left = element.getAttribute('blur-left');
    }
    if(element.getAttribute('blur-right')){
        element.style.right = element.getAttribute('blur-right');
    }
    if(element.getAttribute('blur-bottom')){
        element.style.bottom = element.getAttribute('blur-bottom');
    }
    if(element.getAttribute('blur-border-radius')){
        element.style.borderRadius = element.getAttribute('blur-border-radius');
    }
}
