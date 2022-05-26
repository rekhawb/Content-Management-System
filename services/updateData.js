const config = require('../config/connection');
const inquirer = require('inquirer');
//const inquirerP = require('inquirer-promise');
const tbData = require('console.table');

const mysql= require('mysql2');
const res = require('express/lib/response');
//const mainPage = require('../routes/index');

let conn = mysql.createConnection(config.db);

conn.connect((err) =>{
    if(err){

        return console.error('error: '+err.message);
    }
    console.log('');
})




async function uptNewEmp(){
    let listEmp = [];

    const dataDept = conn.query("SELECT concat(' ',FIRST_NAME,LAST_NAME) FROM EMPLOYEE",await ((err,results) =>{
        if(err){
            console.error("Error: "+err.message);
        }

/* Pull available department*/
        if(results.length > 0){
            
            results.forEach((ele,index)=>{
                Object.values(ele).forEach((ele) => {
                    listEmp.push(ele);
                    return listEmp;
                })
                
            });
         // console.log(...listDept);
    
       inquirer.prompt([
             {
                type:'list',
                name:'nameEmp',
                message:'Choose an Employee:',
                choices: listEmp
             }

         ]).then((results) =>{
             
            var insEmp = results.nameEmp;

            uptEmp(insEmp);
            

            /*** call role */

    })
}
    }))
}
/****************
 * 
 * 
 * END OF add a new Emp
 */

async function uptEmp(emp){
    var listRole = [];
    var empRole = "";
    var empDept = "";
    var empMgr = "";
    const dataRole = conn.query("SELECT TITLE FROM EMP_ROLE",((err,results) =>{
        if(err){
            console.error("Error: "+err.message);
        }

/* Pull available department*/
        if(results.length > 0){
            
            results.forEach((ele,index)=>{
                Object.values(ele).forEach((ele) => {
                    listRole.push(ele);
                    return listRole;
                })
                
            });
        }  
inquirer.prompt([
    {
        type:'list',
        name:'nameRole',
        message:'Choose a role from the list:',
        choices: listRole
    }
]).then((results) =>{

    let newRole = results.nameRole;
    //console.log(newRole,emp);


   

    let newRoleID = conn.query("SELECT ROLE_ID from EMP_ROLE WHERE TITLE='"+newRole+"'", ((err,results) =>{
  
        if(err){
            console.error("Error: "+err.message);
        }       

        empRole = results[0]['ROLE_ID'];
        console.log(empRole);

       // console.log("UPDATE EMPLOYEE SET ROLE_ID ="+empRole+" WHERE concat(FIRST_NAME,' ',LAST_NAME) ='"+emp+"'");

    let uptEmpRole = conn.query("UPDATE EMPLOYEE SET ROLE_ID ="+empRole+" WHERE concat(' ',FIRST_NAME,LAST_NAME) ='"+emp+"'",((err,results) =>{
        if(err){
            console.error("Error:"+err.message);
        }
        console.log("Record updated");
        process.exit(0);
    }));

      
    }));

   /* let newDeptID = conn.query("SELECT DEPT_ID from EMP_ROLE WHERE TITLE='"+newRole+"'", ((err,results) =>{
  
        if(err){
            console.error("Error: "+err.message);
        }       

        empDept = results[0]['DEPT_ID'];
        //console.log(empRole);
      
    }));*/

    /*let newMgrID = conn.query("SELECT MANAGER_ID from EMPLOYEE WHERE ROLE_ID="+empRole, ((err,results) =>{
  
        if(err){
            console.error("Error: "+err.message);
        }       

        empMgr = results[0]['MANAGER_ID'];
        console.log(empMgr);
      
    }));*/

})
}));
    
}

module.exports = { uptNewEmp};