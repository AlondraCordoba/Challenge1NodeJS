const sql = require("mssql/msnodesqlv8");
// const config = {
//     server: 'DESKTOP-OIDF9P5\SQLEXPRESS',
//     port: '1433',
//     database: 'MindCommerce',

//     options: {
//         trustedconnection: true,
//         enableArithAbort: true,
//         instacename: 'SQLEXPRESS'
//     }
// }

const config = new sql.ConnectionPool({
    database: 'MindCommerce',
    server: 'DESKTOP-OIDF9P5',
    port: '1433',
    driver: "msnodesqlv8",
    options: {
        trustedconnection: true,
        enableArithAbort: true,
        instacename: 'SQLEXPRESS'
    }
});


config.connect().then(() => {
    // con.request().query('select 1 as number', (err, result) => {
    //       console.dir(result)
    //   })
    console.log("Conexion establecida")
})

module.exports = config;