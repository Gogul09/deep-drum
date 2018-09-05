var instruments = ["drum"];

var playerLengthElement = document.getElementById("player-length");
var playerLength = parseInt(playerLengthElement.value);
document.getElementById("text-player-length").innerHTML = "Length<br><span>" + playerLength + "</span>";

var instruments_map = {
	drum  : [9, playerLength]
};

var master_cols = playerLength;

//---------------------------
// update player length
//---------------------------
function updatePlayerLength() {
	var playerLengthElement = document.getElementById("player-length");
	playerLength = parseInt(playerLengthElement.value);
	document.getElementById("text-player-length").innerHTML = "Length<br><span>" + playerLength + "</span>";

	var container = document.getElementById("deepdrum-drum-container");
	container.innerHTML = "";

	instruments_map = {
		drum  : [9, playerLength]
	};

	master_cols = playerLength;

	var seedElement = document.getElementById("seed");
	seedElement.max = playerLength;

	generate_step_boxes();
	enableMasterPattern();
	updateSeed();
	updateSeedPattern();
}

var ts_num = 4;
var ts_den = 4;

var predicted_sequence, play_length, seed;

var drum_kick = new Tone.Player("sounds/drum-kits/dubstep/kick.mp3").toMaster();
var drum_snare = new Tone.Player("sounds/drum-kits/dubstep/snare.mp3").toMaster();

var drum_hihat_closed = new Tone.Player("sounds/drum-kits/dubstep/hihat-closed.mp3").toMaster();
var drum_hihat_open = new Tone.Player("sounds/drum-kits/dubstep/hihat-open.mp3").toMaster();

var drum_tom_low = new Tone.Player("sounds/drum-kits/dubstep/tom-low.mp3").toMaster();
var drum_tom_mid = new Tone.Player("sounds/drum-kits/dubstep/tom-mid.mp3").toMaster();
var drum_tom_high = new Tone.Player("sounds/drum-kits/dubstep/tom-high.mp3").toMaster();

var drum_clap = new Tone.Player("sounds/drum-kits/dubstep/clap.mp3").toMaster();
var drum_ride = new Tone.Player("sounds/drum-kits/dubstep/ride.wav").toMaster();

var drum_image_map = [
	"images/kick.png",
	"images/snare.png",
	"images/hihat-closed.png",
	"images/hihat-open.png",
	"images/tom-high.png",
	"images/tom-high.png",
	"images/tom-high.png",
	"images/clap.png",
	"images/stick.png"
]

var drum_color_map = [
	"deepdrum-kick",
	"deepdrum-snare",
	"deepdrum-hihat-closed",
	"deepdrum-hihat-open",
	"deepdrum-tom-low",
	"deepdrum-tom-mid",
	"deepdrum-tom-high",
	"deepdrum-clap",
	"deepdrum-ride"
]

