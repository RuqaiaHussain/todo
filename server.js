
const express = require('express');
const app = express();
 
var userdata = require('./src/User');
var taskdata = require('./src/Task');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Import my test routes into the path '/test'
 
app.use('/user', userdata);
app.use('/task', taskdata);


const port = process.env.port || 8080;
app.listen(port, () => {
    console.log(`server is running on port ${port}.`);
})