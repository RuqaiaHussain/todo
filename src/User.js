
var express = require('express'),
router = express.Router();

const admin = require("firebase-admin");
const credentials = require("../key.json");
var jwt = require('jsonwebtoken');
const crypto = require('crypto');
admin.initializeApp({
    credential: admin.credential.cert(credentials)
});
const db = admin.firestore();
const collection =db.collection("users");
module.exports = router;
router.get('/', async (req, res) => {
    try {
        const translations = []; 
        const snapshot = await collection.get();
        snapshot.forEach(doc => {
            translations.push( doc.data());
            console.log(translations);
        }); 
        const response = {
            code: 200,
            message: translations
        };
       
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

router.post('/Create', async (req, res) => {
    try {
        console.log(req.body);
        const email = req.body.email;
        const userJson = {
            email: req.body.email,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            phoneNum: req.body.phoneNum
        };
        collection.doc(email).set(userJson)
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

router.post('/Update/:email', async (req, res) => {
    try {
        console.log(req?.params?.email);
        const email = req?.params?.email;

        const userJson = {
            email: req.body.email,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            phoneNum: req.body.phoneNum
        };

        collection.doc(email).update(userJson)
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

router.delete('/Delete/:email', async (req, res) => {
    try {

        collection.doc(req.params.email).delete()
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
        let l = 10 ;
    }
});

router.post('/Token', async (req, res) => {
    try {
        console.log(req.body);
        const userJson = {
            email: req.body.email,
            password: req.body.password,
        };
        const token = jwt.sign({
            data: userJson
        }, 'Ruqaya♥', { expiresIn: '1h' })


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

router.post('/TokenVarify', async (req, res) => {
    try {
        console.log(req.body); 
        token = req?.body?.token 
        jwt.verify(token, 'Ruqaya♥', function (err, decoded) {
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