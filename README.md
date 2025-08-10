# Spades Calculator

## In order to run the app locally,

1. Clone the repository in the directory of your choice.
2. Open your Terminal and **cd** into the root directory of the project.
3. Run **npm i** to download server dependencies.
4. Run **npm start**.
5. Now your project should be viewable in your browser at **http://localhost:5173/**.

- You may be asked permission for the project to open the website in your browser. It's safe to grant that permission.

_note: This is a frontend-only application built with Vite. The development server runs on port 5173._

## Running Tests

To run the end-to-end (e2e) tests using Cypress, open your terminal in the project's root directory and execute:

```bash
npx cypress open
```

This will launch the Cypress Test Runner, where you can select and run your tests visually.

## Linting

The project uses ESLint for code quality and consistency. You can run the following commands:

```bash
# Fix automatically fixable linting issues
npm run lint

# Check for linting issues without fixing them
npm run lint:check
```

The project is configured to automatically run linting on staged files before commits using husky and lint-staged.
