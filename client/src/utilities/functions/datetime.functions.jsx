import moment from "moment"

export const createInstance = () => {
    return moment(new Date()).format("YYYYMMDDHHmmss")
}

export const sqlDate = () => {
    return moment(new Date()).format("YYYY-MM-DD")
}

export const sqlTimestamp = () => {
    return moment(new Date()).format("YYYY-MM-DD HH:mm:ss")
}

export const momentPST = (value, format = "YYYY-MM-DD HH:mm:ss") => {
    // production timezone adjustment is based on the 
    // default timezone of hostinger.com
    const timeZone = import.meta.env.MODE === "development" ? 480 : 0
    return moment(value).utcOffset(timeZone).format(format)
}