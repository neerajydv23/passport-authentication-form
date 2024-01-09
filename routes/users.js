const mongoose = require('mongoose');
var plm = require('passport-local-mongoose');

mongoose.connect("mongodb://127.0.0.1:27017/QuantumIT");

const userSchema = mongoose.Schema({
  username:{
    type:String,
    unique:true
  },
  name:{
    type:String,
  },
  email:{
    type:String,
    unique:true
  },
  password:{
    type:String,
  },
  dateOfBirth: {
    type: Date,
  },
});

userSchema.plugin(plm);

module.exports=mongoose.model("user",userSchema);
