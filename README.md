# Glite Browser Extension

Enhances web browsing with Glite learning concepts by subtly augmenting text content with relevant vocabulary and idioms.

## Overview

This browser extension identifies opportunities within web page text (articles, blog posts) to inject vocabulary, idioms, and other concepts that align with the user's current learning goals, as defined by the Glite learning platform. It aims to provide passive reinforcement in a real-world context.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

- [Node.js](https://nodejs.org/) (LTS version recommended, e.g., v20)
- [npm](https://www.npmjs.com/) (usually comes with Node.js) or [Yarn](https://yarnpkg.com/)

### Installation

1.  **Clone the repository:**

    ```bash
    git clone <repository-url>
    cd glite-browser-extension
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    # or
    # yarn install
    ```

### Development Scripts

- **Linting:** Check code quality using ESLint.

  ```bash
  npm run lint
  ```

- **Formatting Check:** Check code formatting using Prettier.

  ```bash
  npm run format:check
  ```

- **Apply Formatting:** Apply Prettier formatting fixes.

  ```bash
  npm run format:fix
  ```

- **Build:** Compile TypeScript and bundle the extension for production. The output will be in the `dist/` directory.

  ```bash
  npm run build
  ```

  _(Note: This initial build is very basic. It will become more complex as features are added.)_

- **Test:** (Tests will be added in later milestones)
  ```bash
  npm test
  ```

### Loading the Extension (Chrome Example)

1.  Run the build command: `npm run build`.
2.  Open Chrome and navigate to `chrome://extensions/`.
3.  Enable "Developer mode" using the toggle switch in the top-right corner.
4.  Click the "Load unpacked" button.
5.  Select the `glite-browser-extension/dist` directory.

The extension icon should appear in your browser toolbar.

## Contribution

(Contribution guidelines will be added here - see `CONTRIBUTING.md` if it exists).

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
