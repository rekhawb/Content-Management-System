const config  = require('../config/connection');
const mysql= require('mysql2');
const tbData = require('console.table');

let conn = mysql.createConnection(config.db);

conn.connect((err) =>{
if(err){
    console.error("Error: "+err.message);

}

console.log("Connected to employee database");

});


 function viewDept(){
   const dataSelect = conn.query("SELECT * from DEPARTMENT",(err,result) => {
    if(err){
        console.error("Error: "+ err.message);
        }
   console.table(result);

   });
}


function viewRoles(){

    const dataSelect = conn.query("SELECT * FROM EMP_ROLE",(err,results) =>{
        if(err){
            console.error("Error: "+ err.message);
            }
        console.table(results);

    });
}

function viewEmp(){
    const dataSelect = conn.query("SELECT * FROM EMPLOYEE",(err,results) =>{
   
        if(err){
        console.error("Error: "+ err.message);
        }

        console.table(results);
    });

  
}




module.exports = { 
    viewDept,
    viewRoles,
    viewEmp
};