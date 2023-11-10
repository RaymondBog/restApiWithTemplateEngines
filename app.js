const express = require('express');
const mongoose = require('mongoose');
const app = express();
app.set('view engine', 'ejs');
const Book = require('./model/bookModel');
app.use(express.static('public'));



port = process.env.PORT || 3000
const bookRouter = express.Router();
mongoose.connect('mongodb://127.0.0.1:27017/booksApi', { 
        useNewUrlParser: true, 
        useUnifiedTopology: true
});


bookRouter.route('/books').get(async (req, res) => {
    try {
        const books = await Book.find();
        res.render('./index', {books} )
    } catch (err) {
         res.status(500).send(err);
    }
 });
 app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/styles.css');
});

app.use('/api', bookRouter);

app.get('/',(req,res) =>{
    res.send('my first restful api')
})

app.listen(port, () =>{
    console.log('app listening at port ' + port);
});