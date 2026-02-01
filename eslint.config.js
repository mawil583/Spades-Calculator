import js from '@eslint/js';
import reactPlugin from 'eslint-plugin-react';
import reactHooksPlugin from 'eslint-plugin-react-hooks';
import importPlugin from 'eslint-plugin-import';

export default [
  js.configs.recommended,
  {
    files: ['src/**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        window: 'readonly',
        document: 'readonly',
        console: 'readonly',
        process: 'readonly',
        Buffer: 'readonly',
        __dirname: 'readonly',
        __filename: 'readonly',
        global: 'readonly',
        module: 'readonly',
        require: 'readonly',
        exports: 'readonly',
        localStorage: 'readonly',
        sessionStorage: 'readonly',
        navigator: 'readonly',
        setTimeout: 'readonly',
        clearTimeout: 'readonly',
        setInterval: 'readonly',
        clearInterval: 'readonly',
        fetch: 'readonly',
        URL: 'readonly',
        Event: 'readonly',
        CustomEvent: 'readonly',
        caches: 'readonly',
        self: 'readonly',
      },
      parserOptions: {
        ecmaFeatures: {
          jsx: true
        }
      }
    },
    plugins: {
      react: reactPlugin,
      'react-hooks': reactHooksPlugin,
      import: importPlugin,
    },
    settings: {
      react: {
        version: 'detect'
      }
    },
    rules: {
      ...reactPlugin.configs.recommended.rules,
      ...reactHooksPlugin.configs.recommended.rules,
      'no-unused-expressions': 'off',
      'react/prop-types': 'off', // Disable prop-types for now
      'react/react-in-jsx-scope': 'off',
      'react/jsx-uses-react': 'off',
      'no-unused-vars': 'error',
      'no-case-declarations': 'warn',
      'no-prototype-builtins': 'warn',
      'react/no-unescaped-entities': 'warn',
      'import/first': 'warn',
      'no-restricted-imports': [
        'error',
        {
          paths: [
            {
              name: '@chakra-ui/react',
              message: 'Architecture Violation: Direct imports from @chakra-ui/react are banned in feature files. Please import from "src/components/ui" or designated adapter files instead.'
            },
            {
              name: '@emotion/react',
              message: 'Architecture Violation: Avoid direct use of Emotion in feature files to maintain decoupling.'
            },
            {
              name: '@emotion/styled',
              message: 'Architecture Violation: Avoid direct use of Emotion in feature files to maintain decoupling.'
            }
          ]
        }
      ],
      'no-restricted-syntax': [
        'warn',
        {
          selector: 'JSXAttribute > Literal[value=/^#([A-Fa-f0-9]{3}|[A-Fa-f0-9]{6})$/]',
          message: 'Architecture Violation: Hardcoded hex colors are discouraged. Use centralized CSS variables like "var(--app-team1)".'
        },
        {
          selector: "JSXAttribute[name.name=/^(p|m|gap|fontSize|borderRadius|px|py|pt|pb|pl|pr|mx|my|mt|mb|ml|mr)$/] > Literal[value=/^[0-9]+(px)?$/]",
          message: 'Architecture Violation: Hardcoded numeric styling is discouraged. Use centralized spacing/font variables like "var(--app-spacing-4)".'
        },
        {
          selector: 'VariableDeclarator[id.type="Identifier"][init.type="Identifier"]',
          message: 'Architecture Violation: Simple variable reassignments (aliases) like "const Field = RoundSummaryField" are discouraged. Use the original variable directly.'
        }
      ]
    }
  },
  {
    // Whitelist the adapter layer and theme config from strict import rules
    files: [
      'src/components/ui/**/*.{js,jsx}',
      'src/customTheme.js',
    ],
    rules: {
      'no-restricted-imports': 'off',
      'no-restricted-syntax': 'off'
    }
  },
  {
    files: ['src/**/*.test.{js,jsx}', 'src/**/*.spec.{js,jsx}', 'src/__tests__/**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        describe: 'readonly',
        it: 'readonly',
        test: 'readonly',
        expect: 'readonly',
        beforeEach: 'readonly',
        afterEach: 'readonly',
        beforeAll: 'readonly',
        afterAll: 'readonly',
        jest: 'readonly',
        window: 'readonly',
        document: 'readonly',
        console: 'readonly',
        localStorage: 'readonly',
        sessionStorage: 'readonly',
        navigator: 'readonly',
        Event: 'readonly',
        CustomEvent: 'readonly',
      }
    },
    rules: {
      'no-unused-expressions': 'off',
      'react/prop-types': 'off',
    }
  },
  {
    files: ['cypress/**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        cy: 'readonly',
        Cypress: 'readonly',
        window: 'readonly',
        document: 'readonly',
        console: 'readonly',
      }
    },
    rules: {
      'no-unused-expressions': 'off',
    }
  },
  {
    files: ['tests/**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        test: 'readonly',
        expect: 'readonly',
        window: 'readonly',
        document: 'readonly',
        console: 'readonly',
        process: 'readonly',
        Buffer: 'readonly',
        __dirname: 'readonly',
        __filename: 'readonly',
        global: 'readonly',
        module: 'readonly',
        require: 'readonly',
        exports: 'readonly',
      }
    },
    rules: {
      'no-unused-expressions': 'off',
    }
  },
  {
    files: ['src/services/service-worker.js'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        self: 'readonly',
        fetch: 'readonly',
        caches: 'readonly',
        URL: 'readonly',
        Request: 'readonly',
        Response: 'readonly',
        Headers: 'readonly',
        console: 'readonly',
      }
    },
    rules: {
      'no-unused-expressions': 'off',
    }
  }
];
