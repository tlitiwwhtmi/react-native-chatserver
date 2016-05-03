/**
 * Created by administrator on 16/4/29.
 */

/**
 * Created by administrator on 16/4/21.
 */

var ws = require("nodejs-websocket");

var dataUtil = require("./dataUtil");

exports.startServer = function () {
  server.listen(8083);
  console.log("phonechatserver is listening on 8083")
}

var server = ws.createServer(function (connection) {
  connection.nickname = null
  connection.on("text", function (str) {
    console.log(str);
    if (!connection.user) {
      var data = JSON.parse(str);
      connection.user = data.user;
      connection.loginTime = data.date;
    }
    handleMsg(str);
  })
  connection.on("close", function () {
    sendOnlineInfo(connection.user);
  })
});

function getOnlineFriends(user,cb){
  if(!user){
    return;
  }
  dataUtil.getUserFriends(user.id, function (friends) {
    if(friends.length == 0){
      return;
    }
    var onlineFriends = new Array();
    for(var i=0;i<server.connections.length;i++){
      var connection = server.connections[i];
      for(var j=0;j<friends.length;j++){
        if(connection.user.id == friends[j].id || connection.user.id == user.id){
          var userWithTime = connection.user;
          userWithTime.loginTime = connection.loginTime
          onlineFriends.push(userWithTime)
        }
      }
    }
    cb(onlineFriends);
  })
}

function sendOnlineInfo(user){
  getOnlineFriends(user, function (onlineFriends) {
    var postData = {
      type : 'list',
      peoples : onlineFriends
    };
    postToFriend(user,JSON.stringify(postData));
  });
}

function handleMsg(str){
  var data = JSON.parse(str);
  if(data.type == 'enter'){
    sendOnlineInfo(data.user);
  }
  if(data.type == 'msg'){
    sendData(data);
  }
}

function sendData(data){
  server.connections.forEach(function (connection) {
    if(connection.user.id == data.to.id){
      connection.sendText(JSON.stringify(data));
    }
  })
}

function postToFriend(user,msg){
  dataUtil.getUserFriends(user.id, function (friends) {
    if(friends.length == 0){
      return;
    }

    server.connections.forEach(function (connection) {
      for(var i=0;i<friends.length;i++){
        if(friends[i].id == connection.user.id || connection.user.id == user.id){
          connection.sendText(msg);
          return;
        }
      }
    });

  })
}
