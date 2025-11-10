const {Sequelize} = require('sequelize');
const path = require('path');

//Load environment variables from .env if present
require('dotenv').config({path:path.resolve(process.cwd(),'.env')})

const DB_URL = process.env.DATABASE_URL;

let sequelize
if (DB_URL){
    sequelize = new Sequelize(DB_URL, {dialect:'postgres',logging:false});
}else{
    const db = process.env.DB_NAME || 'postgres'
    const user = process.env.DB_USER || 'postgres'
    const pass = process.env.DB_PASS || ''
    const host = process.env.DB_HOST || 'localhost'
    const port = process.env.DB_PORT || 5432
    sequelize = new Sequelize(db,user,pass,{
        host,
        port,
        dialect: 'postgres',
        logging: false,
    })
}

const models = {}

models.sequelize = sequelize;
models.Sequelize = Sequelize;

module.exports = models;