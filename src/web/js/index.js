$(function(){

  $('#login').hide();
  $('#roomList').hide(); 

  var socket = io.connect();
  var $frmMessage = $('#send-message');
  var $frmNick = $('#setNick');
  var $nickError = $('#nickError');
  var $nickBox = $('#txtName');
  var $boxMessage = $('#message');
  var $chat = $('#chat');
  
  $('#login').show();
  $('#roomList').hide(); 

  $frmNick.submit(function(e){
    console.log($nickBox.val());
    console.log('hi, frmNick');
    e.preventDefault();
    
    socket.emit('new user', $nickBox.val() );
    
    $nickBox.val('');
    $('#login').hide();
    $('#roomList').show();
    
  });
  $frmMessage.submit(function(e){
    e.preventDefault();
    socket.emit('send message', $boxMessage.val().trim());
    $boxMessage.val('');
  });
  socket.on('usernames', function(data){
    var sb = '';
    for(var d = 0; d < data.length; d++ ) {
      console.log(data[d]);
      sb += data[d] + "<br />";
    }
    $('div#users').html(sb);
  });

  /**
   * 系統訊息
   */
  socket.on('SYSTEM_INFO', function(server, msg){
    const now = new Date(); 
    var datetime = now.getFullYear() + '/' + (now.getMonth()+1) + '/' + now.getDate(); 
    datetime += ' ' + now.getHours() + ':' + now.getMinutes() + ':' + now.getSeconds(); 

    // $chat.append("<br /><i>系統訊息: <b>[ " + msg + " ]</b> (" + datetime + ")</i><br />");
    $chat.append("<br />");
    $chat.append('<span class="system-message">' + `系統訊息: ${msg} (${datetime})` + '</span>');
    $chat.append("<br />");
  });

  socket.on('new message', function(data){
    var msg = data.msg;
    var name = data.nick;
    var now = new Date(); 
    var datetime = now.getFullYear()+'/'+(now.getMonth()+1)+'/'+now.getDate(); 
      datetime += ' '+now.getHours()+':'+now.getMinutes()+':'+now.getSeconds(); 
    $chat.append("<b>" + name + " </b>: " + msg + " (<i>" + datetime + "<i>)<br />");
  });
});