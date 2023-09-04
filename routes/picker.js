const express = require('express');
const {Client} = require("pg");
const router = express.Router();

const checkAuthentication = (req, res,next) => {
    if (req.session && req.session.user) {
        // res.render('index', { user: req.session.user ,cityName:null,trees:null});
        next()
    } else {
        res.render('welcome');
    }
};

const client = new Client({
    user: 'user',
    host: 'postgres',
    database: 'db',
    password: 'pass',
    port: 5432
});
var listOfAllPollens=['GrassPoaceae','Alder','Birch','Cypress','Elm','Hazel','Oak','Pine','Plane','PoplarCottonwood','Chenopod','Mugwort','Nettle','Ragweed']
var grass=['Grass / Poaceae']
var tree=['Alder','Birch','Cypress','Elm','Hazel','Oak','Pine','Plane','Poplar / Cottonwood']
var weed=['Chenopod','Mugwort','Nettle','Ragweed']

router.get('/',async (req, res) => {
    try
    {
        client.connect();
    }catch (e)
    {

    }

    var name='piotr'

    if(req.query.name)
    {
        console.log("username: "+req.query.name)
        name=req.query.name
    }
    console.log("somebody is downloading")
    // const name =req.session.user
    const selectPollens = `select * from pollens where name=$1`;
    let response=await client.query(selectPollens, [name])
    delete response.rows[0].name
    // console.log(response.rows[0])
    var clientPollens=[]
    var clientGrass=[]
    var clientTree=[]
    var clientWeed=[]
    for (let i=0;i<grass.length;i++)
    {
        grass[i]=grass[i].replace(/\s|\//g,'').toLowerCase();
    }
    for (let i=0;i<tree.length;i++)
    {
        tree[i]=tree[i].replace(/\s|\//g,'').toLowerCase();
    }
    for (let i=0;i<weed.length;i++)
    {
        weed[i]=weed[i].replace(/\s|\//g,'').toLowerCase();
    }

    for (const [key, value] of Object.entries(response.rows[0])) {
        if(value===true)
        {
            // clientPollens.push(key)
            if (grass.includes(key)) {
                clientGrass.push(key)
            }
            if (tree.includes(key)) {
                clientTree.push(key)
            }
            if (weed.includes(key)) {
                clientWeed.push(key)
            }
        }
    }
    // console.log("client:")

    console.log(clientGrass)
    return res.json( {grass: grass, tree: tree, weed: weed,clientGrass: clientGrass, clientTree: clientTree, clientWeed: clientWeed}).end();
    // res.render('picker', {grass: grass, tree: tree, weed: weed,clientGrass: clientGrass, clientTree: clientTree, clientWeed: clientWeed});
});

router.post('/',async (req, res) => {
    var name = 'piotr'
    if(req.body.name)
    {
        name = req.body.name
    }
    // console.log(req.body.pollen);
    const pollens = req.body.pollen
    console.log("dlugosc tablicy: "+pollens.length)
    console.log(" tablicy: "+pollens)
    console.log(" name: "+name)
    try
    {
        client.connect();
    }catch (e)
    {

    }
    for (let i = 0; i < listOfAllPollens.length; i++) {
        const updatePollens = `Update pollens set ${listOfAllPollens[i]}=$1 where name=$2`;
        await client.query(updatePollens, ['f', name])
        console.log("w bazie: "+listOfAllPollens[i])
    }

    if (pollens) {
        for (let i = 0; i < pollens.length; i++) {
            // console.log(pollens[i])
            console.log("zmieniane: "+pollens[i].replace(/\s|\//g))
            const updatePollens = `Update pollens set ${pollens[i].replace(/\s|\//g, '')}=$1 where name=$2`;
            await client.query(updatePollens, ['t', name])
        }
    }

    // res.redirect('/picker')
    return res.status(200).send({status:'ok'})
    //
    // try {
    //     client.connect();
    //     const insert = `INSERT INTO users (name, password) VALUES ($1,$2);`;
    //     await client.query(insert,[name,password])
    //     req.session.user = name;
    //     res.redirect("/")
    // } catch (error) {
    //     console.error('Error during registration', error);
    //     res.render('welcome',{error:true});
    //     // return res.status(500).send('Error logging in');
    // }
});

module.exports = router;
