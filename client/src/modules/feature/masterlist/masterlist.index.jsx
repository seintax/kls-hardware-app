import { saveAs } from 'file-saver'
import moment from "moment"
import { useEffect, useState } from 'react'
import { useQuery } from 'react-query'
import * as XLSX from 'xlsx'
import { useClientContext } from "../../../utilities/context/client.context"
import { generateDynamicQuery } from "../../../utilities/functions/query.functions"
import DataIndex from '../../../utilities/interface/datastack/data.index'
import MasterlistManage from './masterlist.manage'
import MasterlistRecords from './masterlist.records'
import { searchMasterlist } from './masterlist.services'

const MasterlistIndex = () => {
    const { search, user } = useClientContext()
    const name = 'Masterlist'
    const { data, isLoading, isError, refetch } = useQuery(`${name.toLowerCase()}-index`, () => searchMasterlist(search.key))
    const [manage, setManage] = useState(false)
    const [id, setId] = useState()

    useEffect(() => { refetch() }, [search])

    const toggleExport = () => {
        if (data?.result?.length) {
            let type = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8'
            const ws = XLSX.utils.json_to_sheet(generateDynamicQuery(data?.result))
            const wb = { Sheets: { 'data': ws }, SheetNames: ['data'] }
            const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' })
            const excelData = new Blob([excelBuffer], { type: type })
            saveAs(excelData, `${name?.toLowerCase()}_export_on_${moment(new Date()).format('YYYY_MM_DD_HH_mm_ss')}.xlsx`)
        }
    }

    const actions = () => {
        return [
            { label: "Export Data", callback: toggleExport, hidden: user.name !== "DEVELOPER" },
        ]
    }

    return (
        (manage) ? (
            <MasterlistManage id={id} name={name} manage={setManage} />
        ) : (
            <DataIndex
                data={data}
                name={name}
                actions={actions()}
                setter={setId}
                manage={setManage}
                isError={isError}
                isLoading={isLoading}
            >
                <MasterlistRecords
                    setter={setId}
                    manage={setManage}
                    refetch={refetch}
                    data={data?.result || []}
                />
            </DataIndex >
        )
    )
}

export default MasterlistIndex