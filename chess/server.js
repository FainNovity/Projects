const mongoose = require('mongoose');
const path = require('path');
const chess = require('./chessSchema');
const serverless = require('serverless-http');

mongoose.connect("mongodb+srv://23010101189:6gwbfJbStcA1ltMp@cluster-1.x5viu.mongodb.net/chess").then(()=>{
    const express = require('express');
    const bodyParser = require('body-parser');
    const app = express();
    const router = express.Router();

    app.use("/server/",router);
    app.use(bodyParser.urlencoded({extended:true}));
    
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
    
    router.get('/',(req,res)=>{
        res.sendFile(path.resolve(__dirname,"./getServer.html"));
    });
    router.get('/newOne',async (req,res)=>{
        let server = await getStr();
        console.log(server);
        let newBoard = new chess({
            "board": "rkbqcbkrpppppppp................................PPPPPPPPRKBQCBKR",
            "server" : server,
            "enPass": [-1,-1],
            "castle" : [[false,false],[false,false]],
            "turn" : true,
            "won": "-1"
        });
        await newBoard.save();
        res.send({"server": server});
    });
    router.get('/:server/[0-1]',(req,res)=>{
        res.sendFile(path.resolve(__dirname,"./index.html"));
    });
    router.get('/:server/chess.js',(req,res)=>{
        res.sendFile(path.resolve(__dirname,"./chess.js"));
    });
    router.get('/:server/chess.css',(req,res)=>{
        res.sendFile(path.resolve(__dirname,"./chess.css"));
    });
    router.get('/:server',async (req,res)=>{
        res.send(await chess.findOne({"server": req.params.server}));
    });
    router.post('/:server',async (req,res)=>{
        let {enPass,castle} = req.body;
        let castleArr = castle.split(',');
        console.log(castleArr[2]);
        await chess.updateOne({"server": req.params.server},{...req.body,"enPass": enPass.split(',').map(Number),"castle": [[castleArr[0]=="true",castleArr[1]=="true"],[castleArr[2]=="true",castleArr[3]=="true"]]});
        res.send("Updated board "+req.params.server);
    });
    router.delete('/:server',async (req,res)=>{
        await chess.deleteOne({"server": req.params.server});
        res.send("Deleted board "+req.params.server);
    });
    module.exports.handler = serverless(app);
});