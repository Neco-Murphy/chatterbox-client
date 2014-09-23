
var app = {

  server: 'https://api.parse.com/1/classes/chatterbox',
  init: function(){
    var self = this;
    $('#send').on('submit',function(){
      self.handleSubmit();
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
    var div = $("<div></div>").addClass(message.username);
    var user = $('<a class ="username" href=""></a>').text(message.username).addClass(message.username);
    if(arguments[1] === undefined){
      room = "#chats";
    }

    var chatMessage = div.text(": " + message.createdAt + message.text);
    div.prepend(user);
    $(room).append(chatMessage);
    $(".username").on('click', function(){
       app.addFriend();
    });
  },
  fetch: function(){
    $.ajax({
      url: this.server,
      type: 'GET',
      contentType: 'application/json',
      success: function (data) {
        var list = data.results.slice(90);
        list.reverse();
        _.each(list, function(item){
          app.addMessage(item);
        });
      },
      error: function (data) {
        console.error('chatterbox: Failed to fetch message');
      }
    });
  },
  clearMessages: function(){
    $('#chats').children().remove();
  },


  addRoom: function(room){
    var roomDiv = $('<div></div>').addClass(room);
    $('#roomSelect').append(roomDiv);
  },

  addFriend: function(){
  }
};

app.fetch();
setInterval(function(){
  app.clearMessages();
  app.fetch();
}, 5000);

var message = {
  'username': 'shawndrost',
  'text': 'hello world',
  'roomname': '4chan'
};
