const { default: mongoose } = require('mongoose');
//const mongoose = require('mongoose');


const UserSchema = new mongoose.Schema({
    displayName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    spotify_ID : {type:String, required: true, unique:true},
    profileImage : {type:String}
  });