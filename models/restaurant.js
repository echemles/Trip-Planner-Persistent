var mongoose = require('mongoose');
var PlaceSchema = require('./place').schema;

var RestaurantSchema = new mongoose.Schema({
  name: String,
  place: [PlaceSchema],
  price: { type: Number, min: 1, max: 5 },
  cuisine: { type: [String], get: toCommaString, set: fromCommaString },
  type: {type: String, default: 'restaurants'}
})

function toCommaString(cuisines) {
  return cuisines.join(', ');
}

function fromCommaString(cuisines) {
  return cuisines.split(', ');
}

module.exports = mongoose.model('Restaurant', RestaurantSchema);