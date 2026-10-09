const db = require("mongoose")
// 默认连本地 MongoDB，可用 MONGO_URL 覆盖（远程 39.96.84.220 已不可达）
db.connect(process.env.MONGO_URL || "mongodb://127.0.0.1:27017/ele", { useNewUrlParser: true, useUnifiedTopology: true });
module.exports = db;
