const mysql = require('mysql')
const my = require('../../../../data/connection/mysql')
const cache = require('../../../../data/connection/cache')
const query = require('../../../../data/connection/query')
const table = require('./credits.helper')
require("../../../utilities/query.prototypes")

const createRecord = async (param, callback) => {
    let helper = query.createBuilder(param, table.credits)
    let sql = query.builder.add(table.credits.name, helper.create.fields, helper.create.values)
    my.query(sql, helper.parameters, async (err, ans) => {
        if (err) return callback(err)
        const res = ans
        await cache.creationCache(sql, ans['insertId'])
        return callback(null, res)
    })
}

const updateRecord = async (param, callback) => {
    let helper = query.updateBuilder(param, table.credits)
    let sql = query.builder.set(table.credits.name, helper.update.fields, table.credits.fields.id)
    await cache.modificyCache(sql, param.id)
    my.query(sql, helper.parameters, async (err, ans) => {
        if (err) return callback(err)
        return callback(null, ans)
    })
}

const deleteRecord = async (param, callback) => {
    let sql = query.builder.del(table.credits.name, table.credits.fields.id)
    await cache.modificyCache(sql, param.id)
    my.query(sql, [param.id], async (err, ans) => {
        if (err) return callback(err)
        return callback(null, ans)
    })
}

const selectRecord = async (param, callback) => {
    let { customer, id } = table.credits.fields
    let options = {
        parameter: [param.search?.Contains()],
        filter: [customer?.Like()],
        order: [id?.Asc()]
    }
    let sql = query.builder.rec(table.credits, options.filter, options.order)
    my.query(sql, options.parameter, (err, ans) => {
        if (err) return callback(err)
        return callback(null, ans)
    })
}

const uniqueRecord = async (param, callback) => {
    let sql = query.builder.get(table.credits, table.credits.fields.id)
    my.query(sql, [param.id], (err, ans) => {
        if (err) return callback(err)
        return callback(null, ans)
    })
}

const searchRecord = async (param, callback) => {
    let { id } = table.credits.fields
    let helper = query.searchBuilder(param.search, table.credits)
    let sql = query.builder.src(table.credits, helper.filters, [id?.Asc()])
    my.query(sql, helper.parameters, (err, ans) => {
        if (err) return callback(err)
        return callback(null, ans)
    })
}

const customerRecord = async (param, callback) => {
    let { customer, status, balance, id } = table.credits.fields
    let options = {
        parameter: [param.customer?.Exact(), "ON-GOING"],
        filter: [customer?.Is(), status?.Is(), balance?.Greater("0")],
        order: [id?.Asc()]
    }
    let sql = query.builder.rec(table.credits, options.filter, options.order)
    my.query(sql, options.parameter, (err, ans) => {
        if (err) return callback(err)
        return callback(null, ans)
    })
}

const ongoingRecord = async (param, callback) => {
    let { code, status, balance, id } = table.credits.fields
    let options = {
        parameter: [param.code?.Exact(), "ON-GOING"],
        filter: [code?.Is(), status?.Is(), balance?.Greater("0")],
        order: [id?.Asc()]
    }
    let sql = query.builder.rec(table.credits, options.filter, options.order)
    my.query(sql, options.parameter, (err, ans) => {
        if (err) return callback(err)
        return callback(null, ans)
    })
}

const returnRecord = async (param, callback) => {
    let sql = param.rem > 0 ?
        table.credits.balanceUpdate.replaceAll("@amt", param.amt) :
        table.credits.returnUpdate
    my.query(sql, [param.code], async (err, ans) => {
        if (err) return callback(err)
        return callback(null, ans)
    })
}

const transactionRecord = async (param, callback) => {
    let { code, id } = table.credits.fields
    let options = {
        parameter: [param.code?.Exact()],
        filter: [code?.Is()],
        order: [id?.Asc()]
    }
    let sql = query.builder.rec(table.credits, options.filter, options.order)
    my.query(sql, options.parameter, (err, ans) => {
        if (err) return callback(err)
        return callback(null, ans)
    })
}

module.exports = {
    createRecord,
    updateRecord,
    deleteRecord,
    selectRecord,
    uniqueRecord,
    searchRecord,
    customerRecord,
    ongoingRecord,
    returnRecord,
    transactionRecord
}