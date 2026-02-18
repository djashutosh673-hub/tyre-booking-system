const express = require('express');
const router = express.Router();

// Show login page
router.get('/login', (req, res) => {
    res.render('login');
});

// Handle login submit
router.post('/login', (req, res) => {

    const { username, password } = req.body;

    // SIMPLE LOGIN CHECK
    if (username === "admin" && password === "1234") {

        req.session.user = username;

        res.json({ success: true });

    } else {

        res.json({ success: false, message: "Invalid login" });

    }
});

module.exports = router;
