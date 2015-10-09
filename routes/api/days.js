var express = require('express');
var router = express.Router();
var models = require('../../models');
var Hotel = models.Hotel;
var Restaurant = models.Restaurant;
var Activity = models.Activity;
var Day = models.Day;
var Promise = require('bluebird');

router.get('/', function(req, res){
  // Day.find({}).then(function(allDays) {
  //   console.log(allDays);
  //   return Promise.all(allDays.map(function(day) {return day.populate('Hotel Restaurants Activities').execPopulate()}))

  //   })
  //   .then(function(allDays) {
  //     res.send(allDays);
  //   });

  Day.findOne({number:0}).populate('restaurants')
  .exec(function(err, day){
    if(err)console.log(err);
    else console.log("TODAY", day);
  })
  // .then(function(day) {
  //   return day.populate('hotels restaurants activities').execPopulate();
  // }).then(function(day) {
  //   res.json(day);
  // })
});

router.post('/', function(req, res){  
  var reqDay = Number(req.params.day);  
  Day.find({}).then(function(days) {
    return Day.create({number: days.length })
  }).then(function() {
      res.send("Post Request!");
  })
})

router.put('/:day/:type/:id', function(req, res){
  var reqDay = Number(req.params.day),
  reqType = req.params.type,
  reqID = req.params.id;
  var toAdd = {};
  toAdd[reqType] = reqID;
  if(reqType === "hotels"){
    Day.update({number: reqDay}, {hotels: reqID}).then(function(theDay) {
      res.send('ADDED HOTEL', theDay);
    })
  } else {
    
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
    if(reqType === "hotel"){
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