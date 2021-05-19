import { getUserList, findUserById } from './user';

require('./config');
const Db = require('./dboperations');
const State = require('./state');
const dboperations = require('./dboperations');

const express = require('express');
const app = express();
const router = express.Router();
const bodyParser = require('body-parser');
const cors = require('cors');

const PORT = process.env.PORT || 8080;

const jwt = require('jsonwebtoken');
const configA = require('./configAut');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

const userList = getUserList(); // assume for now this is your database

const swaggerUi = require('swagger-ui-express'),
    swaggerDocument = require('./swagger.json');

app.use('/', router);

// 1
app.set('llave', configA.llave);

router.use((req, res, next) => {
    console.log('middleware');
    next();
})

router.route('/states').get((req, res) => {
    dboperations.getStates().then(result => {
        res.json(result);
    })
})

// GET Call for all users
app.get("/users", (req, res) => {
    return res.status(200).send({
        success: "true",
        message: "users",
        users: userList,
    });
});


//  POST call - Means you are adding new user into database 

app.post("/addUser", (req, res) => {

    if (!req.body.name) {
        return res.status(400).send({
            success: "false",
            message: "name is required",
        });
    } else if (!req.body.companies) {
        return res.status(400).send({
            success: "false",
            message: "companies is required",
        });
    }
    const user = {
        id: userList.length + 1,
        isPublic: req.body.isPublic,
        name: req.body.name,
        companies: req.body.companies,
        books: req.body.books
    };
    userList.push(user);
    return res.status(201).send({
        success: "true",
        message: "user added successfully",
        user,
    });
});

//  PUt call - Means you are updating new user into database 

app.put("/user/:userId", (req, res) => {
    console.log(req.params)
    const id = parseInt(req.params.userId, 10);
    const userFound = findUserById(id)


    if (!userFound) {
        return res.status(404).send({
            success: 'false',
            message: 'user not found',
        });
    }

    const updatedUser = {
        id: id,
        isPublic: req.body.isPublic || userFound.body.isPublic,
        name: req.body.name || userFound.body.name,
        companies: req.body.companies || userFound.body.companies,
        books: req.body.books || userFound.body.books

    };

    if (!updatedUser.name) {
        return res.status(400).send({
            success: "false",
            message: "name is required",
        });
    } else if (!updatedUser.companies) {
        return res.status(400).send({
            success: "false",
            message: "companies is required",
        });
    }

    for (let i = 0; i < userList.length; i++) {
        if (userList[i].id === id) {
            userList[i] = updatedUser;
            return res.status(201).send({
                success: 'true',
                message: 'user updated successfully',
                updatedUser

            });
        }
    }
    return res.status(404).send({
        success: 'true',
        message: 'error in update'

    });
})

//  Delete call - Means you are deleting new user from database 

app.delete("/user/:userId", (req, res) => {
    console.log(req.params)
    const id = parseInt(req.params.userId, 10);
    console.log(id)
    for (let i = 0; i < userList.length; i++) {
        if (userList[i].id === id) {
            userList.splice(i, 1);
            return res.status(201).send({
                success: 'true',
                message: 'user deleted successfully'
            });
        }
    }
    return res.status(404).send({
        success: 'true',
        message: 'error in delete'
    });
})

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.listen(3000,()=>{
    console.log('Servidor iniciado en el puerto 3000') 
});

app.get('/', function(req, res) {
    res.send('Inicio');
});

app.post('/autenticar', (req, res) => {
    if(req.body.usuario === "asfo" && req.body.contrasena === "holamundo") {
  const payload = {
   check:  true
  };
  const token = jwt.sign(payload, app.get('llave'), {
   expiresIn: 1440
  });
  res.json({
   mensaje: 'Autenticación correcta',
   token: token
  });
    } else {
        res.json({ mensaje: "Usuario o contraseña incorrectos"})
    }
})

const rutasProtegidas = express.Router(); 
rutasProtegidas.use((req, res, next) => {
    const token = req.headers['access-token'];
 
    if (token) {
      jwt.verify(token, app.get('llave'), (err, decoded) => {      
        if (err) {
          return res.json({ mensaje: 'Token inválida' });    
        } else {
          req.decoded = decoded;    
          next();
        }
      });
    } else {
      res.send({ 
          mensaje: 'Token no proveída.' 
      });
    }
 });

 app.get('/datos', rutasProtegidas, (req, res) => {
    const datos = [
     { id: 1, nombre: "Alondra" },
     { id: 2, nombre: "Eduardo" },
     { id: 3, nombre: "Rodrigo" }
    ];
    
    res.json(datos);
   });

app.listen(PORT, () => console.log(`It's running on https://localhost:${PORT}`));