// dotenv for getting credentials
require('dotenv').config();

// for ssh into the server
const tunnel = require('tunnel-ssh');

// pg for db connections
const { Client } = require('pg');

// information from .env
const db_username = process.env.DB_USERNAME;
const db_password = process.env.DB_PASSWORD;
const db_name = process.env.DB_NAME;
const host = 'starbug.cs.rit.edu';
const port = 5432;

let ssh_username = process.env.SSH_USERNAME;
let ssh_password = process.env.SSH_USERNAME;
if (!ssh_username) ssh_username = db_username;
if (!ssh_password) ssh_password = db_password;

// SSH tunnel object
let ssh_tunnel;

// Connects to the database configured in db.pool
// @returns     err     if something went wrong connecting
const connect = async () => {
    const tunnel_config = {
        host: host,
        username: ssh_username,
        password: ssh_password,
        port: 22,
        dstPort: port,
        localPort: port,
    };

    tunnel(
        tunnel_config,
        async (err, server) => {
            if (err) {
                console.log('SSH tunnel connection error!');
                console.log(err);
            }
            console.log('SSH tunnel established.');
            ssh_tunnel = server;
        }
    );
}

// Closes the ssh connection to the server.
const disconnect = async () => {
    if (!ssh_tunnel) {
        console.log('No SSH tunnel to close!');
        return;
    }

    console.log('Closing SSH connection');
    ssh_tunnel.close();
}

// Queries the db with the given query.
// @param       query   The SQL statement to execute (string)
// @returns     (err, res)
//              err if something went wrong
//              res the result of the query
const query = async (query) => {
    const client = new Client({
        connectionString: `postgres://${db_username}:${db_password}@127.0.0.1/${db_name}`
    });

    await client.connect(err => {
        if (!err) {
            return;
        }

        console.log('An error occured querying the database.');
        console.log(err);
        return undefined;
    });
    const res = await client.query(query);
    await client.end();
    return res;
}

module.exports = { query, connect, disconnect };
