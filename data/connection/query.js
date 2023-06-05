require("./../../src/utilities/string.prototypes")

const createBuilder = (parameter, table) => {
    const parameters = []
    const fields = []
    const values = []
    for (const prop in table.fields) {
        if (parameter[prop]) {
            parameters.push(parameter[prop])
            fields.push(table.fields[prop])
            values.push("?")
        }
    }
    return {
        tablename: table.name,
        parameters: parameters,
        create: {
            fields: fields.join(", "),
            values: values.join(", ")
        }
    }
}

const updateBuilder = (parameter, table) => {
    const parameters = []
    const fields = []
    for (const prop in parameter) {
        if (table.fields[prop]) {
            parameters.push(parameter[prop])
            if (prop !== "id") fields.push(`${table.fields[prop]}=?`)
        }
    }
    return {
        tablename: table.name,
        parameters: parameters,
        update: {
            fields: fields.join(", ")
        }
    }
}

const searchBuilder = (parameter, table) => {
    const parameters = []
    const filters = []
    for (const prop in table.fields) {
        filters.push(`${table.fields[prop]} LIKE ?`)
        parameters.push(parameter === undefined ? `%%` : `%${parameter}%`)
    }
    for (const prop in table.joined) {
        filters.push(`${table.joined[prop]} LIKE ?`)
        parameters.push(parameter === undefined ? `%%` : `%${parameter}%`)
    }
    return {
        parameters: parameters,
        filters: filters
    }
}

const alias = (table) => {
    const names = []
    for (const prop in table.fields) {
        names.push(`${table.fields[prop]} AS ${prop}`)
    }
    if (table?.joined) {
        for (const prop in table.joined) {
            names.push(`${table.joined[prop]} AS ${prop}`)
        }
    }
    return names.join(", ")
}

// query builder for create
const add = (name, fields, values) => {
    return `INSERT INTO ${name} (${fields}) VALUES (${values});`
}

// query builder for update
const set = (name, fields, id) => {
    return `UPDATE ${name} SET ${fields} WHERE ${id}=?`
}

// query builder for delete
const del = (name, id) => {
    return `DELETE FROM ${name} WHERE ${id}=?`
}

// query builder for select
const rec = (table, filter, order, limit) => {
    let condition = table?.conditional ? ` ${table?.conditional}` : ""
    return `SELECT ${alias(table)} FROM ${table.name}${condition} WHERE ${filter.join(" AND ")} ORDER BY ${order.join(", ")}${limit ? ` LIMIT ${limit}` : ""}`
}

// query builder for select
const src = (table, filter, order) => {
    let condition = table?.conditional ? ` ${table?.conditional}` : ""
    return `SELECT ${alias(table)} FROM ${table.name}${condition} WHERE ${filter.join(" OR ")} ORDER BY ${order.join(", ")}`
}

// query builder for single
const get = (table, id) => {
    let condition = table?.conditional ? ` ${table?.conditional}` : ""
    return `SELECT ${alias(table)} FROM ${table.name}${condition} WHERE ${id}=?`
}

const optional = (options) => {
    return `(${options?.join(" OR ")})`
}

const builder = {
    add: add,
    set: set,
    del: del,
    rec: rec,
    get: get,
    src: src
}

module.exports = {
    createBuilder,
    updateBuilder,
    searchBuilder,
    optional,
    builder,
}
