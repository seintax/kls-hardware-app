const reports = require('../system/reports/reports.route')
const account = require('../system/account/account.route')
const cloud = require('../system/cloud/cloud.route')
const database = require('../system/database/database.route')

module.exports = {
    reports,
    account,
    cloud,
    database,
}