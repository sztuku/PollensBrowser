const express = require('express');
const session = require('express-session');
const app = express();
app.set('view engine', 'ejs');
const bodyParser = require('body-parser');
const request = require('request');
const http = require("https");
const { Client } = require('pg');
const cors = require('cors')

app.use(
    cors({
        origin: true,
        credentials: true,
    })
);
app.options(
    '*',
    cors({
        origin: true,
        credentials: true,
    })
);

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
    secret: 'my_secret_key',
    resave: false,
    saveUninitialized: true
}));


const loginRoute = require(__dirname+'/routes/login');
const registerRoute = require(__dirname+'/routes/register');
const pickerRoute = require(__dirname+'/routes/picker');

app.use('/login', loginRoute);
app.use('/register', registerRoute);
app.use('/picker', pickerRoute);

const client = new Client({
    user: 'user',
    host: 'postgres',
    database: 'db',
    password: 'pass',
    port: 5432
});
app.use(express.static(__dirname));


const creat_table = `CREATE TABLE If not Exists users (name varchar unique, password varchar);`;

const creat_table_of_pollens = `CREATE TABLE If not Exists pollens (name varchar unique, GrassPoaceae boolean DEFAULT 't',
Alder boolean DEFAULT 't',Birch boolean DEFAULT 't',Cypress boolean DEFAULT 't',Elm boolean DEFAULT 't',
Hazel boolean DEFAULT 't',Oak boolean DEFAULT 't',Pine boolean DEFAULT 't',Plane boolean DEFAULT 't',
PoplarCottonwood boolean DEFAULT 't',Chenopod boolean DEFAULT 't', Mugwort boolean DEFAULT 't',
Nettle boolean DEFAULT 't',Ragweed boolean DEFAULT 't');`;


client.connect();

client.query(creat_table, (err, res) => {
    if (err) {
        console.error(err);
        return;
    }
    console.log('table of users created successful');
});

client.query(creat_table_of_pollens, (err, res) => {
    if (err) {
        console.error(err);
        return;
    }
    console.log('table of pollens created successful');
});


const init_table = `INSERT INTO users (name, password) VALUES ('piotr','1234')`;
const init_table_pollens = `INSERT INTO pollens (name, Alder) VALUES ('piotr','f')`;



    client.query(init_table, (err, res) => {
        if (err) {
            console.log("tables already initialized")
        }
        console.log('users: Data insert successful');
    });

    client.query(init_table_pollens, (err, res) => {
        if (err) {
            console.log("tables already initialized")
        }
        console.log('pollens: Data insert successful');
    });




const checkAuthentication = (req, res,next) => {
    if (req.session && req.session.user) {
        // res.render('index', { user: req.session.user ,cityName:null,trees:null});
        next()
    } else {
        console.log('loging out')
        // res.render('welcome');
        res.send({cityName:'error'})
    }
};

app.get('/',checkAuthentication,async (req, res) => {


    res.render('index',{cityName:null,trees:null,weeds:null,grass:null});
    // res.render('index',{cityName:null,trees:null});
});

