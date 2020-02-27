const mongoose = require('mongoose');

//create new schema for movies
const movieSchema = new mongoose.Schema({
    title:{type:String, unique:true, default:'', lowercase:true},
    rating:{type:String, default:'', lowercase:true},
    synopsis:{type:String, default:'', lowercase:true},
    releaseYear:{type:String, default:'', lowercase:true},
    genre:{type:String, default:'', lowercase:true},
    director:{type:String, default:'', lowercase:true},
    boxOffice:{type:String, default:'', lowercase:true},
});

module.exports = mongoose.model('movies', movieSchema);