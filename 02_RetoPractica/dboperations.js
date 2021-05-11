// LOGICA

const config = require('./config');
const sql = require('mssql');

async function getStates() {
    try {
        let pool = await sql.connect(config);
        let states = await pool.request().query("SELECT * FROM Core_State");
        return states.recordsets;
    } catch (err) {
        console.log(err);
    }
}

module.exports = {
    getStates: getStates
}