var wsCtrl = {}
wsCtrl.userId = document.body.getAttribute("id");
var userId = wsCtrl.userId;
wsCtrl.userName = document.body.getAttribute("name");
var userName = wsCtrl.userName
wsCtrl.mVersion = parseInt(document.body.getAttribute("mv"));
var mVersion = wsCtrl.mVersion
wsCtrl.mRVersion = parseInt(document.body.getAttribute("mv"));
var mRVersion = wsCtrl.mRVersion

var prevTime;



wsCtrl.ping = 0;
wsCtrl.total = 0;

window.redraw = {
  nav: 0,
  home: 0,
  dashboard: 0,
  right: 0,
  app: 0
};

wsCtrl.storage = {
  chat: $.localStorage.get('chat:' + wsCtrl.userId) || []
};



wsCtrl.data = {
  chatrooms: {},
  chatroom: {},
  userOnline: [],
  user: {},
  chat: [],
  notify: {
    n: 0,
    notifyMessage: [],
    init: false,
    display: false
  }
};
var data = wsCtrl.data;

function initChat(){
  wsCtrl.storage.chat.map(function(user){
    data.chat.push({user: user.user, display: true, input: m.prop(''), init: false, hide: user.hide, read: true, chat: []});
    send(sendData("init_chat", {w: user.user.id, cv: 0}));
  });
}

//var ws = new WebSocket("ws://188.166.254.203:9000/socket?sri=" + sri);
var reconnect;
var delayInitWs;

function initReconnect(setTime){
  var delayReconnect;
  var delayInit;
  if(setTime === undefined) {
    delayReconnect = 8000;
    delayInit = 2000;
  } else {
    delayReconnect = setTime;
    delayInit = 0;
  }
  clearTimeout(reconnect);
  reconnect = setTimeout(function(){
    console.log("run reconnect !!")
    clearTimeout(pingSchedule);
    if(ws){
      ws.onerror = $.noop;
      ws.onclose = $.noop;
      ws.onopen = $.noop;
      ws.onmessage = $.noop;
      ws.close();
    }
    console.log("websocket will reconnect in " + delayInit +" ms !!")
    if(delayInitWs) clearTimeout(delayInitWs);
    delayInitWs = setTimeout(initWs, delayInit);
  }, delayReconnect);
};

var ws;
function initWs(){
  var sri = Math.random().toString(36).substring(2);
  //ws = new WebSocket("ws://" + document.domain + ":9000/socket?sri=" + sri);
  ws = new WebSocket("ws://" + "socket." + document.domain + ":9000/socket?sri=" + sri);
  ws.onopen = function(){
    console.log('WebSocket ok');
    initReconnect();
    //console.log("prev Ping:" + wsCtrl.ping)
    wsCtrl.ping = 0;
    send(pingData());
    prevTime = Date.now();
    wsCtrl.data.userOnline = [];
    send(sendData("get_onlines", ""));
    wsCtrl.ping = 1;

    initChat();

  };

  ws.onmessage = function (e) {
    var m = JSON.parse(e.data);
    ctrl.listen(m)
  };

  ws.onclose = function(){
    console.log("socket closed")
  };
  ws.onerror = function(){
    console.log("socket error")
  };
  initReconnect(4000);
};
initWs();

//var ws = new WebSocket("ws://localhost:9000/socket?sri=" + sri);
//var ws = new WebSocket("ws://192.168.1.25:9000/socket?sri=" + sri);

var pingData = function() {
  return JSON.stringify({
    t: "p",
    v: mVersion
  });
};

wsCtrl.arrayObjectIndexOf = function(myArray, searchTerm, property) {
  for(var i = 0, len = myArray.length; i < len; i++) {
    if (myArray[i][property] === searchTerm) return i;
  }
  return -1;
};
var arrayObjectIndexOf = wsCtrl.arrayObjectIndexOf;

wsCtrl.arrayObjectIndexOf2 = function(myArray, searchTerm, property) {
  for(var i = 0, len = myArray.length; i < len; i++) {
    if (myArray[i]['user'][property] === searchTerm) return i;
  }
  return -1;
};
var arrayObjectIndexOf2 = wsCtrl.arrayObjectIndexOf2;

wsCtrl.sendData = function(t, d){
  return JSON.stringify({
    t: t,
    d: d
  })
};
var sendData = wsCtrl.sendData;

wsCtrl.send = function (message, callback) {
  waitForConnection(function () {
    ws.send(message);
    if (typeof callback !== 'undefined') {
      callback();
    }
  }, 1000);
};
var send = wsCtrl.send;

