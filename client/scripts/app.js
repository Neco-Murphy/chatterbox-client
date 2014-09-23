
var app = {
  server: 'https://api.parse.com/1/classes/chatterbox',
  rooms: [],
  friends: [],
  friendStyle: {'font-weight':'bold'},
  roomFilter: undefined,
  init: function(){
    var self = this;

    //submits a chat when clicked
    $('#send .submit').submit(function(event){
      event.preventDefault();
      self.handleSubmit();
      $('#message').val('');
      $('#roomname').val('');
      app.fetch();
    });

    //brings you back to all chats when header is clicked
    $('.allChats').on('click', function(event){
      event.preventDefault();
      app.roomFilter = undefined;
      app.fetch();
    });

   //makes friend styled with 'app.friendStyle' when clicked
    $('#main').on('click', '.username',function(event){
      event.preventDefault();
      var self = $(this).text();
      app.addFriend(self);
      app.fetch();
    });

    //adds a filter to the rooms when a room button is clicked
    $('#roomSelect').on('click','.roombutton',function(){
      var self = $(this).text();
      app.filterRoom(self);
      app.fetch();
    });
  },

  send: function(message){
    $.ajax({
      url: this.server,
      type: 'POST',
      data: JSON.stringify(message),
      contentType: 'application/json',
      success: function (data) {
        console.log('chatterbox: Message sent');
      },
      error: function (data) {
        // see: https://developer.mozilla.org/en-US/docs/Web/API/console.error
        console.error('chatterbox: Failed to send message');
      }
    });
  },

  handleSubmit: function(){
    var username = window.location.search.slice(10);
    var text = $('#message').val();
    var roomname = $('#roomname').val();

    var fullMessage = {
      'username': username,
      'text': text,
      'roomname': roomname
    };

    console.log(fullMessage);
    app.send(fullMessage);

  },

  addMessage: function(message, room){

    //add dive for each class
    var div = $('<div></div>').addClass(message.username);

    //add dive for each user
    var user = $('<a class ="username" href=""></a>').text(message.username).addClass(message.username);


    //add a cleaner looking time stamp
    var time = message.createdAt.substr(11,5);
    var minute = (time.substr(2,3));
    var timeAMPM = (+time.substr(0,2)>12)? (time.substr(0,2)-12) +minute +' PM': time.substr(0,5)+ ' AM';
    var date = message.createdAt.substr(5,2)+'/'+message.createdAt.substr(8,2)+'/'+message.createdAt.substr(0,4);

    //add div for date/time
    var $timeDIV = $('<div class="time"></div>').text(timeAMPM + ' -- ' + date);

    //add message to the div
    var chatMessage = div.text(': ' +message.text);

    //if message is from a friend add css styling
    if(app.friends.indexOf(message.username)!==-1){
      chatMessage.css(app.friendStyle);
    };

    div.prepend(user);
    div.append($timeDIV);
    $('#chats').append(chatMessage).addClass(room);

    $('.username').on('click', function(){
      app.addFriend();
    });


  },

  fetch: function(){
    $.ajax({
      url: this.server,
      type: 'GET',
      data: {'order' : '-createdAt'},
      contentType: 'application/json',
      success: function (data) {
        var list = [];
        app.clearMessages();
        //if room filter is defined, make the list of 10 messages of that roomname.
        if(app.roomFilter){
          var counter = 0;

          _.each(data.results, function(item){

            if(item.roomname===app.roomFilter){
              if(counter<=10){
                list.push(item);
                counter++;
              }
            }
          });
        } else {
          //if it is not defined, make the list with last 10 messages.
          list = data.results.slice(0, 10);
        }

        //go through the list and add messages for each item.
        _.each(list,function(item){
          app.addMessage(item, app.roomFilter);
        });

        //check entire list for room names
        _.each(data.results, function(item){
          if(item.roomname && app.rooms.indexOf(item.roomname) === -1) {
            app.rooms.push(item.roomname);
          }

        });

        //clear friends div
        app.clearFriends();
        //add friend names to friends div
        _.each(app.friends, function(item){
          var $p = $('<p></p>').text(item);
          $('#friends').append($p);
        });

        app.clearRooms();
        app.addRoom();
      },
      error: function (data) {
        console.error('chatterbox: Failed to fetch message');
      }
    });
  },

  clearMessages: function(){
    $('#chats').children().remove();
  },

  clearRooms: function(){
    $('#roomSelect').children().remove();
  },


  addRoom: function(){

    _.each(app.rooms, function(roomname){
      var roomButton = $('<button></button>').addClass('roombutton').text(roomname);
    $('#roomSelect').append(roomButton);
    });


  },

  filterRoom: function(roomname){
    app.roomFilter = roomname;
  },

  addFriend: function(friend){
    if(app.friends.indexOf(friend) === -1){
      app.friends.push(friend);
    }
  },

  clearFriends: function(){
    $('#friends').children('p').remove();
  }
};

app.fetch();
// setInterval(function(){
//   app.fetch();
// }, 5000);

var message = {
  'username': 'shawndrost',
  'text': 'hello world',
  'roomname': '4chan'
};
