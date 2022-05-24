const config = require('../config/connection');
const inquirer = require('inquirer');
//const inquirerP = require('inquirer-promise');
const tbData = require('console.table');

const mysql= require('mysql2');
const { input } = require('inquirer-promise');
//const mainPage = require('../routes/index');

let conn = mysql.createConnection(config.db);

conn.connect((err) =>{
    if(err){

        return console.error('error: '+err.message);
    }
    console.log('');
})


async function addDept(){
    let detailsDept = await inquirer.prompt([
        
    {
     type:'input',
     name:'nameDept',
     message:'Enter department name:'
    }
]);

const dataInsert = conn.query('INSERT INTO DEPARTMENT (DEPT_NAME) VALUES (?)',[detailsDept.nameDept],(err,results) =>{

let userMessage = "Error adding new department";
//console.log(results.affectedRows);


if(results.affectedRows){
    userMessage = "Succesfully added new department:  "+detailsDept.nameDept;
    const dataView = conn.query('SELECT * FROM DEPARTMENT WHERE DEPT_ID = '+results.insertId,(err,results) => { 
    console.table(results);
    });
}

console.log(userMessage);
});

};

/****************
 * 
 * 
 * add a new ROle
 */

async function addRole(){
    let listDept = [];

    const dataDept = conn.query("SELECT DEPT_NAME FROM DEPARTMENT",await ((err,results) =>{
        if(err){
            console.error("Error: "+err.message);
        }

/* Pull available department*/
        if(results.length > 0){
            
            results.forEach((ele,index)=>{
                Object.values(ele).forEach((ele) => {
                    listDept.push(ele);
                    return listDept;
                })
                
            });
        }
        // console.log(...listDept);

        inquirer.prompt([
             {
                type:'list',
                name:'nameDept',
                message:'Choose a department:',
                choices: listDept
             },
             {
                 type:'input',
                 name:'nameRole',
                 message:"Enter a role to add",
                 validate: async(input) =>{
                            if(input === ""){
                                return false;
                            }else{
                                return true;
                            }
                 }
                 
             },
             {
             type:'input',
             name:'salaryRole',
             message:"Enter salary for the role:",
             validate: async(input) =>{
                 if(input === "" || isNaN(input)){
                     return false
                 }else{
                     return true
                 }
             }
             }

         ]).then((results) =>{
             
            addRole( results.nameDept,results.nameRole,results.salaryRole);
         });
         
    }));


   async function addRole(deptName,nameRole,salaryRole){
    

        let newDept = conn.query("SELECT DEPT_ID from DEPARTMENT WHERE DEPT_NAME='"+deptName+"'",await ((err,results) =>{
      
            if(err){
                console.error("Error: "+err.message);
            }
          
           //console.log(results[0]['DEPT_ID']);

           let newRole = conn.query("INSERT INTO EMP_ROLE (DEPT_ID,TITLE,SALARY) VALUES(?,?,?)",[results[0]['DEPT_ID'],nameRole,salaryRole],((err,results) =>{
               if(err){
                   console.error("Error: "+err.message);
               }
               console.table("New Role added: "+nameRole+" and it's associated ROLE ID is: "+results.insertId);
           }));

        }));
    }
}
        
/****************
 * 
 * 
 * END OF add a new Employee
 */



/****************
 * 
 * 
 * add a new Emp
 */

 async function addNewEmp(){
    let listDept = [];
    let listRole = [];
    let listMgr = [];

    const dataDept = conn.query("SELECT DEPT_NAME FROM DEPARTMENT",await ((err,results) =>{
        if(err){
            console.error("Error: "+err.message);
        }

/* Pull available department*/
        if(results.length > 0){
            
            results.forEach((ele,index)=>{
                Object.values(ele).forEach((ele) => {
                    listDept.push(ele);
                    return listDept;
                })
                
            });
         // console.log(...listDept);
    
       inquirer.prompt([
             {
                type:'list',
                name:'nameDept',
                message:'Choose a department:',
                choices: listDept
             }

         ]).then((results) =>{
             
            var insDept = results.nameDept;

            /*** call role */

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
                }      // console.log(...listDept);
            
                inquirer.prompt([
                     {
                        type:'list',
                        name:'nameRole',
                        message:'Choose a Role:',
                        choices: listRole
                     }
        
                 ]).then((results) =>{
                     
                    var insRole = results.nameRole;

                    const dataMgr = conn.query("SELECT CONCAT(' ',FIRST_NAME,LAST_NAME) FROM EMPLOYEE ",((err,results) =>{
                        if(err){
                            console.error("Error: "+err.message);
                        }
                
                /* Pull available department*/
                        if(results.length > 0){
                            
                            results.forEach((ele,index)=>{
                                Object.values(ele).forEach((ele) => {
                                    listMgr.push(ele);
                                    return listMgr;
                                })
                                
                            });
                        }      // console.log(...listDept);
                    
                        inquirer.prompt([
                             {
                                type:'list',
                                name:'nameMgr',
                                message:'Choose Manager:',
                                choices: listMgr
                             },
                             {
                                 type:'input',
                                 name:'nameFirst',
                                 message:'Enter first name:',
                                 validate: async(input)=>{
                                     if(input === ""){
                                         return false;
                                     }else{
                                         return true;
                                     }
                                 }
                             },
                             {
                             type:'input',
                             name:'nameLast',
                             message:'Enter last name:',
                             validate:async(input) =>{
                                 if(input === ""){
                                     return false;
                                 }else{
                                     return true;
                                 }
                             }
                             }
                         ]).then((results) =>{
                             
                            var insMgr = results.nameMgr;
                            addEmp(insDept,insRole,insMgr,results.nameFirst,results.nameLast);
                         });
                         
                    }));
                 });
                 
            }));
            /////////////////////////////////////////////////////////////
         });       
   
        }  
        })
    );
    }
 
/****************
 * 
 * 
 * END OF add a new Emp
 */
 async function addEmp(deptName,nameRole,nameMgr,nameFirst,nameLast){
    var empRole = "";
    var empDept = "";
    var empMgr = "";

    let newDept = conn.query("SELECT DEPT_ID from DEPARTMENT WHERE DEPT_NAME='"+deptName+"'", await((err,results) =>{
  
        if(err){
            console.error("Error: "+err.message);
        }       

        empDept = results[0]['DEPT_ID'];
      
    }));

    let newRole = conn.query("SELECT ROLE_ID from EMP_ROLE WHERE TITLE='"+nameRole+"'",await ((err,results) =>{
  
        if(err){
            console.error("Error: "+err.message);
        }       
    
        empRole = results[0]['ROLE_ID'];
       // console.log(empRole);
      
    }));

    let newMgr = conn.query("SELECT ROLE_ID from EMPLOYEE WHERE concat(' ',FIRST_NAME,LAST_NAME) ='"+nameMgr+"'", await((err,results) =>{
  
        if(err){
            console.error("Error: "+err.message);
        }       

        empMgr = results[0]['ROLE_ID'];
        console.log(empMgr);

        let newEmp = conn.query("INSERT INTO EMPLOYEE(ROLE_ID,FIRST_NAME,LAST_NAME,MANAGER_ID) VALUES(?,?,?,?)",[empRole,nameFirst,nameLast,empMgr],((err,results) =>{
            if(err){
                console.error("Error: "+err.message);
            }
            console.table("New Employee added: "+nameFirst+" and it's associated EMP ID is: "+results.insertId);
        }));
    
      
    }));

   
 }

module.exports = {
    addDept,
    addRole,
    addNewEmp
};