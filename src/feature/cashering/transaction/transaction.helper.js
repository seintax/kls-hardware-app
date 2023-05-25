const transaction = {
    name: 'pos_sales_transaction',
    fields: {
        id: 'trns_id',
        code: 'trns_code',
        ordno: 'trns_order',
        time: 'trns_time',
        vat: 'trns_vat',
        total: 'trns_total',
        less: 'trns_less',
        net: 'trns_net',
        discount: 'trns_discount',
        tended: 'trns_tended',
        loose: 'trns_change',
        method: 'trns_method',
        shift: 'trns_shift',
        status: 'trns_status',
        date: 'trns_date',
    },
    shiftRecord: `SELECT COUNT(*) + 1 AS code FROM pos_sales_transaction WHERE DATE_FORMAT(trns_date, '%Y-%m-%d')=DATE_FORMAT(now(), '%Y-%m-%d') AND trns_shift=?`,
}

module.exports = {
    transaction
}