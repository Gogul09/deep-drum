//---------------------------
// update tempo
//---------------------------
function updateTempo(t) {
	Tone.Transport.bpm.value = t;
	tempo = t;
	document.getElementById("text-tempo").innerHTML = "tempo<br><span>" + tempo + "</span>";
}

//---------------------------
// update temperature drum
//---------------------------
function updateTemperatureDrum(t) {
	temperature_drum = parseFloat(t.toFixed(1));
	document.getElementById("text-temperature-drum").innerHTML = "temperature<br><span>" + temperature_drum + "</span>"
}

//---------------------------
// update temperature arp
//---------------------------
function updateTemperatureArp(t) {
	temperature_arp = parseFloat(t.toFixed(1));
	document.getElementById("text-temperature-arp").innerHTML = "temperature<br><span>" + temperature_arp + "</span>"
}

//---------------------------
// update scale
//---------------------------
function updateScale(id) {
	var e = document.getElementById(id);
	scale = e.options[e.selectedIndex].value + "3";
	relativeChordFinder();
	updateDisplayArpChord();
}

//---------------------------
// update mode
//---------------------------
function updateMode(id) {
	var e = document.getElementById(id);
	mode = e.options[e.selectedIndex].value;
	relativeChordFinder();
	updateDisplayArpChord();
}

//---------------------------
// update seed
//---------------------------
function updateSeed() {
	seed = parseInt(dial_seed.value);
	document.getElementById("text-seed").innerHTML = "seed<br><span>" + seed + "</span>";
	updateSeedDisplay();
}

//---------------------------
// update swing
//---------------------------
function updateSwing() {
	swing = parseFloat(dial_swing.value.toFixed(2));
	document.getElementById("text-swing").innerHTML = "swing<br><span>" + swing + "</span>";
	Tone.Transport.swing = swing;
}

//---------------------------
// update swing sub
//---------------------------
function updateSwingSub() {
	swing_sub = parseInt(dial_swing_sub.value);
	document.getElementById("text-swing-sub").innerHTML = "swing<br><span>" + swing_sub + "</span>";
	Tone.Transport.swingSubdivision = swing_sub + "n";
}

//---------------------------
// update seed display
//---------------------------
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

//---------------------------
// update arp length
//---------------------------
function updateArpLength(v) {
	arp_pattern_length = parseInt(v);
  	document.getElementById("text-arp-length").innerHTML = "arp length<br><span>" + arp_pattern_length + "</span>";
}

//---------------------------
// update synth lead
//---------------------------
function updateSynthLead(id) {
	if (toggle_play == 1) {
		playDeepDrum("deepdrum-play");
	}
	var synthTypeElement = document.getElementById(id);
	synthType  = synthTypeElement.options[synthTypeElement.selectedIndex].value;

	lead_synth = "";
	
	if(synthType == "mono") {
		lead_synth = new Tone.Synth({
			"oscillator" : {
				"type" : "sine",
			},
			"portamento" : 0.05
		});
	} else if (synthType == "poly") {
		lead_synth = new Tone.Synth({
			"oscillator" : {
				"partials" : [0, 2, 3, 4],
			}
		});
	} else if (synthType == "fat") {
		lead_synth = new Tone.Synth({
			"oscillator" : {
				"type" : "fatsawtooth",
				"count" : 3,
				"spread" : 30
			},
			"envelope": {
				"attack": 0.01,
				"decay": 0.1,
				"sustain": 0.5,
				"release": 0.4,
				"attackCurve" : "exponential"
			},
		});
	} else if (synthType == "piano") {
		lead_synth = new Tone.Sampler({
			'A0' : 'A0.[mp3|ogg]',
			'C1' : 'C1.[mp3|ogg]',
			'D#1' : 'Ds1.[mp3|ogg]',
			'F#1' : 'Fs1.[mp3|ogg]',
			'A1' : 'A1.[mp3|ogg]',
			'C2' : 'C2.[mp3|ogg]',
			'D#2' : 'Ds2.[mp3|ogg]',
			'F#2' : 'Fs2.[mp3|ogg]',
			'A2' : 'A2.[mp3|ogg]',
			'C3' : 'C3.[mp3|ogg]',
			'D#3' : 'Ds3.[mp3|ogg]',
			'F#3' : 'Fs3.[mp3|ogg]',
			'A3' : 'A3.[mp3|ogg]',
			'C4' : 'C4.[mp3|ogg]',
			'D#4' : 'Ds4.[mp3|ogg]',
			'F#4' : 'Fs4.[mp3|ogg]',
			'A4' : 'A4.[mp3|ogg]',
			'C5' : 'C5.[mp3|ogg]',
			'D#5' : 'Ds5.[mp3|ogg]',
			'F#5' : 'Fs5.[mp3|ogg]',
			'A5' : 'A5.[mp3|ogg]',
			'C6' : 'C6.[mp3|ogg]',
			'D#6' : 'Ds6.[mp3|ogg]',
			'F#6' : 'Fs6.[mp3|ogg]',
			'A6' : 'A6.[mp3|ogg]',
			'C7' : 'C7.[mp3|ogg]',
			'D#7' : 'Ds7.[mp3|ogg]',
			'F#7' : 'Fs7.[mp3|ogg]',
			'A7' : 'A7.[mp3|ogg]',
			'C8' : 'C8.[mp3|ogg]'
		}, {
			'baseUrl' : '/sounds/salamander/'
		});
		lead_synth.release = 3;
		lead_synth.volume.value = 3;
	} else if (synthType == "guitar") {
		lead_synth = new Tone.Sampler({
			'A2' : 'A2A3.[wav]',
			'A3' : 'A3.[wav]',
			'B2' : 'B2.[wav]',
			'B3' : 'B3.[wav]',
			'B4' : 'B4.[wav]',
			'C#3' : 'Cs3.[wav]',
			'C#4' : 'Cs4.[wav]',
			'D#4' : 'Ds4.[wav]',
			'D3' : 'D3.[wav]',
			'D5' : 'D5.[wav]',
			'E2' : 'E2.[wav]',
			'E4' : 'E4.[wav]',
			'F2' : 'F2.[wav]',
			'F3' : 'F2F3.[wav]',
		}, {
			'baseUrl' : '/sounds/acoustic_guitar/'
		});
	}
	if (boolArp == 1) {
		let lead_echo = new Tone.FeedbackDelay('8n.', 0.3);
		lead_synth.connect(lead_echo);
		lead_synth.connect(lead_gain);
		lead_gain.toMaster();
	} else {
		lead_synth.connect(lead_gain);
		lead_gain.toMaster();
	}
}

