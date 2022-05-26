const express = require('express');
const PORT = process.env.PORT || 3001;
const apiRouter = require('./routes/index');
//const chalk = require('chalk');


const app = express();

app.use(express.json());
app.use(express.urlencoded({extended:true}));
//app.use(apiRouter);

app.get('/', (req,res) =>{
   res.send('');
})

//app.use('/api',apiRouter);


app.listen(PORT,() =>{

  console.log(``);
});

apiRouter.callHomeScreen();

