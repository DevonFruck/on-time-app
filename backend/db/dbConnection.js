// const { Client } = require('pg')


// let client = null;

// // Delay function to allow for db connection retry if it fails
// async function delayConnect(t) {
//     return new Promise(function(resolve) {
//         setTimeout(resolve, t);
//     });
// }

// async function dbConnect() {
//     let hostAddress = process.env.npm_config_host;

//     client = new Client({
//         user: 'postgres',
//         host: hostAddress,
//         database: 'postgres',
//         password: "iamtheadmin12345",
//         port: "5432",
//     })
    
//     await client.connect((err) => {
//         if (err) {
//             console.log('connection error', err.code)
//             return client;
//         } else {
//             console.log('connected')
//       }
//     })
    
//     await client.query(
//         `
//         CREATE TABLE IF NOT EXISTS public.tasks
//         (
//             id numeric NOT NULL,
//             task_id numeric NOT NULL,
//             task_name text COLLATE pg_catalog."default" NOT NULL,
//             is_complete boolean DEFAULT false,
//             CONSTRAINT tasks_pkey PRIMARY KEY (task_id)
//         );
        
//         CREATE TABLE IF NOT EXISTS public.users
//         (
//             id numeric NOT NULL,
//             name text COLLATE pg_catalog."default" NOT NULL,
//             CONSTRAINT users_pkey PRIMARY KEY (id)
//         );
//         `
//     );

//     return client;
// }


// async function connect() {
//     try {
//         return await dbConnect().then((res) =>{return res})
//     }
//     catch(err) {
//         console.log(err)
//         await delayConnect(5000);
//         return connect()
//     }
// }

// //const client = connect();

// module.exports.connectClient = async () => {
//     return await connect();
// }

// module.exports.getClient = async () => {
//     return client;
// }
const { Pool } = require('pg')

var mainPool = null;
var poolCreated = false;
const hostAddress = process.env.npm_config_host;

async function createPool() {
  const pool = new Pool({
    user: 'postgres',
    host: hostAddress,
    database: 'postgres',
    password: "iamtheadmin12345",
    port: "5432",
    connectionTimeoutMillis: 5000
  });
  return pool;
}

async function dbQuery(queryString, parameters) {
  if(!poolCreated) {
    mainPool = await createPool();
    poolCreated = true;
  }

  return res = await mainPool.query(queryString, parameters)
    .then(res => { return res.rows})
    .catch(err => { throw(err) })
}



module.exports = dbQuery;
