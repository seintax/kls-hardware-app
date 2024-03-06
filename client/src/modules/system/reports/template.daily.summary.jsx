import { PrinterIcon } from "@heroicons/react/20/solid"
import { ArchiveBoxArrowDownIcon } from "@heroicons/react/24/outline"
import { FunnelIcon } from "@heroicons/react/24/solid"
import { saveAs } from 'file-saver'
import moment from "moment"
import React, { useEffect, useState } from 'react'
import * as XLSX from 'xlsx'
import { useClientContext } from "../../../utilities/context/client.context"
import { sortBy } from "../../../utilities/functions/array.functions"
import { amount, currencyFormat } from "../../../utilities/functions/number.funtions"
import AppModal from "../../../utilities/interface/application/modalities/app.modal"
import DataRecords from "../../../utilities/interface/datastack/data.records"
import { fetchDailySummary } from "./reports.services"

const TemplateDailySummary = ({ report, toggle }) => {
    const { setloading } = useClientContext()
    const [filter, setfilter] = useState({
        fr: moment(new Date()).subtract(7, 'days').format("YYYY-MM-DD"),
        to: moment(new Date()).format("YYYY-MM-DD")
    })
    const [data, setdata] = useState([])

    const [records, setrecords] = useState()
    const [sorted, setsorted] = useState()
    const [startpage, setstartpage] = useState(1)
    const itemsperpage = 150
    const columns = {
        style: '',
        items: [
            { name: 'Date', stack: false, sort: 'date' },
            { name: <span>Sales Cash <br />Collection</span>, stack: true, sort: 'sales_cash', size: 160 },
            { name: <span>Sales Cheque <br />Collection</span>, stack: true, sort: 'sales_cheque', size: 160 },
            { name: <span>Sales GCash <br />Collection</span>, stack: true, sort: 'sales_gcash', size: 160 },
            { name: <span>Sales Credit <br />Collection</span>, stack: true, sort: 'sales_credit', size: 160 },
            { name: <span className="font-bold">Total Sales <br />Collection</span>, stack: true, size: 160 },
            { name: <span>Credit Cash <br />Collection</span>, stack: true, sort: 'credit_cash', size: 160 },
            { name: <span>Credit Cheque <br />Collection</span>, stack: true, sort: 'credit_cheque', size: 160 },
            { name: <span>Credit GCash <br />Collection</span>, stack: true, sort: 'credit_gcash', size: 160 },
            { name: <span className="font-bold">Total Collection <br />Collection</span>, stack: true, size: 160 },
            { name: <span>Returned</span>, stack: true, sort: 'returned', size: 160 },
        ]
    }

    const items = (item) => {
        return [
            { value: moment(item.date).format("MM-DD-YYYY") },
            { value: currencyFormat.format(item.sales_cash) },
            { value: currencyFormat.format(item.sales_cheque) },
            { value: currencyFormat.format(item.sales_gcash) },
            { value: currencyFormat.format(item.sales_credit) },
            { value: <b>{currencyFormat.format(amount(item.sales_cash) + amount(item.sales_cheque) + amount(item.sales_gcash) + amount(item.sales_credit || 0))}</b> },
            { value: currencyFormat.format(item.credit_cash) },
            { value: currencyFormat.format(item.credit_cheque) },
            { value: currencyFormat.format(item.credit_gcash) },
            { value: <b>{currencyFormat.format(amount(item.credit_cash) + amount(item.credit_cheque) + amount(item.credit_gcash))}</b> },
            { value: currencyFormat.format(item.returned) },
        ]
    }

    const print = (item) => {
        return [
            { value: moment(item.date).format("MM-DD-YYYY") },
            { value: currencyFormat.format(item.sales_cash) },
            { value: currencyFormat.format(item.sales_cheque) },
            { value: currencyFormat.format(item.sales_gcash) },
            { value: currencyFormat.format(item.sales_credit) },
            { value: currencyFormat.format(amount(item.sales_cash) + amount(item.sales_cheque) + amount(item.sales_gcash) + amount(item.sales_credit || 0)) },
            { value: currencyFormat.format(item.credit_cash) },
            { value: currencyFormat.format(item.credit_cheque) },
            { value: currencyFormat.format(item.credit_gcash) },
            { value: currencyFormat.format(amount(item.credit_cash) + amount(item.credit_cheque) + amount(item.credit_gcash)) },
            { value: currencyFormat.format(item.returned) },
        ]
    }

    const summary = () => {
        return {
            key: 0,
            items: [
                { value: "TOTAL" },
                { value: currencyFormat.format(data?.reduce((prev, curr) => prev + amount(curr.sales_cash || 0), 0)) },
                { value: currencyFormat.format(data?.reduce((prev, curr) => prev + amount(curr.sales_cheque || 0), 0)) },
                { value: currencyFormat.format(data?.reduce((prev, curr) => prev + amount(curr.sales_gcash || 0), 0)) },
                { value: currencyFormat.format(data?.reduce((prev, curr) => prev + amount(curr.sales_credit || 0), 0)) },
                { value: currencyFormat.format(data?.reduce((prev, curr) => prev + (amount(curr.sales_cash) + amount(curr.sales_cheque) + amount(curr.sales_gcash) + amount(curr.sales_credit || 0)), 0) || 0) },
                { value: currencyFormat.format(data?.reduce((prev, curr) => prev + amount(curr.credit_cash || 0), 0)) },
                { value: currencyFormat.format(data?.reduce((prev, curr) => prev + amount(curr.credit_cheque || 0), 0)) },
                { value: currencyFormat.format(data?.reduce((prev, curr) => prev + amount(curr.credit_gcash || 0), 0)) },
                { value: currencyFormat.format(data?.reduce((prev, curr) => prev + (amount(curr.credit_cash) + amount(curr.credit_cheque) + amount(curr.credit_gcash)), 0) || 0) },
                { value: currencyFormat.format(data?.reduce((prev, curr) => prev + amount(curr.returned || 0), 0)) },
            ]
        }
    }

    useEffect(() => {
        if (data) {
            let tempdata = sorted ? sortBy(data, sorted) : data
            setrecords(tempdata?.map((item, i) => {
                return {
                    key: item.id,
                    items: items(item),
                    print: print(item)
                }
            }))
        }
    }, [data, sorted])

    const onChange = (e) => {
        const { name, value } = e.target
        setfilter(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const getData = async (e) => {
        e.preventDefault()
        setloading(true)
        let res = await fetchDailySummary(moment(filter.fr).format("YYYY-MM-DD"), moment(filter.to).format("YYYY-MM-DD"))
        setdata(res?.result)
        setloading(false)
    }

    const printData = () => {
        let forprint = records?.map(rec => {
            return {
                ...rec,
                items: rec.print
            }
        })
        localStorage.setItem(report, JSON.stringify({
            title: "DAILY SUMMARY REPORT",
            subtext: `From: ${moment(filter.fr).format("MMMM DD, YYYY")} To: ${moment(filter.to).format("MMMM DD, YYYY")}`,
            data: forprint,
            summary: summary()
        }))
        window.open(`/#/print/${report}/${moment(filter.fr).format("MMDDYYYY")}${moment(filter.to).format("MMDDYYYY")}`, '_blank')
    }

    const exportData = () => {
        if (data?.length) {
            let type = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8'
            const ws = XLSX.utils.json_to_sheet([...data])
            const wb = { Sheets: { 'data': ws }, SheetNames: ['data'] }
            const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' })
            const excelData = new Blob([excelBuffer], { type: type })
            saveAs(excelData, `${report?.toLowerCase()?.replaceAll("-", "_")}_exported_on_${moment(new Date()).format('YYYY_MM_DD_HH_mm_ss')}.xlsx`)
        }
    }

    useEffect(() => {
        return () => {
            localStorage.removeItem(report)
        }
    }, [report])

    return (
        <AppModal show={report === "daily-summary"} setshow={toggle} title={`REPORT: ${report.replaceAll("-", " ").toUpperCase()}`} full={true} >
            <div className="w-full h-[calc(100%-60px)] bg-gradient-to-b from-white to-gray-400 mb-2 flex flex-col pt-3">
                <form
                    onSubmit={getData}
                    className="flex flex-col gap-[5px] no-select"
                >
                    <label htmlFor="date">Report Filter:</label>
                    <div className="flex flex-wrap items-center gap-[10px]">
                        <div className="flex items-center gap-[10px] border border-1 border-black pl-3">
                            <label htmlFor="fr">From:</label>
                            <input
                                type="date"
                                name="fr"
                                id="fr"
                                className="w-[250px] border-none"
                                value={filter.fr}
                                onChange={onChange}
                            />
                        </div>
                        <div className="flex items-center gap-[10px] border border-1 border-black pl-3">
                            <label htmlFor="to">To:</label>
                            <input
                                type="date"
                                name="to"
                                id="to"
                                className="w-[250px] border-none"
                                value={filter.to}
                                onChange={onChange}
                            />
                        </div>
                        <button type="submit">
                            <FunnelIcon
                                className="h-8 w-8 text-gray-700 hover:text-gray-500 cursor-pointer"
                            />
                        </button>
                        <ArchiveBoxArrowDownIcon
                            className="h-8 w-8 text-gray-700 hover:text-gray-500 cursor-pointer ml-auto mr-3"
                            onClick={() => exportData()}
                        />
                        <PrinterIcon
                            className="h-8 w-8 text-gray-700 hover:text-gray-500 cursor-pointer"
                            onClick={() => printData()}
                        />
                    </div>
                </form>
                <DataRecords
                    columns={columns}
                    records={records}
                    page={startpage}
                    setPage={setstartpage}
                    itemsperpage={itemsperpage}
                    setsorted={setsorted}
                    keeppagination={true}
                />
            </div>
            <div className="font-bold text-lg ml-auto flex gap-5">
                <span>
                    <span className="no-select mr-3">Total Sales:</span>{currencyFormat.format(data?.reduce((prev, curr) => prev + (amount(curr.sales_cash) + amount(curr.sales_cheque) + amount(curr.sales_gcash) + amount(curr.sales_credit || 0)), 0) || 0)}
                </span>
                <span>
                    <span className="no-select mr-3">Total Collection:</span>{currencyFormat.format(data?.reduce((prev, curr) => prev + (amount(curr.credit_cash) + amount(curr.credit_cheque) + amount(curr.credit_gcash)), 0) || 0)}
                </span>
            </div>
        </AppModal>
    )
}

export default TemplateDailySummary