import moment from "moment"
import React, { useEffect, useRef, useState } from 'react'
import { useNotificationContext } from "../../../utilities/context/notification.context"
import AppModal from "../../../utilities/interface/application/modalities/app.modal"

const CasheringQuantity = ({ show, toggle, item, setitem, cart, setcart, vat, transno }) => {
    const { handleNotification } = useNotificationContext()
    const inputRef = useRef()
    const [quantity, setquantity] = useState("")

    const onFocus = (e) => {
        e.target.select()
    }

    const onKeyDown = (e) => {
        if (show) {
            if (e.key === 'Enter') {
                if (quantity) {
                    let tax = (item.vatable === "Y" ? vat : 0)
                    let existing = cart?.filter((i => i.item === item.id))
                    let totalqty = existing?.reduce((prev, curr) => prev + Number(curr?.input?.qty), 0) + Number(quantity)
                    if (Number(item.stocks) < totalqty) {
                        handleNotification({
                            type: 'error',
                            message: `${item.name} ${item.details} ${item.unit} has insufficient stocks.`,
                        })
                        return
                    }
                    let unit = item.price - (item.price * tax)
                    const purchase = {
                        code: transno?.code,
                        conv: item.conv,
                        acquisition: item.acquisition,
                        position: moment(new Date()).format("YYYY-MM-DD-HH-mm-ss"),
                        name: item.name,
                        details: item.details,
                        unit: item.unit,
                        category: item.category,
                        time: moment(new Date()).format("YYYY-MM-DD HH:mm:ss"),
                        item: item.id,
                        product: item.product,
                        purchase: quantity,
                        dispense: quantity,
                        price: item.price,
                        total: quantity * item.price,
                        vat: quantity * (item.price * tax),
                        less: 0,
                        net: quantity * item.price,
                        discount: 0,
                        taxrated: tax,
                        toreturn: 0,
                        returned: 0,
                        input: {
                            product: `${item.name} ${item.details} ${item.unit}`,
                            qty: quantity,
                            unit: unit,
                            vat: quantity * (item.price * tax),
                            price: quantity * item.price,
                            net: quantity * item.price
                        }
                    }
                    setitem(purchase)
                    setcart(prev => [...prev, purchase])
                    inputRef.current.blur()
                    toggle()
                }
            }
        }
    }

    const onChange = (e) => {
        const { value } = e.target
        setquantity(value)
    }

    useEffect(() => {
        if (show) {
            inputRef.current.focus()
            setquantity("")
            return
        }
        inputRef.current.blur()
    }, [show])

    return (
        <AppModal show={show} setshow={toggle} title="Quantity">
            <div className="w-[400px] flex flex-col py-3 gap-[20px] no-select">
                <input
                    ref={inputRef}
                    type="number"
                    value={quantity}
                    onFocus={onFocus}
                    onChange={onChange}
                    onKeyDown={onKeyDown}
                    className="w-full" />
            </div>
        </AppModal>
    )
}

export default CasheringQuantity