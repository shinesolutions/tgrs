const headless = process.env.HEADLESS !== "false";

module.exports = {
  launch: {
    headless,
    devtools: !headless,
    dumpio: true,
  },
};
