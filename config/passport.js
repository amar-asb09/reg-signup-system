const LocalStrategy = require('passport-local').Strategy;

const User = require('../modals/user');

const databaseConfig = require('../config/database');
const bcrypt = require('bcryptjs');

module.exports = (passport) => {
    //local strategy
    passport.use(new LocalStrategy((username, password, done) => {
        // match credentials

        let query = {username: username};
        User.findOne(query, (err, user) => {
            if (err) {
                throw err;

            }
            if (!user) {
                return done(null, false, {
                    message: 'Invalid Username!'
                })

            }
            // match password
            bcrypt.compare(password, user.password, (err, isMatch) => {

                if (err) {
                    throw err;

                }
                if (isMatch) {
                    return done(null, user);
                } else {
                    return done(null, false, {
                        message: 'Invalid Password !'
                    })
                }

            });
        });
    }));

    passport.serializeUser((user, done)=> {
        done(null, user.id);
    });

    passport.deserializeUser((id, done)=> {
        User.findById(id,(err, user)=> {
            done(err, user);
        });
    });

};