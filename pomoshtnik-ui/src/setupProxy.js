const {createProxyMiddleware} = require("http-proxy-middleware");

module.exports = function (app) {
  app.use("/api", createProxyMiddleware({target: "http://localhost:2999/", changeOrigin: true}));
  app.use("/socket.io", createProxyMiddleware({target: "http://localhost:2999/socket.io/"}));
};
