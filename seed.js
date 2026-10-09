// 一次性导入 data/ 下的数据到 MongoDB（先清空再插入，可重复执行）
const db = require("./config")
const items = [
    ["./collections/ele_dinner_dinnerBar", "./data/ele_dinner_dinnerBar"],
    ["./collections/ele_dinner_dinnerChoose", "./data/ele_dinner_dinnerChoose"],
    ["./collections/ele_dinner_dinnerResList", "./data/ele_dinner_dinnerResList"],
    ["./collections/ele_index_banners", "./data/ele_index_banners"],
    ["./collections/ele_index_cities", "./data/ele_index_cities"],
    ["./collections/ele_index_home", "./data/ele_index_home"],
    ["./collections/ele_index_recom", "./data/ele_index_recom"],
    ["./collections/ele_order_order", "./data/ele_order_order"],
]
;(async () => {
    for (const [m, d] of items) {
        const Model = require(m)
        const data = require(d)
        await Model.deleteMany({})
        await Model.insertMany(data)
        console.log(m, "导入", data.length, "条")
    }
    await db.disconnect()
})().catch(e => { console.error(e); process.exit(1) })
