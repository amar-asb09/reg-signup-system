const express = require('express');
const router = express.Router();


//adding Databse Article modal
let Article = require('../modals/article');
//adding Databse User modal
let User = require('../modals/user');






//Single article edit route
router.get('/Edit/:id', ensureAuthenticated, (req, res) => {
    Article.findById(req.params.id, (err, article) => {
        if (article.author != req.user._id) {
            req.flash('danger', 'Not Authorized')
            res.redirect('/');
        }
        res.render('single_article_edit', {
            title: 'Edit This Article',
            article: article
        })

    })

})




//Adding route
router.get('/add', ensureAuthenticated, (req, res) => {
    res.render('add_article', {
        title: 'Add Atricle'
    })

});

// Add SUBMIT post Route
router.post('/add', (req, res) => {
    /*console.log('Submitted..........')
    return; */

    req.checkBody('title', 'Title is Required').notEmpty();
    //req.checkBody('author', 'Author is Required').notEmpty();
    req.checkBody('body', 'Body is Required').notEmpty();

    let errors = req.validationErrors();
    if (errors) {
        res.render('add_article', {
            title: 'Add Article',
            errors: errors
        });

    } else {
        let article = new Article();
        article.title = req.body.title;
        article.author = req.user._id;
        article.body = req.body.body;

        article.save((err) => {
            if (err) {
                console.log(err)
                return;
            } else {
                req.flash('success', 'Article Added Successfully..')
                res.redirect('/');
            }
        });

    }
});

// Update Article Route
router.post('/Edit/:id', ensureAuthenticated, (req, res) => {
    /*console.log('Submitted..........')
    return; */
    let article = {};
    article.title = req.body.title;
    article.author = req.user._id;
    article.body = req.body.body;
    let query = {
        _id: req.params.id
    }
    Article.update(query, article, (err) => {
        if (err) {
            console.log(err)
            return;
        } else {
            req.flash('success', 'Updated Successfully....')
            res.redirect('/');
        }
    });
});


router.delete('/:id', (req, res) => {
    let query = {
        _id: req.params.id
    }
    Article.remove(query, (err) => {
        if (err) {
            console.log(err);

        } else {
            res.send('Success !');
        }


    });
});

//get single  Article Route
router.get('/:id', (req, res) => {
    Article.findById(req.params.id, (err, article) => {
        User.findById(article.author, (err, user) => {
            res.render('single_article', {
                article: article,
                author: user.name
            })
        });
    })
})


//access control

function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    } else {
        req.flash('danger', 'Please Log-In First');
        res.redirect('/users/login');
    }

}
module.exports = router;