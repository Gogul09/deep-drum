//------------------------------------
// initial chord pattern to be played
//------------------------------------
function initChordPattern() {
	arpSequence = [0];

	for (i = 0; i < arpSequence.length; i++) {
		cur_chords.push(scale_chord_notes[arpSequence[i]]);
		cur_bass_notes.push(scale_bass_notes[arpSequence[i]]);

		// generate arp using ImprovRNN
		cur_note = scale_bass_notes[arpSequence[i]];
		let s_seq = [
				{ note: Tonal.midi(scale_bass_notes[arpSequence[i]]), 
				  time: Tone.now()
			    }];
		let c_prg = scale_bass_notes[arpSequence[i]][0] + mode_chords[mode][arpSequence[i]];
		setTimeout(function() {
			predictArpSequence(Tonal.midi(scale_bass_notes[arpSequence[i]]), s_seq, c_prg, 0).then(function(r) {
				gen_arp_patterns[0] = r;
			});
		}, 1000);
	}
	
	for (var i = 0; i < arpCols; i++) {
		var col_elements = document.querySelectorAll("[id^=deepdrum-arp-" + i + "]");
		for (var j = 0; j < col_elements.length; j++) {
			if (j == (arpSequence[i])) {
				col_elements[j].setAttribute("arp-mode", "on");
				col_elements[j].style.backgroundColor = "#ffffff";
				col_elements[j].style.color = "#000";
			}
		}
	}
}

//-----------------------------------------------------
// arp boxes that holds relative chords for a "Scale"
//-----------------------------------------------------
function initArpBoxes() {
	var container = document.getElementById("deepdrum-arp-box");

	var col = 0;
	for (var i = 0; i < arpCols + 1; i++) {
		if (i == arpCols) { 
			var ulElement = document.createElement("ul");
			ulElement.id  = "deepdrum-arp-container-" + col;
			ulElement.className = "deepdrum-arp-container-controls";

			var addBox = "<div class='deepdrum-arp-add-btn-box'><button class='deepdrum-arp-btn' id='deepdrum-arp-add-btn" + col + "' onclick='addArpCols(this.id)'>+</button><button class='deepdrum-arp-btn' id='deepdrum-arp-remove-btn" + col + "' onclick='removeArpCols(this.id)'>-</button></div><div class='deepdrum-arp-hold-container'><button class='deepdrum-arp-hold animated pulse infinite' id='deepdrum-arp-hold' onclick='holdArp(this.id)'></button></div>";
			ulElement.innerHTML = addBox;
			container.appendChild(ulElement);
		} else {
			var ulElement = document.createElement("ul");
			ulElement.id  = "deepdrum-arp-container-" + col;
			ulElement.className = "deepdrum-arp-container";

			var row = 1;
			var liElements = "";
			for (var j = 0; j < arpRows; j++) {
				li_id = "deepdrum-arp-" + col + "-" + row;
				
				if (j == (arpRows - 1)) {
					if (i == 0) {
						var liElement = "<li id='" + li_id + "' class='deepdrum-arp-note'>" + (cur_bass_notes[i].split(/([0-9]+)/)[0] + mode_chords[mode][i]) + "</li>";
					} else {
						var liElement = "<li id='" + li_id + "' class='deepdrum-arp-note'>" + (cur_bass_notes[i].split(/([0-9]+)/)[0] + mode_chords[mode][i-1]) + "</li>";
					}
				} else {
					var liElement = "<li id='" + li_id + "' onclick='enableChordNote(this.id)'>" + row + "</li>";
				}
				liElements = liElements + liElement;

				row = row + 1;
			}
			ulElement.innerHTML = liElements;
			container.appendChild(ulElement);
		}
		
		col = col + 1;
	}
}

//-----------------------------------------------------
// enable chord notes onclick of numbered arpbox cell
//-----------------------------------------------------
function enableChordNote(li_id) {
	var s   = li_id.split("-");
	var arp_row = s[3];
	var arp_col = s[2];

	var col_elements = document.querySelectorAll("[id^=deepdrum-arp-" + arp_col + "]");
	for (var i = 0; i < col_elements.length; i++) {
		col_elements[i].style.backgroundColor = "#1d1d1dad";
		col_elements[i].style.color = "#8d8d8d";
	}

	document.getElementById(li_id).setAttribute("arp-mode", "on");
	document.getElementById(li_id).style.backgroundColor = "#ffffff";
	document.getElementById(li_id).style.color = "#000";

	arpSequence[arp_col] = parseInt(arp_row-1);
	updateArpSequence();
	showArpChords(li_id, arp_row, arp_col);

	// generate arp using ImprovRNN
	cur_note = scale_bass_notes[arp_row-1];
	let s_seq = [
			{ note: Tonal.midi(scale_bass_notes[arp_row-1]), 
			  time: Tone.now()
		    }];
	let c_prg = scale_bass_notes[arp_row-1][0] + mode_chords[mode][arp_row-1];
	predictArpSequence(Tonal.midi(scale_bass_notes[arp_row-1]), s_seq, c_prg, 0).then(function(r) {
		gen_arp_patterns[arp_col] = r;
	});
	updateGenArpPatterns();
}