app.post('/check',async (req, res) => {
    try
    {
        client.connect();
    }catch (e) {}

    // const name=req.session.user
    const name ='piotr'
    console.log("name: "+name);
    if (!req.body.cityName||req.body.cityName.length<=0) {
        // return res.render('index',{cityName:null,trees:null,weeds:null,grass:null});
        res.send({cityName:null,trees:null,weeds:null,grass:null});
    }
    console.log("city: "+req.body.cityName);


    let dbResponse
    const selectPollens = `select * from pollens where name=$1 `;
    try{
        dbResponse=await client.query(selectPollens, [name])
        delete dbResponse.rows[0].name
        dbResponse=dbResponse.rows[0]
        const asArray = Object.entries(dbResponse);
        const filtered = asArray.filter(([key, value]) => value === true);
        dbResponse = Object.fromEntries(filtered);
        console.log("ser: ",dbResponse)


    }catch (e){
        console.log("db erroor");
        // res.render('index',{cityName:null,trees:null,weeds:null,grass:null});
        res.send({cityName:null,trees:null,weeds:null,grass:null});
    }
    // let response=await client.query(selectPollens, [name])
    // delete response.rows[0].name
    // console.log(response)


    const options = {
        "method": "GET",
        "hostname": "api.ambeedata.com",
        "port": null,
        "path": "/latest/pollen/by-place?place="+req.body.cityName,
        "headers": {
            "x-api-key": "024fa4328e5e4dc12bfa17795848ee1da0fe93bd5d44456632f380069d558673",
            "Content-type": "application/json"
        }
    };




    let treesPolens
    let weedsPolens
    let grassPolens



    try {
         const request =  await http.request(options, function (response) {
            const chunks = [];
             response.on("data", function (chunk) {
                chunks.push(chunk);
            });

             response.on("end", function () {
                const body = Buffer.concat(chunks);
                if (body && JSON.parse(body).message==='success')
                {
                    treesPolens=Object.entries(JSON.parse(body).data[0].Species.Tree);
                    weedsPolens=Object.entries(JSON.parse(body).data[0].Species.Weed);
                    grassPolens=Object.entries(JSON.parse(body).data[0].Species.Grass);
                    console.log("all tree pollens: "+treesPolens)
                    console.log("all tree pollens length: "+treesPolens.length)
                    for(let i=0;i<treesPolens.length;i++){
                        console.log("porownywany pollen: "+treesPolens[i][0])
                        treesPolens[i][0]=treesPolens[i][0].replace(/\s|\//g,'').toLowerCase();
                        console.log("porownywany pollen po zmianie: "+treesPolens[i][0])

                        if(!Object.keys(dbResponse).includes(treesPolens[i][0]))
                        {
                            treesPolens[i][0]='-'
                        }
                    }
                    treesPolens=treesPolens.filter(item => item[0] !== '-');

                    for(let i=0;i<weedsPolens.length;i++){
                        weedsPolens[i][0]=weedsPolens[i][0].replace(/\s|\//g,'').toLowerCase();
                        if(!Object.keys(dbResponse).includes(weedsPolens[i][0]))
                        {
                            weedsPolens[i][0]='-'
                        }
                    }
                    weedsPolens=weedsPolens.filter(item => item[0] !== '-');

                    // console.log(weedsPolens)
                    for(let i=0;i<grassPolens.length;i++){
                        grassPolens[i][0]=grassPolens[i][0].replace(/\s|\//g,'').toLowerCase();
                        if(!Object.keys(dbResponse).includes(grassPolens[i][0]))
                        {
                            grassPolens[i][0]='-'
                        }
                    }
                    grassPolens=grassPolens.filter(item => item[0] !== '-');


                    console.log("grass pollens:")
                    console.log(grassPolens)

                    console.log("treesPolens :")
                    console.log(treesPolens)

                    console.log("weedsPolens: ")
                    console.log(weedsPolens)


                    // res.render('index',{cityName:req.body.cityName,trees:treesPolens,weeds:weedsPolens,grass:grassPolens})
                    res.send({cityName:req.body.cityName,trees:treesPolens,weeds:weedsPolens,grass:grassPolens})
                }else
                {
                    console.log("ertyuio")

                    // res.render('index',{cityName:null,trees:null,weeds:null,grass:null});
                    res.send({cityName:null,trees:null,weeds:null,grass:null});


                }


             });
        });
        request.end();


    }catch (error)
    {
        console.log(error)
        // res.render('index',{cityName:null,trees:null,weeds:null,grass:null});
        res.send({cityName:null,trees:null,weeds:null,grass:null});

    }

    console.log(treesPolens)
    // res.render('index',{trees:treesPolens})
});



app.listen(3000, '0.0.0.0',() => {
    console.log('Server started on port 3000');
});

