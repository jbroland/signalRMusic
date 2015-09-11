var chat = $.connection.chatHub;
var oscillators = new Array();
var oscillatorsPlaying = new Array();
var timeToPlay = new Array();
var timeToStop = new Array();
var context = new AudioContext();
var isPlaying = false;


$(function () {
    $.connection.hub.start().done(function () {
        chat.server.updateClientSounds();
    });

    document.getElementById('file').addEventListener('change', handleFileSelect, false);
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
            var blob = new Blob([view], { type: file.type });
            createAudioElement("audio0", file.name, fr.result, file.type);

            chat.server.sendAudioFile(file.name.toString(), fr.result.toString(), file.type.toString());
        });

        fr.readAsBinaryString(file);
    }
});

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
    oscillatorsPlaying[id] = false;
    timeToPlay[id] = 1;
    timeToStop[id] = 0;

    //create html element
    var html = new Array();
    html.push("<div class='sound' id='" + id + "'>");
    html.push('<input type="range"  min="0" max="1000" value="' + f + '" onClick="setFrequency(this, this.value)"/>');
    html.push('<div class="sound_types">');
    html.push('<input type="radio" name="type_' + id + '" value="sine">sine</input>');
    html.push('<input type="radio" name="type_' + id + '" value="square">square</input>');
    html.push('<input type="radio" name="type_' + id + '" value="sawtooth">sawtooth</input>');
    html.push('<input type="radio" name="type_' + id + '" value="triangle">triangle</input>');
    html.push('</div>');
    html.push('<div class="sound_range">');
    html.push('<input type="text" name="timePlay" onchange="modifyTimeToPlay(' + id + ',this.value)">');
    html.push('<input type="text" name="timeStop"onchange="modifyTimeToStop(' + id + ',this.value)">');
    html.push('</div>');
    html.push('</div>');
    $(".sounds").append(html.join(""));

    //bind function
    $(":radio[name='type_"+id+"']").bind('click', function () {
        var newType = $(this + ":checked").val();
        chat.server.modifyType(id, newType);
    });
}

chat.client.broadcastCreateSound = function(id){
    createHtmlElement(id);
}

chat.client.castUpdateClientSounds = function (jsonSounds) {
    sounds = JSON.parse(jsonSounds);
    for (i in sounds) {
        createHtmlElement(sounds[i].id, sounds[i].f);
    }
}
/**********************************************************/

/************ADD AUDIO FUNCTIONS **************************/
var createAudioElement = function (id, name, buffer, audioType) {
    var len = buffer.length;
    var buf = new ArrayBuffer(len);
    var view = new Uint8Array(buf);
    for (var i = 0; i < len; i++) {
        view[i] = buffer.charCodeAt(i) & 0xff;
    }
    var blob = new Blob([view], { type: audioType });

    html = new Array();
    html.push("<div class='audio'>");
    html.push("<audio id='" + id + "' controls='controls'>");
    html.push("<source src='" + URL.createObjectURL(blob) + "'/>");
    html.push("</audio>");
    html.push("</div>");

    $(".sounds").append(html.join(""));
}


/********************************************************/


/******* MODIFY REQUENCY FUNCTIONS **********************/
var setFrequency = function (el, f) {
    var id = $(el).parents(".sound").attr("id");
    chat.server.modifyFrequency(id, parseInt(f));
}

chat.client.broadcastFrequencyChange = function (id, f) {
    if (oscillators[id]) {
        oscillators[id].frequency.value = f;
        $("#" + id + " input").val(f);
    }
}

chat.client.broadcastTypeChange = function (id, type) {
    if (oscillators[id]) {
        oscillators[id].type = type;
        $(":input[name='type_" + id + "'][value='" + type + "']").attr('checked', true);
    }
}
/*****************************************************/

var modifyTimeToPlay = function (i, sec) {
    timeToPlay[i] = sec;
}

var modifyTimeToStop = function (i, sec) {
    timeToStop[i] = sec;
}


/******* DELETE SOUNDS FUNCTIONS **********************/

chat.client.broadcastResetSounds = function () {
    $(".sounds").empty();
    oscillators = new Array();
}

var resetSounds = function () {
    stopSounds();
    chat.server.resetSounds();
}


/*****************************************************/

var playSounds = function () {
    if (isPlaying == true)
        return;
    else
        isPlaying = true;
    for (i in oscillators) {
        console.log(i);
        oscillators[i].start();
        oscillatorsPlaying[i] = true;
        //stopSound(i, timeToPlay[i]);
    }
}

var stopSounds = function () {
    if (isPlaying == false)
        return;
    else
        isPlaying = false;
    for (i in oscillators) {
        var saveFreq = oscillators[i].frequency.value;
        oscillators[i].stop();
        oscillatorsPlaying[i] = false;

        oscillators[i] = context.createOscillator();
        oscillators[i].connect(context.destination);
        oscillators[i].frequency.value = saveFreq;
        stopSound(i, 150);
    }
}

/*var playSound = function (i, sec) {
    if (oscillatorsPlaying[i])
        return;
    oscillators[i].start(context.currentTime + sec);
    oscillatorsPlaying[i] = true;
    isPlaying = true;
    for (i in oscillatorsPlaying) {
        if (!oscillatorsPlaying)
            isPlaying = false;
    }
    sec += timeToPlay[i];
    if (sec >= 100)
        return;
    stopSound(i, sec);
}*/

/*var stopSound = function (i, sec) {
    if (!oscillatorsPlaying[i])
        return;
    var saveFreq = oscillators[i].frequency.value;
    oscillators[i].stop(context.currentTime + sec);
    oscillatorsPlaying[i] = false;
    isPlaying = false;
    for (i in oscillatorsPlaying) {
        if (oscillatorsPlaying)
            isPlaying = true;
    }
    oscillators[i] = context.createOscillator();
    oscillators[i].connect(context.destination);
    oscillators[i].frequency.value = saveFreq;
    sec += timeToStop[i];
    if (sec >= 100)
        return;
    playSound(i, sec);
}*/

$(function () {



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