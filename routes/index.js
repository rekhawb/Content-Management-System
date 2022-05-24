const express = require('express');
const inquirer = require('inquirer');
//const router = require('express').Router();
//const empData = require('../services/data');


const addRouter = require('../services/addData');
const updateRouter = require('../services/updateData');
const deleteRouter = require('../services/deleteData');
const viewRouter = require('../services/viewData');
//const { home } = require('nodemon/lib/utils');

async function callHomeScreen(){

    let homeScreenQ = await inquirer.prompt([{
          type:"list",
          name:"qList",
          message:"What would you like to do?",
          choices:["Add Employee","Update Employee Role","View All Employees","View All Roles","Add Role","View All Departments","Add Department","Quit"]

    }]);

console.log(homeScreenQ.qList);

let actionChosen = homeScreenQ.qList;

if (actionChosen === "Quit"){
    
    console.log("Bye");
    process.exit(0);
}else if(actionChosen === "Add Department"){
    console.log("You selected to add a new Department");
    addRouter.addDept();

}else if(actionChosen === "View All Departments"){
    console.log("You selected to view all Departments");
    viewRouter.viewDept();
}else if(actionChosen === "View All Roles"){
    console.log("You selected view all Roles");
    viewRouter.viewRoles();
}else if(actionChosen === "View All Employees"){
    console.log("You selected to view all Employees");
    viewRouter.viewEmp();
}else if(actionChosen === "Add Role"){
    console.log("You selected add a new Role");
    addRouter.addRole();
}
else if(actionChosen === "Add Employee"){
    console.log("You selected add a new Employee");
    addRouter.addNewEmp();
}else if(actionChosen === "Update Employee Role"){
    console.log("You selected to update Employee Role");
    updateRouter.uptNewEmp();
}

}

/*router.get('/emp',(req,res) =>{

res.send('Welcome to Employee Router');
});*/


module.exports = {callHomeScreen};

