const mongoose = require("mongoose");
const express = require("express");
const Schema = mongoose.Schema;
const app = express();
const jsonParser = express.json();
 
const {
    MONGO_DB_HOSTNAME,
    MONGO_DB_PORT,
    MONGO_DB
} = process.env
 
const options = {
    useUnifiedTopology: true,
    useNewUrlParser: true,
}
 
const url = `mongodb://${MONGO_DB_HOSTNAME}:${MONGO_DB_PORT}/${MONGO_DB}`;
 
const gardenScheme = new Schema({name: String, place: String, date: String, phone: String}, {versionKey: false});
const Garden = mongoose.model("Garden", gardenScheme);
 
app.use(express.static(__dirname + "/public"));
 
mongoose.connect(url, options, function(err){
    if(err) return console.log(err);
    app.listen(3000, function(){
        console.log("Сервер очікує підключення...");
    });
});
  
app.get("/api/gardens", function(req, res){
        
    Garden.find({}, function(err, gardens){
 
        if(err) return console.log(err);
        res.send(gardens)
    });
});
 
app.get("/api/gardens/:id", function(req, res){
         
    const id = req.params.id;
    Garden.findOne({_id: id}, function(err, garden){
          
        if(err) return console.log(err);
        res.send(garden);
    });
});
    
app.post("/api/gardens", jsonParser, function (req, res) {
        
    if(!req.body) return res.sendStatus(400);
        
    const gardenName = req.body.name;
    const gardenPlace = req.body.place;
    const gardenDate = req.body.date;
    const gardenPhone = req.body.phone;
    const garden = new Garden({name: gardenName, place: gardenPlace, date: gardenDate, phone: gardenPhone});
        
    garden.save(function(err){
        if(err) return console.log(err);
        res.send(garden);
    });
});
     
app.delete("/api/gardens/:id", function(req, res){
         
    const id = req.params.id;
    Garden.findByIdAndDelete(id, function(err, garden){
                
        if(err) return console.log(err);
        res.send(garden);
    });
});
    
app.put("/api/gardens", jsonParser, function(req, res){
         
    if(!req.body) return res.sendStatus(400);
    const id = req.body.id;
    const gardenName = req.body.name;
    const gardenPlace = req.body.place;
    const gardenDate = req.body.date;
    const gardenPhone = req.body.phone;
    const newGarden = {name: gardenName, place: gardenPlace, date: gardenDate, phone: gardenPhone};
     
    Garden.findOneAndUpdate({_id: id}, newGarden, {new: true}, function(err, garden){
        if(err) return console.log(err); 
        res.send(garden);
    });
});


