/**
 * Created by administrator on 16/4/29.
 */


var fs = require('fs');
var path = require('path');

var USER_FILE = path.join(__dirname, 'data/users.json');
var FRIEND_FILE = path.join(__dirname, 'data/friends.json');


var dataUtil = {
  getUser : function (userName, passWord,cb) {
    fs.readFile(USER_FILE, function (err, data) {
      if (err){
        console.log(err);
        cb();
        return;
      }
      data = JSON.parse(data);
      for(var i=0;i<data.length;i++){
        if(data[i].userName == userName && data[i].passWord == passWord){
          data[i].token = this.generateToken();
          fs.writeFile(USER_FILE, JSON.stringify(data, null, 4), function(err) {
            if (err) {
              console.log(err);
              cb()
            }
          });
          cb(data[i]);
          return;
        }
      }
      cb();
    }.bind(this));
  },

  getUserByToken : function (id,token, cb) {
    fs.readFile(USER_FILE, function (err, data) {
      if(err){
        console.log(err)
        cb()
        return;
      }
      data = JSON.parse(data);
      for(var i=0;i<data.length;i++){
        if(data[i].token == token && data[i].id == id){
          cb(data[i])
          return;
        }
      }
      cb();
    })
  },

  getUserFriends : function (id, cb) {
    var friendIds = new Array();
    fs.readFile(FRIEND_FILE, function (err, data) {
      if(err){
        console.log(err);
        cb([]);
        return;
      }
      data = JSON.parse(data);
      for(var i=0;i<data.length;i++){
        if(data[i].id_1 == id){
          friendIds.push(data[i].id_2)
        }
        if(data[i].id_2 == id){
          friendIds.push(data[i].id_1)
        }
      }
      if(friendIds.length == 0){
        cb([]);
        return;
      }
      fs.readFile(USER_FILE, function (err, userData) {
        if(err){
          console.log(err)
          cb([]);
          return;
        }
        userData = JSON.parse(userData);
        var friendArray = new Array();
        for(var j=0;j<friendIds.length;j++){
          for(var i=0;i<userData.length;i++){
            if(userData[i].id == friendIds[j]){
              friendArray.push(userData[i]);
              break;
            }
          }
        }
        cb(friendArray);
      });
    });
  },

  generateToken : function() {
    var s = [];
    var hexDigits = "0123456789abcdef";
    for (var i = 0; i < 36; i++) {
      s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
    }
    s[14] = "4"; // bits 12-15 of the time_hi_and_version field to 0010
    s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
    s[8] = s[13] = s[18] = s[23] = "-";

    var uuid = s.join("");
    return uuid;
  }

};

module.exports = dataUtil;
