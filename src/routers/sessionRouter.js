const express = require('express');
const debug = require('debug')('app:sessionRouter');
const {MongoClient, ObjectID} = require('mongodb');
const sessions = require('../data/sessions.json');
const speakerService = require('../services/speakerService');

const sessionRouter = express.Router();
sessionRouter.use((req,res,next)=>{
   if(req.user){
       next();
   } else{
       res.redirect('/auth/signIn');
   }
});
sessionRouter.route('/')
    .get((req, res) => {
        const url = "mongodb+srv://admin:G5fgwSHYPlPs9PIz@cluster0.jjgah.mongodb.net?retryWrites=true&w=majority";
        const dbName = 'nodexpress';

        (async function mongo() {
            let client;
            try {
                    client = await MongoClient.connect(url);
                    debug('connected to the DB');

                    const db = client.db(dbName);

                const sessions = await db.collection("sessions").find().toArray();

                res.render('sessions', {
                    sessions,
                });

            } catch (error) {
                debug(error.stack);
            }
        }());


    });

sessionRouter.route('/:id')
    .get((req, res) => {
        const id = req.params.id;
        const url = "mongodb+srv://admin:G5fgwSHYPlPs9PIz@cluster0.jjgah.mongodb.net?retryWrites=true&w=majority";
        const dbName = 'nodexpress';

        (async function mongo() {
            let client;
            try {
                client = await MongoClient.connect(url);
                debug('connected to the DB');

                const db = client.db(dbName);

                const session = await db.collection("sessions").findOne({_id: new ObjectID(id)});

                const speaker = await speakerService.getSpeakerById(session.speakers[0].id);
                session.speaker = speaker.data;
                res.render('session', {
                    session,
                });

            } catch (error) {
                debug(error.stack);
            }
        }());
    });

module.exports = sessionRouter;