var master_pattern = [
	[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
	[0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0]
];

var seed_pattern = [];

let drum_rnn = new mm.MusicRNN('https://storage.googleapis.com/download.magenta.tensorflow.org/tfjs_checkpoints/music_rnn/drum_kit_rnn');
drum_rnn.initialize();

function updateSeedPattern() {
	seed_pattern = [];
	for (var k=0; k<seed; k++) {
		var empty_list = [];
		
		for (var i = 0; i < master_pattern.length; i++) {
			if(master_pattern[i][k] == 1) {
				empty_list.push(i);
			}
		}
		uniq_list = uniqueArray(empty_list);
		seed_pattern.push(uniq_list);
	}
}

function updateUserSeedPattern() {
	seed_pattern = [];
	for (var k=0; k<seed; k++) {
		var empty_list = [];
		
		for (var i = 0; i < instruments_map["drum"][0]; i++) {
			var btnId = instruments[0] + "_" + i + "_" + k;
			var btn = document.getElementById(btnId);
			if(btn.getAttribute("btn-mode") == "on") {
				empty_list.push(i);
			}
		}

		uniq_list = uniqueArray(empty_list);
		seed_pattern.push(uniq_list);
	}
}

function uniqueArray(array) {
   return Array.from(new Set(array));
}

async function predictSequence(btnId) {
	updateUserSeedPattern();

	let cur_seq = drum_to_note_sequence(seed_pattern);

	predicted_sequence = await drum_rnn
				.continueSequence(cur_seq, play_length, temperature)
      			.then(r => seed_pattern.concat(note_to_drum_sequence(r, play_length)));

    predicted_pattern = pattern_to_display();
    update_display(predicted_pattern);
}

function drum_to_note_sequence(quantize_tensor) {
	var notes_array = [];
	var note_index = 0;
	for (var i = 0; i < quantize_tensor.length; i++) {
		var notes = quantize_tensor[i];
		if(notes.length > 0) {
			for (var j = 0; j < notes.length; j++) {
				notes_array[note_index] = {};
				notes_array[note_index]["pitch"] = midiDrums[notes[j]];
				notes_array[note_index]["startTime"] = i * 0.5;
				notes_array[note_index]["endTime"] = (i+1) * 0.5;
				note_index = note_index + 1;
			}
		}
	}

    return mm.sequences.quantizeNoteSequence(
      {
        ticksPerQuarter: 220,
        totalTime: quantize_tensor.length / 2,
        timeSignatures: [
          {
            time: 0,
            numerator: ts_num,
            denominator: ts_den
          }
        ],
        tempos: [
          {
            time: 0,
            qpm: tempo
          }
        ],
        notes: notes_array
       },
      1
    );
}

function note_to_drum_sequence(seq, pLength) {
	let res = [];
	for (var i = 0; i < pLength; i++) {
		empty_list = [];
		res.push(empty_list);
	}
    for (let { pitch, quantizedStartStep } of seq.notes) {
      res[quantizedStartStep].push(reverseMidiMapping.get(pitch));
    }
    return res;
}

//------------------------------------
// pattern to visual display convert
//------------------------------------
function pattern_to_display() {
	var predicted_pattern = [];

	// create 2d array filled with zeros --> [9, 33] is the shape
	for (var row_id = 0; row_id < instruments_map["drum"][0]; row_id++) {
		var empty_list = [];
		for (var col_id = 0; col_id < instruments_map["drum"][1]+1; col_id++) {
			empty_list.push(0);
		}
		predicted_pattern.push(empty_list);
	}

	for (var i = 0; i < predicted_sequence.length; i++) {
		if (predicted_sequence[i].length > 0) {
			for (var j = 0; j < predicted_sequence[i].length; j++) {
				var in_val = predicted_sequence[i][j];
				predicted_pattern[in_val][i] = 1;
			}
		}
	}

	return predicted_pattern;
}

//--------------------------------
// update display based on 
// predicted pattern
//--------------------------------
function update_display(pattern) {
	partialClear = 1;
	clearPlayback(partialClear);

	var step_buttons = document.getElementsByClassName("deepdrum-step-buttons");

	for (var i = 0; i < step_buttons.length; i++) {
		var btn   = step_buttons[i];
		var btnId = btn.id;
		var s = btnId.split("_");
		var row_id = s[1];
		var col_id = s[2];

		if (col_id >= seed) {
			if(predicted_pattern[row_id][col_id] == 1) {
				btn.setAttribute("btn-mode", "on");
				btn.className = 'deepdrum-step-boxes-on';
				btn.classList.add(drum_color_map[row_id]);
				btn.classList.add('deepdrum-step-buttons');
			}
		}
	}
}

//------------------------------------
// step sequencer for all instruments
//------------------------------------
function generate_step_boxes() {
	for (var k = 0; k < instruments.length; k++) {
		var instrument_name = Object.keys(instruments_map)[k];
		var inst_id         = "deepdrum-" + instrument_name + "-container";
		var instrument      = document.getElementById(inst_id);

		var rows = instruments_map[instrument_name][0];
		var cols = instruments_map[instrument_name][1];

		for (var i = 0; i < rows; i++) {
			var div = document.createElement("div");
			div.className = "deepdrum-step-wrapper";
			instrument.appendChild(div);
			for (var j = 0; j < cols + 1; j++) {

				var id = "";
				if (j == 0) {
					id = instruments[k] + "image_" + i + "_" + j;
				} else {
					id = instruments[k] + "_" + i + "_" + (j-1);
				}
				add_step_button(id, div, instrument_name, i, j);
			}
		}
	}
}

//-------------------------------
// step sequencer add button
//-------------------------------
function add_step_button(id, parentContainer, instrument_name, row_value, col_value) { 

  var element = document.createElement("input");

  element.type = "button";
  element.id = id;
  
  if (col_value == 0) {
  	element.style.backgroundImage = "url(" + drum_image_map[row_value] + ")";
  	element.className = "deepdrum-step-boxes-image";
  	element.classList.add("deepdrum-instrument-image");
  
  } else {
	element.className = "deepdrum-step-boxes-off";
	element.classList.add("deepdrum-step-buttons");

	element.setAttribute("btn-mode", "off");
	element.onclick = function() {
		turn_on_step_button(id, row_value);
	};
  }
 
  parentContainer.appendChild(element);
}

//-------------------------------
// step sequencer button handler
//-------------------------------
function turn_on_step_button(btnId, row_value) {
	var btn = document.getElementById(btnId);
	
	var btnOn = btn.getAttribute("btn-mode");
	if (btnOn == "on") {
		col_id = btn.id.split("_")[2];
		btn.setAttribute("btn-mode", "off");
		btn.className = 'deepdrum-step-boxes-off';
		btn.classList.add('deepdrum-step-buttons');
		if (col_id < seed) {
			btn.classList.add('deepdrum-seed-indicator');
		}
	} else {
		btn.setAttribute("btn-mode", "on");
		btn.className = 'deepdrum-step-boxes-on';
		btn.classList.add(drum_color_map[row_value]);
		btn.classList.add('deepdrum-step-buttons');
	}
}

//------------------------------
// play deepdrum button
//------------------------------
var togglePlay = 0;
var playTimer  = 0;
function playdeepdrum(id) {
	var btn = document.getElementById(id);

	if (togglePlay == 0) {
		togglePlay = 1;
		btn.style.backgroundColor = "#f0ff66";
		btn.style.border = "4px solid #b0be31";
		btn.style.backgroundImage = "url('images/stop.png')";
		scheduleTimeOn();
	} else {
		togglePlay = 0;
		btn.style.backgroundColor = "#64e0e5";
		btn.style.border = "4px solid #5fb5b8";
		btn.style.backgroundImage = "url('images/play.png')";
		scheduleTimeOff();
	}
}

//------------------------------
// master scheduler time on
//------------------------------
function scheduleTimeOn() {
	var tempo = document.getElementById("tempo").value;
	Tone.Transport.bpm.value = tempo;

	if (playedOnce==0) {
		Tone.Transport.scheduleRepeat(repeat, 16 + "n");
		playedOnce = 1;
	}
	Tone.Transport.start();
}

var playedOnce = 0;
var count = 0;

function repeat(time) {
	if (count == (master_cols)) {count = 0};

	var step_buttons = document.getElementsByClassName("deepdrum-step-buttons");
	for (var i = 0; i < step_buttons.length; i++) {
		step_buttons[i].classList.remove("deepdrum-indicator");
	}

	for (var i = 0; i < step_buttons.length; i++) {
		var btnId = step_buttons[i].id;
		var s = btnId.split("_");
		if(s[2] == count) {
			step_buttons[i].classList.add("deepdrum-indicator");
			
			if(step_buttons[i].getAttribute("btn-mode") == "on") {
				var note = step_buttons[i].dataset.note;

				if (s[0] == "drum") {
					if(s[1] == "0") {
						drum_kick.start(time);
					} else if(s[1] == "1") {
						drum_snare.start(time);
					} else if(s[1] == "2") {
						drum_hihat_closed.start(time);
					} else if(s[1] == "3") {
						drum_hihat_open.start(time);
					} else if(s[1] == "4") {
						drum_tom_low.start(time);
					} else if(s[1] == "5") {
						drum_tom_mid.start(time);
					} else if(s[1] == "6") {
						drum_tom_high.start(time);
					} else if(s[1] == "7") {
						drum_clap.start(time);
					} else if(s[1] == "8") {
						drum_ride.start(time);
					}
				}
			}
		}
	}
	count = count + 1;
}

//------------------------------
// master scheduler time off
//------------------------------
function scheduleTimeOff() {
	Tone.Transport.stop();
	count = 0;
}

//------------------------------
// handle user input values
//------------------------------

// tempo 
var tempo = document.getElementById("tempo").value;
document.getElementById("text-tempo").innerHTML = "Tempo<br><span>" + tempo + "</span>" 

function updateTempo(tempo) {
	Tone.Transport.bpm.value = tempo;
	document.getElementById("text-tempo").innerHTML = "Tempo<br><span>" + tempo + "</span>"
}

// temperature 
var t = document.getElementById("temperature").value;
temperature = parseFloat(t);
document.getElementById("text-temperature").innerHTML = "Temperature<br><span>" + t + "</span>" 

function updateTemperature(t) {
	document.getElementById("text-temperature").innerHTML = "Temperature<br><span>" + t + "</span>"
	temperature = parseFloat(temperature);
}

function updateSeed() {
	var seedElement = document.getElementById("seed");
	seed = parseInt(seedElement.value);
	document.getElementById("text-seed").innerHTML = "Seed<br><span>" + seed + "</span>";
	play_length = master_cols - seed;
	updateSeedDisplay();
}

function updateSeedDisplay() {
	var step_buttons = document.getElementsByClassName("deepdrum-step-buttons");
	for (var i = 0; i < step_buttons.length; i++) {
		step_buttons[i].classList.remove('deepdrum-seed-indicator');
	}

	for (var i = 0; i < step_buttons.length; i++) {
		var step_button_id = step_buttons[i].id;
		var s = step_button_id.split("_");
		var row_id = s[1];
		var col_id = s[2];

		if(col_id < seed) {
			var target_button = document.getElementById(step_button_id);
			if(target_button.getAttribute("btn-mode") == "off") {
				target_button.classList.add('deepdrum-seed-indicator');
			}
		}
	}
}

//--------------------------------
// enable master pattern playback
//--------------------------------
function enableMasterPattern() {
	var step_buttons = document.getElementsByClassName("deepdrum-step-buttons");
	
	for (var i = 0; i < step_buttons.length; i++) {
		var step_button_id = step_buttons[i].id;
		var s = step_button_id.split("_");
		var row_id = s[1];
		var col_id = s[2];

		if(master_pattern[row_id][col_id] == 1) {
			var target_button = document.getElementById(step_button_id);
			target_button.setAttribute("btn-mode", "on");
			target_button.className = 'deepdrum-step-boxes-on';
			target_button.classList.add(drum_color_map[row_id]);
			target_button.classList.add('deepdrum-step-buttons');
		}
	}
}

//--------------------------------
// clear all pattern in playback
//--------------------------------
function clearPlayback(partialClear) {

	var step_buttons = document.getElementsByClassName("deepdrum-step-buttons");

	if(partialClear == 0){
		for (var i = 0; i < step_buttons.length; i++) {
			var s_id = step_buttons[i].id;
			var btn = document.getElementById(s_id);
			btn.setAttribute("btn-mode", "off");
			btn.className = 'deepdrum-step-boxes-off';
			btn.classList.add('deepdrum-step-buttons');
		}
	} else {
		for (var i = 0; i < step_buttons.length; i++) {
			var s_id = step_buttons[i].id;
			var btn = document.getElementById(s_id);
			var s   = s_id.split("_");
			var row_id = s[1];
			var col_id = s[2];

			if (col_id >= seed) {
				btn.setAttribute("btn-mode", "off");
				btn.className = 'deepdrum-step-boxes-off';
				btn.classList.add('deepdrum-step-buttons');
			}
		}
	}
	if(togglePlay == 1) {
		playdeepdrum("deepdrum-play");
	}
	count = 0;
	scheduleTimeOff();
}

generate_step_boxes();
enableMasterPattern();
updateSeed();
updateSeedPattern();

document.body.onkeyup = function(e){
    if(e.keyCode == 32){
        playdeepdrum("deepdrum-play");
    }
}