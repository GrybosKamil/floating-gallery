export default {
  plugins: ["typescript", "unicorn", "oxc", "react"],
  categories: {
    correctness: "error",
  },
  rules: {},
  env: {
    builtin: true,
  },
  ignorePatterns: ["dist", "node_modules"],
};
