const dispensing = {
    name: 'pos_sales_dispensing',
    fields: {
        id: 'sale_id',
        code: 'sale_trans',
        index: 'sale_index',
        time: 'sale_time',
        item: 'sale_item',
        product: 'sale_product',
        conv: 'sale_conv',
        purchase: 'sale_purchase',
        dispense: 'sale_dispense',
        price: 'sale_price',
        vat: 'sale_vat',
        total: 'sale_total',
        less: 'sale_less',
        net: 'sale_net',
        discount: 'sale_discount',
        taxrated: 'sale_taxrated',
        toreturn: 'sale_toreturn',
        returned: 'sale_returned',
    }
}

module.exports = {
    dispensing
}