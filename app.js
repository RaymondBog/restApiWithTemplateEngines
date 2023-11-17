const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const session = require('express-session');
const bcrypt = require('bcrypt')
const Book = require('./model/Book');
const User = require('./model/User');

const app = express();
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }))
app.use(session({secret: "Your secret key"}));

mongoose.connect('mongodb://127.0.0.1:27017/booksApi', { 
        useNewUrlParser: true, 
        useUnifiedTopology: true
});

function checkSignIn(req, res,next){
    if(req.session.user){
       next();     //If session exists, proceed to page
    } else {
       return res.redirect('/login')
    }
 }

app.get('/', checkSignIn, (async (req, res,next) => {
    try {
        const books = await Book.find();
        return res.render('./index', {books} )
    } catch (err) {
        return res.status(500).send(err);
    }
}));

app.get('/books/:id', checkSignIn, (async (req, res, next) => {
    try {
        let id = req.params.id;
        const book = await Book.findById({'_id': id});
        return res.render('./bookDetails', {book} )
    } catch (err) {
        return res.status(500).send(err);
    }
}));

app.get('/form', (req, res) => {
    res.render('bookform');
});

app.post('/save', (req, res) => {
    Book.create(req.body)
    .then((result) => {
        res.redirect('/api/books')
    })
    .catch((err) => {
    })
});

app.get("/register", (req, res) => {
    res.render("register")
})

app.get("/login", (req, res) => {
    res.render("login")
})

app.post("/register", async (req, res) => { 
    const { name, email, password, password_confirm } = req.body
    let user = await User.findOne({'email': email});
    if( !user ) { 
        if(password !== password_confirm) {
            return res.render('register', {
                message: 'Password Didn\'t Match!'
            })
        }
        let hashedPassword = await bcrypt.hash(password, 8)
        await User.create({name, email, password: hashedPassword})
        return res.redirect('/login')
    }else{
        return res.render('register', {
            message: 'This email is already in use'
        })
    }
})

app.post('/login', async(req, res) => {
  const { email, password } = req.body
  if( !email || !password ) {
   return  res.render('login', ({message: "Kindly provide your email or password"}));
  }
  const user = await User.findOne({'email': email})
  if(user){
    let isUser = await bcrypt.compare(password, user.password)
    if(isUser){
        req.session.user = user;
        return res.redirect('/')
    }
  }
  return res.render('login', ({message: "Account does not exist, make sure to create an account"}))
});

const PORT = process.env.PORT || 3000

app.listen(PORT, () =>{
    console.log('app listening at port ' + PORT);
});