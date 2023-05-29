const transaction = require('../feature/cashering/transaction/transaction.route')
const dispensing = require('../feature/cashering/dispensing/dispensing.route')
const payment = require('../feature/cashering/payment/payment.route')
const customer = require('../feature/cashering/customer/customer.route')
const credits = require('../feature/cashering/credits/credits.route')
const schedule = require('../feature/cashering/schedule/schedule.route')
const request = require('../feature/cashering/request/request.route')
const returned = require('../feature/cashering/returned/returned.route')

module.exports = {
    transaction,
    dispensing,
    payment,
    customer,
    credits,
    schedule,
    request,
    returned
}