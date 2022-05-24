
require('dotenv').config();
const env = process.env;
//console.log(env);




const config = {
    db: { 
      host:'localhost',
      user:env.DB_USER ,
      password:env.DB_PASSWORD,
      database:env.DB_NAME,
      port: 3306
  }
};
    
  module.exports = config;