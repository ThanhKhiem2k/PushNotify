module.exports = {
  root: true,
  extends: '@react-native-community',
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  overrides: [
    {
      files: ['*.ts', '*.tsx'],
      rules: {
        '@typescript-eslint/no-shadow': ['error'],
        'no-shadow': 'off',
        'react-hooks/exhaustive-deps': 'off',
        'arrow-body-style': 0,
        'linebreak-style': 0,
        'no-use-before-define': 'off',
        'react/jsx-filename-extension': 'off',
        'react/prop-types': 'off',
        'comma-dangle': 'off',
        'import/prefer-default-export': 'off',
        'react-hooks/rules-of-hooks': 'error',
        'import/no-cycle': 'off',
        'no-empty-function': 'off',
        'react/display-name': 'off',
        'react-native/no-unused-styles': 'off',
        'react-native/no-inline-styles': 'off',
        'react-native/no-single-element-style-arrays': 2,
        'no-undef': 2,
        // 'react-native/no-color-literals': 2,
        'no-unused-vars': 'off',
        '@typescript-eslint/no-unused-vars': 'off',
        // 'allowEmptyCatch': 'on'
        "react-native/no-inline-styles": 0,
        "prettier/prettier": ["error", {
          "no-inline-styles": false
        }],  
      },
    },
  ],
};
