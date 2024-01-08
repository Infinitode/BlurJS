# BlurJS 1.0

[![GitHub license](https://img.shields.io/badge/license-custom-green.svg)](https://github.com/infinitode/blurjs/blob/main/LICENSE)
[![GitHub stars](https://img.shields.io/github/stars/infinitode/blurjs.svg)](https://github.com/infinitode/blurjs/stargazers)
[![GitHub issues](https://img.shields.io/github/issues/infinitode/blurjs.svg)](https://github.com/infinitode/blurjs/issues)

BlurJS is a lightweight JavaScript library for creating blurred effects on HTML elements. Easily integrate blur into your web projects with simple HTML attributes.

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

## How to use BlurJS

You can use BlurJS in an HTML file. It will automatically detect all elements with a class of `blur`.

*Please note that the parent element in which the blur is placed must have it's position set to `relative`.*

## Available properties

There are several available properties that come with BlurJS, these include (include as attributes in the element, see example below):

- `blur-width`: Sets the width of the blur. `default 50px`
- `blur-height`: Sets the height of the blur. `default 50px`
- `blur-amount`: Sets the amount of blur. `default 25px`
- `blur-color`: Sets the color of the blur (gradients can also be used). `default red`
- `blur-z-index`: Sets the Z Index of the blur. `default 99`
- `blur-top`: Positions the blur from the top. `default 0`
- `blur-left`: Positions the blur from the left. `default 0`
- `blur-right`: Positions the blur from the right. `no default assigned`
- `blur-bottom`: Positions the blur from the bottom. `no default assigned`
- `blur-border-radius`: Changes the blur border radius. `default 5rem 2rem 5rem 50%`

*more coming soon*

## Usage examples

Here follows a couple of basic usage examples for BlurJS.

### 1. Width and Height
```HTML
<div class="blur" blur-width="50px" blur-height="50px">
```

### 2. Color
```HTML
<div class="blur" blur-color="#5d17eb">
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
