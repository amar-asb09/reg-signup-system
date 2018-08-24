let mongoose = require('mongoose');


//articel schema
let articleschema = mongoose.Schema({
    title: 
    {
        type: String,
        required: true

    },
    author:{
        type: String,
        required: true
    },
    body: {
        type: String,
        required: true
    }
});


let article = module.exports = mongoose.model('Article', articleschema);