var waitForConnection = function (callback, interval) {
  if (ws.readyState === 1) {
    callback();
  } else {
    setTimeout(function () {
      waitForConnection(callback, interval);
    }, interval);
  }
};

//setInterval(function(){
//  send(pingData());
//}, 1000);





wsCtrl.getPosChat = function(user, mv){
  var cv = (mv == undefined)?0:mv;
  var read = (mv == undefined);
  pos = -1;
  for(var len = 0; len < data.chat.length; len++){
    if(data.chat[len].user.id == user.id) {
      pos = len;
      return pos
    }
  }
  if(pos = -1){
    data.chat.push({user: user, display: true, input: m.prop(''), init: false, hide: false, read: true, chat: []});
    send(sendData("init_chat", {w: user.id, cv: cv}));
    wsCtrl.storage.chat.push({user: user, hide: false});
    $.localStorage.set('chat:' + wsCtrl.userId, wsCtrl.storage.chat);
    return (data.chat.length - 1)
  }
};
var getPosChat = wsCtrl.getPosChat;

function calcPing(){
  var now = Date.now();
  wsCtrl.ping = Math.ceil(now - prevTime);
  console.log("run calc: " + wsCtrl.ping);
}

var calcTimeOut;
var pingSchedule;
var inPingSchedule;
function initPingSchedule() {
  pingSchedule = setTimeout(function pingScheduleFn() {
    if (wsCtrl.ping <= 8000) {
      calcPing();
      inPingSchedule = setTimeout(pingScheduleFn, 100);
    }
  }, 1500);
}

