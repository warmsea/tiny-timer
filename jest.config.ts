module.exports = {
  moduleNameMapper: {
    "\\.s?css$": "identity-obj-proxy",
  },
  transform: {
    "\\.tsx?$": ["ts-jest"],
  },
  collectCoverageFrom: ["src/**"],
};
