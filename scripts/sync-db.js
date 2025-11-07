const {sequelize} = require('../models')

async function run(){
    try{
        console.log('Synching database...');
        await sequelize.sync({alter:true});
        console.log('Databse synced');
        process.exit(0);
    }catch(err){
        console.error('Failed to sync DB',err);
        process.exit(1);
    }
}

run()