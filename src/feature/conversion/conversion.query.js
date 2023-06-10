const mysql = require('mysql')
const my = require('../../../data/connection/mysql')
const cache = require('../../../data/connection/cache')
const query = require('../../../data/connection/query')
const table = require('./conversion.helper')
require("../../utilities/query.prototypes")

const createRecord = async (param, callback) => {
    let helper = query.createBuilder(param, table.conversion)
    let sql = query.builder.add(table.conversion.name, helper.create.fields, helper.create.values)
    my.query(sql, helper.parameters, async (err, ans) => {
        if (err) return callback(err)
        let res = ans
        await cache.creationCache(sql, ans['insertId'])
        return callback(null, res)
    })
}

const updateRecord = async (param, callback) => {
    let helper = query.updateBuilder(param, table.conversion)
    let sql = query.builder.set(table.conversion.name, helper.update.fields, table.conversion.fields.id)
    await cache.modificyCache(sql, param.id)
    my.query(sql, helper.parameters, async (err, ans) => {
        if (err) return callback(err)
        return callback(null, ans)
    })
}

const deleteRecord = async (param, callback) => {
    let sql = query.builder.del(table.conversion.name, table.conversion.fields.id)
    await cache.modificyCache(sql, param.id)
    my.query(sql, [param.id], async (err, ans) => {
        if (err) return callback(err)
        return callback(null, ans)
    })
}

const selectRecord = async (param, callback) => {
    let { name, id } = table.conversion.fields
    let options = {
        parameter: [param.search?.Contains()],
        filter: [name?.Like()],
        order: [id?.Asc()]
    }
    let sql = query.builder.rec(table.conversion, options.filter, options.order)
    my.query(sql, options.parameter, (err, ans) => {
        if (err) return callback(err)
        return callback(null, ans)
    })
}

const uniqueRecord = async (param, callback) => {
    let sql = query.builder.get(table.conversion, table.conversion.fields.id)
    my.query(sql, [param.id], (err, ans) => {
        if (err) return callback(err)
        return callback(null, ans)
    })
}

const searchRecord = async (param, callback) => {
    let { drdate } = table.conversion.fields
    let helper = query.searchBuilder(param.search, table.conversion)
    let sql = query.builder.src(table.conversion, helper.filters, [drdate?.Desc()])
    my.query(sql, helper.parameters, (err, ans) => {
        if (err) return callback(err)
        return callback(null, ans)
    })
}

const availableRecord = async (param, callback) => {
    let { name, details, drdate, stocks } = table.conversion.fields
    let options = {
        parameter: [param.search?.Contains()],
        filter: [name?.Like(), stocks?.Greater("0")],
        order: [name?.Asc(), details?.Asc(), drdate?.Asc()]
    }
    let sql = query.builder.rec(table.conversion, options.filter, options.order)
    my.query(sql, options.parameter, (err, ans) => {
        if (err) return callback(err)
        return callback(null, ans)
    })
}

const inventoryRecord = async (param, callback) => {
    let { name, reference } = table.conversion.fields
    let options = {
        parameter: [param.id],
        filter: [reference?.Is()],
        order: [name?.Asc()]
    }
    let sql = query.builder.rec(table.conversion, options.filter, options.order)
    my.query(sql, options.parameter, (err, ans) => {
        if (err) return callback(err)
        return callback(null, ans)
    })
}

const transferRecord = async (param, callback) => {
    let sql = (
        param.op === "add" ?
            table.conversion.balanceAdded.replaceAll("@qty", param.qty) :
            table.conversion.balanceMinus.replaceAll("@qty", param.qty)
    )
    my.query(sql, [param.id], async (err, ans) => {
        if (err) return callback(err)
        return callback(null, ans)
    })
}

const batchRecord = async (param, callback) => {
    let batch = await Promise.all(param?.cart?.map(async item => {
        let retrieve = await new Promise((resolve, reject) => {
            let sql = (
                param.op === "add" ?
                    table.conversion.balanceAdded.replaceAll("@qty", item.purchase) :
                    table.conversion.balanceMinus.replaceAll("@qty", item.purchase)
            )
            my.query(sql, [item.conv], async (err, ans) => {
                if (err) return reject(err)
                resolve({ item: item.item, response: ans })
            })
        })
        return retrieve
    }))
    return callback(null, batch)
}

const returnRecord = async (param, callback) => {
    let batch = await Promise.all(param?.cart?.map(async item => {
        let retrieve = await new Promise((resolve, reject) => {
            let sql = (
                param.op === "add" ?
                    table.conversion.balanceAdded.replaceAll("@qty", item.toreturn) :
                    table.conversion.balanceMinus.replaceAll("@qty", item.toreturn)
            )
            my.query(sql, [item.conv], async (err, ans) => {
                if (err) return reject(err)
                resolve({ item: item.item, response: ans })
            })
        })
        return retrieve
    }))
    return callback(null, batch)
}

module.exports = {
    createRecord,
    updateRecord,
    deleteRecord,
    selectRecord,
    uniqueRecord,
    searchRecord,
    availableRecord,
    inventoryRecord,
    transferRecord,
    batchRecord,
    returnRecord
}
