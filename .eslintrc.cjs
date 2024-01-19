/* eslint-env node */

module.exports = {
  root: true,
  extends: ["plugin:vue/vue3-essential", "eslint:recommended", "@vue/eslint-config-typescript"],
  rules: {
    // Enable vue/script-setup-uses-vars rule
    "vue/script-setup-uses-vars": "error",
    "vue/no-unused-vars": "off",
  },
  parserOptions: {
    ecmaVersion: "latest",
  },
};
