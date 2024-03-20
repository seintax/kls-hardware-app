const my = require('../../../data/connection/cloud')
const table = require('./cloud.helper')
require("../../utilities/query.prototypes")

const showTables = async (param, callback) => {
    let sql = table.cloud.showTables
    my.query(sql, async (err, ans) => {
        if (err) return callback(err)
        return callback(null, ans)
    })
}

const selectTable = async (param, callback) => {
    let sql = table.cloud.selectTable.replaceAll("@tableName", param.table)
    my.query(sql, async (err, ans) => {
        if (err) return callback(err)
        return callback(null, ans)
    })
}

const pagedTable = async (param, callback) => {
    let sql = table.cloud.pagedTable.replaceAll("@tableName", param.table).replaceAll("@offset", param.offset).replaceAll("@limit", param.limit)
    my.query(sql, async (err, ans) => {
        if (err) return callback(err)
        return callback(null, ans)
    })
}

const countTable = async (param, callback) => {
    let sql = table.cloud.countTable.replaceAll("@tableName", param.table)
    my.query(sql, async (err, ans) => {
        if (err) return callback(err)
        return callback(null, ans)
    })
}

module.exports = {
    showTables,
    selectTable,
    pagedTable,
    countTable,
}