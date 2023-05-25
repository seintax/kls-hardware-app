const payment = {
    name: 'pos_payment_collection',
    fields: {
        id: 'paym_id',
        code: 'paym_trans',
        type: 'paym_type',
        method: 'paym_method',
        amount: 'paym_amount',
        refcode: 'paym_refcode',
        refdate: 'paym_refdate',
        refstat: 'paym_refstat',
    }
}

module.exports = {
    payment
}