//configurações
require("dotenv").config();

const path = require("path");
const express = require("express");
const app = express();
const handlebars = require("express-handlebars");
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser');
const sessions = require('express-session');
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const Sequelize = require("sequelize");
const Usuarios = require("./models/Usuarios");
const alg = require("./public/js/alg.js");

const { info } = require("console");
const { Server } = require("http");

var http = require('http').Server(app);
// passa o http-server par ao socketio
var io = require('socket.io')(http);


const PORT = process.env.PORT || 8081;

app.engine('.hbs', handlebars.engine({ defaultLayout: 'main', extname: '.hbs', runtimeOptions: {
    allowProtoPropertiesByDefault: true,
    allowProtoMethodsByDefault: true,
}}));
app.set('view engine', '.hbs');
const hbs = handlebars.create({});
hbs.handlebars.registerHelper('if_eq', function(a, b, opts) {
    if (a == b) {   
        console.log("'" + a + "'\n'" + b + "'");
        return opts.fn(this);   
    } else {
        console.log("'" + a + "'\n'" + b + "'");
        return opts.inverse(this);
    }
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());

const oneDay = 1000 * 60 * 60 * 24;
app.use(sessions({
    secret: "thisismysecrctekeyfhrgfgrfrty84fwir767",
    saveUninitialized:true,
    cookie: { maxAge: oneDay },
    resave: false 
}));

var session;

//ROTAS

    //Páginas estáticas e dir public
    app.use(express.static(path.join(__dirname, "public")));

    //Teste de template
    app.get("/template", function(req,res){
        
        res.render("layouts/main", {
            title: "Template",
            style: "styles.css"
        });

    });

    app.get("/form", function(req,res){
    
        res.render("formulario");

    });

    //REDIRECT DA TELA INICIAL

//Cadastro de informações básicas
    app.get('/cadastrodeusuarios', function(req, res){
        res.render('cadastrodeusuarios', {
            title: "Cadastrar usuário",
            style: "cadastro.css"
        });
    });
    
    app.post('/add-usuarios', async (req, res)=>{
        const hashSenha = await bcrypt.genSalt(10);
        var users = {
            nome: req.body.nome,
            email: req.body.email,
            matricula: req.body.matricula,
            curso: req.body.curso,
            senha: await bcrypt.hash(req.body.senha, hashSenha),
            whatsapp: req.body.whatsapp,
            discord: req.body.discord,
            instagram: req.body.instagram,
            twitter: req.body.twitter,
            musicas:req.body.musicas,
            jogos: req.body.jogos,
            filmes: req.body.filmes,
            livros: req.body.livros,
            esportes: req.body.esportes,
            educação: req.body.educação
        };
        create_user = await Usuarios.create(users);
        res.status(201).redirect("login");//.json(create_user);
    });
        

//Esqueci minha senha
    app.get("/recuperar_senha", function(req,res){
        res.sendFile(__dirname + "/recuperar_senha.html");
    });




//EDITAR PERFIL

    app.get("/perfil/edit", (req,res) =>{
        session=req.session;
        if(session.userid){
            Usuarios.findByPk(session.userid).then(function(info){
                res.render("edit",{
                    title: "Editar perfil",
                    style: "cadastro.css",
                    nome: info.nome,
                    email: info.email,
                    curso: info.curso,
                    whatsapp: info.whatsapp,
                    discord: info.discord,
                    instagram: info.instagram,
                    twitter: info.twitter,
                    musicas: info.musicas,
                    jogos: info.jogos,
                    filmes: info.filmes,
                    livros: info.livros,
                    esportes: info.esportes,
                    educacao: info.educação
                });
            });
        }else
            res.send('erro');
        });

    app.post("/perfil/subm-edit", async (req, res) => {
        session=req.session;
        if(session.userid){
            var users = {
                nome: req.body.nome,
                email: req.body.email,
                curso: req.body.curso,
                whatsapp: req.body.whatsapp,
                discord: req.body.discord,
                instagram: req.body.instagram,
                twitter: req.body.twitter,
                musicas:req.body.musicas,
                jogos: req.body.jogos,
                filmes: req.body.filmes,
                livros: req.body.livros,
                esportes: req.body.esportes,
                educação: req.body.educação
            };
            await Usuarios.update(users, {
                where: {matricula : session.userid}
            });
            res.status(200).redirect("/perfil");
        }else
            res.send('erro');
    });

    app.get("/perfil/trocarsenha", function(req,res){

        res.sendFile(__dirname + "/perfil/eu.html");

    });



//LOGIN
app.get("/login", function(req, res){
    res.render("login", {
        title: "Efetuar login",
        style: "login.css"
    });
});

app.post("/validar-login", async(req, res) =>{
    const user= await Usuarios.findOne({where: {matricula: req.body.matricula}});
    if (user){
        const password_valid = await bcrypt.compare(req.body.senha, user.senha);
    if(password_valid){
        session=req.session;
        session.userid=req.body.matricula;
        console.log(req.session)
        res.redirect('/perfil')
    }
    else{
        res.send('Invalid username or password');
    }
}})

app.get('/logout',(req,res) => {
    req.session.destroy();
    res.redirect('/login');
});

//PERFIL
app.get('/perfil', function(req,res){
    session=req.session;
    if(session.userid){
        Usuarios.findByPk(session.userid).then(function(info){
            res.render('perfil',{
                style : "perfil.css",
                title : "Perfil",
                nome : info.nome,
                curso : info.curso
            })
        });
    }else
        res.send('erro')
});

/*app.get("/feed", function(req,res){
    session=req.session;
    if(session.userid){
        Usuarios.findAll({
            where: {matricula : { [Sequelize.Op.not] : session.userid}}
        }).then((conexao) =>{
            res.render("feed", {
                conexao : conexao,
                title:"Uniconnect",
                style:"swiper-bundle.min.css", 
                style2:"feed.css"
            }); 
        });
    }else
        res.send("erro")
});*/

app.get("/feed", (req, res) =>{
    var orderedFeed = [];
    var tempFeed = {};
    var feed = {};
    session = req.session;
    if(session.userid){
        Usuarios.count().then((count) => {
            Usuarios.findByPk(session.userid).then((info) =>{
                Usuarios.findAll({
                    where: {matricula : { [Sequelize.Op.not] : session.userid}}
                }).then(async (conexao) =>{
                    let matzero = false;
                    for(var i = 0; i < count-1; i++){
                        if(conexao[i].matricula == 0){matzero = true; continue;}
                        let comp = alg.match(info, conexao[i]);
                        tempFeed[conexao[i].matricula] = comp;
                    }


                    var items = Object.keys(tempFeed).map(
                        (key) => { return [key, tempFeed[key]] });
                      
                    items.sort(
                        (first, second) => { return first[1] - second[1] }
                    );
                    
                    orderedFeed = items.map(
                        (e) => { return e[0] }
                    );
                    
                    for(var i = 0; i < count-1-matzero; i++){
                        feed[i] = await Usuarios.findByPk(orderedFeed[i]);
                        console.log("compatibilidade - " + tempFeed[orderedFeed[i]]);
                    }
                    
                    res.render("feed", {
                        feed : feed,
                        title:"Uniconnect",
                        style:"swiper-bundle.min.css", 
                        style2:"feed.css"
                    }); 
                })
            })
        })
        
    }else
        res.send("erro")

});

app.get("/lalala/:matricula", function(req, res){
    var matriculausuarioatual = req.params.matricula;
    matriculausuarioatual = matriculausuarioatual.substring(1);
    Usuarios.findByPk(matriculausuarioatual).then(function(interesses){
        res.render('perfiloutros', {
            style: "perfiloutros.css",
            nome: interesses.nome,
            curso: interesses.curso,
            musicas : interesses.musicas,
            filmes : interesses.filmes,
            esportes : interesses.esportes,
            educação : interesses.educacao,
            jogos : interesses.jogos,
            livros: interesses.livros,
            whatsapp: interesses.whatsapp,
            discord: interesses.discord, 
            twitter: interesses.twitter,
            instagram: interesses.instagram

        })
        })
    })

//app.get('/chat', function(req,res){
   // session=req.session;
   // if(session.userid){
    //    Usuarios.findByPk(session.userid).then(function(chat){
      //      res.render('chat',{
       //         nome : chat.nome
        //    })
       // });
      //  io.on('connection', function(socket){
       //     socket.on('chat message', function(msg){
       //         io.emit('chat message', msg);
     //       })
      //  })
  //   }else
    //    res.send("erro");
//})


// cria uma rota para fornecer o arquivo index.html
app.get('/prechat', function(req, res){
    res.render('prechat', {
        style: "prechat.css"
    });
  });

app.get('/chatesportes', function(req, res){
session=req.session;
if(session.userid){
    Usuarios.findByPk(session.userid).then(function(info){
    res.render('chatesportes', {
        nome: info.nome
    })
    io.on('connection', function(socket){
        socket.on('chat esportes', function(msg){
          io.emit('chat esportes', msg);
        });
      });
})
}})

app.get('/chatmusicas', function(req, res){
    session=req.session;
    if(session.userid){
        Usuarios.findByPk(session.userid).then(function(info){
        res.render('chatmusicas', {
            nome: info.nome
        })
    io.on('connection', function(socket){
        socket.on('chat musicas', function(msg){
          io.emit('chat musicas', msg);
        });
      });
})
    }})

app.get('/chatfilmes', function(req, res){
session=req.session;
if(session.userid){
    Usuarios.findByPk(session.userid).then(function(info){
    res.render('chatfilmes', {
        nome: info.nome
    })
    io.on('connection', function(socket){
        socket.on('chat filmes', function(msg){
          io.emit('chat filmes', msg);
        });
      });
})
}})

app.get('/chatjogos', function(req, res){
    session=req.session;
    if(session.userid){
        Usuarios.findByPk(session.userid).then(function(info){
        res.render('chatjogos', {
            nome: info.nome
        })
    io.on('connection', function(socket){
        socket.on('chat jogos', function(msg){
          io.emit('chat jogos', msg);
        });
      });
})
    }})

app.get('/chatlivros', function(req, res){
session=req.session;
if(session.userid){
    Usuarios.findByPk(session.userid).then(function(info){
    res.render('chatlivros', {
        nome: info.nome
    })
    io.on('connection', function(socket){
        socket.on('chat livros', function(msg){
          io.emit('chat livros', msg);
        });
      });
})
}})

app.get('/chatestudos', function(req, res){
    session=req.session;
    if(session.userid){
        Usuarios.findByPk(session.userid).then(function(info){
        res.render('chatestudos', {
            nome: info.nome
        })
    io.on('connection', function(socket){
        socket.on('chat estudos', function(msg){
          io.emit('chat estudos', msg);
        });
        socket.on('disconnect', function(){
            console.log("disconnected!");
          });
      });
})
}})


//TELA INICIAL
app.get("/", function(req,res){
    res.render("index", {
      title:"Uniconnect",
       style:"styles.css"
    });
});

/*Usuarios.count().then((count) => {
    Usuarios.findByPk(1115).then((info) => {
        Usuarios.findAll().then((info2) =>{
            for(var i = 1; i < count; i++){
                console.log("-----------" +alg.match(info,info2[i]));
            }
        })
    })
})*/




// server 

http.listen(8081, function(){
    console.log('Servidor rodando em: http://localhost:8081');
  });
