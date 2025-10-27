# BlurJS 1.5

[![GitHub license](https://img.shields.io/badge/license-compliance-green.svg)](https://github.com/infinitode/blurjs/blob/main/LICENSE)
[![GitHub stars](https://img.shields.io/github/stars/infinitode/blurjs.svg)](https://github.com/infinitode/blurjs/stargazers)
[![GitHub issues](https://img.shields.io/github/issues/infinitode/blurjs.svg)](https://github.com/infinitode/blurjs/issues)
[![JSDelivr monthly downloads](https://data.jsdelivr.com/v1/package/gh/Infinitode/BlurJS/badge?style=rounded)](https://www.jsdelivr.com/package/gh/Infinitode/BlurJS)

BlurJS is a lightweight JavaScript library for creating blurred effects on HTML elements. Easily integrate blurred elements into your web projects with simple HTML attributes.

> [!NOTE]
> Older versions of BlurJS are not maintained, and are not recommended for use. We only maintain `main`, which is the latest stable release of BlurJS.

## Changes in Version 1.4

- Support for more browsers, using vendor prefixes where needed.
- Performance optimizations by refactoring and cleaning code.
- More usage examples in the README file for clearer usage.

## Changes in Version 1.3

BlurJS now supports using multiple animations in one single element. You can combine animations and change their easing, duration, and repetitions to create unique and fun interactions/animations. New `blur-{animation-type}-timing` parameter for controlling easing during animations.

## Changes in Version 1.2

Pointer events and user selection is now available through BlurJS parameters. You can trigger animation effects dynamically using the new `blur-interaction` parameter. This will enable you to make custom interactions using very little effort.

### Changes in Version 1.1:
1. Moved the for loop to loop per element, improving stability and performance.
2. Created implementations for interactions with blur elements using the `blur-interaction` attribute.
3. Updated the code to also have attributes for controlling pointer events and user selection.

# Getting Started

## Installation

You can include BlurJS in your project by downloading the ready-to-use files from this repository or by using the CDN links for faster loading.
- `dist/blur.js`: The development (unminified) version of BlurJS.
- `dist/blur.min.js`: The production (minified) version of BlurJS.

**Using CDN:**

**Minified Version (Recommended for production)**
```html
<script src="https://cdn.jsdelivr.net/gh/Infinitode/BlurJS@main/dist/blur.min.js"></script>
```

**Normal Version (Useful for development/debugging)**
```html
<script src="https://cdn.jsdelivr.net/gh/Infinitode/BlurJS@main/dist/blur.js"></script>
```

> [!IMPORTANT]
> BlurJS should be placed at the end of the `<body>` element in your HTML file, after all elements you intend to apply blur effects to. Do not place it in the `<head>` element.

## How to use BlurJS

1.  Ensure the parent element of any `blur` element has its CSS `position` property set to `relative` (or `absolute`, `fixed`, `sticky`). This is crucial for correct positioning of the blur effect.
    ```html
    <div style="position: relative; width: 200px; height: 200px; border: 1px solid #ccc;">
      <!-- BlurJS elements will go here -->
    </div>
    ```
2.  Add the class `blur` to any HTML element you want BlurJS to affect.
3.  Use the `blur-*` attributes on that element to customize its appearance and behavior.

BlurJS will automatically detect and process all elements with the class `blur`.

## Available properties

There are several available properties that come with BlurJS. Include these as HTML attributes on your `.blur` elements.

- `blur-width`: Sets the width of the blur effect. `default: 50px`
- `blur-height`: Sets the height of the blur effect. `default: 50px`
- `blur-amount`: Sets the intensity of the blur. `default: 25px`
- `blur-background`: Sets the color or background of the blur (CSS color values, gradients can also be used). `default: red`
- `blur-z-index`: Sets the Z Index of the blur effect. `default: 99`
- `blur-top`: Positions the blur from the top edge of its parent. `no default`
- `blur-left`: Positions the blur from the left edge of its parent. `no default`
- `blur-right`: Positions the blur from the right edge of its parent. `no default`
- `blur-bottom`: Positions the blur from the bottom edge of its parent. `no default`
- `blur-border-radius`: Changes the border radius of the blur effect. `default: 5rem 2rem 5rem 50%`
- `blur-grain`: Set to `true` to apply a grainy texture to the blur effect. `no default`
- `blur-pointer-events`: Set to `true` to enable pointer events (e.g., clicks) on the blur element, or `false` to disable. `no default (inherits CSS default)`
- `blur-user-select`: Set to `true` to allow text selection on the blur element, or `false` to disable. `no default (inherits CSS default)`
- `blur-custom`: Apply any custom CSS properties to the blur element. This is useful for adding properties that are not available through the other attributes. `no default`

**Animation Properties:**

Animations run with a 50% keyframe by default (animating to the target value and back to the original).

- `blur-scale`: The scale factor (e.g., `1.2` for 120% size). Triggers a scale animation. `no default`
- `blur-scale-duration`: Duration for the scale animation (e.g., `2s`, `500ms`). `default: 1s`
- `blur-scale-repetitions`: Number of times the scale animation repeats (e.g., `3`, `infinite`). `default: infinite`
- `blur-scale-timing`: CSS animation timing function for scale (e.g., `ease-in-out`, `linear`). `default: linear`

- `blur-translate-x`: Horizontal translation distance (e.g., `50px`, `-10%`). Triggers a horizontal translation animation. `no default`
- `blur-translate-x-duration`: Duration for X translation. `default: 1s`
- `blur-translate-x-repetitions`: Repetitions for X translation. `default: infinite`
- `blur-translate-x-timing`: Timing function for X translation. `default: linear`

- `blur-translate-y`: Vertical translation distance. Triggers a vertical translation animation. `no default`
- `blur-translate-y-duration`: Duration for Y translation. `default: 1s`
- `blur-translate-y-repetitions`: Repetitions for Y translation. `default: infinite`
- `blur-translate-y-timing`: Timing function for Y translation. `default: linear`

- `blur-opacity`: Target opacity value (e.g., `0.5`). Triggers an opacity animation. `no default`
- `blur-opacity-duration`: Duration for opacity animation. `default: 1s`
- `blur-opacity-repetitions`: Repetitions for opacity animation. `default: infinite`
- `blur-opacity-timing`: Timing function for opacity animation. `default: linear`

- `blur-animate`: Target blur amount for animation (e.g., `10px`). Animates the `filter: blur()` property. `no default`
- `blur-animate-duration`: Duration for blur amount animation. `default: 1s`
- `blur-animate-repetitions`: Repetitions for blur amount animation. `default: infinite`
- `blur-animate-timing`: Timing function for blur amount animation. `default: linear`

**Interaction Property:**

- `blur-interaction`: Defines how animations are triggered.
    - `hover`: Animation plays when the mouse hovers over the element, pauses when it leaves.
    - `click`: Animation toggles between play/pause on each click.
    - `scroll`: Animation plays when the element is scrolled into the viewport, pauses when scrolled out.
    `no default`

> [!NOTE]
> For an exhaustive list of properties and more detailed explanations, view the [official documentation](https://infinitode-docs.gitbook.io/documentation/package-documentation/blurjs-package-documentation).

## Usage examples

Below are some examples to get you started. Remember to include the BlurJS script at the end of your `<body>` and ensure parent elements of `.blur` items have `position: relative;` (or similar).

### Basic Styling

**1. Custom Width, Height, and Color**
```html
<div style="position: relative; width: 150px; height: 100px; border: 1px solid #eee; margin-bottom: 10px;">
  <div class="blur"
       blur-width="100px"
       blur-height="70px"
       blur-background="rgba(0, 150, 255, 0.7)"
       blur-amount="15px">
  </div>
</div>
```

**2. Custom Border Radius**
```html
<div style="position: relative; width: 100px; height: 100px; border: 1px solid #eee; margin-bottom: 10px;">
  <div class="blur"
       blur-border-radius="50%"
       blur-background="purple">
  </div>
</div>
```

### Advanced Styling

**1. Combining Multiple Properties & Positioning**
```html
<div style="position: relative; width: 250px; height: 150px; border: 1px solid #eee; margin-bottom: 10px; background: #f0f0f0;">
  <p style="padding: 5px; text-align: center;">Content behind the blur</p>
  <div class="blur"
       blur-width="200px"
       blur-height="100px"
       blur-background="rgba(255, 100, 100, 0.6)"
       blur-amount="20px"
       blur-border-radius="10px"
       blur-top="25px"
       blur-left="25px"
       blur-z-index="100">
  </div>
</div>
```

**2. Grainy Texture Effect**
```html
<div style="position: relative; width: 150px; height: 100px; border: 1px solid #eee; margin-bottom: 10px;">
  <div class="blur"
       blur-width="120px"
       blur-height="80px"
       blur-background="rgba(50, 200, 50, 0.7)"
       blur-grain="true"
       blur-amount="30px">
  </div>
</div>
```

### Animations

**1. Simple Scale Animation**
```html
<div style="position: relative; width: 100px; height: 100px; border: 1px solid #eee; margin-bottom: 10px;">
  <div class="blur"
       blur-scale="1.5"
       blur-scale-duration="2s"
       blur-scale-repetitions="infinite"
       blur-background="orange">
  </div>
</div>
```

**2. Combined Opacity and Translation Animation**
```html
<div style="position: relative; width: 200px; height: 100px; border: 1px solid #eee; margin-bottom: 10px; overflow: hidden;">
  <div class="blur"
       blur-opacity="0.2"
       blur-opacity-duration="3s"
       blur-opacity-repetitions="infinite"
       blur-translate-x="70px"
       blur-translate-x-duration="3s"
       blur-translate-x-timing="ease-in-out"
       blur-translate-x-repetitions="infinite"
       blur-background="teal">
  </div>
</div>
```

**3. Animating Blur Amount**
```html
<div style="position: relative; width: 100px; height: 100px; border: 1px solid #eee; margin-bottom: 10px;">
  <div class="blur"
       blur-amount="5px"
       blur-animate="35px"
       blur-animate-duration="2.5s"
       blur-animate-repetitions="infinite"
       blur-background="crimson">
  </div>
</div>
```

### Interactions

**1. Hover Interaction (Scale Effect)**
```html
<div style="position: relative; width: 120px; height: 120px; border: 1px solid #eee; margin-bottom: 10px; display: flex; align-items: center; justify-content: center;">
  <p>Hover Me</p>
  <div class="blur"
       blur-interaction="hover"
       blur-scale="2"
       blur-scale-duration="0.5s"
       blur-scale-timing="ease-out"
       blur-scale-repetitions="1"
       blur-background="rgba(255, 200, 0, 0.8)"
       blur-width="80px"
       blur-height="80px">
  </div>
</div>
```
> **Note:** For hover, `blur-scale-repetitions` is often set to `1` if you want the animation to play once per hover, or `infinite` (with `alternate`) if you want it to pulse as long as hovered. The default behavior is it plays to 50% and back.

**2. Click Interaction (Toggle Opacity)**
```html
<div style="position: relative; width: 120px; height: 120px; border: 1px solid #eee; margin-bottom: 10px; display: flex; align-items: center; justify-content: center; cursor: pointer;">
  <p>Click Me</p>
  <div class="blur"
       blur-interaction="click"
       blur-opacity="0.1"
       blur-opacity-duration="1s"
       blur-opacity-repetitions="1"
       blur-background="rgba(0, 100, 200, 0.7)"
       blur-width="100px"
       blur-height="100px">
  </div>
</div>

**3. Custom CSS properties**
```html
<div style="position: relative; width: 250px; height: 150px; border: 1px solid #eee; margin-bottom: 10px;">
    <div class="blur"
        blur-width="100%"
        blur-height="100%"
        blur-top="0"
        blur-left="0"
        blur-amount="5px"
        blur-custom="background: linear-gradient(45deg, rgba(255,0,0,0.5), rgba(0,0,255,0.5)); border: 2px solid black; box-shadow: 5px 5px 10px rgba(0,0,0,0.5);">
    </div>
</div>
```
```

**3. Scroll Interaction (Translate Effect)**
```html
<div style="height: 150px;">Scroll down to see the effect...</div>
<div style="position: relative; width: 150px; height: 100px; border: 1px solid #eee; margin: 50vh auto 100vh auto; background: #f9f9f9;">
  <!-- The large margin is to ensure scrolling is needed -->
  <p style="text-align:center; padding-top: 40px;">I appear on scroll</p>
  <div class="blur"
       blur-interaction="scroll"
       blur-translate-y="-30px"
       blur-translate-y-duration="1.5s"
       blur-translate-y-repetitions="1"
       blur-background="rgba(100, 0, 150, 0.75)"
       blur-width="100%"
       blur-height="100%"
       blur-top="0"
       blur-left="0">
  </div>
</div>
```

These examples showcase a range of possibilities with BlurJS. Experiment with different combinations of attributes to achieve unique effects!

# License

BlurJS is licensed under a [modified MIT license](https://github.com/infinitode/blurjs/blob/main/LICENSE), please view the license file for more information.

# Contributions

All contributions are welcome! You can get started by opening a request on Github. Help us make BlurJS better for everyone!
