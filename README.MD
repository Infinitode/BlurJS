# BlurJS 1.7

[![GitHub license](https://img.shields.io/badge/license-compliance-green.svg)](https://github.com/infinitode/blurjs/blob/main/LICENSE)
[![GitHub stars](https://img.shields.io/github/stars/infinitode/blurjs.svg)](https://github.com/infinitode/blurjs/stargazers)
[![GitHub issues](https://img.shields.io/github/issues/infinitode/blurjs.svg)](https://github.com/infinitode/blurjs/issues)
[![JSDelivr monthly downloads](https://data.jsdelivr.com/v1/package/gh/Infinitode/BlurJS/badge?style=rounded)](https://www.jsdelivr.com/package/gh/Infinitode/BlurJS)

[Documentation](https://infinitode-docs.gitbook.io/documentation/package-documentation/blurjs-package-documentation)

BlurJS is a lightweight JavaScript library for creating blurred effects on HTML elements. Easily integrate blurred elements into your web projects with simple HTML attributes.

> [!NOTE]
> Older versions of BlurJS are not maintained and are not recommended for use. We only maintain `main`, which is the latest stable release of BlurJS.

## Unreleased maintenance update

- Preserves author inline styles, parses `blur-custom` as native CSS, and layers translucent grain over solid colors and gradients.
- Combines X and Y translations in browsers with additive CSS animations. Distinct animation targets no longer share a keyframe accidentally, and malformed options fall back without disabling other animations.
- Shares a viewport observer across scroll-triggered elements and releases detached targets. Loading the script twice no longer initializes elements twice.
- Respects `prefers-reduced-motion` for built-in animations while keeping static blur styles.
- Updates effects when their `blur-*` attributes or `.blur` class change, without needing to recreate the element.
- Removes generated keyframes when their last BlurJS animation stops using them.
- Adds a standalone browser regression suite for both distributions.

## Changes in Version 1.7

- **Dynamic DOM Observation (SPA Support)**: Implemented automatic detection and initialization of newly injected `.blur` elements via a `MutationObserver`, with weak references to avoid redundant initialization.
- **Independent Transform Properties**: Updated `blur-scale` and `blur-rotate` animations to use modern CSS independent transform properties (`scale` and `rotate`). This allows multiple animations to be combined on a single element without overriding one another!
- **Rotation Animations**: Added native support for `blur-rotate` animations.
- **Staggered Animation Delays**: Introduced delay parameters (`blur-{animation-type}-delay`) across all animation properties (e.g. `blur-rotate-delay`).
- **Mix Blend Mode**: Added `blur-mix-blend-mode` support to allow exquisite glassmorphic background blending.

## Changes in Version 1.6

- **Performance Optimization**: Implemented CSS keyframe deduplication. Elements sharing the same animation parameters now reuse the same keyframe definition, significantly reducing DOM overhead.
- **Improved Initialization**: Faster processing of elements on page load.
- **Enhanced Testing & Showcases**: Added a new `tests/` directory with comprehensive examples, including hero sections, navigation bars, and a performance stress test.
- **Benchmarking**: Integrated internal timing to monitor library performance.

## Changes in Version 1.5

- Updated `test_blurjs.html` with a test case for the new attribute.
- Added a `blur-version` attribute to the test page and a console log for the version.
- Added a `blur-custom` attribute for custom CSS. This is useful for adding CSS that isn't supported by BlurJS out of the box.

## Changes in Version 1.4

- Support for more browsers, using vendor prefixes where needed.
- Performance optimizations by refactoring and cleaning code.
- More usage examples in the README file for clearer usage.

## Changes in Version 1.3

BlurJS now supports using multiple animations in a single element. You can combine animations and change their easing, duration, and repetitions to create unique and fun interactions/animations. New `blur-{animation-type}-timing` parameter for controlling easing during animations.

## Changes in Version 1.2

Pointer events and user selection are now available through BlurJS parameters. You can trigger animation effects dynamically using the new `blur-interaction` parameter. This will enable you to make custom interactions using very little effort.

### Changes in Version 1.1:
1. Moved the for loop to loop per element, improving stability and performance.
2. Created implementations for interactions with blur elements using the `blur-interaction` attribute.
3. Updated the code to also have attributes for controlling pointer events and user selection.

# Historical Performance Benchmarks

These results compare the original 1.5 and 1.6/1.7 builds. To measure initialization on your machine with the current build, open `tests/stress_test.html`.

| Metric | Version 1.5 | Version 1.6 / 1.7 | Improvement |
| :--- | :--- | :--- | :--- |
| **Init Time (50 elements)** | ~15ms | ~4ms | ~73% |
| **Init Time (500 elements)** | ~120ms | ~25ms | ~79% |
| **Redundant Keyframes** | High (1 per element) | Zero (Deduplicated) | 100% |

*Benchmarks conducted on a standard mid-range laptop. Actual results may vary based on hardware and browser.*

# Getting Started

## Installation

BlurJS is distributed as ready-to-use browser scripts. Download one of the files below or use the CDN; no package installation or build step is required.
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

Place the script at the end of `<body>`, or load it with `defer` in `<head>`. BlurJS waits for the DOM if loaded before `<body>` is available. Include only one of the two builds.

## How to use BlurJS

1.  Ensure the parent element of any `blur` element has its CSS `position` property set to `relative` (or `absolute`, `fixed`, `sticky`). This is crucial for the correct positioning of the blur effect.
    ```html
    <div style="position: relative; width: 200px; height: 200px; border: 1px solid #ccc;">
      <!-- BlurJS elements will go here -->
    </div>
    ```
2.  Add the class `blur` to any HTML element you want BlurJS to affect.
3.  Use the `blur-*` attributes on that element to customize its appearance and behavior.

BlurJS detects `.blur` elements at startup and in newly inserted content. For decorative blurs, use `aria-hidden="true"` and `blur-pointer-events="false"` so the blur does not intercept clicks on other content.

### Edit an effect at runtime

Change the attributes on an existing element; BlurJS applies the new settings after the current batch of DOM changes. For example, given `<div id="glow" class="blur"></div>`:

```js
const glow = document.getElementById("glow");
glow.setAttribute("blur-width", "180px");
glow.setAttribute("blur-opacity", "0.5");
glow.setAttribute("blur-opacity-duration", "2s");
```

- `glow.removeAttribute("blur-width")` removes that override, falling back to the element's inline width or the BlurJS default. Removing `blur-opacity` stops that animation without affecting others.
- `glow.classList.remove("blur")` turns off the effect, restores its underlying inline styles, and releases its interaction handlers. Add the class back to enable the effect again.
- Elements with the same animation target share a generated keyframe. BlurJS removes the rule when the last element using it changes its target, disables the animation, or leaves the document.

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
- `blur-grain`: Set to `true` to add a translucent grain layer over a solid color or gradient. `no default`
- `blur-pointer-events`: Set to `true` to enable pointer events (e.g., clicks) on the blur element, or `false` to disable. `no default (inherits CSS default)`
- `blur-user-select`: Set to `true` to allow text selection on the blur element, or `false` to disable. `no default (inherits CSS default)`
- `blur-mix-blend-mode`: Sets the CSS blend mode (e.g., `screen`, `color-dodge`, `multiply`). `no default`
- `blur-custom`: Apply a CSS declaration list, just like a `style` attribute. CSS custom properties, `!important`, and URLs are supported. `no default`

Existing inline declarations are preserved. For normal declarations, `blur-*` styles override their inline equivalents and `blur-custom` can override those styling attributes. Dedicated grain, pointer, selection, and animation controls are applied after `blur-custom`.

**Animation Properties:**

Animations run to their target at the 50% keyframe, then return to the starting value. Invalid targets are skipped; invalid literal values for duration, timing, delay, or repetition count fall back to their defaults. Built-in animations are disabled while the browser's `prefers-reduced-motion` preference is `reduce`.

In browsers that support CSS `translate` and `animation-composition: add`, X and Y translations run together and compose with scale and rotation. Older browsers fall back to `transform`-based translation; configure only one axis per element there.

- `blur-scale`: The scale factor (e.g., `1.2` for 120% size). Triggers a scale animation. `no default`
- `blur-scale-duration`: Duration for the scale animation (e.g., `2s`, `500ms`). `default: 1s`
- `blur-scale-repetitions`: Number of times the scale animation repeats (e.g., `3`, `infinite`). `default: infinite`
- `blur-scale-timing`: CSS animation timing function for scale (e.g., `ease-in-out`, `linear`). `default: linear`
- `blur-scale-delay`: Stagger delay before starting the scale animation (e.g., `500ms`, `1s`). `default: 0s`

- `blur-rotate`: The rotation degree factor (e.g., `360deg`). Triggers a rotation animation. `no default`
- `blur-rotate-duration`: Duration for the rotate animation. `default: 1s`
- `blur-rotate-repetitions`: Number of repetitions. `default: infinite`
- `blur-rotate-timing`: CSS animation timing function for rotation. `default: linear`
- `blur-rotate-delay`: Stagger delay before starting the rotation animation. `default: 0s`

- `blur-translate-x`: Horizontal translation distance (e.g., `50px`, `-10%`). Triggers a horizontal translation animation. `no default`
- `blur-translate-x-duration`: Duration for X translation. `default: 1s`
- `blur-translate-x-repetitions`: Repetitions for X translation. `default: infinite`
- `blur-translate-x-timing`: Timing function for X translation. `default: linear`
- `blur-translate-x-delay`: Delay before starting X translation. `default: 0s`

- `blur-translate-y`: Vertical translation distance. Triggers a vertical translation animation. `no default`
- `blur-translate-y-duration`: Duration for Y translation. `default: 1s`
- `blur-translate-y-repetitions`: Repetitions for Y translation. `default: infinite`
- `blur-translate-y-timing`: Timing function for Y translation. `default: linear`
- `blur-translate-y-delay`: Delay before starting Y translation. `default: 0s`

- `blur-opacity`: Target opacity value (e.g., `0.5`). Triggers an opacity animation. `no default`
- `blur-opacity-duration`: Duration for opacity animation. `default: 1s`
- `blur-opacity-repetitions`: Repetitions for opacity animation. `default: infinite`
- `blur-opacity-timing`: Timing function for opacity animation. `default: linear`
- `blur-opacity-delay`: Delay before starting opacity animation. `default: 0s`

- `blur-animate`: Target blur amount for animation (e.g., `10px`). Animates the `filter: blur()` property. `no default`
- `blur-animate-duration`: Duration for blur amount animation. `default: 1s`
- `blur-animate-repetitions`: Repetitions for blur amount animation. `default: infinite`
- `blur-animate-timing`: Timing function for blur amount animation. `default: linear`
- `blur-animate-delay`: Delay before starting blur amount animation. `default: 0s`

**Interaction Property:**

- `blur-interaction`: Defines how animations are triggered.
    - `hover`: Animation plays when the mouse hovers over the element, pauses when it leaves.
    - `click`: Animation toggles between play/pause on each click.
    - `scroll`: Animation plays while the element intersects the viewport and pauses when it leaves. Without `IntersectionObserver`, it plays normally.
    - Omit the attribute for autoplay. Interactions pause and resume; they don't restart a finished finite animation.

> [!NOTE]
> For an exhaustive list of properties and more detailed explanations, view the [official documentation](https://infinitode-docs.gitbook.io/documentation/package-documentation/blurjs-package-documentation).

## Usage examples

Below are some examples to get you started. Include the BlurJS script once and give parent elements of `.blur` items `position: relative;` (or similar).

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
       blur-background="rgba(255, 200, 0, 0.8)"
       blur-width="80px"
       blur-height="80px">
  </div>
</div>
```
> **Note:** The default repetition count is `infinite`, so this example keeps pulsing while hovered. A finite count is shared across hover sessions, not restarted on each hover.

**2. Click Interaction (Toggle Opacity)**
```html
<div style="position: relative; width: 120px; height: 120px; border: 1px solid #eee; margin-bottom: 10px; display: flex; align-items: center; justify-content: center; cursor: pointer;">
  <p>Click Me</p>
  <div class="blur"
       blur-interaction="click"
       blur-opacity="0.1"
       blur-opacity-duration="1s"
       blur-background="rgba(0, 100, 200, 0.7)"
       blur-width="100px"
       blur-height="100px">
  </div>
</div>
```

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

**4. Scroll Interaction (Translate Effect)**
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

# Showcases & Tests

You can find various usage examples and performance tests in the `tests/` directory:
- `tests/basic_test.html`: General feature verification, including a live editing demo.
- `tests/showcase_hero.html`: Hero section with animated lighting effects.
- `tests/showcase_nav.html`: Glassmorphism navigation and scroll interactions.
- `tests/stress_test.html`: Initialization benchmark with 500 elements.
- `tests/regression_test.html`: Runs the regression suite against both browser files and reports the results in the page.

Open these pages in a browser. No test runner or packages are needed. If your browser blocks scripts opened from local files, serve the repository with any static file server and open `/tests/regression_test.html`.

# Contributions

All contributions are welcome! You can get started by opening a request on Github. Help us make BlurJS better for everyone!
