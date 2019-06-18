////////////////////////////////
// MASTER SWITCHES
////////////////////////////////
var boolArp        = 0;
var boolGpad       = 0;
var boolPlayMode   = 0;
var boolMidi       = 0;
var boolArpNote    = 0;
var boolArpToggler = 0;

//------------------------------
// GLOBAL VARIABLES in this app
//------------------------------
let deepdrum_container = {};

let drumkit_list = ["kick", "snare", "hihat closed", "hihat open", "tom low", "tom mid", "tom high", "clap", "ride"];

let cur_arp_notes      = [];
let gen_arp_patterns   = [];
var gen_arp_length     = 0;
var gen_arp_idx        = 0;
var arp_pattern_length = 8;

var player_length = 32;
const MIDI_FUTURE = 0.2;
const TIME_FUTURE = 0.05;
const GAIN_LEAD = 0.6;
const GAIN_BASS = 0.5;

const ROWS = 10;

var ts_num = 4;
var ts_den = 4;

var scale = "A3";

var swing = 0.0;
var swing_sub = 16;

var toggle_play = 0;

var playedOnce = 0;
var count = 0;
var connectPlayersToRecorder = 0;
var chunks = [];
var recordCount = 0;
var step = 0;

var scale_chord_notes = [];
var scale_bass_notes  = [];
var scale_all_notes   = [];
var cur_chords = [];
var cur_bass_notes = [];

var chordIdx   = 0;
var bassIdx    = 0;

var arpCount  = 0;
var arpLimit  = 8;
var bassLimit = 8;
var arpSequence = [];

var recordPattern = 0;

var arpCols = 1;
var arpRows = 9;

var dialSize = [50, 50];

var selectedTagId;

var timelineInitialized = 0;
var global_timeline_patterns = [];
var global_count_limit = 0;
var global_timeline_rows = 10;
var global_tags = [];

var lead_synth;

var predicted_sequence, play_length, seed;

var drum_kick, 
	drum_snare, 
	drum_hihat_closed, 
	drum_hihat_open, 
	drum_tom_low,
	drum_tom_mid,
	drum_tom_high,
	drum_clap,
	drum_ride;

var p_indicator_left;

var timelinePatternCount = 0;
var toggleSettings = 0;

var tag_ids = ["a", "b", "c", "d", "e", "f"];

var dial_tempo, 
	dial_temperature_drum,
	dial_seed,
	dial_length,
	toggle_arp,
	toggle_midi,
	piano,
	slider_bar_length,
	slider_beats_per_bar,
	slider_split_beats_into,
	dial_temperature_arp,
	dial_arp_length;

var delay       = new Tone.PingPongDelay('16n', 0.1);
var distortion  = new Tone.Distortion(0.8);
var reverb      = new Tone.Freeverb(0.1, 3000);

const lead_gain = new Tone.Gain(GAIN_LEAD);
const bass_gain = new Tone.Gain(GAIN_BASS);

updateSynthLead("deepdrum-select-synth");
updateSynthBass("deepdrum-select-synth-bass");

lead_synth.connect(lead_gain);
lead_gain.toMaster();

var count_display_timeline = 0;
var cur_note = "";

var indicator_count = 0;

//-------------------------------
// DEEP ARPEGGIO VARIABLES
//-------------------------------
var arp_seq_limit   = 20;
var temperature_arp = 1.0;

