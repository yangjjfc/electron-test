module.exports = {
    root: true,
    parserOptions: {
        'parser': 'babel-eslint',
        'ecmaVersion': 2017,
        sourceType: 'module'
    },
    env: {
        node: true
    },
    'extends': [
        'plugin:vue/essential',
        '@vue/standard'
    ],
    plugins: ['vue'],
    rules: {
        'no-alert': 2,
        'no-caller': 2,
        'no-console': 0,
        'no-constant-condition': 2,
        'no-control-regex': 2,
        'no-debugger': 2,
        'no-delete-var': 2,
        'no-dupe-keys': 2,
        'no-dupe-args': 2,
        'no-duplicate-case': 2,
        'no-empty': 2,
        'no-empty-character-class': 2,
        'no-extra-boolean-cast': 2,
        'no-extra-semi': 2,
        'no-fallthrough': 2,
        'no-func-assign': 2,
        'no-inner-declarations': 2,
        'no-invalid-regexp': 2,
        'no-irregular-whitespace': 2,
        'no-mixed-requires': 2,
        'no-mixed-spaces-and-tabs': 2,
        'linebreak-style': [0, 'windows'],
        'no-multiple-empty-lines': 2,
        'no-negated-in-lhs': 2,
        'no-new-require': 2,
        'no-obj-calls': 2,
        'no-octal': 2,
        'no-redeclare': 2,
        'no-regex-spaces': 2,
        'no-sparse-arrays': 1,
        'no-undef': 1,
        'no-tabs': 'off',
        'no-trailing-spaces': 'off', // 不让有空行
        'spaced-comment': 1,
        'no-unreachable': 2,
        'no-unused-vars': 1,
        'no-warning-comments': 0, // 不能有警告备注 , { "terms": ["TODO", "FIXME", "xxx"], "LOCATION": "start" }
        'array-bracket-spacing': 1,
        'arrow-body-style': 2,
        // 'comma-dangle': 0,
        'comma-dangle': ['error', 'never'], // 是否允许对象中出现结尾逗号
        'complexity': 1,
        'computed-property-spacing': 2,
        'curly': 1,
        'dot-notation': 2,
        'func-style': 0,
        // 'func-style': [2, 'declaration'],
        'indent': [1, 4],
        'key-spacing': 1,
        'eol-last': 0,
        'max-depth': 2,
        'max-nested-callbacks': 2,
        'prefer-promise-reject-errors': 0,
        'one-var': [
            'error',
            {
                // "let": "never",
                // "const": "never",
                var: 'always'
            }
        ],
        'operator-assignment': 2,
        'quotes': ['error', 'single'],
        'semi': ['error', 'always'],
        'semi-spacing': 2,
        // "space-after-keywords": 1,
        // "space-before-keywords": 1,
        'space-before-blocks': 2,
        'space-before-function-paren': 1,
        'space-in-parens': 2,
        'space-unary-ops': 2,
        'use-isnan': 2,
        'valid-jsdoc': 0,
        'valid-typeof': 2,
        // allow paren-less arrow functions
        'arrow-parens': 0,
        // allow async-await
        'generator-star-spacing': 0,
        // allow debugger during development
        'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0
    }
};
