const mongoose = require('mongoose'); 
const chessSchema = new mongoose.Schema({
    board : String,
    server : String,
    enPass: [Number],
    turn : Boolean,
    castle: [[Boolean]],
    won : String,
    white : String,
    black : String
});
const chess = mongoose.model('server',chessSchema);
module.exports = chess;