//--------------------------------
// create nexus UI dials/toggles
//--------------------------------
function createUItuners() {
	Nexus.colors.accent = "#f62e2e";
	Nexus.colors.fill = "#242424ad";

	dial_tempo = new Nexus.Slider('#dial-tempo',{
	    'size': [120,20],
	    'mode': 'absolute',
	    'min': 50,
	    'max': 200,
	    'step': 1,
	    'value': 115,
	});
	dial_tempo.on('change',function(v) {
  		updateTempo(v);
	});



	dial_temperature_drum = new Nexus.Slider('#dial-temperature-drum',{
	    'size': [120,20],
	    'mode': 'absolute',
	    'min': 0.5,
	    'max': 2.5,
	    'step': 0.1,
	    'value': 1.0,
	});

	dial_temperature_drum.on('change',function(v) {
  		updateTemperatureDrum(v);
	});



	dial_seed = new Nexus.Slider('#dial-seed',{
	    'size': [120,20],
	    'mode': 'absolute',
	    'min': 1,
	    'max': 32,
	    'step': 1,
	    'value': 10,
	});

	dial_seed.on('change',function(v) {
  		updateSeed(v);
	});

	dial_swing = new Nexus.Slider('#dial-swing',{
	    'size': [120,20],
	    'mode': 'absolute',
	    'min': 0,
	    'max': 1,
	    'step': 0.05,
	    'value': 0,
	});

	dial_swing.on('change',function(v) {
  		updateSwing(v);
	});

	dial_swing_sub = new Nexus.Slider('#dial-swing-sub',{
	    'size': [120,20],
	    'mode': 'absolute',
	    'min': 4,
	    'max': 32,
	    'step': 4,
	    'value': 16,
	});

	dial_swing_sub.on('change',function(v) {
  		updateSwingSub(v);
	});


	toggle_midi = new Nexus.Toggle('#toggle-midi', {
		'size': [30,20],
		'state': false
	});
	toggle_midi.on('change',function(v) {
		boolMidi = v;
		if(boolMidi == 1) {
			initMIDI();
  			document.getElementById("text-melody").innerHTML = "piano";
  			toggle_arp.state  = false;
  			boolArp  = 0;
		}
	});

	radio_melody = new Nexus.RadioButton('#radio-melody',{
	  'size': [70, 15],
	  'numberOfButtons': 3,
	  'active': 0
	});


	radio_melody.on('change',function(v) {
	  if(v == 0) {
	  	// piano mode
	  	initPiano();
		updateSynthLead("deepdrum-select-synth");
		updateSynthBass("deepdrum-select-synth-bass");

	  } else if (v == 1) {
	  	// deep arp mode
	  	boolArp = 1;
	  	initArp();
		let s_seq = [
		{ note: 58, 
		  time: Tone.now()
	    }];

		let c_prg = Tonal.Note.pc(Tonal.Note.fromMidi(58)[0]) + "M";
		predictArpSequence(58, s_seq, c_prg);
		updateSynthLead("deepdrum-select-synth");
		updateSynthBass("deepdrum-select-synth-bass");
		initChordPattern();
		updateGenArpPatterns();

	  } else if (v == 2) {
	  	// gpad mode
	  	boolArp  = 0;
	  	boolGpad = 1;
	  	initGPad();
	  	createGPadElements();
	  }
	});
	radio_melody.colorize("mediumLight", "#444");


	toggle_play_mode = new Nexus.Toggle('#toggle-play-mode', {
		'size': [30,20],
		'state': false
	});
	toggle_play_mode.on('change',function(v) {
		boolPlayMode = v;
		if (v == 1) {
			// song mode
			document.getElementById("deepdrum-timeline-container").classList.remove("bounceOutDown");
			document.getElementById("deepdrum-timeline-container").classList.add("bounceInUp");
			document.getElementById("deepdrum-timeline-container").style.display = "flex";
			document.getElementById("text-play-mode").innerHTML = "song";
			if(timelineInitialized == 0) {
				for (var i = 0; i < global_timeline_rows; i++) {
					global_timeline_patterns.push([]);
				}
				timelineInitialized = 1;
			}
			toggle_play = 1;
			playDeepDrum("deepdrum-play");
		} else {
			// pattern mode
			document.getElementById("deepdrum-timeline-container").classList.remove("bounceInUp");
			document.getElementById("deepdrum-timeline-container").classList.add("bounceOutDown");
			document.getElementById("deepdrum-timeline-container").style.display = "none";
			document.getElementById("text-play-mode").innerHTML = "pattern";
			toggle_play = 1;
			playDeepDrum("deepdrum-play");
		}
	});

	dial_temperature_arp = new Nexus.Slider('#dial-temperature-arp',{
	    'size': [120,20],
	    'mode': 'absolute',
	    'min': 0.5,
	    'max': 2.5,
	    'step': 0.1,
	    'value': 1.0,
	});

	dial_temperature_arp.on('change',function(v) {
  		updateTemperatureArp(v);
	});

	dial_arp_length = new Nexus.Slider('#dial-arp-length',{
	    'size': [120,20],
	    'mode': 'absolute',
	    'min': 1,
	    'max': 16,
	    'step': 1,
	    'value': 8,
	});

	dial_arp_length.on('change',function(v) {
  		updateArpLength(v);
	});


	piano = new Nexus.Piano('#deepdrum-piano',{
		'size': [950, 150],
	    'mode': 'button',
	    'lowNote': 12,
	    'highNote': 72
	});

	piano.colors.dark = "000";
	piano.colors.mediumDark = "000";
	piano.colors.fill = "000";
	piano.colorize();

	piano.on('change',function(v) {
		let note  = Tonal.Note.fromMidi(v["note"] + 24);
		let state = v["state"];

		if(boolArp == 0) {
			if (boolMidi == 0) {
				if(state == true) {
					lead_synth.triggerAttack(note);
				} else {
					lead_synth.triggerRelease();
				}
			}
		}
	});

	slider_bar_length = new Nexus.Slider('#slider-bar-length',{
	    'size': [120,20],
	    'mode': 'absolute',
	    'min': 1,
	    'max': 8,
	    'step': 1,
	    'value': 4
	});

	slider_bar_length.on('change',function(v) {
		var text_slider_bar_length       = document.getElementById("text-slider-bar-length");
		text_slider_bar_length.innerHTML = slider_bar_length.value + " bars";
	});

	slider_beats_per_bar = new Nexus.Slider('#slider-beats-per-bar',{
	    'size': [120,20],
	    'mode': 'absolute',
	    'min': 2,
	    'max': 7,
	    'step': 1,
	    'value': 4
	});

	slider_beats_per_bar.on('change',function(v) {
		var text_slider_beats_per_bar       = document.getElementById("text-slider-beats-per-bar");
		text_slider_beats_per_bar.innerHTML = slider_beats_per_bar.value;
	});

	slider_split_beats_into = new Nexus.Slider('#slider-split-beats-into',{
	    'size': [120,20],
	    'mode': 'absolute',
	    'min': 1,
	    'max': 4,
	    'step': 1,
	    'value': 2
	});

	slider_split_beats_into.on('change',function(v) {
		var text_slider_split_beats_into       = document.getElementById("text-slider-split-beats-into");
		text_slider_split_beats_into.innerHTML = slider_split_beats_into.value;
	});

	// grid html elements
	var text_slider_bar_length       = document.getElementById("text-slider-bar-length");
	var text_slider_beats_per_bar    = document.getElementById("text-slider-beats-per-bar");
	var text_slider_split_beats_into = document.getElementById("text-slider-split-beats-into");

	text_slider_bar_length.innerHTML        = slider_bar_length.value + " bars";
	text_slider_beats_per_bar.innerHTML     = slider_beats_per_bar.value;
	text_slider_split_beats_into.innerHTML  = slider_split_beats_into.value;
}

createUItuners();
var x = window.matchMedia("(max-width: 700px)");
resizePiano(x);
x.addListener(resizePiano);

function resizePiano(x) {
	if (x.matches) {
        piano.resize(800, 150);
		Tone.context.lookAhead = 0.1;
    } else {
        piano.resize(1000, 150);
		Tone.context.lookAhead = 0;
    }
}

//--------------------------------
// build arpeggiator sequence
//--------------------------------
function buildArpSequence(seed) {
  var notes = [{
      0: { 	pitch: seed[0]["note"],
      		quantizedStartStep: 0,
      		quantizedEndStep: 1 
  	  }
  }];

  return {
    totalQuantizedSteps: 1,
    quantizationInfo: {
      stepsPerQuarter: 1 
  	},
    notes: notes };
}

