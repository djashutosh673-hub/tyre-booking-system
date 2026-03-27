const mysql = require('mysql2');

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '', // put your MySQL password here
    database: 'tyre_service'
});

db.connect((err) => {
    if (err) {
        console.error('❌ MySQL Connection Failed:', err);
    } else {
        console.log('✅ MySQL Connected');
    }
});

module.exports = db;