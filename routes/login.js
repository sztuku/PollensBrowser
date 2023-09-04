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

    req.session.destroy((err) => {
        if (err) {
            console.error('Error destroying session', err);
            return res.status(500).send('Error logging out');
        }
        res.render('welcome');
    });


});

router.post('/', async (req, res) => {
    const name = req.body.name;
    const password = req.body.password;

    console.log("proba zalowgoawnia "+name+" + "+password)


    if (!name || !password) {
        return res.render('welcome',{error:true});

    }

    try {
        client.connect();


        const select = `select * from  users where name=$1;`;
        const q = await client.query(select,[name])

        if (q.rows[0]["password"]!==password)
        {
            return res.render('welcome',{error:true});
        }

        console.log(q.rows[0]["name"])
        req.session.user = q.rows[0]["name"];

        // res.render('index',{cityName:null,trees:null});
        // res.redirect("/")
        // res.render('index', { user: req.session.user,cityName:null,trees:null });
        // res.render('index',{cityName:null,trees:null,weeds:null,grass:null});
        // res.redirect('/')
        // res.status(200).send({cityName:null,trees:null,weeds:null,grass:null})
        // res.status(200).send({cityName:null,trees:null,weeds:null,grass:null})
        return res.status(200).send({status:'logged'})
    } catch (error) {
        console.error('Error logging in', error);
        res.render('welcome',{error:true});
        // return res.status(500).send('Error logging in');
    }
});

module.exports = router;
