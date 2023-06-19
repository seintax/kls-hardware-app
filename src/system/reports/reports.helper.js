const reports = {
    weeklySales: `
        SELECT 
            DATE(paym_time) AS day, 
            SUM(IF(paym_method='CASH',paym_amount,0)) AS cash,
            SUM(IF(paym_method='CHEQUE',paym_amount,0)) AS cheque,
            SUM(IF(paym_method='GCASH',paym_amount,0)) AS gcash
        FROM 
            pos_payment_collection 
                LEFT JOIN pos_sales_transaction 
                    ON trns_code = paym_trans
        WHERE 
            DATE(paym_time) BETWEEN '@fr' AND '@to' 
        GROUP BY DATE(paym_time) 
        ORDER BY DATE(paym_time) ASC
        `,
    dailySales: `
        SELECT 
            paym_trans AS code, 
            trns_order AS receipt,
            paym_type AS type,
            paym_amount AS amount,
            paym_method AS method,
            paym_refcode AS cheque,
            paym_refdate AS date
        FROM 
            pos_payment_collection 
                LEFT JOIN pos_sales_transaction 
                    ON trns_code = paym_trans 
        WHERE 
            DATE(paym_time) BETWEEN '@fr' AND '@to' 
        ORDER BY DATE(paym_time) DESC
        `,
    dailySummary: `
        SELECT 
            paym_date AS date,
            SUM(IF(paym_method='CASH' AND paym_type='SALES', paym_amount, 0)) AS sales_cash, 
            SUM(IF(paym_method='CHEQUE' AND paym_type='SALES', paym_amount, 0)) AS sales_cheque, 
            SUM(IF(paym_method='GCASH' AND paym_type='SALES', paym_amount, 0)) AS sales_gcash, 
            (SELECT 
                SUM(trns_net) 
            FROM 
                pos_sales_transaction 
            WHERE 
                trns_method='CREDIT' AND 
                trns_date=paym_date 
            GROUP BY trns_date) AS sales_credit,
            SUM(IF(paym_method='CASH' AND paym_type='CREDIT', paym_amount, 0)) AS credit_cash,
            SUM(IF(paym_method='CHEQUE' AND paym_type='CREDIT', paym_amount, 0)) AS credit_cheque, 
            SUM(IF(paym_method='GCASH' AND paym_type='CREDIT', paym_amount, 0)) AS credit_gcash 
        FROM
            (SELECT *,DATE(paym_time) AS paym_date FROM pos_payment_collection WHERE
            paym_time BETWEEN '@fr 00:00:01' AND '@to 23:59:59') arg
        GROUP BY paym_date
        ORDER BY paym_date DESC;
        `
}

module.exports = {
    reports
}