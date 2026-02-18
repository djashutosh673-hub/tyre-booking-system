const express = require('express');
const router = express.Router();

// Show login page
router.get('/login', (req, res) => {
    res.render('login'); // login.ejs or login.html
});

// Handle login submit
router.post('/login', (req, res) => {

    const { username, password } = req.body;

    // SIMPLE LOGIN CHECK (later connect database)
    if(username === "admin" && password === "1234"){

        req.session.user = username; // save login session

        res.redirect('/'); // go to booking page

    } else {
        res.send("Invalid login");
    }
});

module.exports = router;
