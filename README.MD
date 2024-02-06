# BlurJS 1.1

[![GitHub license](https://img.shields.io/badge/license-compliance-green.svg)](https://github.com/infinitode/blurjs/blob/main/LICENSE)
[![GitHub stars](https://img.shields.io/github/stars/infinitode/blurjs.svg)](https://github.com/infinitode/blurjs/stargazers)
[![GitHub issues](https://img.shields.io/github/issues/infinitode/blurjs.svg)](https://github.com/infinitode/blurjs/issues)
[![JSDelivr monthly downloads](https://data.jsdelivr.com/v1/package/gh/Infinitode/BlurJS/badge?style=rounded)](https://www.jsdelivr.com/package/gh/Infinitode/BlurJS)

BlurJS is a lightweight JavaScript library for creating blurred effects on HTML elements. Easily integrate blurred elements into your web projects with simple HTML attributes.

## Changes in Version 1.1

BlurJS now includes a `blur-background` property, allowing for more control over the blur, and some blur animations properties to animate the blurs. The code has also been refactored for better readability. Removed the `blur-color` property, as it is no longer needed, use `blur-background`, it works the same, but allows for more advanced blurs. You can also now use multiple animations on one blur element, this allows you to create more advanced blur animations.

**Note: You can disable pointer events for BlurJS using `.blur{pointer-events:none}`, in your CSS to avoid pointer events being fired on the blurs, if you place it over elements like buttons, etc. Similarly user selection can also be disabled using `.blur{user-select:none}`. Remember to also include browser prefixes when using these CSS rules.**

## Coming soon in version 1.2

Changes coming to BlurJS in version 1.2:
- Hover animations
- Scroll Animations
- Pointer events and user selection booeleans
- Browser vendor prefixes for compatibility across multiple browsers

# Getting Started

## Installation

You can include BlurJS in your project by downloading it from this repository and linking it to your HTML file. Alternatively, use the CDN link for faster loading:

**Minified Version**
```html
<script src="https://cdn.jsdelivr.net/gh/Infinitode/BlurJS@main/dist/blur.min.js"></script>
```

**Normal Version**
```html
<script src="https://cdn.jsdelivr.net/gh/Infinitode/BlurJS@main/dist/blur.js"></script>
```

**Important Note:** BlurJS should be placed in the `body` element of your HTML file, after all the blur elements, not in the `head` element.

## How to use BlurJS

You can use BlurJS in an HTML file. It will automatically detect all elements with a class of `blur`.

*Please note that the parent element in which the blur is placed must have it's position set to `relative`.*

## Available properties

There are several available properties that come with BlurJS, these include (include as attributes in the element, see example below):

- `blur-width`: Sets the width of the blur. `default 50px`
- `blur-height`: Sets the height of the blur. `default 50px`
- `blur-amount`: Sets the amount of blur. `default 25px`
- `blur-background`: Sets the color or background of the blur (gradients can also be used). `default red`
- `blur-z-index`: Sets the Z Index of the blur. `default 99`
- `blur-top`: Positions the blur from the top. `no default assigned`
- `blur-left`: Positions the blur from the left. `no default assigned`
- `blur-right`: Positions the blur from the right. `no default assigned`
- `blur-bottom`: Positions the blur from the bottom. `no default assigned`
- `blur-border-radius`: Changes the blur border radius. `default 5rem 2rem 5rem 50%`
- `blur-grain`: Must be set to `true` in order to work. Sets the blur to a grainy texture. `no default assigned`
- `blur-scale`: The value to scale to. If present triggers a scale animation to that value. `no default assigned`
- `blur-scale-duration`: Optional duration value for the scale animation. `no default assigned`
- `blur-scale-repetitions`: Optional repetitions value for the scale animation. `no default assigned`
- `blur-translate-x`: The value to translate on the x-axis. If present triggers a translation animation to that value. `no default assigned`
- `blur-translate-x-duration`: Optional duration value for the translation animation. `no default assigned`
- `blur-translate-x-repetitions`: Optional repetitions value for the translation animation. `no default assigned`
- `blur-translate-y`: The value to translate on the y-axis. If present triggers a translation animation to that value. `no default assigned`
- `blur-translate-y-duration`: Optional duration value for the translation animation. `no default assigned`
- `blur-translate-y-repetitions`: Optional repetitions value for the translation animation. `no default assigned`
- `blur-opacity`: The value to animate on the opacity property. If present triggers a opacity animation to that value. `no default assigned`
- `blur-opacity-duration`: Optional duration value for the opacity animation. `no default assigned`
- `blur-opacity-repetitions`: Optional repetitions value for the opacity animation. `no default assigned`
- `blur-animate`: The value to transition to. Transitions from the `blur-amount` value and this value. If present triggers a blur animation to that value. `no default assigned`
- `blur-animate-duration`: Optional duration value for the blur animation. `no default assigned`
- `blur-animate-repetitions`: Optional repetitions value for the blur animation. `no default assigned`

*View the [docs](https://infinitode-docs.gitbook.io/documentation/package-documentation/blurjs-package-documentation) for more...*

## Usage examples

Here follows a couple of basic usage examples for BlurJS.

### 1. Width and Height
```HTML
<div class="blur" blur-width="50px" blur-height="50px">
```

### 2. Background / Color
```HTML
<div class="blur" blur-background="#5d17eb">
```

### 3. Border Radius
```HTML
<div class="blur" blur-border-radius="50%">
```

These examples only detail the basic usage of BlurJS, BlurJS is directly connected to CSS properties, which allows for more advanced effects such as gradient blurs, animated blurs, shape blurs, etc.

# License

BlurJS is licensed under a [modified MIT license](https://github.com/infinitode/blurjs/blob/main/LICENSE), please view the license file for more information.

# Contributions

All contributions are welcome! You can get started by opening a request on Github. Help us make BlurJS better for everyone!