//--------------------------------
// predict arpeggiator sequence
//--------------------------------
async function predictArpSequence(n, s, c, idx) {
	let cur_sequence = [];
	await improv_rnn
		.continueSequence(buildArpSequence(s), arp_seq_limit, temperature_arp, [c])
		.then(function(r) {
			res_notes = construct_arpeggio(r, arp_seq_limit);
			for (var i = 0; i < arp_pattern_length; i++) {
				if(res_notes[i] == undefined) { 
					cur_sequence[i] = res_notes[0];
				} else {
					cur_sequence[i] = res_notes[i];
				}
			}
		 });
	return cur_sequence;
}

//---------------------------------
// construct arpeggio sequence
//---------------------------------
function construct_arpeggio(seq, pLength) {
	let res = [];
	res.push(cur_note);
    for (let { pitch, quantizedStartStep } of seq.notes) {
		res.push(Tonal.Note.fromMidi(pitch));
    }
    res.filter(n => n);
    return res;
}

function initArp() {
	document.getElementById("text-melody").innerHTML             = "deeparp";
	document.getElementById("deepdrum-piano-box").style.display  = "none";
	document.getElementById("deepdrum-arp-box").style.display    = "flex";
	document.getElementById("deepdrum-gpad-box").style.display   = "none";
	document.getElementById("box-dial-arp-length").style.display = "initial";
	document.getElementById("text-arp-length").style.display     = "block";
	document.getElementById("text-arp-length").innerHTML = "arp length<br><span>" + arp_pattern_length + "</span>";
	arpCount = 0;
}

function initPiano() {
	document.getElementById("text-melody").innerHTML              = "piano";
	document.getElementById("deepdrum-piano-box").style.display   = "flex";
	document.getElementById("deepdrum-arp-box").style.display     = "none";
	document.getElementById("deepdrum-gpad-box").style.display    = "none";
	document.getElementById("box-dial-arp-length").style.display  = "none";
	document.getElementById("text-arp-length").style.display      = "none";
	arpCount = 0;
	boolArp = 0;
}

function initGPad() {
	document.getElementById("text-melody").innerHTML              = "gpad";
	document.getElementById("deepdrum-piano-box").style.display   = "none";
	document.getElementById("deepdrum-arp-box").style.display     = "none";
	document.getElementById("deepdrum-gpad-box").style.display    = "flex";
	document.getElementById("box-dial-arp-length").style.display  = "none";
	document.getElementById("text-arp-length").style.display      = "none";
	arpCount = 0;
}

// init melody line
if(boolArp == 1) { 
	initArp();
} else if (boolGpad == 1) {
	initGPad();
	createGPadElements();
} else {
	initPiano();
}

if(boolPlayMode == 0) { 
	document.getElementById("deepdrum-timeline-container").style.display = "none";
	document.getElementById("text-play-mode").innerHTML = "pattern";
} else {
	document.getElementById("deepdrum-timeline-container").style.display = "flex";
	document.getElementById("text-play-mode").innerHTML = "song";
	if(timelineInitialized == 0) {
		for (var i = 0; i < global_timeline_rows; i++) {
			global_timeline_patterns.push([]);
		}
		timelineInitialized = 1;
	}
}

//-----------------------------
// instrument specific details
//-----------------------------
var instruments = ["drum"];

// tempo 
var tempo = dial_tempo.value;
document.getElementById("text-tempo").innerHTML = "tempo<br><span>" + tempo + "</span>"; 

// temperature drum
temperature_drum = Math.round(parseFloat(dial_temperature_drum.value) * 10) / 10;
document.getElementById("text-temperature-drum").innerHTML = "temperature<br><span>" + temperature_drum + "</span>";

temperature_arp = Math.round(parseFloat(dial_temperature_arp.value) * 10) / 10;
document.getElementById("text-temperature-arp").innerHTML = "temperature<br><span>" + temperature_arp + "</span>";

var instruments_map = {
	drum  : [ROWS, player_length]
};

var kitTypeElement = document.getElementById("deepdrum-kit");
var kitType = kitTypeElement.options[kitTypeElement.selectedIndex].value;

var kitTypeElement = document.getElementById("deepdrum-kit");
var kitType = kitTypeElement.options[kitTypeElement.selectedIndex].value;

var modeTypeElement = document.getElementById("deepdrum-select-mode");
var mode = modeTypeElement.options[modeTypeElement.selectedIndex].value;

var instrument_player = [
	"/sounds/drum-kits/" + kitType +  "/kick.mp3",
	"/sounds/drum-kits/" + kitType +  "/snare.mp3",
	"/sounds/drum-kits/" + kitType +  "/hihat-closed.mp3",
	"/sounds/drum-kits/" + kitType +  "/hihat-open.mp3",
	"/sounds/drum-kits/" + kitType +  "/tom-low.mp3",
	"/sounds/drum-kits/" + kitType +  "/tom-mid.mp3",
	"/sounds/drum-kits/" + kitType +  "/tom-high.mp3",
	"/sounds/drum-kits/" + kitType +  "/clap.mp3",
	"/sounds/drum-kits/" + kitType +  "/ride.mp3"
]

//---------------------------
// load instrument players
//---------------------------
function loadPlayers() {
	drum_kick = new Tone.Player(instrument_player[0]).toMaster();
	drum_snare = new Tone.Player(instrument_player[1]).toMaster();
	drum_hihat_closed = new Tone.Player(instrument_player[2]).toMaster();
	drum_hihat_open = new Tone.Player(instrument_player[3]).toMaster();
	drum_tom_low = new Tone.Player(instrument_player[4]).toMaster();
	drum_tom_mid = new Tone.Player(instrument_player[5]).toMaster();
	drum_tom_high = new Tone.Player(instrument_player[6]).toMaster();
	drum_clap = new Tone.Player(instrument_player[7]).toMaster();
	drum_ride = new Tone.Player(instrument_player[8]).toMaster();
}

//-----------------------------
// dispose instrument players
//-----------------------------
function disposePlayers() {
	drum_kick.dispose();
	drum_snare.dispose();
	drum_hihat_closed.dispose();
	drum_hihat_open.dispose();
	drum_tom_low.dispose();
	drum_tom_mid.dispose();
	drum_tom_high.dispose();
	drum_clap.dispose();
	drum_ride.dispose();
}

