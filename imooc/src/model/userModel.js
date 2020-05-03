const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    us: {type:String,require:true},
    ps: {type:String,require:true},
    age: Number,
    sex: {type:Number,default:0}
});

const User = mongoose.model('users', userSchema);

module.exports = User;