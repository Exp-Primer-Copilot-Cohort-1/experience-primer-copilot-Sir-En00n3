//Create web server
const express = require('express');
const app = express();
const port = 3000;
const path = require('path');
const router = express.Router();
const bodyParser = require('body-parser');
const mysql = require('mysql');
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '123456',
    database: 'comments'
});

//Connect to database
connection.connect(function (err) {
    if (err) throw err;
    console.log("Connected!");
});

//View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//Body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//Set static path
app.use(express.static(path.join(__dirname, 'public')));

//Show all comments
app.get('/', (req, res) => {
    let sql = 'SELECT * FROM comment';
    let query = connection.query(sql, (err, rows) => {
        if (err) throw err;
        res.render('comment_index', {
            title: 'Comments',
            comments: rows
        });
    });
});

//Show single comment
app.get('/show/:id', (req, res) => {
    let sql = `SELECT * FROM comment WHERE id = ${req.params.id}`;
    let query = connection.query(sql, (err, result) => {
        if (err) throw err;
        res.render('comment_show', {
            title: 'Comment Details',
            comment: result[0]
        });
    });
});

//Add new comment
app.get('/add', (req, res) => {
    res.render('comment_add', {
        title: 'Add New Comment'
    });
});

//Save comment
app.post('/save', (req, res) => {
    let data = {
        name: req.body.name,
        comment: req.body.comment
    };
    let sql = "INSERT INTO comment SET ?";
    let query = connection.query(sql, data, (err, results) => {
        if (err) throw err;
        res.redirect('/');
    });
});

//Edit comment
app.get('/edit/:id', (req, res) => {
    const commentId = req.params.id;
    let sql = `SELECT * FROM comment WHERE id = ${commentId}`;
    let query = connection.query(sql, (err, result) => {
        if (err)