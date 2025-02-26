module.exports = {
    {
        "extends": [
            "airbnb",
            "prettier",
            "prettier/react"
        ],
        "parser": "babel-eslint",
        "env": {
            "browser": true,
            "commonjs": true,
            "es6": true,
            "node": true
        },
        "parserOptions": {
            "ecmaFeatures": {
                "jsx": true
            },
            "sourceType": "module"
        },
        "rules": {
            "no-const-assign": "warn",
            "no-this-before-super": "warn",
            "no-undef": "warn",
            "no-unreachable": "warn",
            "no-unused-vars": "warn",
            "constructor-super": "warn",
            "valid-typeof": "warn",
            "prettier/prettier": [
                "error",
                {
                    "trailingComma": "es5",
                    "singleQuote": true,
                    "printWidth": 120,
                    "semi": true
                }
            ],
            "react/jsx-filename-extension": [
                "error",
                {
                    "extensions": [
                        ".js",
                        ".jsx"
                    ]
                }
            ],
            "import/no-extraneous-dependencies": [
                "off"
            ],
            "react/prefer-stateless-function": [
                "off"
            ],
            "jsx-a11y/anchor-is-valid": [
                "error",
                {
                    "components": []
                }
            ]
        },
        "plugins": [
            "prettier"
        ]
    }
};