//---------------------------
// update drum kit
//---------------------------
function updateKit() {
	var kitTypeElement = document.getElementById("deepdrum-kit");
	kitType = kitTypeElement.options[kitTypeElement.selectedIndex].value;

	instrument_player = [
		"/sounds/drum-kits/" + kitType +  "/kick.mp3",
		"/sounds/drum-kits/" + kitType +  "/snare.mp3",
		"/sounds/drum-kits/" + kitType +  "/hihat-closed.mp3",
		"/sounds/drum-kits/" + kitType +  "/hihat-open.mp3",
		"/sounds/drum-kits/" + kitType +  "/tom-low.mp3",
		"/sounds/drum-kits/" + kitType +  "/tom-mid.mp3",
		"/sounds/drum-kits/" + kitType +  "/tom-high.mp3",
		"/sounds/drum-kits/" + kitType +  "/clap.mp3",
		"/sounds/drum-kits/" + kitType +  "/ride.mp3",
	]
	disposePlayers();
	loadPlayers();
	count = 0;
	if (toggle_play == 1) {
		playDeepDrum("deepdrum-play");
	}
}

var drum_image_map = [
	"/images/live-demo/deepdrum/kick.png",
	"/images/live-demo/deepdrum/snare.png",
	"/images/live-demo/deepdrum/hihat-closed.png",
	"/images/live-demo/deepdrum/hihat-open.png",
	"/images/live-demo/deepdrum/tom-high.png",
	"/images/live-demo/deepdrum/tom-high.png",
	"/images/live-demo/deepdrum/tom-high.png",
	"/images/live-demo/deepdrum/clap.png",
	"/images/live-demo/deepdrum/stick.png",
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
	"deepdrum-ride",
]

