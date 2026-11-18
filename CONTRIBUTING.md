# Contributing to BlurJS

Thank you for considering contributing to **BlurJS**! Contributions, whether they are bug fixes, new features, or improvements to the documentation, are always welcome. Before contributing, please read the following guidelines to ensure smooth collaboration.

## Getting Started

1. **Fork the Repository**  
   Create a fork of this repository to your GitHub account and clone it locally.

2. **Run Tests**

   Open `tests/regression_test.html` in your browser. It tests both browser builds and displays the results without any tooling to install. Open `tests/basic_test.html` to try the examples manually.

## How to Contribute

1. **Report Issues**  
   Use the [GitHub Issues page](https://github.com/Infinitode/blurjs/issues) to report bugs or suggest features. Please include:
   - A clear description of the issue or suggestion.
   - Steps to reproduce (for bugs).

2. **Make Changes**  
   - Edit `dist/blur.js` and keep `dist/blur.min.js` in sync using a JavaScript minifier. Include both browser files in your changes.
   - Add a case to `tests/regression_test.js` for bug fixes and new behavior.
   - Use clear and descriptive commit messages, and keep the code readable.

3. **Submit a Pull Request**  
   - Push your changes to a feature branch in your fork.
   - Submit a pull request with a detailed explanation of what you've changed or added.
   - Run the browser regression suite and include the results in your pull request.

## Community Guidelines

To maintain a positive and collaborative community, we ask that all contributors adhere to the following principles:

1. **Be Respectful**  
   Treat others with respect, regardless of their background or expertise. 

2. **Provide Constructive Feedback**  
   Offer helpful and actionable suggestions during code reviews.

3. **Follow Licensing Requirements**  
   Ensure that any derivative works comply with the [license](https://github.com/infinitode/blurjs/blob/main/LICENSE).

By contributing, you agree to abide by these guidelines and this project's [license](https://github.com/infinitode/blurjs/blob/main/LICENSE). Thank you for helping make **BlurJS** better!