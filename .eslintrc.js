module.exports = {
    root: true,
    env: {
        node: true,
        es6: true,
    },
    extends: [
        "eslint:recommended",
        "plugin:@typescript-eslint/recommended",
        "prettier",
    ],
    parser: "@typescript-eslint/parser",
    plugins: ["@typescript-eslint"],
    rules: {
        "prettier/prettier": "error",
        "no-console": "warn",
        "@typescript-eslint/no-explicit-any": "off",
    },
};
