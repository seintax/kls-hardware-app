const transaction = require('../feature/cashering/transaction/transaction.route')
const dispensing = require('../feature/cashering/dispensing/dispensing.route')
const payment = require('../feature/cashering/payment/payment.route')

module.exports = {
    transaction,
    dispensing,
    payment
}