const inventory = {
    name: 'pos_stock_inventory',
    fields: {
        id: 'invt_id',
        product: 'invt_product',
        sku: 'invt_sku',
        supplier: 'invt_supplier',
        drno: 'invt_drno',
        drdate: 'invt_drdate',
        reference: 'invt_dr_ref',
        received: 'invt_received',
        cost: 'invt_cost',
        stocks: 'invt_stocks',
        price: 'invt_price',
        receipt: 'invt_rct_name',
        brand: 'invt_brand',
        model: 'invt_model',
        convcount: 'invt_conv_count',
        trnicount: 'invt_trni_count',
        convvalue: 'invt_conv_value',
        trnivalue: 'invt_trni_value',
        convtotal: 'invt_conv_total',
        trnitotal: 'invt_trni_total',
        convspare: 'invt_conv_spare',
        soldtotal: 'invt_sold_total',
        plusadjmt: 'invt_plus_adjmt',
        mnusadjmt: 'invt_mnus_adjmt',
        vatable: 'invt_vatable',
        isloose: 'invt_isloose',
        acquisition: 'invt_acquisition',
        status: 'invt_status',
        category: "invt_category",
        name: "invt_name",
        details: "invt_details",
        unit: "invt_unit",
    },
    product: {
        id: 'invt_id',
        conv: `'0'`,
        item: 'invt_id',
        product: 'invt_product',
        sku: 'invt_sku',
        cost: 'invt_cost',
        stocks: 'invt_stocks',
        price: 'invt_price',
        receipt: 'invt_rct_name',
        brand: 'invt_brand',
        model: 'invt_model',
        vatable: 'invt_vatable',
        isloose: 'invt_isloose',
        acquisition: 'invt_acquisition',
        status: 'invt_status',
        supplier: 'invt_supplier',
        drno: 'invt_drno',
        drdate: 'invt_drdate',
        category: "invt_category",
        name: "invt_name",
        details: "invt_details",
        unit: "invt_unit",
    },
    // joined: {
    //     name: "prod_name",
    //     details: "prod_details",
    //     unit: "prod_unit",
    //     category: "prod_category",
    // },
    // conditional: 'LEFT JOIN pos_stock_masterlist ON prod_id=invt_product',
    stocksUpdate: `
        UPDATE pos_stock_inventory SET 
            invt_stocks=invt_received - (
                (
                    SELECT IFNULL(SUM(sale_dispense),0) 
                    FROM pos_sales_dispensing 
                    WHERE sale_item=invt_id AND (sale_conv=0 OR sale_conv IS NULL)
                ) + (
                    SELECT IFNULL(SUM(trni_qty),0) 
                    FROM pos_stock_transfer_item 
                    WHERE trni_item=invt_id
                ) + (
                    SELECT IFNULL(SUM(conv_item_qty),0) 
                    FROM pos_stock_conversion 
                    WHERE conv_item=invt_id    
                ) - (
                    SELECT IFNULL(SUM(adjt_quantity),0) 
                    FROM pos_stock_adjustment 
                    WHERE adjt_item=invt_id AND adjt_operator='Plus'
                ) + (
                    SELECT IFNULL(SUM(adjt_quantity),0) 
                    FROM pos_stock_adjustment 
                    WHERE adjt_item=invt_id AND adjt_operator='Minus'
                )
            ),
            invt_conv_count=(
                SELECT IFNULL(COUNT(*),0) 
                FROM pos_stock_conversion 
                WHERE conv_item=invt_id
            ),
            invt_conv_value=(
                SELECT IFNULL(SUM(conv_item_qty * invt_price),0) 
                FROM pos_stock_conversion 
                WHERE conv_item=invt_id
            ),
            invt_conv_total=(
                SELECT IFNULL(SUM(conv_item_qty),0) 
                FROM pos_stock_conversion 
                WHERE conv_item=invt_id
            ), 
            invt_trni_count=(
                SELECT IFNULL(COUNT(*),0) 
                FROM pos_stock_transfer_item 
                WHERE trni_item=invt_id
            ),
            invt_trni_value=(
                SELECT IFNULL(SUM(trni_qty * trni_price),0) 
                FROM pos_stock_transfer_item 
                WHERE trni_item=invt_id
            ),
            invt_trni_total=(
                SELECT IFNULL(SUM(trni_qty),0) 
                FROM pos_stock_transfer_item 
                WHERE trni_item=invt_id
            ), 
            invt_sold_total=(
                SELECT IFNULL(SUM(sale_dispense),0) 
                FROM pos_sales_dispensing 
                WHERE sale_item=invt_id AND (sale_conv=0 OR sale_conv IS NULL)
            ),
            invt_plus_adjmt=(
                SELECT IFNULL(SUM(adjt_quantity),0) 
                FROM pos_stock_adjustment 
                WHERE adjt_item=invt_id AND (adjt_conv=0 OR adjt_conv IS NULL) AND adjt_operator='Plus'
            ),
            invt_mnus_adjmt=(
                SELECT IFNULL(SUM(adjt_quantity),0) 
                FROM pos_stock_adjustment 
                WHERE adjt_item=invt_id AND (adjt_conv=0 OR adjt_conv IS NULL) AND adjt_operator='Minus'
            )
        WHERE invt_id = ?
        `,
    balanceUpdate: `
        UPDATE pos_stock_inventory SET 
            invt_conv_count=(SELECT IFNULL(COUNT(*),0) FROM pos_stock_conversion WHERE conv_item=invt_id),
            invt_conv_value=(SELECT IFNULL(SUM(conv_item_qty * invt_price),0) FROM pos_stock_conversion WHERE conv_item=invt_id),
            invt_conv_total=(SELECT IFNULL(SUM(conv_item_qty),0) FROM pos_stock_conversion WHERE conv_item=invt_id), 
            invt_trni_count=(SELECT IFNULL(COUNT(*),0) FROM pos_stock_transfer_item WHERE trni_item=invt_id),
            invt_trni_value=(SELECT IFNULL(SUM(trni_qty * trni_price),0) FROM pos_stock_transfer_item WHERE trni_item=invt_id),
            invt_trni_total=(SELECT IFNULL(SUM(trni_qty),0) FROM pos_stock_transfer_item WHERE trni_item=invt_id), 
            invt_sold_total=(SELECT IFNULL(SUM(sale_dispense),0) FROM pos_sales_dispensing WHERE sale_item=invt_id), 
            invt_plus_adjmt=(SELECT IFNULL(SUM(adjt_quantity),0) FROM pos_stock_adjustment WHERE adjt_item=invt_id AND adjt_operator='Plus'), 
            invt_mnus_adjmt=(SELECT IFNULL(SUM(adjt_quantity),0) FROM pos_stock_adjustment WHERE adjt_item=invt_id AND adjt_operator='Minus')
        `,
    inventoryAdded: `
        UPDATE pos_stock_inventory SET 
            invt_stocks=(invt_stocks + @qty),
            invt_sold_total=(SELECT SUM(sale_dispense) FROM pos_sales_dispensing WHERE sale_item=invt_id)
        WHERE invt_id = ?
        `,
    inventoryMinus: `
        UPDATE pos_stock_inventory SET 
            invt_stocks=(invt_stocks - @qty),
            invt_sold_total=(SELECT SUM(sale_dispense) FROM pos_sales_dispensing WHERE sale_item=invt_id)
        WHERE invt_id = ?
        `,
    transferAdded: `
        UPDATE pos_stock_inventory SET 
            invt_stocks=(invt_stocks + @qty),
            invt_trni_count=(SELECT COUNT(*) FROM pos_stock_transfer_item WHERE trni_item=invt_id),
            invt_trni_value=(SELECT SUM(trni_qty * trni_price) FROM pos_stock_transfer_item WHERE trni_item=invt_id),
            invt_trni_total=(SELECT SUM(trni_qty) FROM pos_stock_transfer_item WHERE trni_item=invt_id) 
        WHERE invt_id = ?
        `,
    transferMinus: `
        UPDATE pos_stock_inventory SET 
            invt_stocks=(invt_stocks - @qty),
            invt_trni_count=(SELECT COUNT(*) FROM pos_stock_transfer_item WHERE trni_item=invt_id),
            invt_trni_value=(SELECT SUM(trni_qty * trni_price) FROM pos_stock_transfer_item WHERE trni_item=invt_id),
            invt_trni_total=(SELECT SUM(trni_qty) FROM pos_stock_transfer_item WHERE trni_item=invt_id) 
        WHERE invt_id = ?
        `,
    returnAdded: 'UPDATE pos_stock_inventory SET invt_stocks=(invt_stocks + @qty) WHERE invt_id = ?',
    returnMinus: 'UPDATE pos_stock_inventory SET invt_stocks=(invt_stocks - @qty) WHERE invt_id = ?',
    convertAdded: `
        UPDATE pos_stock_inventory SET 
            invt_stocks=(invt_stocks + @qty),
            invt_conv_count=(SELECT COUNT(*) FROM pos_stock_conversion WHERE conv_item=invt_id),
            invt_conv_value=(SELECT SUM(conv_item_qty * invt_price) FROM pos_stock_conversion WHERE conv_item=invt_id),
            invt_conv_total=(SELECT SUM(conv_item_qty) FROM pos_stock_conversion WHERE conv_item=invt_id) 
        WHERE invt_id = ?
        `,
    convertMinus: `
        UPDATE pos_stock_inventory SET 
            invt_stocks=(invt_stocks - @qty),
            invt_conv_count=(SELECT COUNT(*) FROM pos_stock_conversion WHERE conv_item=invt_id),
            invt_conv_value=(SELECT SUM(conv_item_qty * invt_price) FROM pos_stock_conversion WHERE conv_item=invt_id),
            invt_conv_total=(SELECT SUM(conv_item_qty) FROM pos_stock_conversion WHERE conv_item=invt_id) 
        WHERE invt_id = ?
        `,
    adjustmentAdded: `
        UPDATE pos_stock_inventory SET 
            invt_stocks=(invt_stocks + @qty),
            invt_plus_adjmt=(invt_plus_adjmt + @qty)
        WHERE invt_id = ?
        `,
    adjustmentMinus: `
        UPDATE pos_stock_inventory SET 
            invt_stocks=(invt_stocks - @qty),
            invt_mnus_adjmt=(invt_mnus_adjmt + @qty)
        WHERE invt_id = ?
        `,
}

module.exports = {
    inventory
}