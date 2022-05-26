const express = require('express');
const inquirer = require('inquirer');
const chalk = require('chalk');

const tbData = require('console.table');
//const router = require('express').Router();
//const empData = require('../services/data');


const addRouter = require('../services/addData');
const updateRouter = require('../services/updateData');
const deleteRouter = require('../services/deleteData');
const viewRouter = require('../services/viewData');
const res = require('express/lib/response');

//const { resolve } = require('promise');
//const { home } = require('nodemon/lib/utils');

async function callHomeScreen(){
    console.log(chalk.blue('*******************'));
    console.log(chalk.blue('*EMPLOYEE DATABASE*')); 
    console.log(chalk.blue('*******************'));
   

    let homeScreenQ = await inquirer.prompt([{
          type:"list",
          name:"qList",
          message:"What would you like to do?",
          choices:["Add Employee","Update Employee Role","View All Employees","View All Roles","Add Role","View All Departments","Add Department","View Employees by Manager","Total Utilized budget by Department","Quit"]

    }]);

//console.log(homeScreenQ.qList);

let actionChosen = homeScreenQ.qList;

if (actionChosen === "Quit"){
    
    console.log("Bye");
    process.exit(0);
}else if(actionChosen === "Add Department"){
    console.log("You selected to add a new Department");
    let s = addRouter.addDept();
    s.then((result) =>{
        console.log("#of new records added: "+result[0].affectedRows+".   New Dept ID: "+result[0].insertId);
        callHomeScreen();
    }).catch((result) =>{
        console.error(result.message);
        callHomeScreen();
    });
    

}else if(actionChosen === "View All Departments"){
    console.log("You selected to view all Departments");
    let s = viewRouter.viewDept();
    s.then((result) =>{
        console.table(result);
        callHomeScreen();
    }).catch((result) =>{
        console.error(result.message);
        callHomeScreen();
    });
    
}else if(actionChosen === "View All Roles"){
    console.log("You selected view all Roles");
   let s =  viewRouter.viewRoles();
   s.then((result) =>{
       console.table(result);
       callHomeScreen();
   }).catch((result)=>{
    console.error(result.message);
    callHomeScreen();
   })
    
   
}else if(actionChosen === "View All Employees"){
    console.log("You selected to view all Employees");
    let s = viewRouter.viewEmp();
s.then((result)=>{
    console.table(result);
    callHomeScreen();
}).catch((result) =>{
    console.error(result.message);
    callHomeScreen();
});


}else if(actionChosen === "Add Role"){
    console.log("You selected add a new Role");
    var selectDept ="";
   let s =  addRouter.getDept();
   s.then((result)=>{
             let p = addRouter.promptDept(result);
             p.then((result) =>{
                let r = addRouter.addRole(result);
                r.then((result)=>{
                    let finalCall = addRouter.addNewRole(result[0],result[1],result[2]);
                    finalCall.then((result)=>{

                        console.log("New Role is successfully added");
                        callHomeScreen();
                    }).catch((result) =>{
                        console.log(result.message);
                        callHomeScreen();
                    })
                   
                }).catch((result)=>{
                    console.log(result);
                    callHomeScreen();
                })
                    
                }).catch((result)=>{
                     console.log(result.message);
                     callHomeScreen();
                })
   }).catch((result)=>{
       console.log(result.message);
       callHomeScreen();
   })
}
else if(actionChosen === "Add Employee"){
    console.log("You selected add a new Employee");
    let s = addRouter.getDept();
    s.then((result)=>{
       
        let p = addRouter.promptDept(result);
        p.then((result) =>{
            //console.log(result);
            var nameDept = result;
            let s = addRouter.getRole(result);
            s.then((result)=>{
               //console.log(result);
               let r = addRouter.promptRole(result);
               r.then((result)=>{
                   //console.log(result);
                   var nameRole = result;
                   let q = addRouter.getMgr(nameDept);
                   q.then((result)=>{
                       //console.log(result);
                       let a = addRouter.promptMgr(result);
                       a.then((result)=>{
                           //console.log(result);
                           var  nameMgr = result;
                           let b = addRouter.promptfnamelname(nameDept,nameRole,nameMgr);
                           b.then((result)=>{
                              // console.log(result);
                              let c = addRouter.addEmp(result[0],result[1],result[2],result[3],result[4]);
                              c.then((result)=>{
                                 console.log("New Employee added successfully");
                                callHomeScreen();
                              }).catch((result)=>{
                                  console.log(result.message);
                                  callHomeScreen();
                              })
                           }).catch((result)=>{
                               console.log(result);
                               callHomeScreen();
                           })
                       }).catch((result)=>{
                           console.log(result);
                           callHomeScreen();
                       })
                   }).catch((result)=>{
                       console.log(result);
                       callHomeScreen();
                   })
               }).catch((result)=>{
                   console.log(result);
                   callHomeScreen();
               })
            }).catch((result)=>{
                console.log(result);
                callHomeScreen();
            })
            
        }).catch((result)=>{
                 console.log(result);
                 callHomeScreen();
        })
    }).catch((result)=>{
        console.log(result);
        callHomeScreen();
    })
       
}else if(actionChosen === "Update Employee Role"){
    console.log("You selected to update Employee Role");
    updateRouter.uptNewEmp();
    callHomeScreen();
}

else if(actionChosen === "View Employees by Manager"){
    console.log("You selected to view employees by manager");
    let s = addRouter.getMgrAll();
    s.then((result)=>{
        let w = addRouter.promptMgr(result);
        w.then((result) =>{
               let p = viewRouter.viewEmpByMgr(result);
               p.then((result)=>{
                   console.table(result);
                   callHomeScreen();
               }).catch((result)=>{
                   console.log(result);
                   callHomeScreen();
               })
        }).catch((result)=>{
            console.log(result);
            callHomeScreen();
        })
    }).catch((result)=>{
        console.log(result);
        callHomeScreen();
    })
}

else if(actionChosen === "Total Utilized budget by Department"){
    console.log("You selected to view total budget by department");
   let s = addRouter.getDept();
   s.then((result)=>{
       let p = addRouter.promptDept(result);
       p.then((result)=>{
           let r = viewRouter.viewBudgetDept(result);
           r.then((result)=>{
               console.table(result);
               callHomeScreen();
           }).catch((result)=>{
               console.log(result);
               callHomeScreen();
           })
       }).catch((result)=>{
           console.log(result);
           callHomeScreen();
       })

   }).catch((result)=>{
       console.log(result);
       callHomeScreen();
   })
}

}

/*router.get('/emp',(req,res) =>{

res.send('Welcome to Employee Router');
});*/

//callHomeScreen();
module.exports = {callHomeScreen};