//-------------------------------
// master pattern to get started
//-------------------------------
var master_pattern = [
	[1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 1, 1],
	[1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 0, 1, 1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
];

var seed_pattern = [];

//-------------------------------
// Google Magenta's DrumsRNN
//-------------------------------
let drums_rnn = new mm.MusicRNN('https://storage.googleapis.com/download.magenta.tensorflow.org/tfjs_checkpoints/music_rnn/drum_kit_rnn');
drums_rnn.initialize();

//-------------------------------
// Google Magenta's ImprovRNN
//-------------------------------
let improv_rnn = new mm.MusicRNN('https://storage.googleapis.com/download.magenta.tensorflow.org/tfjs_checkpoints/music_rnn/chord_pitches_improv');
improv_rnn.initialize();

//-------------------------------
// update seed pattern
//-------------------------------
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

//-------------------------------
// update user seed pattern
//-------------------------------
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

//---------------------
// uniquify an array
//---------------------
function uniqueArray(array) {
   return Array.from(new Set(array));
}

//-------------------------------
// DrumsRNN predict sequence
//-------------------------------
async function predictSequence(btnId) {
	if(recordPattern == 1) {
		return;
	}
	updateUserSeedPattern();

	let cur_seq = drum_to_note_sequence(seed_pattern);
	predicted_sequence = await drums_rnn
				.continueSequence(cur_seq, player_length, temperature_drum)
      			.then(r => seed_pattern.concat(note_to_drum_sequence(r, player_length)));

    predicted_pattern = pattern_to_display();
    updateDisplay(1, predicted_pattern);
    count = 0;
	if (toggle_play == 1) {
		playDeepDrum("deepdrum-play");
	}

	master_tag_patterns[selectedTagId] = predicted_pattern;
	updateDisplay(1, predicted_pattern);
}

//---------------------------------
// drum to note sequence formation
//---------------------------------
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

//---------------------------------
// note to drum sequence formation
//---------------------------------
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

	// create 2d array filled with zeros
	for (var row_id = 0; row_id < global_timeline_rows-1; row_id++) {
		var empty_list = [];
		for (var col_id = 0; col_id < instruments_map["drum"][1] + 1; col_id++) {
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

//---------------------------------------------
// step sequencer for DeepDrum
// this generates step buttons for drum kits
//---------------------------------------------
function generateStepBoxes() {
	let col_length = parseInt((slider_bar_length.value)*(slider_beats_per_bar.value)*(slider_split_beats_into.value));

	for (var k = 0; k < instruments.length; k++) {
		var instrument_name = Object.keys(instruments_map)[k];
		var inst_id         = "deepdrum-" + instrument_name + "-container";
		var instrument      = document.getElementById(inst_id);

		var rows = instruments_map[instrument_name][0];
		var cols = col_length;

		for (var i = 0; i < rows; i++) {
			var div = document.createElement("div");
			div.className = "deepdrum-step-wrapper";
			div.classList.add("no-select");
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

//----------------------------------------------
// create volume dials for each drum kit sample
//----------------------------------------------
function createVolumeDials() {
	var drumElements  = document.getElementsByClassName("dial-volume");

	for (var i = 0; i < drumElements.length; i++) {
		var dial_volume_name = Nexus.Add.Dial('#' + drumElements[i].id, {
		  'interaction': 'radial',
		  'size': [12,12],
		  'mode': 'relative',
		  'min': -12,
		  'max': 8,
		  'step': 1,
		  'value': 2
		});
		dial_volume_name.colorize("accent","#f62e2e");
		dial_volume_name.colorize("fill","#000");

		if(i == 0) {
			dial_volume_name.on('change', function(v) {
				drum_kick.volume.value = v;
			});
		} else if(i == 1) {
			dial_volume_name.on('change', function(v) {
				drum_snare.volume.value = v;
			});
		} else if(i == 2) {
			dial_volume_name.on('change', function(v) {
				drum_hihat_closed.volume.value = v;
			});
		} else if(i == 3) {
			dial_volume_name.on('change', function(v) {
				drum_hihat_open.volume.value = v;
			});
		} else if(i == 4) {
			dial_volume_name.on('change', function(v) {
				drum_tom_low.volume.value = v;
			});
		} else if(i == 5) {
			dial_volume_name.on('change', function(v) {
				drum_tom_mid.volume.value = v;
			});
		} else if(i == 6) {
			dial_volume_name.on('change', function(v) {
				drum_tom_high.volume.value = v;
			});
		} else if(i == 7) {
			dial_volume_name.on('change', function(v) {
				drum_clap.volume.value = v;
			});
		} else if(i == 8) {
			dial_volume_name.on('change', function(v) {
				drum_ride.volume.value = v;
			});
		}
	}
}

//-------------------------------
// step sequencer add button
//-------------------------------
function add_step_button(id, parentContainer, instrument_name, row_value, col_value) { 
  
	var element;

	if (row_value == ROWS-1) {
		if (col_value == 0) {
			// create transparent div!
			element = document.createElement("div");
			element.id = id;
			element.innerHTML = "<span class='deepdrum-drumkit-info'>indicator</span><div class='dial-volume' id='dial-volume-" + id + "'>";
			element.className = "deepdrum-step-boxes-image";
			element.classList.add("deepdrum-instrument-image");
			element.style.visibility = "hidden";
		} else {
			// these are the step button indicators
			element = document.createElement("input");
			element.type = "button";
			element.id = id;
			element.className = "deepdrum-step-boxes-off";
			element.classList.add("deepdrum-step-buttons-indicator");
		}
	} else {
		if (col_value == 0) {
			element = document.createElement("div");
			element.id = id;
			element.innerHTML = "<span class='deepdrum-drumkit-info'>" + drumkit_list[row_value] + "</span><div class='dial-volume' id='dial-volume-" + id + "'>";
			element.className = "deepdrum-step-boxes-image";
			element.classList.add("deepdrum-instrument-image");
			element.onclick = function() {
				playInstrument(row_value);
			};

		} else {
			element = document.createElement("input");
			element.type = "button";
			element.id = id;
			element.className = "deepdrum-step-boxes-off";
			element.classList.add("deepdrum-step-buttons");

			element.setAttribute("btn-mode", "off");
			element.onclick = function() {
				turnOnStepButton(id, row_value, col_value);
			};
		}
	} 
	parentContainer.appendChild(element);
}

//-------------------------------
// step sequencer button handler
//-------------------------------
function turnOnStepButton(btnId, row_value, col_value) {
	var btn = document.getElementById(btnId);
	
	var btnOn = btn.getAttribute("btn-mode");
	if (btnOn == "on") {
		col_id = btn.id.split("_")[2];
		btn.setAttribute("btn-mode", "off");
		btn.className = 'deepdrum-step-boxes-off';
		btn.classList.add('deepdrum-step-buttons');
		master_tag_patterns[selectedTagId][row_value][col_value-1] = 0;
		if (col_id < seed) {
			btn.classList.add('deepdrum-seed-indicator');
		}
	} else {
		btn.setAttribute("btn-mode", "on");
		btn.className = 'deepdrum-step-boxes-on';
		btn.classList.add(drum_color_map[row_value]);
		btn.classList.add('deepdrum-step-buttons');
		master_tag_patterns[selectedTagId][row_value][col_value-1] = 1;
	}
	
	updateGlobalTimelinePatterns();
}

//----------------------------------
// play instrument onclick of icon
//----------------------------------
function playInstrument(row_value) {
	if(row_value == 0) {
		drum_kick.start();
	} else if(row_value == 1) {
		drum_snare.start();
	} else if(row_value == 2) {
		drum_hihat_closed.start();
	} else if(row_value == 3) {
		drum_hihat_open.start();
	} else if(row_value == 4) {
		drum_tom_low.start();
	} else if(row_value == 5) {
		drum_tom_mid.start();
	} else if(row_value == 6) {
		drum_tom_high.start();
	} else if(row_value == 7) {
		drum_clap.start();
	} else if(row_value == 8) {
		drum_ride.start();
	}
}

//-----------------------
// record pattern
//-----------------------
var recordPatternAudio = document.createElement("audio");
recordPatternAudio.id = "deepdrum-record-audio";
recordPatternAudio.controls = "controls";

var actx = Tone.context;
var dest = actx.createMediaStreamDestination();
const recorder = new MediaRecorder(dest.stream);

//---------------------------
// PLAY DEEPDRUM handler
//---------------------------
function playDeepDrum(id) {
	var btn = document.getElementById(id);

	if(recordPattern == 1) {
		toggle_play = 0;
		btn.style.backgroundColor = "#64e0e5";
		btn.style.backgroundImage = "url('/images/live-demo/deepdrum/play.png')";
		scheduleTimeOff();
		//updateDisplay(1, master_tag_patterns[selectedTagId]);
		timelineIndicator.style.left = "0px";
		clearIndicatorInStepButtons();
		return;
	}


	if (toggle_play == 0) {
		if(boolPlayMode == 1) {
			if(global_timeline_patterns.length > 0) {
				if(global_timeline_patterns[0].length == 0) {
					showSnackMessage("please add a pattern in timeline to play song!");
				} else {
					toggle_play = 1;
					btn.style.backgroundColor = "#f0ff66";
					btn.style.backgroundImage = "url('/images/live-demo/deepdrum/stop.png')";
					scheduleTimeOn();
				}	
			}  
		} else {
			toggle_play = 1;
			btn.style.backgroundColor = "#f0ff66";
			btn.style.backgroundImage = "url('/images/live-demo/deepdrum/stop.png')";
			scheduleTimeOff();
			scheduleTimeOn();
		}
	} else {
		toggle_play = 0;
		btn.style.backgroundColor = "#64e0e5";
		btn.style.backgroundImage = "url('/images/live-demo/deepdrum/play.png')";
		scheduleTimeOff();
		//updateDisplay(1, master_tag_patterns[selectedTagId]);
		timelineIndicator.style.left = "0px";
		clearIndicatorInStepButtons();
	}
}

//------------------------------
// snackbar message handler
//------------------------------
function showSnackMessage(message) {
	var snackbar  = document.getElementById("deepdrum-snackbar");
	snackbar.innerHTML = message;
    snackbar.classList.add("deepdrum-snackbar-show");
    setTimeout(function(){ snackbar.classList.remove("deepdrum-snackbar-show"); }, 3000);
}

//------------------------------
// master scheduler time ON
//------------------------------
function scheduleTimeOn() {
	tempo = dial_tempo.value;
	Tone.Transport.bpm.value = tempo;

	if (boolPlayMode == 0) {
		if (playedOnce==0) {
			Tone.Transport.scheduleRepeat(playPattern, "16n");
			playedOnce = 1;
		}
	} else {
		if (playedOnce==0) {
			Tone.Transport.scheduleRepeat(playTimeline, "16n");
			playedOnce = 1;
		}
	}
	Tone.Transport.start();
}

//------------------------------
// master scheduler time OFF
//------------------------------
function scheduleTimeOff() {
	Tone.Transport.stop();
	count       = 0;
	chordIdx    = 0;
	bassIdx     = 0;
	arpCount    = 0;
	playedOnce  = 0;
	step        = 0;
	gen_arp_idx = 0;
	indicator_count = 0;
	count_display_timeline = 0;
	lead_synth.triggerRelease();
	bass_synth.triggerRelease();
	Tone.Transport.cancel();
}

//------------------------------
// PLAY DEEPDRUM (TIMELINE MODE)
//------------------------------
var btnAddTimeline     = document.getElementById("deepdrum-timeline-add");
var rectBtnAddTimeline = btnAddTimeline.getBoundingClientRect();

var timelineIndicator     = document.getElementById("deepdrum-timeline-indicator");
var rectTimelineIndicator = timelineIndicator.getBoundingClientRect();

var rectTimelineIndicatorLeft = rectTimelineIndicator.left;
var rectTimelineIndicatorTop  = rectTimelineIndicator.top;

function playTimeline(time) {

	// if global count is reached, stop playing!
	if (count == global_count_limit) { 
		var btn = document.getElementById("deepdrum-play");
		toggle_play = 0;
		btn.style.backgroundColor = "#64e0e5";
		btn.style.backgroundImage = "url('/images/live-demo/deepdrum/play.png')";
		scheduleTimeOff();
		clearIndicatorInStepButtons();
		count = 0;
		timelineIndicator.style.left = "0px";

		// if recorder is on, stop recorder
		if (recordPattern == 1 && connectPlayersToRecorder == 1) {
			if(recorder.state == "inactive") {
				// do nothing
			} else {
				recorder.stop();
			}

			var d_btn = document.getElementById("deepdrum-record");
			d_btn.style.backgroundColor = "#41c443";
			d_btn.style.backgroundImage = "url('/images/live-demo/deepdrum/record-stop.png')";
			scheduleTimeOff();
			clearIndicatorInStepButtons();
			waitAndRender();
		}

		return;
	};

	// timeline indicator iterator
	timelineIndicator.style.left = count + "px";

	var step_buttons_indicator = document.getElementsByClassName("deepdrum-step-buttons-indicator");
	for (var i = 0; i < step_buttons_indicator.length; i++) {
		step_buttons_indicator[i].style.backgroundColor = "#18181b";
	}

	// connect players to destination during recording alone
	if (recordPattern == 1 && connectPlayersToRecorder == 0) {
		connectInstrumentsToRecorder();
		connectPlayersToRecorder = 1;
		recorder.start();
	}

	if(indicator_count >= player_length) { indicator_count = 0 }

	for (var rowId = 0; rowId < global_timeline_patterns.length - 1; rowId++) {

		for (var colId = 0; colId < global_timeline_patterns[rowId].length; colId++) {
			var tick = global_timeline_patterns[rowId][colId];

			if(colId == count) {
				var sb_in = document.getElementById("drum_9_" + indicator_count);
				sb_in.style.backgroundColor = "#ffffff";
				
				if(tick == 1) {
					if(rowId == "0") {
						drum_kick.start(time + TIME_FUTURE);
					} else if(rowId == "1") {
						drum_snare.start(time + TIME_FUTURE);
					} else if(rowId == "2") {
						drum_hihat_closed.start(time + TIME_FUTURE);
					} else if(rowId == "3") {
						drum_hihat_open.start(time + TIME_FUTURE);
					} else if(rowId == "4") {
						drum_tom_low.start(time + TIME_FUTURE);
					} else if(rowId == "5") {
						drum_tom_mid.start(time + TIME_FUTURE);
					} else if(rowId == "6") {
						drum_tom_high.start(time + TIME_FUTURE);
					} else if(rowId == "7") {
						drum_clap.start(time + TIME_FUTURE);
					} else if(rowId == "8") {
						drum_ride.start(time + TIME_FUTURE);
					}
				}
			}
		}
	}

	enableTag("btn-tag-" + global_timeline_patterns[9][count].toLowerCase());

	//-------------------------------------
	// arpeggio quantization happens here
	//-------------------------------------
	try {
		if (arpCount >= (arp_pattern_length)) { 
			arpCount     = 0; 
			gen_arp_idx += 1; 
			bass_synth.triggerRelease();
		}
		if (gen_arp_idx >= gen_arp_patterns.length) {
			gen_arp_idx = 0;
		};
	} catch (err) { }

	//-----------------------
	// enable arp
	//-----------------------
	if (boolArp == 1) {
		if(gen_arp_patterns[gen_arp_idx][arpCount].length >= 1) {
			note = gen_arp_patterns[gen_arp_idx][arpCount];

			if (arpCount % hold_arp_val == 0) {
				lead_synth.triggerAttackRelease(note, "16n", time + TIME_FUTURE);
			}

			if (arpCount == 0) {
				bass_synth.triggerAttack(note[0] + "2");
			}
		}
	}

	//-----------------------
	// count iterator
	//-----------------------
	count       = count + 1;
	arpCount    = arpCount + 1;
	recordCount = recordCount + 1;
	count_display_timeline = count_display_timeline + 1;
	indicator_count = indicator_count + 1;
}

//------------------------------
// CONNECT PLAYERS TO RECORDER
//------------------------------
function connectInstrumentsToRecorder() {
	// drum kit
	drum_kick.connect(dest);
	drum_snare.connect(dest);
	drum_hihat_closed.connect(dest);
	drum_hihat_open.connect(dest);
	drum_tom_low.connect(dest);
	drum_tom_mid.connect(dest);
	drum_tom_high.connect(dest);
	drum_clap.connect(dest);
	drum_ride.connect(dest);

	// arp lead & bass
	lead_synth.connect(dest);
	bass_synth.connect(dest);

	if(boolGpad == 1) {
		gpad_lead.connect(dest);
	}
}

//------------------------------
// PLAY DEEPDRUM (PATTERN MODE)
//------------------------------
function playPattern(time) {
	if(boolPlayMode == 0) {
		if (count == player_length) { 
			count = 0;
		};
	}

	var step_buttons = document.getElementsByClassName("deepdrum-step-buttons");
	var step_buttons_indicator = document.getElementsByClassName("deepdrum-step-buttons-indicator");
	for (var i = 0; i < step_buttons_indicator.length; i++) {
		step_buttons_indicator[i].style.backgroundColor = "#18181b";
	}

	// connect players to destination during recording alone
	if (recordPattern == 1 && connectPlayersToRecorder == 0) {
		connectInstrumentsToRecorder();
		connectPlayersToRecorder = 1;
		recorder.start();
	}

	if (toggle_play == 1) {
		//----------------------------------
		// main loop trigger
		// based on on/off of step buttons
		//----------------------------------
		if (boolPlayMode == 0) {
			// play pattern mode
			for (var i = 0; i < step_buttons.length; i++) {
				var btnId = step_buttons[i].id;
				var s = btnId.split("_");
				if(s[2] == count) {

					var sb_indicator = document.getElementById("drum_9_" + s[2]);
					sb_indicator.style.backgroundColor = "#ffffff";
					
					if(step_buttons[i].getAttribute("btn-mode") == "on") {
						var note = step_buttons[i].dataset.note;
			
						if (s[0] == "drum") {
							if(s[1] == "0") {
								drum_kick.start(time + TIME_FUTURE);
							} else if(s[1] == "1") {
								drum_snare.start(time + TIME_FUTURE);
							} else if(s[1] == "2") {
								drum_hihat_closed.start(time + TIME_FUTURE);
							} else if(s[1] == "3") {
								drum_hihat_open.start(time + TIME_FUTURE);
							} else if(s[1] == "4") {
								drum_tom_low.start(time + TIME_FUTURE);
							} else if(s[1] == "5") {
								drum_tom_mid.start(time + TIME_FUTURE);
							} else if(s[1] == "6") {
								drum_tom_high.start(time + TIME_FUTURE);
							} else if(s[1] == "7") {
								drum_clap.start(time + TIME_FUTURE);
							} else if(s[1] == "8") {
								drum_ride.start(time + TIME_FUTURE);
							}
						}
					}
				}
			}
		}
	}

	//-------------------------------------
	// arpeggio quantization happens here
	//-------------------------------------
	try {
		if (arpCount == (arp_pattern_length - 1)) {
			//bass_synth.triggerRelease();
		}
		if (arpCount >= (arp_pattern_length)) { 
			arpCount     = 0; 
			gen_arp_idx += 1; 
			//bass_synth.triggerRelease();
		}
		if (gen_arp_idx >= gen_arp_patterns.length) {
			gen_arp_idx = 0;
		};
	} catch (err) { }

	//-----------------------
	// enable arp
	//-----------------------
	if (boolArp == 1) {
		if(gen_arp_patterns[gen_arp_idx][arpCount].length >= 1) {
			note = gen_arp_patterns[gen_arp_idx][arpCount];

			if (arpCount % hold_arp_val == 0) {
				lead_synth.triggerAttackRelease(note, "16n", time + TIME_FUTURE);
			}

			if (arpCount == 0) {
				bass_synth.triggerAttackRelease(note[0] + "2", "16n", time + TIME_FUTURE);
			}
		}
	}

	//-----------------------
	// count iterator
	//-----------------------
	count       = count + 1;
	arpCount    = arpCount + 1;
	recordCount = recordCount + 1;
}

function updateGenArpPatterns() {
	gen_arp_length = 0;
	for (var i = 0; i < gen_arp_patterns.length; i++) {
		for (var j = 0; j < gen_arp_patterns[i].length; j++) {
			gen_arp_length += 1;
		}
	}
}

//-----------------------
// download pattern
//-----------------------
function downloadPattern(id) {
	var btn = document.getElementById("deepdrum-record");

	if (boolPlayMode == 1) {
		if(global_timeline_patterns[0].length == 0) {
			showSnackMessage("please add a pattern in timeline to play song!");
			return;
		}
	}

	if (recordPattern == 0) {
		connectPlayersToRecorder = 0;
		
		count     = 0;
		arpCount  = 0;
		chordIdx  = 0;
		bassIdx   = 0;
		step      = 0;
		count_display_timeline = 0;
		chunks    = [];

		btn.style.backgroundColor = "#ffffff";
		btn.style.backgroundImage = "url('/images/live-demo/deepdrum/record-start.png')";
		toggle_play = 0;
		playDeepDrum("deepdrum-play");

		recordPattern = 1;

	} else {
		
		if(recorder.state == "inactive") {
			// do nothing
		} else {
			recorder.stop();
		}

		btn.style.backgroundColor = "#f62e2e";
		btn.style.backgroundImage = "url('/images/live-demo/deepdrum/record-stop.png')";
		toggle_play = 1;
		playDeepDrum("deepdrum-play");
		waitAndRender();
	}
}

function waitAndRender() {
	renderAudioFile();
	recordPattern = 0;
}

function renderAudioFile() {
	recorder.ondataavailable = function (evt) {return chunks.push(evt.data);};
	recorder.onstop = function (evt) {
		var blob = new Blob(chunks, { type: 'audio/wav; codecs=opus' });
		recordPatternAudio.src = URL.createObjectURL(blob);
		
		// create "a" tag to download 
		var downloadBtn  = document.createElement("a");
		downloadBtn.href = recordPatternAudio.src;
		downloadBtn.download = "deepdrum_pattern.wav";
		downloadBtn.click();
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

		try {
			if(master_pattern[row_id][col_id] == 1) {
				var target_button = document.getElementById(step_button_id);
				target_button.setAttribute("btn-mode", "on");
				target_button.className = 'deepdrum-step-boxes-on';
				target_button.classList.add(drum_color_map[row_id]);
				target_button.classList.add('deepdrum-step-buttons');
			}
		} catch (err) {

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
}

let master_tag_patterns = {"A": master_pattern}

// init everything here!
var initializeAll = 0;
loadPlayers();
rearrangeGrid();

document.body.onkeyup = function(e){
    if(e.keyCode == 32){
        playDeepDrum("deepdrum-play");
    }
}

function getKeyByValue(object, value) {
  return Object.keys(object).find(key => object[key] === value);
}

//---------------------------
// display settings in modal
//---------------------------
function showSettings(id) {
	var modal = document.getElementById("deepdrum-modal-settings");
	if (toggleSettings == 0) {
		modal.style.display = "flex";
		toggleSettings = 1;
	} else {
		modal.style.display = "none";
		toggleSettings = 0;
	}
}

//---------------------------
// hide settings in modal
//---------------------------
function closeSettings() {
	var modal = document.getElementById("deepdrum-modal-settings");
	modal.style.display = "none";
	toggleSettings = 0;
}

function initMIDI() {
	const midi = new MIDIAccess({ onDeviceInput });
	midi.start().then(() => {
		console.log("STARTED MIDI");
	}).catch(console.error);

}

function onDeviceInput({ input, velocity}) {
	if(input != undefined && velocity != undefined) {
		if(velocity > 0) {
			lead_synth.triggerAttack(midiSynthMap[input], Tone.context.currentTime, 0.5);
			piano.toggleKey((input-24));
		} else {
			// not pressed
			lead_synth.triggerRelease();
			piano.toggleKey((input-24));
		}
	}
}

function velocityMapper(x, in_min, in_max, out_min, out_max) {
  return parseFloat((x - in_min) * (out_max - out_min) / (in_max - in_min) + out_min);
}

function clearIndicatorInStepButtons() {
	var step_buttons_indicator = document.getElementsByClassName("deepdrum-step-buttons-indicator");
	for (var i = 0; i < step_buttons_indicator.length; i++) {
		step_buttons_indicator[i].style.backgroundColor = "#18181b";
	}
}

function rearrangeGrid() {

	// updated grid values
	let bar_length       = slider_bar_length.value;
	let beats_per_bar    = slider_beats_per_bar.value;
	let split_beats_into = slider_split_beats_into.value;

	// update master length values
	instruments_map["drum"][1] = parseInt(bar_length*beats_per_bar*split_beats_into);
	player_length = parseInt(bar_length*beats_per_bar*split_beats_into);

	// clear drum sequencer
	document.getElementById("deepdrum-drum-container").innerHTML = "";

	// restart everything again
	loadPlayers();
	generateStepBoxes();
	createVolumeDials();
	enableMasterPattern();
	updateSeed();
	updateSeedPattern();
	updateSwing();
	updateSwingSub();
	relativeChordFinder();

	if (initializeAll == 0) {
		initChordPattern();
		updateArpSequence();
		initTagPatterns();
		initArpBoxes();
		initChordPattern();
		updateArpSequence();
		getScaleNotes();
		initializeAll = 1;
	}

	// clear all margins for step buttons
	let step_buttons = document.getElementsByClassName("deepdrum-step-buttons");
	let step_buttons_indicator = document.getElementsByClassName("deepdrum-step-buttons-indicator");
	for (var i = 0; i < step_buttons.length; i++) {
		step_buttons[i].style.marginRight = "1px";
	}
	for (var i = 0; i < step_buttons_indicator.length; i++) {
		step_buttons_indicator[i].style.marginRight = "1px";
	}

	// beat splitter
	let beat_split = parseInt(split_beats_into);
	let buttons_beat_split = document.querySelectorAll(".deepdrum-step-wrapper .deepdrum-step-buttons:nth-child(" + beat_split + "n+1)");
	let buttons_beat_split_indicator = document.querySelectorAll(".deepdrum-step-wrapper .deepdrum-step-buttons-indicator:nth-child(" + beat_split + "n+1)");
	for (var i = 0; i < buttons_beat_split.length; i++) {
		buttons_beat_split[i].style.marginRight = "5px";
	}
	for (var i = 0; i < buttons_beat_split_indicator.length; i++) {
		buttons_beat_split_indicator[i].style.marginRight = "5px";
	}

	// bar splitter
	let bar_split = parseInt(beats_per_bar*split_beats_into);
	let buttons_bar_split = document.querySelectorAll(".deepdrum-step-wrapper .deepdrum-step-buttons:nth-child(" + bar_split + "n+1)");
	let buttons_bar_split_indicator = document.querySelectorAll(".deepdrum-step-wrapper .deepdrum-step-buttons-indicator:nth-child(" + bar_split + "n+1)");
	for (var i = 0; i < buttons_bar_split.length; i++) {
		buttons_bar_split[i].style.marginRight = "20px";
	}
	for (var i = 0; i < buttons_bar_split_indicator.length; i++) {
		buttons_bar_split_indicator[i].style.marginRight = "20px";
	}
}

function applySettings() {
	rearrangeGrid();
	scheduleTimeOff();
	clearPatternInTimeline();
	enableTag("btn-tag-a");
	closeSettings();
}

function getScaleNotes() {
	let temp_notes = scale_bass_notes;
	for (var i = 0; i < temp_notes.length; i++) {
		scale_all_notes.push(temp_notes[i]);
	}

	for (var i = 0; i < temp_notes.length; i++) {
		let note_num = parseInt(temp_notes[i].substring((temp_notes[i].length -1))) + 1;
		let note_pre = temp_notes[i].substring(0, (temp_notes[i].length -1));
		scale_all_notes.push(note_pre + note_num.toString());
	}
}