const reports = {
    dailySales: `SELECT SUM(IF(paym_method='CASH' AND paym_type='SALES', paym_amount, 0)) AS sales_cash, SUM(IF(paym_method='CHEQUE' AND paym_type='SALES', paym_amount, 0)) AS sales_cheque, SUM(IF(paym_method='GCASH' AND paym_type='SALES', paym_amount, 0)) AS sales_gcash FROM pos_payment_collection LEFT JOIN pos_sales_transaction ON trns_code=paym_trans WHERE trns_date='@date'`
}

module.exports = {
    reports
}