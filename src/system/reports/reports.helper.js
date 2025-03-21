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
            DATE(paym_time) BETWEEN '@fr' AND '@to' AND 
            paym_amount > 0
        ORDER BY trns_code DESC
        `,
    dailySummary: `
        WITH paym_data AS (
            SELECT 
                DATE(paym_time) AS paym_date,
                SUM(IF(paym_method='CASH' AND paym_type='SALES', paym_amount, 0)) AS sales_cash,
                SUM(IF(paym_method='CHEQUE' AND paym_type='SALES', paym_amount, 0)) AS sales_cheque,
                SUM(IF(paym_method='GCASH' AND paym_type='SALES', paym_amount, 0)) AS sales_gcash,
                SUM(IF(paym_method='CASH' AND paym_type='CREDIT', paym_amount, 0)) AS credit_cash,
                SUM(IF(paym_method='CHEQUE' AND paym_type='CREDIT', paym_amount, 0)) AS credit_cheque,
                SUM(IF(paym_method='GCASH' AND paym_type='CREDIT', paym_amount, 0)) AS credit_gcash
            FROM 
                pos_payment_collection
            WHERE 
                paym_time BETWEEN '@fr 00:00:01' AND '@to 23:59:59'
            GROUP BY 
                DATE(paym_time)
        ),
        refund_data AS (
            SELECT
                DATE(paym_time) AS rfnd_date,
                SUM(IF(paym_method='CASH' AND paym_type='SALES', rtrn_r_net, 0)) AS return_sales_cash,
                SUM(IF(paym_method='CHEQUE' AND paym_type='SALES', rtrn_r_net, 0)) AS return_sales_cheque,
                SUM(IF(paym_method='GCASH' AND paym_type='SALES', rtrn_r_net, 0)) AS return_sales_gcash,
                SUM(IF(paym_method='CASH' AND paym_type='CREDIT', rtrn_r_net, 0)) AS return_credit_cash,
                SUM(IF(paym_method='CHEQUE' AND paym_type='CREDIT', rtrn_r_net, 0)) AS return_credit_cheque,
                SUM(IF(paym_method='GCASH' AND paym_type='CREDIT', rtrn_r_net, 0)) AS return_credit_gcash
            FROM 
                pos_return_transaction
            LEFT JOIN 
                pos_payment_collection ON rtrn_trans = paym_trans
            WHERE 
                rtrn_time > '@fr 23:59:59' AND 
                DATE(paym_time) BETWEEN '@fr' AND '@to'
            GROUP BY 
                DATE(paym_time)
        ),
        credit_data AS (
            SELECT 
                trns_date AS credit_date,
                SUM(trns_net) AS sales_credit
            FROM 
                pos_sales_transaction
            WHERE 
                trns_method = 'CREDIT' AND 
                trns_date BETWEEN '@fr' AND '@to'
            GROUP BY 
                trns_date
        ),
        return_data AS (
            SELECT
                    DATE(rtrn_time) AS rtrn_date,
                    SUM(rtrn_r_net) AS returned
                FROM 
                    pos_return_transaction
                WHERE 
                    rtrn_time BETWEEN '@fr 00:00:01' AND '@to 23:59:59' 
                GROUP BY DATE(rtrn_time)
        )
        SELECT 
            p.paym_date AS date,
            p.sales_cash + COALESCE(f.return_sales_cash, 0) AS sales_cash,
            p.sales_cheque + COALESCE(f.return_sales_cheque, 0) AS sales_cheque,
            p.sales_gcash + COALESCE(f.return_sales_gcash, 0) AS sales_gcash,
            COALESCE(c.sales_credit, 0) AS sales_credit,
            p.credit_cash + COALESCE(f.return_credit_cash, 0) AS credit_cash,
            p.credit_cheque + COALESCE(f.return_credit_cheque, 0) AS credit_cheque,
            p.credit_gcash + COALESCE(f.return_credit_gcash, 0) AS credit_gcash,
            COALESCE(r.returned, 0) AS returned
        FROM 
            paym_data p
        LEFT JOIN 
            refund_data f ON p.paym_date = f.rfnd_date
        LEFT JOIN 
            credit_data c ON p.paym_date = c.credit_date
        LEFT JOIN 
            return_data r ON p.paym_date = r.rtrn_date
        ORDER BY 
            p.paym_date DESC;
        `,
    dailyReceivables: `
        SELECT
            cust_name AS customer,
            balance
        FROM
            pos_archive_customer 
            LEFT JOIN 
                (SELECT 
                    cred_creditor,
                    SUM(cred_balance) AS balance 
                FROM 
                    pos_sales_credit 
                WHERE 
                    cred_status='ON-GOING' 
                GROUP BY 
                    cred_creditor) a
                ON a.cred_creditor=cust_id
        WHERE
            balance>0
        ORDER BY cust_name
    `,
    receivableCollection: `
        SELECT
            cred_id AS crno,
            paym_time AS time,
            cust_name AS customer,
            paym_amount AS amount,
            paym_method AS method,
            paym_refcode AS cheque,
            paym_refdate AS date
        FROM 
            pos_payment_collection
            LEFT JOIN (
                SELECT
                    cred_id,
                    cust_name,
                    cred_trans,
                    cred_settledon
                FROM 
                    pos_sales_credit,
                    pos_archive_customer
                WHERE
                    cred_creditor=cust_id AND
                    cred_status<>'ON-GOING'
            ) a ON
                cred_trans=paym_trans AND
                DATE_FORMAT(cred_settledon - INTERVAL 8 HOUR, "%Y-%m-%d %H") = DATE_FORMAT(paym_time, "%Y-%m-%d %H")
        WHERE
            paym_type='CREDIT' AND
            paym_time BETWEEN '@fr 00:00:01' AND '@to 23:59:59'
        ORDER BY paym_time
    `,
    dailyInventory: `
        SELECT
            invt_name AS name,
            invt_details AS details,
            invt_unit AS unit,
            invt_received AS received,
            invt_price AS price,
            sold,
            purchase,
            (invt_received - (sold + purchase)) AS remain
        FROM
            (SELECT 
                sale_item,
                SUM(sale_purchase) AS purchase,
                SUM(sale_dispense) AS dispense 
            FROM 
                pos_sales_dispensing
            WHERE 
                sale_time 
                    BETWEEN '@fr 00:00:01' AND '@fr 23:59:59' 
            GROUP BY sale_item) arg
                LEFT JOIN pos_stock_inventory 
                    ON invt_id=arg.sale_item,
            (SELECT 
                sale_item,
                SUM(sale_purchase) AS sold 
            FROM 
                pos_sales_dispensing
            WHERE 
                sale_time<'@fr 00:00:01' 
            GROUP BY sale_item) prior
        WHERE
            prior.sale_item=arg.sale_item
        ORDER BY invt_name
    `,
    dailyReturn: `
        SELECT
            rtrn_trans AS code,
            trns_order AS receipt,
            rtrn_time AS time,
            acct_fullname AS user,
            rtrn_p_net AS p_net,
            rtrn_r_net AS r_net
        FROM 
            pos_return_transaction,
            pos_sales_transaction,
            sys_account
        WHERE
            rtrn_trans=trns_code AND 
            rtrn_requestedby=acct_id AND 
            rtrn_status='COMPLETED' AND 
            rtrn_time BETWEEN '@fr 00:00:01' AND '@to 23:59:59' 
        ORDER BY rtrn_trans
    `,
    runningStocks: `
        SELECT 
            prod_id AS id,
            prod_name AS name,
            prod_details AS details,
            delivered,
            converted,
            dispensed,
            transfered,
            balance
        FROM 
            pos_stock_masterlist a
            LEFT JOIN 
                (SELECT
                    invt_product,
                    SUM(invt_received) AS delivered,
                    SUM(invt_stocks) AS balance
                FROM
                    pos_stock_inventory
                GROUP BY invt_product) b 
                    ON invt_product=prod_id
            LEFT JOIN 
                (SELECT
                    conv_product,
                    SUM(conv_item_qty) AS converted
                FROM
                    pos_stock_conversion
                GROUP BY conv_product) c 
                    ON conv_product=prod_id
            LEFT JOIN 
                (SELECT
                    sale_product,
                    SUM(sale_dispense) AS dispensed
                FROM
                    pos_sales_dispensing
                GROUP BY sale_product) d 
                    ON sale_product=prod_id
            LEFT JOIN 
                (SELECT
                    trni_product,
                    SUM(trni_qty) AS transfered
                FROM
                    pos_stock_transfer_item
                GROUP BY trni_product) e 
                    ON trni_product=prod_id
        ORDER BY prod_name,prod_details
    `,
}

module.exports = {
    reports
}