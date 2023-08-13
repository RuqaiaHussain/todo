
var express = require('express'),
    router = express.Router();

const admin = require("firebase-admin");
const credentials = require("../key.json");
var jwt = require('jsonwebtoken');
const crypto = require('crypto');

const db = admin.firestore();
const collection = db.collection("tasks");
module.exports = router;
router.get('/', async (req, res) => {
    try {
        const translations = [];
        const snapshot = await collection.get();
        snapshot.forEach(doc => {
            translations.push(doc.data());
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
        collection.doc(newIdRef.id).set(newIdRef)
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


router.get('/:User', async (req, res) => {
    try {
        console.log(req?.params);
        const User = req?.params?.User
        console.log(User);
        const translations = [];
        const snapshot = await collection.get();
        if (snapshot.empty) {
            console.log('No matching documents.');
            const response = {
                code: 404,
                message: 'No matching documents.'
            };
            res.json(response);
        } else {
            snapshot.forEach(doc => {
                if (doc.data().User == User) translations.push(doc.data());
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


router.post('/createBytoken/:token', async (req, res) => {
    try {
        // console.log(req.body);
        const token = req?.params?.token;
        //

        console.log(token) // bar

        jwt.verify(token, 'Ruqaya♥', function (err, decoded) {
            console.log(decoded) // bar

            const newIdRef = ({
                id: crypto.randomUUID(),
                nameTask: req.body.nameTask,
                discription: req.body.discription,
                dateCrated: req.body.dateCrated,
                dateComplete: req.body.dateComplete,
                reminder: req.body.reminder,
                User: decoded.data.email
            });
            console.log(newIdRef)

            collection.doc(newIdRef.id).set(newIdRef)
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
router.get('/taskBytoken/:token', async (req, res) => {
    try {
        console.log(req?.params);
        const User = req?.params?.User
        console.log(User);
        const translations = [];
        const snapshot = await collection.get();
        if (snapshot.empty) {
            console.log('No matching documents.');
            const response = {
                code: 404,
                message: 'No matching documents.'
            };
            res.json(response);
        } else {
            snapshot.forEach(doc => {
                if (doc.data().User == User) translations.push(doc.data());
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
router.post('/Update/:id', async (req, res) => {
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
        collection.doc(newIdRef.id).update(newIdRef)
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

router.delete('/Delete/:id', async (req, res) => {
    try {

        collection.doc(req.params.id).delete()
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