//-----------------------------------
// sleep code
//-----------------------------------
function sleep(milliseconds) {
  var start = new Date().getTime();
  for (var i = 0; i < 1e7; i++) {
    if ((new Date().getTime() - start) > milliseconds){
      break;
    }
  }
}

//-----------------------------------
// add arp columns to the controller
//-----------------------------------
function addArpCols(id) {
	if (arpCols == 4) { 
		showSnackMessage("you have reached the maximum!");
	} else {

		var container = document.getElementById("deepdrum-arp-box");
		var col = arpCols;

		arpSequence[col] = 0;
		updateArpSequence();

		var ulElement = document.createElement("ul");
		ulElement.id  = "deepdrum-arp-container-" + col;
		ulElement.className = "deepdrum-arp-container";

		var row = 1;
		var liElements = "";
		for (var j = 0; j < arpRows; j++) {
			li_id = "deepdrum-arp-" + col + "-" + row;
			
			if (j == 0) {
				var liElement = "<li id='" + li_id + "' onclick='enableChordNote(this.id)' style='background-color: #ffffff; color: #000;'>" + row + "</li>";
			} else if (j == (arpRows - 1)) { 
				var liElement = "<li id='" + li_id + "' class='deepdrum-arp-note'>" + (cur_bass_notes[col].split(/([0-9]+)/)[0] + mode_chords[mode][0]) + "</li>";
			}else {
				var liElement = "<li id='" + li_id + "' onclick='enableChordNote(this.id)'>" + row + "</li>";
			}
			liElements = liElements + liElement;

			row = row + 1;
		}
		ulElement.innerHTML = liElements;
		container.insertBefore(ulElement, container.childNodes[arpCols]);
		arpCols = arpCols + 1;
		
		// generate arp using ImprovRNN
		cur_note = scale_bass_notes[0];
		let s_seq = [
				{ note: Tonal.midi(scale_bass_notes[0]), 
				  time: Tone.now()
			    }];
		let c_prg = scale_bass_notes[0][0] + mode_chords[mode][0];
		setTimeout(function() {
			predictArpSequence(Tonal.midi(scale_bass_notes[0]), s_seq, c_prg, 0).then(function(r) {
				gen_arp_patterns[col] = r;
			});
			updateGenArpPatterns();
		}, 1000);
	}
}

//---------------------------------------
// remove arp columns from the controller
//---------------------------------------
function removeArpCols(id) {
	if (arpCols == 1) {
		showSnackMessage("minimum one arp note must be there!");
	} else {
		var container = document.getElementById("deepdrum-arp-box");
		var col = arpCols;
		container.removeChild(container.childNodes[col]);
		arpCols = arpCols - 1;
		arpSequence.pop();
		updateArpSequence();
	}
}

//---------------------------------------
// update current arp sequence
//---------------------------------------
function updateArpSequence() {
	cur_chords     = [];
	cur_bass_notes = [];
	for (var i = 0; i < arpSequence.length; i++) {
		cur_chords.push(scale_chord_notes[arpSequence[i]]);
		cur_bass_notes.push(scale_bass_notes[arpSequence[i]]);
	}
}

//--------------------------------------------
// update chord name in arp boxes
//--------------------------------------------
function showArpChords(li_id, row_id, col_id) {
	var d_btn = document.getElementById("deepdrum-arp-" + col_id + "-" + arpRows); 
	d_btn.innerHTML = cur_bass_notes[col_id].split(/([0-9]+)/)[0] + mode_chords[mode][row_id - 1];
}

//----------------------------------------------
// update all chord notes if "mode" is changed
//----------------------------------------------
function updateDisplayArpChord() {
	for (var col_id = 0; col_id < arpCols; col_id++) {
		var row_id = arpSequence[col_id];
		var d_btn = document.getElementById("deepdrum-arp-" + col_id + "-" + arpRows);
		d_btn.innerHTML = cur_bass_notes[col_id].split(/([0-9]+)/)[0] + mode_chords[mode][row_id];
	}
}

var hold_arp_limit = 5;
var hold_arp_val   = 1;
var hold_arp_colors = ["#f62e2e", "#ffffff", "#f62e2e", "#ffffff", "#f62e2e"];

function holdArp() {
	var btn_hold = document.getElementById("deepdrum-arp-hold");
	if(hold_arp_val >= (hold_arp_limit-1)) {
		hold_arp_val = 1;
		btn_hold.style.borderWidth = "2px";
	} else {
		hold_arp_val += 1;
		btn_hold.style.borderWidth = (hold_arp_val * 5) + "px";
	}
	btn_hold.style.backgroundColor = hold_arp_colors[hold_arp_val];
}