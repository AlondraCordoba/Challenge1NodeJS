const config = {
    server: 'DESKTOP-OIDF9P5',
    port: '1433',
    database: 'MindCommerce',
    authentication: {
        type: 'default',
        // options: {
        //     userName: 'your_username', //update me
        //     password: 'your_password'  //update me
        // }
    },
    options: {
        trustedconnection: true,
        enableArithAbort: true,
        instacename: 'SQLEXPRESS'
    }
}
module.exports = config;