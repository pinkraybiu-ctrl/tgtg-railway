// 让 watcher 的配置写到容器内固定目录（Render 免费版重启不丢，重新部署会清空——可在 Shell 里再登录一次）
process.env.XDG_CONFIG_HOME = process.env.XDG_CONFIG_HOME || "/opt/render/project/.config";

const express = require("express");
const { spawn } = require("child_process");

const app = express();
const PORT = process.env.PORT || 3000;

// 启动 toogoodtogo-watcher
console.log("Starting TooGoodToGo watcher…");
const child = spawn("npx", ["toogoodtogo-watcher", "watch"], {
  stdio: "inherit",
  shell: false
});

child.on("exit", (code) => {
  console.log("Watcher exited with code:", code);
});

// 一个简单的健康检查，让 Render 认为服务“在线”
app.get("/", (_req, res) => res.send("TGTG watcher running"));
app.get("/healthz", (_req, res) => res.send("ok"));

app.listen(PORT, () => {
  console.log(`HTTP server listening on :${PORT}`);
});
