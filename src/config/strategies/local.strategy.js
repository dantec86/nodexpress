const passport = require('passport');
const {Strategy} = require('passport-local');
const {MongoClient} = require('mongodb');
const debug = require('debug')('app:localStrategy');
module.exports = function localStrategy() {
    passport.use(
        new Strategy(
            {
                usernameField: 'username',
                passwordField: 'password'
            },
            (username, password, done) => {
                const url = "mongodb+srv://admin:G5fgwSHYPlPs9PIz@cluster0.jjgah.mongodb.net?retryWrites=true&w=majority";
                const dbName = 'nodexpress';

                (async function validateUser(){
                    let client;
                    try{
                        client = await MongoClient.connect(url);
                        debug('connected to the DB');

                        const db = client.db(dbName);

                        const user = await db.collection('users').findOne({username});

                        if(user && user.password === password){
                            done(null,user);
                        }
                        else{
                            done(null,false);
                        }
                    }catch(error){
                        done(error, false);
                    }
                }())
            }
        )
    );
};