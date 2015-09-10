var chat = $.connection.chatHub;
$(function () {
    $.connection.hub.start();
    chat = $.connection.chatHub;
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



var oscillators = new Array();
var context = new AudioContext();



var addSound = function (id) {
    
    var newId = (id) ? id : 'sound' + oscillators.length;
    chat.server.createSound(newId);
   
}

var createHtmlElement = function (id) {
    //create osc object
    var temp = context.createOscillator();
    temp.connect(context.destination);
    oscillators.push(temp);

    //create html element
    var html = new Array();
    html.push("<div class='sound' id='" + id + "'>");
    html.push('<input type="range"  min="0" max="1000" value="0" onClick="setFrequency(this, this.value)"/>');
    html.push('</div>');
    $(".sounds").append(html.join(""));
}

chat.client.broadcastCreateSound = function(id){
    createHtmlElement(id);
}

var setFrequency = function (el, f) {
    var id = $(el).parents(".sound").attr("id");
    chat.server.modifyFrequency(id, parseInt(f));
}

chat.client.broadcastFrequencyChange = function (id, f) {
    updateFrequency(id, f);
}

var updateFrequency = function (id, f) {
    
    oscillators[id.replace("sound", "")].frequency.value = f;
    $("#" + id + " input").val(f);
}

var playSounds = function () {
    for (var i = 0; i < oscillators.length; i++) {
        oscillators[i].start();
    }
    
}

var stopSounds = function () {
    for (var i = 0; i < oscillators.length; i++) {
        oscillators[i].stop();

        oscillators[i] = context.createOscillator();
        oscillators[i].connect(context.destination);
    }
}