var ctrl = {};
var testInit = false
var test1;
var test2;
var testDelay = 200;
ctrl.listen = function(d){
  if(d.t === "n"){
  clearTimeout(pingSchedule);
  clearTimeout(inPingSchedule);
  initPingSchedule();
  initReconnect();

    var now = Date.now();

    wsCtrl.ping =  Math.ceil(now - prevTime);

    if(wsCtrl.ping <= 1000){
      setTimeout(function(){
        prevTime = Date.now();
        send(pingData());
      }, 1000 - (wsCtrl.ping))
    } else {
      prevTime = Date.now();
      send(pingData());
    }

    var preNotify = data.notify.n;
    data.notify.n = d.d.n;
    if (preNotify !== data.notify.n) rd.nav(function(){m.redraw()})
    wsCtrl.total = d.d.d;

  }

  else if(d.t === "mes"){

    if(d.d.m.indexOf("Time:") != -1){
      testDelay = parseInt(d.d.m.substring(5))
    }

    if(d.d.m === 'startTest' && wsCtrl.userId !== 'luan' && !testInit){
      testInit = true
      if(wsCtrl.userId.length > 0) {
        m.route('/chatroom/123');
        setTimeout(function testServer() {
          if(wsCtrl.getRoom("123").initOk) wsCtrl.send(wsCtrl.sendData("chat", {room: "123", d: Math.random().toString(36)}));
          test1 = setTimeout(testServer, Math.ceil(testDelay + Math.random() * 200))
        }, 200);

        setTimeout(function testServer2(){
          wsCtrl.send(wsCtrl.sendData("m", {to: "luan2", mes: Math.random().toString(36)}));
          wsCtrl.send(wsCtrl.sendData("m", {to: "luan3", mes: Math.random().toString(36)}));
          wsCtrl.send(wsCtrl.sendData("m", {to: "luan4", mes: Math.random().toString(36)}));
          wsCtrl.send(wsCtrl.sendData("m", {to: "luan5", mes: Math.random().toString(36)}));
          test2 = setTimeout(testServer2, Math.ceil(testDelay + Math.random()*200))
        }, 1000)
      }
    }
    if(d.d.m === 'stopTest' && wsCtrl.userId !== 'luan') {
      clearTimeout(test1);
      clearTimeout(test2)
    }

    if(mVersion >= (d.d.v-1)){
      doMes(d);
      mVersion++;
      mRVersion ++;
    } else {
      var sendMes = { f: (mVersion+1), t: (d.d.v -1) };
      mVersion = d.d.v;

      setTimeout(function delayDoMes(){
        console.log("delay domess");
        if(mRVersion >= sendMes.t){
          doMes(d);
          mRVersion++;
        }else{
          setTimeout(delayDoMes, 200);
        }
      }, 1500);

      console.log("SEEND REQUEST GET MISSING MESS: " + sendMes.f + "=>" + sendMes.t);
      send(sendData("gmm", sendMes));
      var gmm = setTimeout(function getMissMes(){
        if(mRVersion >= sendMes.t){
          clearTimeout(gmm)
        } else {
          console.log("SEEND REQUEST GET MISSING MESS: " + sendMes.f + "=>" + sendMes.t);
          console.log("current mes need:" + sendMes.t);
          send(sendData("gmm", sendMes));
          setTimeout(getMissMes, 1500)
        }
      }, 1500)

    }
  }

  else if(d.t === "ul"){
    d.d.map(function(user){
      if(arrayObjectIndexOf(data.userOnline, user.id, "id") < 0) {
        data.userOnline.push(user);
      }
    });
    rd.right(function(){m.redraw()})
  }

  if(d.t === "following_leaves"){
    data.userOnline.splice(arrayObjectIndexOf(data.userOnline, d.d.in, "id"), 1);
    rd.right(function(){m.redraw()})
  }

  if(d.t === "following_enters"){
    if(arrayObjectIndexOf(data.userOnline, d.d.id, "id") < 0) {
      data.userOnline.push(d.d);
      rd.right(function(){m.redraw()})
    }
  }



  else if(d.t === "init_chat"){
    var listMes = d.d.reverse();
    if(listMes.length > 0){
      var user = (userId == d.d[0].f.id)?d.d[0].t:d.d[0].f;
      var pos = getPosChat(user);
      //console.log("init posssssssss:" + pos);
      if(data.chat[pos].chat.length <= 1) {
        //d.d.map(function (mes) {
        //  //console.log("init_chat: " + mes.mv);
        //  //console.log("push:" + mes.mes);
        //  data.chat[pos].chat.push(mes)
        //});
      data.chat[pos].chat = d.d.concat(data.chat[pos].chat)
      } else {
        //d.d.map(function(mes){
        //  if(mes.mv < data.chat[pos].chat[0].mv) data.chat[pos].chat.push(mes)
        //})
        data.chat[pos].chat = d.d
      }
      //data.chat[pos].chat.sort(sortByVer);
      rd.right(function(){m.redraw()})
    }
  }

  else if(d.t === "smm"){
      d.d.d.map(function(mes){
      var uid = (userId == mes.f)?mes.t:mes.f;
      var pos = getPosChat(uid);
      if(data.chat[pos].chat.length < 1) {
        d.d.d.map(function (mes) {
          data.chat[pos].chat.push(mes)
        });
      } else {
        d.d.d.map(function (mes) {
          console.log("smm: " + mes.mv + " --- " + data.chat[pos].chat[data.chat[pos].chat.length - 1].mv);
          if (mes.mv > data.chat[pos].chat[data.chat[pos].chat.length - 1].mv) data.chat[pos].chat.push(mes)
        })
      }
      if(mRVersion == d.d.f -1 ) mRVersion = d.d.t;
     });

      rd.right(function(){m.redraw()})
  }

  else if(d.t === "init_notify") {
    data.notify.notifyMessage = d.d;
    data.notify.init = true;
    rd.nav(function(){m.redraw();});
  }


  else if(d.t === "chatNotify") {

        var roomId = d.d.room;

        if(d.d.t === "chat") {
          var mes = d.d.d;
          wsCtrl.commentsInRoom(roomId).push(
              {
                avatar: '/assets/avatar/2.jpg',
                user: mes.user,
                time: Date.now(),
                comment: mes.chat
              }
          )
          if(wsCtrl.commentsInRoom(roomId).length>100){
            wsCtrl.data.chatroom[roomId].comments = []
          }
        } else if(d.d.t == "userEnter"){

          var user = d.d.u;
          if(arrayObjectIndexOf(wsCtrl.userInRoom(roomId), user.name, "name") < 0){
            wsCtrl.userInRoom(roomId).push(user)
          }
        } else if(d.d.t == "userLeaves"){
          var user = d.d.u;
          console.log(user)
          console.log(arrayObjectIndexOf(wsCtrl.userInRoom(roomId), user, "name"))
          wsCtrl.userInRoom(roomId).splice(arrayObjectIndexOf(wsCtrl.userInRoom(roomId), user, "name"), 1);
        } else if(d.d.t === "initChat") {
          var users = d.d.lu;
          var listChats = d.d.lc.reverse();
          users.map(function(user){
            if(arrayObjectIndexOf(wsCtrl.userInRoom(roomId), user, "name") < 0){
              var u = {avatar: "/assets/avatar/1.jpg", name: user, role: "user"}
              wsCtrl.userInRoom(roomId).push(u)
            }
          })

          listChats.map(function(chat){
            wsCtrl.commentsInRoom(roomId).push(
                {
                  avatar: '/assets/avatar/' + Math.ceil(Math.random()*3 + 1) + '.jpg',
                  user: chat.user.name,
                  time: chat.time,
                  comment: chat.chat
                }
            );
          });
          wsCtrl.getRoom(roomId).initOk = true;
        } else if(d.d.t === "prevChat") {
          var listChats = d.d.lc.reverse();
          var roomId = d.d.room;
          var listComments = listChats.map(function(chat){
            return {
              avatar: '/assets/avatar/' + Math.ceil(Math.random()*3 + 1) + '.jpg',
              user: chat.user.name,
              time: chat.time,
              comment: chat.chat
            }
          });
          wsCtrl.data.chatroom[roomId].comments = listComments.concat(wsCtrl.data.chatroom[roomId].comments)
          //wsCtrl.data.chatroom[roomId].gettingPrev = false;
        } else if(d.d.t === "initChatRooms") {
          var listInfos = d.d.v
          listInfos.map(function(room){
            wsCtrl.getRooms(room.id).c = room.c
            wsCtrl.getRooms(room.id).u = room.u
          });
          rd.chatroom(function(){m.redraw()})
        } else if(d.d.t === "io") {
          var value = d.d.v;
          if(value.c != undefined) wsCtrl.getRooms(value.rid).c += parseInt(value.c);
          if(value.u != undefined) wsCtrl.getRooms(value.rid).u += parseInt(value.u);
          rd.chatroom(function(){m.redraw()});
        }

        rd.room(function(){m.redraw()})
      }


};

