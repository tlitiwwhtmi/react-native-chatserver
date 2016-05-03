/**
 * This file provided by Facebook is for non-commercial testing and evaluation
 * purposes only. Facebook reserves all rights not expressly granted.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL
 * FACEBOOK BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN
 * ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
 * WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

var fs = require('fs');
var path = require('path');
var express = require('express');
var bodyParser = require('body-parser');

var phoneChatServer = require("./phoneChatServer");

var dataUtil = require("./dataUtil")

var app = express();

app.set('port', (process.env.PORT || 3000));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// Additional middleware which will set headers that we need on each request.
app.use(function(req, res, next) {
    // Set permissive CORS header - this allows this server to be used only as
    // an API server in conjunction with something like webpack-dev-server.
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Disable caching so we'll always get the latest comments.
    res.setHeader('Cache-Control', 'no-cache');
    next();
});

app.post("/login", function (req,res) {

  if(req.body.userName && req.body.passWord){
    dataUtil.getUser(req.body.userName,req.body.passWord,function(user){
      if(user){
        res.json({
          status : "success",
          user : user
        });
      }else{
        res.json({
          status : "error",
          user : user
        });
      }
    });
  }

});


app.post("/loginwithtoken", function (req,res) {

  if(req.body.id && req.body.token){
    dataUtil.getUserByToken(req.body.id,req.body.token,function(user){
      if(user){
        res.json({
          status : "success",
          user : user
        });
      }else{
        res.json({
          status : "error",
          user : user
        });
      }
    });
  }

});

app.get("/listfriend/:id", function (req, res) {
  if(req.params.id){
    dataUtil.getUserFriends(req.params.id, function (friends) {
      if(!friends){
        friends = new Array();
      }
      res.json({
        friends : friends
      })
    });
  }
});



app.listen(app.get('port'), function() {
  console.log('Server started: http://localhost:' + app.get('port') + '/');
});


var getUUID = function() {
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

//chatServer.startServer();
phoneChatServer.startServer();
