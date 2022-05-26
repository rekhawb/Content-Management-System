const config = require('../config/connection');
const inquirer = require('inquirer');
//const mainPage = require('../routes/index');
var forever = require('forever-monitor');
//const inquirerP = require('inquirer-promise');
const tbData = require('console.table');
require('events').EventEmitter.prototype._maxListeners = 100;

const mysql= require('mysql2');
const { param } = require('express/lib/request');
//const { input } = require('inquirer-promise');


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
const dataInsert = conn.promise().query('INSERT INTO DEPARTMENT (DEPT_NAME) VALUES (?)',[detailsDept.nameDept]);
return dataInsert;
 };


 async function getDept(){

    const dataDept = conn.promise().query("SELECT DEPT_NAME FROM DEPARTMENT");
    return dataDept;

 }


 async function getRole(nameDept){
    let idRole = conn.promise().query("SELECT TITLE FROM EMP_ROLE WHERE DEPT_ID IN (SELECT DEPT_ID from DEPARTMENT WHERE DEPT_NAME='"+nameDept+"')");
    return idRole;

 }

 async function getMgr(nameDept){
    let nameMgr = conn.promise().query("SELECT concat(FIRST_NAME,' ',LAST_NAME) FROM EMPLOYEE WHERE ROLE_ID IN (SELECT ROLE_ID from EMP_ROLE where DEPT_ID IN(SELECT DEPT_ID from DEPARTMENT WHERE DEPT_NAME='"+nameDept+"'))");
    return nameMgr;
 }

 async function getMgrAll(){
    let nameMgr = conn.promise().query("SELECT concat(FIRST_NAME,' ',LAST_NAME) FROM EMPLOYEE WHERE MANAGER_ID IS NULL");
   // console.log(nameMgr);
    return nameMgr;
 }


async function promptMgr(result){

    let listMgr =[];
    let results = result[0];
   if(results.length > 0){
           
       results.forEach((ele,index)=>{
           Object.values(ele).forEach((ele) => {
               listMgr.push(ele);
               return listMgr;
           })
           
       });
   }
   // console.log(...listDept);

  let selectMgr = await inquirer.prompt([
        {
           type:'list',
           name:'nameMgr',
           message:'Choose Manager:',
           choices: listMgr
        }
       ]);

       //console.log(selectDept.nameDept);
     return selectMgr.nameMgr;



}

 async function promptRole(result){
    let listRole =[];
     let results = result[0];
    if(results.length > 0){
            
        results.forEach((ele,index)=>{
            Object.values(ele).forEach((ele) => {
                listRole.push(ele);
                return listRole;
            })
            
        });
    }
    // console.log(...listDept);

   let selectRole = await inquirer.prompt([
         {
            type:'list',
            name:'nameRole',
            message:'Choose a Role:',
            choices: listRole
         }
        ]);

        //console.log(selectDept.nameDept);
      return selectRole.nameRole;

 }


async function promptfnamelname(nameDept,nameRole,nameMgr){
    let listEmp = [];

    let nameF = await inquirer.prompt([{
                              type:'input',
                              name:'nameFirst',
                              message:'Enter new employee first name',
                              validate: async(input) =>{
                                if(input === ""){
                                    return false;
                                }else{
                                    return true;
                                }
                     }


    }
]);

let nameL = await inquirer.prompt([
    {
        type:'input',
        name:'nameLast',
        message:'Enter employee last name',
        validate: async(input) =>{
            if(input === ""){
                return false;
            }else{
                return true;
            }
 }
    }
]);

listEmp.push(nameDept);
listEmp.push(nameRole);
listEmp.push(nameMgr);
listEmp.push(nameF.nameFirst);
listEmp.push(nameL.nameLast);

return listEmp;

}

async function addEmp(nameDept,nameRole,nameMgr,nameF,nameL){
    //var listR = [];
    var  idRole ="";
    var empMgr = "";
let newEmp = conn.promise().query("select DEPT_ID,ROLE_ID from EMP_ROLE where TITLE ='"+nameRole+"'");
const p = Promise.resolve(newEmp);
p.then((result)=>{
    result = result[0];
   var idDept = result[0]['DEPT_ID'];
  idRole = result[0]['ROLE_ID'];
 // console.log(idDept,idRole);
 let newEmpMgr = conn.promise().query("select ROLE_ID,MANAGER_ID from employee where concat(FIRST_NAME,' ',LAST_NAME) ='"+nameMgr+"'");
 const s = Promise.resolve(newEmpMgr);
 s.then((result)=>
 {
     result = result[0];
  empMgrRoleID = result[0]['ROLE_ID'];
  empMgrMgrID = result[0]['MANAGER_ID'];

  empMgr = empMgrRoleID;
  if(idRole === empMgrRoleID){
      empMgr = empMgrMgrID;
  }

//  console.log(idRole);

let addNewEmp = conn.promise().query("INSERT INTO employee (ROLE_ID,FIRST_NAME,LAST_NAME,MANAGER_ID) VALUES(?,?,?,?)",[idRole,nameF,nameL,empMgr]);

return addNewEmp;
 //console.log(empMgr);
 }).catch((result)=>{
 console.log(result);
 });

});






}




 async function promptDept(result){
     let listDept =[];
     let results = result[0];
    if(results.length > 0){
            
        results.forEach((ele,index)=>{
            Object.values(ele).forEach((ele) => {
                listDept.push(ele);
                return listDept;
            })
            
        });
    }
    // console.log(...listDept);

   let selectDept = await inquirer.prompt([
         {
            type:'list',
            name:'nameDept',
            message:'Choose a department:',
            choices: listDept
         }
        ]);

        //console.log(selectDept.nameDept);
      return selectDept.nameDept;
 }


 async function addRole(nameDept){

    let paramList = [];

    let name = await inquirer.prompt([{
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

    }]);

    let salary = await inquirer.prompt([{

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
    }]);

//return s;param
paramList.push(nameDept);
paramList.push(name.nameRole);
paramList.push(salary.salaryRole);
//console.log(paramList);
return paramList;

 }
        

 async function addNewRole(nameDept,nameRole,salaryRole){
    let newDept = conn.promise().query("SELECT DEPT_ID from DEPARTMENT WHERE DEPT_NAME='"+nameDept+"'");
  //  console.log(newDept);

   newDept.then((result) =>{
       result = result[0];
    const newRole = conn.promise().query("INSERT INTO EMP_ROLE (DEPT_ID,TITLE,SALARY) VALUES(?,?,?)",[result[0]['DEPT_ID'],nameRole,salaryRole]);
   return newRole;
    
 }).catch((result)=>{
     return result;
 })

};
 

module.exports = {
    addDept,
    getDept,
    promptDept,
    addRole,
    addNewRole,
    getRole,
    promptRole,
    getMgr,
    promptMgr,
    promptfnamelname,
    addEmp,
    getMgrAll
    //addNewEmp
};