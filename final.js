const { response } = require('express');
const express = require('express');
const app = express();

const admin = require("firebase-admin");
const credentials = require("./key.json");
var jwt = require('jsonwebtoken');
const crypto = require('crypto');
admin.initializeApp({
    credential: admin.credential.cert(credentials)
});
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const port = process.env.port || 8080;
app.listen(port, () => {
    console.log(`server is running on port ${port}.`);
})
const db = admin.firestore();

// create user 
app.post('/UserCreate', async (req, res) => {
    try {
        console.log(req.body);
        const email = req.body.email;
        const userJson = {
            email: req.body.email,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            phoneNum: req.body.phoneNum
        };
        db.collection("users").doc(email).set(userJson)
            .then((data) => {
                const response = {
                    code: 200,
                    message: `the User ${email} created successfully!`
                };
                res.json(response);
            })
            .catch((data) => {
                const response = {
                    code: 400,
                    message: `the User ${email} not created!`
                };
                res.json(response);
            });

    }
    catch (error) {
        const response = {
            code: 500,
            message: `the User ${email} not created!`
        };
        res.json(response);
    }
});

app.get('/Getusers', async (req, res) => {
    try {

        const translations = [];
        const citiesRef = db.collection('users');
        const snapshot = await citiesRef.get();
        snapshot.forEach(doc => {
            translations.push( doc.data());
            console.log(translations);
        }); 
        const response = {
            code: 200,
            message: translations
        };
        //res.json(response);
        res.json(response);
    }
    catch (error) {
        console.log(error);
        const response = {
            code: 500,
            message: error
        };
        res.json(response);
    }
});

app.post('/UserUpdate/:email', async (req, res) => {
    try {
        console.log(req?.params?.email);
        const email = req?.params?.email;

        const userJson = {
            email: req.body.email,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            phoneNum: req.body.phoneNum
        };

        db.collection("users").doc(email).update(userJson)
            .then((data) => {
                const response = {
                    code: 200,
                    message: `the User ${email} updated successfully!`
                };
                res.json(response);
            })
            .catch((data) => {
                const response = {
                    code: 400,
                    message: `the User ${email} not update!`
                };
                res.json(response);
            }); // add

    }
    catch (error) {
        const response = {
            code: 500,
            message: `the User ${email} not created!`
        };
        res.json(response);
    }
});

app.delete('/UserDelete/:email', async (req, res) => {
    try {

        db.collection("users").doc(req.params.email).delete()
            .then((data) => {
                const response = {
                    code: 200,
                    message: `the User ${req.params.email} delete successfully!`
                };
                res.json(response);
            })
            .catch((data) => {
                const response = {
                    code: 400,
                    message: `the User ${req.params.email} not delete!`
                };
                res.json(response);
            });

    }
    catch (error) {
        const response = {
            code: 500,
            message: `the User ${req.params.email} not delete!`
        };
        res.json(response);
    }
});

app.post('/UserToken', async (req, res) => {
    try {
        console.log(req.body);
        const userJson = {
            email: req.body.email,
            password: req.body.password,
        };
        const token = jwt.sign({
            data: userJson
        }, 'secret', { expiresIn: '1h' })


        const response = {
            code: 200,
            token: token
        };
        res.json(response);


    }
    catch (error) {
        console.log(error);

        const response = {
            code: 500,
            message: `Internal Error!`
        };
        res.json(response);
    }
});

app.post('/UserTokenVarify', async (req, res) => {
    try {
        console.log(req.body);

        token = req?.body?.token


        jwt.verify(token, 'secret', function (err, decoded) {
            console.log(decoded) // bar
            const response = {
                code: 200,
                decoded: decoded
            };
            res.json(decoded);

        });



    }
    catch (error) {
        console.log(error);

        const response = {
            code: 500,
            message: `Internal Error!`
        };
        res.json(response);
    }
});

// create task
app.post('/TaskCreate', async (req, res) => {
    try {
        console.log(req.body);

//




        const newIdRef = ({
            id: crypto.randomUUID(),
            nameTask: req.body.nameTask,
            discription: req.body.discription,
            dateCrated: req.body.dateCrated,
            dateComplete: req.body.dateComplete,
            reminder: req.body.reminder,
            User: req.body.User
        });
        db.collection("tasks").doc(newIdRef.id).set(newIdRef)
            .then((data) => {
                const response = {
                    code: 200,
                    message: `the Task ${newIdRef.id} created successfully!`
                };
                res.json(response);
            })
            .catch((data) => {
                const response = {
                    code: 400,
                    message: `the Task ${newIdRef.id} not created!`
                };
                res.json(response);
            });

    }
    catch (error) {
        const response = {
            code: 500,
            message: `the Task not created!`
        };
        res.json(response);
    }
});

app.get('/GetTasks', async (req, res) => {
    try {

        const translations = [];
        const citiesRef = db.collection('tasks');
        const snapshot = await citiesRef.get();
        snapshot.forEach(doc => {
            translations.push( doc.data()); 
        }); 
        const response = {
            code: 200,
            message: translations
        };
        //res.json(response);
        res.json(response);
    }
    catch (error) {
        console.log(error);
        const response = {
            code: 500,
            message: error
        };
        res.json(response);
    }
});
 
app.get('/GetTasksuser/:User', async (req, res) => {
    try {
        console.log(req?.params); 
        const User=req?.params?.User
        console.log(User);
          const translations = [];
        const citiesRef = db.collection('tasks');
       // const snapshot = await citiesRef.where('User', '==', ' ٍZainab@123.com').get();
       const snapshot = await citiesRef.get();
        if (snapshot.empty) {
            console.log('No matching documents.');
            const response = {
                code: 404,
                message: 'No matching documents.'
            };
            res.json(response); 
        }else{
            snapshot.forEach(doc => {
                if  (doc.data().User==User)  translations.push(doc.data());
            });
            const response = {
                code: 200,
                message: translations
            };
            //res.json(response);
            res.json(response);
        }
      
    }
    catch (error) {
        console.log(error);
        const response = {
            code: 500,
            message: error
        };
        res.json(response);
    }
});

app.post('/TaskUpdate/:id', async (req, res) => {
    try {
        console.log(req.params.id);
        const id = req?.params?.id;

        const newIdRef = ({
            id: id,
            nameTask: req.body.nameTask,
            discription: req.body.discription,
            dateCrated: req.body.dateCrated,
            dateComplete: req.body.dateComplete,
            reminder: req.body.reminder,
            User: req.body.User
        });
        db.collection("tasks").doc(newIdRef.id).update(newIdRef)
            .then((data) => {
                const response = { 
                    code: 200,
                    message: `the Task ${newIdRef.id} update successfully!`
                };
                res.json(response);
            })
            .catch((data) => {
                const response = {
                    code: 400,
                    message: `the Task ${newIdRef.id} not update!`
                };
                res.json(response);
            });

    }
    catch (error) {
        const response = {
            code: 500,
            message: `the Task not update!`
        };
        res.json(response);
    }
});

app.delete('/TaskDelete/:id', async (req, res) => {
    try {

        db.collection("tasks").doc(req.params.id).delete()
            .then((data) => {
                const response = {
                    code: 200,
                    message: `the tasks ${req.params.id} delete successfully!`
                };
                res.json(response);
            })
            .catch((data) => {
                const response = {
                    code: 400,
                    message: `the tasks ${req.params.id} not delete!`
                };
                res.json(response);
            });

    }
    catch (error) {
        const response = {
            code: 500,
            message: `the tasks ${req.params.id2} not delete!`
        };
        res.json(response);
    }
});