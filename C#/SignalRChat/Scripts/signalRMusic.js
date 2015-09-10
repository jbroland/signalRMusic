﻿var chat = $.connection.chatHub;
var oscillators = new Array();
var context = new AudioContext();

/******ADD A SOUND FUNCTIONS ******************/
var addSound = function () {
    chat.server.createSound();
}

var createHtmlElement = function (id, f) {
    //create osc object
    var temp = context.createOscillator();
    temp.connect(context.destination);

    if( f ){
        temp.frequency.value = f;
    }
    oscillators[id] = temp;

    //create html element
    var html = new Array();
    html.push("<div class='sound' id='" + id + "'>");
    html.push('<input type="range"  min="0" max="1000" value="'+f+'" onClick="setFrequency(this, this.value)"/>');
    html.push('</div>');
    $(".sounds").append(html.join(""));
}

chat.client.broadcastCreateSound = function(id){
    createHtmlElement(id);
}

chat.client.broadcastUpdateClientSounds = function (jsonSounds) {
    sounds = JSON.parse(jsonSounds);
    for (i in sounds) {
        createHtmlElement(sounds[i].id, sounds[i].f);
    }
}
/**********************************************************/


/******* MODIFY REQUENCY FUNCTIONS **********************/
var setFrequency = function (el, f) {
    var id = $(el).parents(".sound").attr("id");
    chat.server.modifyFrequency(id, parseInt(f));
}

chat.client.broadcastFrequencyChange = function (id, f) {
    updateFrequency(id, f);
}

var updateFrequency = function (id, f) {
    if (oscillators[id]) {
        oscillators[id].frequency.value = f;
        $("#" + id + " input").val(f);
    }
}
/*****************************************************/

var playSounds = function () {
    for (i in oscillators) {
        console.log(i);
        oscillators[i].start();
    }
}

var stopSounds = function () {
    for (i in oscillators) {
        var saveFreq = oscillators[i].frequency.value;
        oscillators[i].stop();

        oscillators[i] = context.createOscillator();
        oscillators[i].connect(context.destination);
        oscillators[i].frequency.value = saveFreq;
    }
}

$(function () {

    $.connection.hub.start().done(function () {
        chat.server.updateClientSounds();
    });

    /*  document.getElementById('file').addEventListener('change', handleFileSelect, false);
      function handleFileSelect(evt) {
          var file = evt.target.files[0];
          var fr = new FileReader();
          fr.addEventListener("load", function () {
              var len = fr.result.length;
              var buf = new ArrayBuffer(len);
              var view = new Uint8Array(buf);
              for (var i = 0; i < len; i++) {
                  view[i] = fr.result.charCodeAt(i) & 0xff;
              }
              var blob = new Blob([view], { type: "audio/x-wav" });
  
              $("#audioPlayer").append("<source src='" + URL.createObjectURL(blob) + "'/>")
  
              chat.server.send($('#displayname').val(), fr.result);
          });
  
          fr.readAsBinaryString(file);
  
      }*/

    /*chat.client.broadcastMessage = function (name, message) {
        var len = message.length;
        var buf = new ArrayBuffer(len);
        var view = new Uint8Array(buf);
        for (var i = 0; i < len; i++) {
            view[i] = message.charCodeAt(i) & 0xff;
        }
        var blob = new Blob([view], { type: "audio/x-wav" });


        $("#audioPlayer").append("<source src='" + URL.createObjectURL(blob) + "'/>")
    };

    $('#displayname').val(prompt('Enter your name:', ''));
    $('#message').focus();

    $.connection.hub.start().done(function () {
        $('#hzSelector').change(function () {
            chat.server.send($('#displayname').val(), $('#hzSelector').val());
            $('#message').val('').focus();


        });
    });*/
});