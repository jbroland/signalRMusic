var context = new AudioContext();
var oscillators = new Array();

var playSound = function(){
	for(var i=0; i<oscillators.length; i++){
		oscillators[i].start();
	}
	document.getElementById("audio").play();
}

var stopSound = function(){
	for(var i=0; i<oscillators.length; i++){
		oscillators[i].stop();

		oscillators[i] = context.createOscillator();
		oscillators[i].connect(context.destination);
	}
}

var setFrequency = function(el, f){
	var id = $(el).parents(".sound").attr("id");
	oscillators[id.replace("sound", "")].frequency.value = f;
}

var addSound = function(){
	var newSound = $(".sound:eq(0)").clone();
	newSound.attr("id", "sound" + oscillators.length );
	$(".sounds").append(newSound);
	createNewSound();
}

var createNewSound = function(){
	var temp = context.createOscillator();
	temp.connect(context.destination);
	oscillators.push(temp);
}

 function handleFileSelect(evt) {
 	var file = evt.target.files[0];
 	$("#oldAudio").append("<source src='"+file.name+"'/>")

 	var fr = new FileReader();
 	fr.readAsBinaryString(file);

 	wavString = fr.result;
 	var len = wavString.length;
	var buf = new ArrayBuffer(len);
	var view = new Uint8Array(buf);
	for (var i = 0; i < len; i++) {
	  view[i] = wavString.charCodeAt(i) & 0xff;
	}
	var blob = new Blob([view], {type: "audio/x-wav"});


 	$("#newAudio").append("<source src='"+URL.createObjectURL(blob)+"'/>")
  }

  function sendNewValue(value){

  }

  function blobToFile(theBlob, fileName){
    //A Blob() is almost a File() - it's just missing the two properties below which we will add
    theBlob.lastModifiedDate = new Date();
    theBlob.name = fileName;
    return theBlob;
}

  document.getElementById('file').addEventListener('change', handleFileSelect, false);

createNewSound();