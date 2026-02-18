const express = require('express');
const router = express.Router();

// Show login page
router.get('/login', (req, res) => {
    res.render('login');
});

// Handle login submit
router.post('/login', (req, res) => {

    const { email, password } = req.body;

    // SIMPLE LOGIN CHECK
    if (email === "djashutosh673@gmail.com" && password === "1234") {

        req.session.user = email;

        res.json({
            success: true,
            message: "Login successful"
        });

    } else {

        res.json({
            success: false,
            message: "Invalid login"
        });

    }
});

module.exports = router;
