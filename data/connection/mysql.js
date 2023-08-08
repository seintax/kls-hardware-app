const mysql = require('mysql')

// var my = mysql.createPool({
//     host: process.env.MY_SERVER,
//     user: process.env.MY_USER,
//     password: process.env.MY_PASSWORD,
//     database: process.env.MY_DATABASE,
//     waitForConnections: true,
//     multipleStatements: true,
//     connectionLimit: 10,
//     queueLimit: 0
// })

// development environment
// var my = mysql.createPool('mysql://ql4nryngt7llnxn6c2gq:pscale_pw_xhSDbUrfZUh1lFznu8jyaW18pvuYR8BrQ0cuOEssIag@aws.connect.psdb.cloud/app-jbs-hpos?ssl={"rejectUnauthorized":true}')

production environment
var my = mysql.createPool('mysql://e0wmy46upo7a2d3rdh61:pscale_pw_Wtyj2B8FXVu1JpZapP6zXrfL1wS4VFMsTgXeKDHbAkD@aws.connect.psdb.cloud/app-jbs-hpos?ssl={"rejectUnauthorized":true}')

my.getConnection((err, con) => {
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
        console.log(`\x1b[45m`, `MYSQL`, '\x1b[0m', `@ ${process.env.MY_SERVER}/${process.env.MY_DATABASE}\n`)
    }
    if (con) con.release()
    return
})

module.exports = my
