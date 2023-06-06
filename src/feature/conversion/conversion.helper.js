const conversion = {
    name: 'pos_stock_conversion',
    fields: {
        id: 'conv_id',
        conv: 'conv_id',
        item: 'conv_item',
        product: 'conv_product',
        sku: 'conv_sku',
        time: 'conv_time',
        itemunit: 'conv_item_unit',
        itemqty: 'conv_item_qty',
        convunit: 'conv_prod_unit',
        conqty: 'conv_prod_qty',
        stocks: 'conv_stocks',
        cost: 'conv_cost',
        price: 'conv_price',
        receipt: 'conv_rct_name',
        brand: 'conv_brand',
        model: 'conv_model',
        vatable: 'conv_vatable',
        isloose: 'conv_isloose',
        acquisition: 'conv_acquisition',
        status: 'conv_status',
    },
    joined: {
        drdate: "invt_drdate",
        drno: "invt_drno",
        supplier: "invt_supplier",
        name: "prod_name",
        details: "prod_details",
        unit: "prod_unit",
        category: "prod_category",
    },
    conditional: 'LEFT JOIN pos_stock_inventory ON invt_id=conv_item LEFT JOIN pos_stock_masterlist ON prod_id=conv_product',
    balanceAdded: 'UPDATE pos_stock_conversion SET conv_stocks=(conv_stocks + @qty) WHERE conv_id = ?',
    balanceMinus: 'UPDATE pos_stock_conversion SET conv_stocks=(conv_stocks - @qty) WHERE conv_id = ?',
}

module.exports = {
    conversion
}