var express = require('express');
var router = express.Router();
var models = require('../../models');
var Hotel = models.Hotel;
var Restaurant = models.Restaurant;
var Activity = models.Activity;
var Day = models.Day;
var Promise = require('bluebird');


Day.find({number: 0}).then(function(day) {
  if(day.length === 0) {
    return Day.create({number: 0});
  } else return;
}).then(function(firstDay) {
  console.log(firstDay);
})

router.get('/', function(req, res){
   Day.find({}).then(function(allDays) {
     console.log(allDays);
     return Promise.all(allDays.map(function(day) {return day.populate('hotels restaurants activities').execPopulate()}))
     })
     .then(function(allDays) {
       res.send(allDays);
     });
});


router.post('/', function(req, res){  
  var reqDay = Number(req.params.day);  
  Day.find({}).then(function(days) {
    return Day.create({number: days.length })
  }).then(function() {
      res.send("Created a new day.");
  })
})

router.put('/:day/:type/:id', function(req, res){
  var reqDay = Number(req.params.day),
  reqType = req.params.type;
  reqID = req.params.id;
  if(reqType === "hotels"){
    Day.update({number: reqDay}, {hotels: reqID}).then(function(theDay) {
      res.send('ADDED HOTEL', theDay);
      console.log('reqID', reqID);
    })
  } else {    
    var toAdd = {};
    toAdd[reqType] = reqID;
    Day.update({number: reqDay}, {$push: toAdd}).then(function(theDay){
      res.send(theDay);  
    })
  }

})

router.delete('/:day/:type/:id', function(req, res){
  var reqDay = Number(req.params.day),
  reqType = req.params.type,
  reqID = req.params.id;
  Day.findOne({number: reqDay}).then(function(theDay){
    if(reqType === "hotels"){
      theDay[reqType].remove();
      theDay.save();
    } else {
      theDay[reqType].splice(theDay[reqType].indexOf(reqID), 1);
      theDay.save();
      res.send(theDay)
    }
  })
})

router.delete('/:day', function(req, res){
  var reqDay = Number(req.params.day);
  Day.find({number: reqDay}).remove().then(function(){
    res.send("DELETED!")
  });
})

module.exports = router;