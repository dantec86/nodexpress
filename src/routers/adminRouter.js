const express = require('express');
const debug = require('debug')('app:adminRouter');
const {MongoClient} = require('mongodb');
const sessions = require('../data/sessions.json');

const adminRouter = express.Router();

adminRouter.route('/').get((req, res) => {
    const url = "mongodb+srv://admin:G5fgwSHYPlPs9PIz@cluster0.jjgah.mongodb.net?retryWrites=true&w=majority";
    const dbName = 'nodexpress';

    (async function mongo() {
        let client;
        try {
            client = await MongoClient.connect(url);
            debug('connected to the DB');

            const db = client.db(dbName);

            const response = await db.collection("sessions").insertMany(sessions);

            res.json(response);

        } catch (error) {
            debug(error.stack);
        }
    }());
});

module.exports = adminRouter;