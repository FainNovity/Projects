const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');
const chess = require('./chessSchema');
let port = process.env.PORT || 3001;

const cors = require('cors');
/*
require('dotenv').config();
*/
mongoose.connect("mongodb+srv://23010101189:6gwbfJbStcA1ltMp@cluster-1.x5viu.mongodb.net/chess").then(()=>{
    const express = require('express');
    const bodyParser = require('body-parser');
    const app = express();
    app.use(bodyParser.urlencoded({extended:true}));
    app.use(cors({
        origin : "*"
    }));    
    
  console.log("database connected successfully !!");  

  const characters ='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  function generateString(length) {
      let result = ' ';
      const charactersLength = characters.length;
      for ( let i = 0; i < length; i++ ) {
          result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    }
    async function getStr(){
        var str = generateString(6);
        while(await chess.findOne({"server": str})!=null){
            str= generateString(6);
        }
        return str;
    }
    
    app.get('/',async (req,res)=>{
        await fs.readFile('./getServer.html',async (err,data)=>res.type('html').send(data.toString()));
    });
    app.put('/newOne',async (req,res)=>{
        let server = await getStr();
        console.log(server);
        let {white, black,time} = req.body;
        time??= -1;
        let newBoard = new chess({
            "board": "rkbqcbkrpppppppp................................PPPPPPPPRKBQCBKR",
            "server" : server,
            "enPass": [-1,-1],
            "castle" : [[false,false],[false,false]],
            "turn" : true,
            "won": "-1",
            "white": white,
            "black": black
        });
        await newBoard.save();
        res.send({"server": server});
    });
    app.get('/:server/[0-1]',async (req,res)=>{
                await fs.readFile('./index.html',async (err,data)=>res.type('html').send(data.toString()));
    });
    app.get('/:server/chess.js',async (req,res)=>{
        await fs.readFile('./chess.js',async (err,data)=>res.type('js').send(data.toString()));
    });
    app.get('/:server/chess.css',async (req,res)=>{
                await fs.readFile('./chess.css',async (err,data)=>res.type('css').send(data.toString()));

    });
    app.get('/:server',async (req,res)=>{
        res.send(await chess.findOne({"server": req.params.server}));
    });
    app.post('/:server',async (req,res)=>{
        let {enPass,castle,time} = req.body;
        let castleArr = castle.split(',');
        await chess.updateOne({"server": req.params.server},{...req.body,"enPass": enPass.split(',').map(Number),"castle": [[castleArr[0]=="true",castleArr[1]=="true"],[castleArr[2]=="true",castleArr[3]=="true"]]});
        res.send("Updated board "+req.params.server);
    });
    app.delete('/:server',async (req,res)=>{
        await chess.deleteOne({"server": req.params.server});
        res.send("Deleted board "+req.params.server);
    });
    
    let server = app.listen(port,()=>{
        console.log('started successfully');
    });
    server.keepAliveTimeout = 120 * 1000;
    server.headersTimeout = 120 * 1000;
});