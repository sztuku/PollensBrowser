const express = require('express');
const {Client} = require("pg");
const router = express.Router();


const client = new Client({
    user: 'user',
    host: 'postgres',
    database: 'db',
    password: 'pass',
    port: 5432
});

router.get('/',(req,res)=>
{
    res.render('register');
});

router.post('/', async (req, res) => {
    const name = req.body.name;
    const password = req.body.password;

    if (!name || !password) {
        return  res.send({error:true});
        // return  res.render('register',{error:true});
    }

    try {
        client.connect();
        const select = `select * from  users where name=$1;`;
        await client.query(select,[name])
        const insert = `INSERT INTO users (name, password) VALUES ($1,$2);`;
        const insert_pollens = `INSERT INTO pollens (name, Alder) VALUES ($1,$2)`;
        await client.query(insert,[name,password])
        await client.query(insert_pollens,[name,'f'])
        req.session.user = name;
        res.send({error:false,userName:name})
        // res.redirect("/picker")
    } catch (error) {
        console.error('Error during registration', error);
        // res.render('welcome',{error:true});
        return  res.send({error:true});
        // return res.status(500).send('Error logging in');
    }
});

module.exports = router;