//---------------------------
// update synth Bass
//---------------------------
function updateSynthBass(id) {
	if (toggle_play == 1) {
		playDeepDrum("deepdrum-play");
	}
	var synthTypeElement = document.getElementById(id);
	synthType  = synthTypeElement.options[synthTypeElement.selectedIndex].value;
	
	if(synthType == "mono") {
		bass_synth = new Tone.Synth({
			"oscillator" : {
				"type" : "sine",
			},
			"portamento" : 0.05
		});
	} else if (synthType == "poly") {
		bass_synth = new Tone.Synth({
			"oscillator" : {
				"partials" : [0, 2, 3, 4],
			}
		});
	} else if (synthType == "fat") {
		bass_synth = new Tone.Synth({
			"oscillator" : {
				"type" : "fatsawtooth",
				"count" : 3,
				"spread" : 30
			},
			"envelope": {
				"attack": 0.01,
				"decay": 0.1,
				"sustain": 0.5,
				"release": 0.4,
				"attackCurve" : "exponential"
			},
		});
	} else if (synthType == "piano") {
		bass_synth = new Tone.Sampler({
			'A0' : 'A0.[mp3|ogg]',
			'C1' : 'C1.[mp3|ogg]',
			'D#1' : 'Ds1.[mp3|ogg]',
			'F#1' : 'Fs1.[mp3|ogg]',
			'A1' : 'A1.[mp3|ogg]',
			'C2' : 'C2.[mp3|ogg]',
			'D#2' : 'Ds2.[mp3|ogg]',
			'F#2' : 'Fs2.[mp3|ogg]',
			'A2' : 'A2.[mp3|ogg]',
			'C3' : 'C3.[mp3|ogg]',
			'D#3' : 'Ds3.[mp3|ogg]',
			'F#3' : 'Fs3.[mp3|ogg]',
			'A3' : 'A3.[mp3|ogg]',
			'C4' : 'C4.[mp3|ogg]',
			'D#4' : 'Ds4.[mp3|ogg]',
			'F#4' : 'Fs4.[mp3|ogg]',
			'A4' : 'A4.[mp3|ogg]',
			'C5' : 'C5.[mp3|ogg]',
			'D#5' : 'Ds5.[mp3|ogg]',
			'F#5' : 'Fs5.[mp3|ogg]',
			'A5' : 'A5.[mp3|ogg]',
			'C6' : 'C6.[mp3|ogg]',
			'D#6' : 'Ds6.[mp3|ogg]',
			'F#6' : 'Fs6.[mp3|ogg]',
			'A6' : 'A6.[mp3|ogg]',
			'C7' : 'C7.[mp3|ogg]',
			'D#7' : 'Ds7.[mp3|ogg]',
			'F#7' : 'Fs7.[mp3|ogg]',
			'A7' : 'A7.[mp3|ogg]',
			'C8' : 'C8.[mp3|ogg]'
		}, {
			'baseUrl' : '/sounds/salamander/'
		});
		bass_synth.release = 3;
	}
	bass_synth.connect(bass_gain);
	bass_gain.toMaster();
}

//-----------------------------
// update global tag container
//-----------------------------
function updateGlobalTagContainer() {
	deepdrum_container[selectedTagId] = {};

	deepdrum_container[selectedTagId] = {
		"tempo": tempo,
		"temperature": temperature,
		"seed": seed,
		"pattern": master_tag_patterns[selectedTagId],
		"arp_sequence": arpSequence
	}
}

//--------------------------------
// update display based on 
// input/predicted pattern
//--------------------------------
function updateDisplay(partialClear, pattern) {
	clearPlayback(partialClear);

	var step_buttons = document.getElementsByClassName("deepdrum-step-buttons");
	for (var i = 0; i < step_buttons.length; i++) {
		var btn   = step_buttons[i];
		var btnId = btn.id;
		var s = btnId.split("_");
		var row_id = s[1];
		var col_id = s[2];

		if (row_id == 9) {

		} else {
			if (col_id >= seed) {
				if(master_tag_patterns[selectedTagId][row_id][col_id] == 1) {
					btn.setAttribute("btn-mode", "on");
					btn.className = 'deepdrum-step-boxes-on';
					btn.classList.add(drum_color_map[row_id]);
					btn.classList.add('deepdrum-step-buttons');
				} else {
					btn.setAttribute("btn-mode", "off");
					btn.className = 'deepdrum-step-boxes-off';
					btn.classList.add('deepdrum-step-buttons');
				}
			}
		}
	}
}