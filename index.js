const express = require("express")

// 引入 collection 集合
const models = {
    dinnerBar: require("./collections/ele_dinner_dinnerBar"),
    dinnerChoose: require("./collections/ele_dinner_dinnerChoose"),
    dinnerResList: require("./collections/ele_dinner_dinnerResList"),
    banners: require("./collections/ele_index_banners"),
    cities: require("./collections/ele_index_cities"),
    home: require("./collections/ele_index_home"),
    recom: require("./collections/ele_index_recom"),
    order: require("./collections/ele_order_order"),
}

const app = express()
const router = express.Router()

// 允许跨域（前端本地开发直接调用）
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*")
    res.header("Access-Control-Allow-Methods", "GET,OPTIONS")
    res.header("Access-Control-Allow-Headers", "Content-Type")
    if (req.method === "OPTIONS") return res.sendStatus(204)
    next()
})
app.use("/ele", router)

// 全量列表接口：{ total, object_list }
const listAll = (Model) => async (req, res) => {
    try {
        const doc = await Model.find({})
        res.json({ status: "1", data: { total: doc.length, object_list: doc } })
    } catch (err) {
        res.json({ status: "-1", msg: err.message })
    }
}

// 分页接口：?page=2&limit=4&sort=-1&sortBy=id
// sort 只接受 1 / -1，sortBy 必须是 schema 中存在的字段，否则忽略排序
const listPaged = (Model) => async (req, res) => {
    try {
        const page = Math.max(parseInt(req.query.page) || 1, 1)
        const pageSize = Math.min(Math.max(parseInt(req.query.limit) || 10, 1), 100)
        const dir = parseInt(req.query.sort)
        const sortBy = req.query.sortBy || "id"

        let query = Model.find({})
        if ((dir === 1 || dir === -1) && Model.schema.path(sortBy)) {
            query = query.sort({ [sortBy]: dir })
        }
        const [total, doc] = await Promise.all([
            Model.countDocuments({}),
            query.skip((page - 1) * pageSize).limit(pageSize),
        ])
        res.json({
            status: "1",
            data: { total, current_total: doc.length, object_list: doc },
        })
    } catch (err) {
        res.json({ status: "-1", msg: err.message })
    }
}

// 首页
router.get("/index/banners", listAll(models.banners))
router.get("/index/home", listAll(models.home))
router.get("/index/recom", listAll(models.recom))
router.get("/index/cities", listPaged(models.cities))
// 订单
router.get("/order/order", listAll(models.order))
// 晚餐
router.get("/dinner/bar", listPaged(models.dinnerBar))
router.get("/dinner/reslist", listPaged(models.dinnerResList))
router.get("/dinner/choose", listPaged(models.dinnerChoose))

// 监听 8088 端口
app.listen(8088, "0.0.0.0", () => console.log("ele api listening on :8088"))
