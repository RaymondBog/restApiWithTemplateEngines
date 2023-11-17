const mongoose = require('mongoose');

const {Schema} = mongoose;

const bookSchema = new Schema(
    {
        email: {type:String},
        genre: {type:String},
        author:{type:String},
        read:  {type:Boolean, default : false},
    }
);

module.exports = mongoose.model('Book', bookSchema);