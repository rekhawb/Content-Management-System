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


 async function viewDept(){
   const dataSelect = await conn.promise().query("SELECT * from DEPARTMENT");
   return dataSelect[0];
}


async function viewRoles(){

    const dataSelect = await conn.promise().query("SELECT * FROM EMP_ROLE");
    return dataSelect[0];
}

async function viewEmp(){
    const dataSelect = await conn.promise().query("SELECT * FROM EMPLOYEE");
     return dataSelect[0];
}

async function viewEmpByMgr(nameMgr){
    const dataSelect = await conn.promise().query("SELECT * from employee where MANAGER_ID IN (SELECT ROLE_ID FROM EMPLOYEE WHERE concat(FIRST_NAME,' ',LAST_NAME)='"+nameMgr+"')");
    return dataSelect[0];
}


async function viewBudgetDept(nameDept){
    const dataSelect = await conn.promise().query("select D.DEPT_NAME ,SUM(SALARY)    FROM EMPLOYEE as E     JOIN EMP_ROLE as R ON E.ROLE_ID = R.ROLE_ID    JOIN DEPARTMENT as D ON R.DEPT_ID = D.DEPT_ID    AND D.DEPT_NAME ='"+nameDept+"'      GROUP BY D.DEPT_NAME");
    return dataSelect[0];
}



module.exports = { 
    viewDept,
    viewRoles,
    viewEmp,
    viewEmpByMgr,
    viewBudgetDept
};