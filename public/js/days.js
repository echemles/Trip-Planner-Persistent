'use strict';
/* global $ mapModule */

var daysModule = (function(){

  var exports = {},
      days = [{
        hotels:      [],
        restaurants: [],
        activities:  []
      }];

  if(days_init.length >0) {
    days = days_init;
    days.map(function(day) {
      delete day['__v'];
      delete day['_id'];
      delete day['number'];
      day.hotels = [day.hotels];
      return day;
    });
  }
  
  var currentDay = days[0];

  
  function addDay () {
    $.ajax({
      method: "POST",
      url: "/api/", //UPDATE WITH ACTUAL DAY
      success: function(response){
        console.log(response)
      },
      error: function(err){
        console.log("ERROR", err)
      }

    })
    days.push({
      hotels: [],
      restaurants: [],
      activities: []
    });
    renderDayButtons();
    switchDay(days.length - 1);
  }

  function switchDay (index) {
     $.ajax({
      method: "GET",
      url: "/api/", //UPDATE WITH PROPER ID
      success: function(response){
        console.log(response);
      },
      error: function(err){
        console.log("Error in get request!", err);
      }
    })
    var $title = $('#day-title');
    if (index >= days.length) index = days.length - 1;
    $title.children('span').remove();
    $title.prepend('<span>Day ' + (index + 1) + '</span>');
    currentDay = days[index];
    renderDay();
    renderDayButtons();
  }

  function removeCurrentDay () {
    console.log(currentDay);
    if (days.length === 1) return;
    var index = days.indexOf(currentDay);
    days.splice(index, 1);
    switchDay(index);

    $.ajax({
      method: "DELETE",
      url: "/api/" + days.indexOf(currentDay), //UPDATE WITH PROPER ID
      success: function(response){
        console.log(response);
      },
      error: function(err){
        console.log("Error!", err);
      }
    })
  }

  function renderDayButtons () {
    var $daySelect = $('#day-select');
    $daySelect.empty();
    days.forEach(function(day, i){
      $daySelect.append(daySelectHTML(day, i, day === currentDay));
    });
    $daySelect.append('<button class="btn btn-circle day-btn new-day-btn">+</button>');
  }

  function daySelectHTML (day, i, isCurrentDay) {
    return '<button class="btn btn-circle day-btn' + (isCurrentDay ? ' current-day' : '') + '">' + (i + 1) + '</button>';
  }

  exports.addAttraction = function(attraction) {
    $.ajax({
      method: "PUT",
      url: "/api/" + days.indexOf(currentDay) + "/" + attraction.type + "/" + attraction._id, //UPDATE WITH PROPER ID
      success: function(response){
        console.log(response);
      },
      error: function(err){
        console.log("Error!", err);
      }
    })
    if (currentDay[attraction.type].indexOf(attraction) !== -1) return;
    currentDay[attraction.type].push(attraction);
    renderDay(currentDay);
    console.log(days);
  };

  exports.removeAttraction = function (attraction) {
    console.log(attraction);
    console.log(days.indexOf(currentDay) + "/" + attraction.type + "/" + attraction._id);
    $.ajax({
      method: "DELETE",
      url: "/api/" + days.indexOf(currentDay) + "/" + attraction.type + "/" + attraction._id, //UPDATE WITH PROPER ID
      success: function(response){
        console.log(response);
      },
      error: function(err){
        console.log("Error!", err);
      }
    })
    var index = currentDay[attraction.type].indexOf(attraction);
    if (index === -1) return;
    currentDay[attraction.type].splice(index, 1);
    renderDay(currentDay);
    console.log(days);
  };

  function renderDay(day) {
    mapModule.eraseMarkers();
    day = day || currentDay;
    Object.keys(day).forEach(function(type){
      var $list = $('#itinerary ul[data-type="' + type + '"]');
      $list.empty();
      day[type].forEach(function(attraction){
        $list.append(itineraryHTML(attraction));
        mapModule.drawAttraction(attraction);
      });
    });
  }

  function itineraryHTML (attraction) {
    return '<div class="itinerary-item><span class="title>' + attraction.name + '</span><button data-id="' + attraction._id + '" data-type="' + attraction.type + '" class="btn btn-xs btn-danger remove btn-circle">x</button></div>';
  }

  $(document).ready(function(){
    switchDay(0);
    $('.day-buttons').on('click', '.new-day-btn', addDay);
    $('.day-buttons').on('click', 'button:not(.new-day-btn)', function() {
      switchDay($(this).index());
    });
    $('#day-title').on('click', '.remove', removeCurrentDay);
  });

  return exports;

}());
