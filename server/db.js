// API for connecting to a db with ssh tunneling
// Authors: Daniel Chapin (dsc4984)
//
// Database information is taken from .env
// You must define:
//      DB_USERNAME
//      DB_PASSWORD
//      DB_NAME
//      DB_HOST
// You may optionaly define:
//      DB_PORT         (default 5432)
//      SSH_USERNAME    (default DB_USERNAME)
//      SSH_PASSWORD    (default DB_PASSWORD)
//      SSH_HOST        (default DB_HOST)
//      SSH_PORT        (default 22)
//      DB_PORT_LOCAL   (default DB_PORT)
//

// dotenv for getting credentials
require('dotenv').config();

// for ssh into the server
const tunnel = require('tunnel-ssh');

// pg for db connections
const Pool = require('pg').Pool;

// information from .env
const db_username = process.env.DB_USERNAME;
const db_password = process.env.DB_PASSWORD;
const db_name = process.env.DB_NAME;
const db_host = process.env.DB_HOST;
let db_port = process.env.DB_PORT;
if (!db_port) db_port = 5432;
let db_port_local = process.env.DB_PORT_LOCAL;
if (!db_port_local) db_port_local = db_port;

let ssh_username = process.env.SSH_USERNAME;
let ssh_password = process.env.SSH_USERNAME;
let ssh_host = process.env.SSH_HOST;
let ssh_port = process.env.SSH_PORT;
if (!ssh_username) ssh_username = db_username;
if (!ssh_password) ssh_password = db_password;
if (!ssh_host) ssh_host = db_host;
if (!ssh_port) ssh_port = 22;

// SSH tunnel object
let ssh_tunnel;

// Connects to the database configured in db.pool
// @returns     err     if something went wrong connecting
const connect = async () => {
    const tunnel_config = {
        host: ssh_host,
        username: ssh_username,
        password: ssh_password,
        port: 22,
        dstPort: db_port,
        localPort: db_port_local,
    };

    tunnel(
        tunnel_config,
        async (err, server) => {
            if (err) {
                console.log('SSH tunnel connection error!');
                return err;
            }
            console.log('SSH tunnel established.');
            ssh_tunnel = server;
        }
    );
}

const pool = new Pool({
    connectionString: `postgres://${db_username}:${db_password}@127.0.0.1:${db_port_local}/${db_name}`
});

// Closes the ssh connection to the server.
// const disconnect = async () => {
//     if (!ssh_tunnel) {
//         console.log('No SSH tunnel to close!');
//         return;
//     }

//     await pool.end();

//     console.log('Closing SSH connection');
//     await ssh_tunnel.close();
// }

// Queries the db with the given query.
// @param       query   The SQL statement to execute (string)
// @return      The result of the query
// const query = async (query) => {
//     return await pool.query(query);
// }
connect();
module.exports = pool;