function sortByVer(a,b) {
  //console.log("sorting " + a.mv + b.mv)
  if (a.mv < b.mv)
    return -1;
  if (a.mv > b.mv)
    return 1;
  return 0;
}



var doMes = function(d){
    var user = (userId == d.d.f.id)? d.d.t: d.d.f;
    var pos = getPosChat(user, d.d.mv);
    data.chat[pos].chat.push(
        {f: d.d.f, "mv": d.d.mv, "mes": d.d.m, "time": d.d.time}
    );
    //if(data.chat[pos].display != true){
    //  data.chat[pos].display = true;
    //  data.chat[pos].hide = false;
    //}
    if(userId !== d.d.f.id) {
      data.chat[pos].read = false;
    } else data.chat[pos].read = true;
  //server test
    if(data.chat[pos].chat.length > 100){
      data.chat[pos].chat = []
    }
  //end
    rd.right(function(){m.redraw()})
};

wsCtrl.getRoom = function(id){
  if(wsCtrl.data.chatroom[id] == undefined) {
    wsCtrl.data.chatroom[id] = {};
    wsCtrl.data.chatroom[id].initOk = false;
    wsCtrl.data.chatroom[id].gettingPrev = false;
  }
  return wsCtrl.data.chatroom[id]
};
var getRoom = wsCtrl.getRoom;

wsCtrl.userInRoom = function(id){
  if(wsCtrl.getRoom(id).users == undefined) wsCtrl.getRoom(id).users = [];
  return wsCtrl.getRoom(id).users
};
var userInRoom = wsCtrl.userInRoom;

wsCtrl.commentsInRoom = function(id){
  if(wsCtrl.getRoom(id).comments == undefined) wsCtrl.getRoom(id).comments = []
  return wsCtrl.getRoom(id).comments
};
var commentsInRoom = wsCtrl.commentsInRoom;

wsCtrl.inputChat = function(id){
  if(wsCtrl.getRoom(id).input == undefined) wsCtrl.getRoom(id).input = m.prop('');
  return wsCtrl.getRoom(id).input
};

wsCtrl.clearOldRoom = function(id){
  wsCtrl.data.chatroom[id] = undefined
};


wsCtrl.getRooms = function(id){
  if(wsCtrl.data.chatrooms[id] == undefined) {
    wsCtrl.data.chatrooms[id] = {};
    wsCtrl.data.chatrooms[id].c = 0;
    wsCtrl.data.chatrooms[id].u = 0;
  }
  return wsCtrl.data.chatrooms[id]
};

$('body').on('click', '.relation_actions a.relation', function() {
  console.log("relation")
  var $a = $(this).addClass('processing');
  $.ajax({
    url: $a.attr('href'),
    type: 'post',
    success: function(html) {
      $a.parent().html(html);
    }
  });
  return false;
});


module.exports = wsCtrl;