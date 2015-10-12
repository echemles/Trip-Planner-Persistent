var express = require('express');
var router = express.Router();
var models = require('../models');
var Hotel = models.Hotel;
var Restaurant = models.Restaurant;
var Activity = models.Activity;
var Day = models.Day;
var Promise = require('bluebird');

router.get('/', function(req, res) {
  Promise.all([
    Hotel.find(),
    Restaurant.find(),
    Activity.find(), 
    Day.find().populate('hotels restaurants activities')
    ]).spread(function(hotels, restaurants, activities, days) {

      res.render('index', {
        all_hotels: hotels,
        all_restaurants: restaurants,
        all_activities: activities,
        days_init: days
      });
    })
})

router.use('/api', require('./api/days'));

module.exports = router;
