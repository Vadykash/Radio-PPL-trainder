
//webkitURL is deprecated but nevertheless 
URL = window.URL || window.webkitURL;
var gumStream;
//stream from getUserMedia() 
var rec;
//Recorder.js object 
var input;
//MediaStreamAudioSourceNode we'll be recording 
// shim for AudioContext when it's not avb. 
var AudioContext = window.AudioContext || window.webkitAudioContext;
var audioContext = new AudioContext;
//new audio context to help us record 
var recordButton = document.getElementById("recordButton");
var stopButton = document.getElementById("stopButton");
var pauseButton = document.getElementById("pauseButton");
var post_result = document.getElementById("post_result");
var user_name_input = document.getElementById("user_name");
var set_user_btn = document.getElementById("setUserButton")
var user_records = document.getElementById("user_records");

console.log(post_result);
//add events to those 3 buttons 

/* Simple constraints object, for more advanced audio features see

https://addpipe.com/blog/audio-constraints-getusermedia/ */

var constraints = {
    audio: true,
    video: false
} 
/* Disable the record button until we get a success or fail from getUserMedia() */

recordButton.disabled = false;
stopButton.disabled = true;
pauseButton.disabled = true

/* We're using the standard promise based getUserMedia()

https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia */
function setButtonsEnabled(val) {
	recordButton.disabled = !val;
	stopButton.disabled = !val;
	pauseButton.disabled = !val;
}


navigator.mediaDevices.getUserMedia(constraints).then(function(stream) {
    console.log("getUserMedia() success, stream created, initializing Recorder.js ..."); 
    /* assign to gumStream for later use */
    gumStream = stream;
    /* use the stream */
    input = audioContext.createMediaStreamSource(stream);
    /* Create the Recorder object and configure to record mono sound (1 channel) Recording 2 channels will double the file size */
    rec = new Recorder(input, {
        numChannels: 1
    }) 
    //start the recording process 
    rec.record()
    console.log("Recording started");
}).catch(function(err) {
    //enable the record button if getUserMedia() fails 
    setButtonsEnabled(false);
    pauseButton.disabled = true
});


function pauseRecording() {
    console.log("pauseButton clicked rec.recording=", rec.recording);
    if (rec.recording) {
        //pause 
        rec.stop();
        pauseButton.innerHTML = "Resume";
    } else {
        //resume 
        rec.record()
        pauseButton.innerHTML = "Pause";
    }
}

function stopRecording() {
    console.log("stopButton clicked");
    //disable the stop button, enable the record too allow for new recordings 
    //reset button just in case the recording is stopped while paused 
    pauseButton.innerHTML = "Pause";
    //tell the recorder to stop the recording 
    rec.stop(); //stop microphone access 
    gumStream.getAudioTracks()[0].stop();
    //create the wav blob and pass it on to createDownloadLink 
    //rec.exportWAV(createDownloadLink);
    setButtonsEnabled(false);
    recordButton.disabled = false;
    rec.exportWAV(sendWAV);

}

function sendWAV(blob) {
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "data.json");
    xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
    var reader = new FileReader();

    // The magic always begins after the Blob is successfully loaded
    reader.onload = function () {
        // Since it contains the Data URI, we should remove the prefix and keep only Base64 string
        var b64 = reader.result.replace(/^data:.+;base64,/, '');
        console.log(b64); //-> "V2VsY29tZSB0byA8Yj5iYXNlNjQuZ3VydTwvYj4h"
        var obj = {
            "wav" : b64,
            "smth": "1111",
            "name": user_name_input.value
        };
        var str_to_send = JSON.stringify(obj);
        console.log("str_data len: " + str_to_send);
        console.log("blob len: " + blob.size);
        console.log("blob type: " + blob.type);
        xhr.send(str_to_send);


        xhr.onloadend = function () { 
            setButtonsEnabled(false);
            recordButton.disabled = false;
            post_result.innerText = xhr.responseText;
        };

    }; 
    reader.readAsDataURL(blob);
    fillUserRecords();
}

function createDownloadLink(blob) {
    var url = URL.createObjectURL(blob);
    var au = document.createElement('audio');
    var li = document.createElement('li');
    var link = document.createElement('a');
    //add controls to the <audio> element 
    au.controls = true;
    au.src = url;
    //link the a element to the blob 
    link.href = url;
    link.download = new Date().toISOString() + '.wav';
    link.innerHTML = link.download;
    //add the new audio and a elements to the li element 
    li.appendChild(au);
    li.appendChild(link);
    //add the li element to the ordered list 
    recordingsList.appendChild(li);
}

recordButton.addEventListener("click", startRecording);
stopButton.addEventListener("click", stopRecording);
pauseButton.addEventListener("click", pauseRecording);
set_user_btn.addEventListener("click", fillUserRecords);

function fillUserRecords() {
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "user_records.json");
    xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');

    var obj = {
        "name": user_name_input.value
    };
    var str_to_send = JSON.stringify(obj);
    xhr.send(str_to_send);
    xhr.onloadend = function () {
        setButtonsEnabled(false);
        recordButton.disabled = false;
        user_records.innerHTML = makeUserWavList(xhr.responseText);
    };
}

function makeUserWavList(json_text) {
    var table_content = "<tr><th>№</th> <th>Created</th> </tr>";
    var js_obj = JSON.parse(json_text);
    var i = 1;

    for (wav_rec of js_obj) {
        var line = `<tr> <td>${i}</td> <td>${wav_rec.time}</td> </tr>`;
        console.log("VAD_001: " + line)
        table_content += line;
        ++i;
    }
    console.log("VAD_002: " +table_content);
    return `<table style=\"width:60%\">${table_content}</table>`;
}

window.onload = function(e){
    console.log("VAD-005 On doc load");
    fillUserRecords();
}
function startRecording() { 
	console.log("recordButton clicked"); 
	var constraints = {
		audio: true,
		video: false
	} 
	/* Disable the record button until we get a success or fail from getUserMedia() */

    setButtonsEnabled(true);
	recordButton.disabled = true;

	/* We're using the standard promise based getUserMedia()

	https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia */

	navigator.mediaDevices.getUserMedia(constraints).then(function(stream) {
		console.log("getUserMedia() success, stream created, initializing Recorder.js ..."); 
		/* assign to gumStream for later use */
		gumStream = stream;
		/* use the stream */
		input = audioContext.createMediaStreamSource(stream);
		/* Create the Recorder object and configure to record mono sound (1 channel) Recording 2 channels will double the file size */
		rec = new Recorder(input, {
			numChannels: 1
		}) 
		//start the recording process 
		rec.record()
		console.log("Recording started");
	}).catch(function(err) {
		//enable the record button if getUserMedia() fails 
		recordButton.disabled = false;
		stopButton.disabled = true;
		pauseButton.disabled = true
	});
}	
