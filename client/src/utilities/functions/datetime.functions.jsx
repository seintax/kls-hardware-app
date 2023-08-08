import moment from "moment"

export const createInstance = () => {
    return moment(new Date).format("YYYYMMDDHHmmss")
}