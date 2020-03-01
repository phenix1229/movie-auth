const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name:{type:String, default:'', lowercase:true, trim:true},
    email:{type:String, default:'', unique:true, lowercase:true, trim:true},
    password:{type:String, default:'', trim:true}
});

module.exports = mongoose.model('users', UserSchema);