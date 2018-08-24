const express = require('express');
const router = express.Router();
const passport = require('passport');

//bringing user rmodel

let User = require('../modals/user');


//bcrypt

const bcrypt = require('bcryptjs');


//register form
router.get('/register', (req, res) => 
{
    if(req.isAuthenticated())
    {
        res.redirect('/');
    }
    else{
         res.render('registration')
    }
   

});

//Register User Process

router.post('/register', (req, res) => {
    const name = req.body.name;
    const email = req.body.email;
    const username = req.body.username;
    const password = req.body.password;
    const password2 = req.body.password2;

    req.checkBody('name', 'Name is required').notEmpty();
    req.checkBody('email', 'Email is required').notEmpty();
    req.checkBody('username', 'Username is required').notEmpty();
    req.checkBody('password', 'Password is required').notEmpty();
    req.checkBody('password2', 'Please Confirm Password').notEmpty();
    req.checkBody('password2', 'Passwords Do Not Match').equals(req.body.password);

    let errors = req.validationErrors();
    if (errors) {
        res.render('registration', 
        {
            errors: errors
        });

    } else {
        let newUser = new User({
            name: name,
            email: email,
            username: username,
            password: password
        });

        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(newUser.password, salt, (err, hash) => {
                if (err) {
                    console.log(err);

                } else {
                    newUser.password = hash;
                    newUser.save((err) => {
                        if (err) {
                            console.log(err);
                            return;

                        } else {
                            req.flash('success', 'Successfully Registered! Login')
                            res.redirect('/users/login');
                        }

                    })
                }

            });
        });
    }
});

//login form
router.get('/login',(req, res)=>
{
    if(req.isAuthenticated())
    {
        res.redirect('/');
    }
    else{
        res.render('login');

    }
    


});


//login process

router.post('/login',(req, res, next)=>
{
    passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/users/login',
        failureFlash: true
    })(req, res, next);
});


//Logout process
router.get('/logout', (req, res)=>
{
    req.logOut();
    req.flash('success','You are Logged Out');
    res.redirect('/users/login');
})





module.exports = router;