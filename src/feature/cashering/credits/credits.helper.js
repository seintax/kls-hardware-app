const credits = {
    name: 'pos_sales_credit',
    fields: {
        id: 'cred_id',
        name: 'cred_creditor',
        code: 'cred_trans',
        time: 'cred_time',
        total: 'cred_total',
        partial: 'cred_partial',
        balance: 'cred_balance',
        payment: 'cred_payment',
        tended: 'cred_tended',
        loose: 'cred_change',
        waived: 'cred_waived',
        method: 'cred_method',
        settledon: 'cred_settledon',
    }
}

module.exports = {
    credits
}