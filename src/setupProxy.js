const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  app.use(
    "/api",
    createProxyMiddleware({
      target: "https://www.pre-onboarding-selection-task.shop",
      changeOrigin: true,
      secure: process.env.NODE_ENV === "development" ? false : true,
      pathRewrite: (path) => path.replace(/^\/api/, ""),
    })
  );
};
