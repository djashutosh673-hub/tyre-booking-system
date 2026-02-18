const db = require('../config/db');

exports.login = async (req,res)=>{
    const { email, password } = req.body;

    const user = await db.query(
        'SELECT * FROM users WHERE email=$1',
        [email]
    );

    if(user.rows.length === 0){
        return res.json({message:"User not found"});
    }

    res.json({message:"Login Success"});
};
