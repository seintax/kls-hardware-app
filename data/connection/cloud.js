const mysql = require('mysql')

var cl = mysql.createPool('')

cl.getConnection((err, con) => {
    if (err) {
        console.log(`\x1b[41m`, `ERROR`, '\x1b[0m', `Failed to load server @ ${process.env.MY_SERVER}/${process.env.MY_DATABASE}`)
        if (err.code === 'PROTOCOL_CONNECTION_LOST') {
            console.error(`\x1b[41m`, `ERROR`, '\x1b[0m', 'PROTOCOL_CONNECTION_LOST: Database connection was closed.\n')
        }
        else if (err.code === 'ER_CON_COUNT_ERROR') {
            console.error(`\x1b[41m`, `ERROR`, '\x1b[0m', 'ER_CON_COUNT_ERROR: Database has too many connections.\n')
        }
        else if (err.code === 'ECONNREFUSED') {
            console.error(`\x1b[41m`, `ERROR`, '\x1b[0m', 'ECONNREFUSED: Database connection was refused.\n')
        }
        else {
            console.error(`\x1b[41m`, `ERROR`, '\x1b[0m', `${err.code}\n`)
        }
    }
    else {
        console.log(`\x1b[43m`, `CLOUD`, '\x1b[0m', `@ planetscale/app-jbs-hpos\n`)
        console.log(`\x1b[43m`, `CLOUD`, '\x1b[0m', `@ planetscale/app-jbs-hpos\n`)
    }
    if (con) con.release()
    return
})

module.exports = cl
