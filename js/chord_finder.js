var all_notes    = ["C3", "C#3", "D3", "D#3", "E3", "F3", "F#3", "G3", "G#3", "A3", "A#3", "B3",
				    "C4", "C#4", "D4", "D#4", "E4", "F4", "F#4", "G4", "G#4", "A4", "A#4", "B4",
				    "C5", "C#5", "D5", "D#5", "E5", "F5", "F#5", "G5", "G#5", "A5", "A#5", "B5",
				    "C6", "C#6", "D6", "D#6", "E6", "F6", "F#6", "G6", "G#6", "A6", "A#6", "B6"];

var base_notes   = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];

var ionian_steps     = [0, 2, 2, 1, 2, 2, 2, 1];
var dorian_steps     = [0, 2, 1, 2, 2, 2, 1, 2];
var phrygian_steps   = [0, 1, 2, 2, 2, 1, 2, 2];
var lydian_steps     = [0, 2, 2, 2, 1, 2, 2, 1];
var myxolydian_steps = [0, 2, 2, 1, 2, 2, 1, 2];
var aeolian_steps    = [0, 2, 1, 2, 2, 1, 2, 2];
var locrian_steps    = [0, 1, 2, 2, 1, 2, 2, 2];

var ionian_chords     = ["maj", "min", "min", "maj", "maj", "min", "min", "maj"];
var dorian_chords     = ["min", "min", "maj", "min", "min", "min", "maj", "min"];
var phrygian_chords   = ["min", "maj", "min", "min", "min", "maj", "min", "min"];
var lydian_chords     = ["maj", "min", "min", "min", "maj", "min", "min", "maj"];
var myxolydian_chords = ["min", "min", "min", "maj", "min", "min", "maj", "min"];
var aeolian_chords    = ["min", "min", "maj", "min", "min", "maj", "maj", "min"];
var locrian_chords    = ["min", "maj", "min", "min", "maj", "min", "min", "min"];

let mode_chords = {
	"ionian"     : ["M", "m", "m", "M", "M", "m", "m", "M", "M"],
	"dorian"     : ["m", "m", "M", "m", "m", "m", "M", "m", "m"],
	"phrygian"   : ["m", "M", "m", "m", "m", "M", "m", "m", "m"],
	"lydian"     : ["M", "m", "m", "m", "M", "m", "m", "M", "M"],
	"myxolydian" : ["m", "m", "m", "M", "m", "m", "M", "m", "m"],
	"aeolian"    : ["m", "m", "M", "m", "m", "M", "M", "m", "m"],
	"locrian"    : ["m", "M", "m", "m", "M", "m", "m", "m", "m"]
}

/*
var ionian_chords     = ["maj", "min", "min", "maj", "dom", "min", "dim", "maj"];
var dorian_chords     = ["min", "min", "maj", "dom", "min", "dim", "maj", "min"];
var phrygian_chords   = ["min", "maj", "dom", "min", "dim", "maj", "min", "min"];
var lydian_chords     = ["maj", "dom", "min", "dim", "maj", "min", "min", "maj"];
var myxolydian_chords = ["dom", "min", "dim", "maj", "min", "min", "maj", "dom"];
var aeolian_chords    = ["min", "dim", "maj", "min", "min", "maj", "maj", "min"];
var locrian_chords    = ["dim", "maj", "min", "min", "maj", "dom", "min", "dim"];
*/

var MAJOR_OFFSET = [4, 7];
var MINOR_OFFSET = [3, 7];
var DIM_OFFSET   = [3, 7];
var DOM_OFFSET   = [3, 7];

function relativeChordFinder() {

	scale_chord_notes = [];
	scale_bass_notes  = [];

	var scale_notes  = [];
	var scale_chords = [];
	var rootNoteIndex = all_notes.indexOf(scale);
	var curNoteIndex  = rootNoteIndex;

	if(mode == "ionian") {
		for (var i = 0; i < ionian_steps.length; i++) {
			var curNoteIndex = curNoteIndex + ionian_steps[i];
			scale_notes.push(all_notes[curNoteIndex]);
			
			var chord = [];

			chord.push(all_notes[curNoteIndex]);
			if(ionian_chords[i] == "maj") {
				chord.push(all_notes[curNoteIndex + MAJOR_OFFSET[0]]);
				chord.push(all_notes[curNoteIndex + MAJOR_OFFSET[1]]);
			} else if(ionian_chords[i] == "min") {
				chord.push(all_notes[curNoteIndex + MINOR_OFFSET[0]]);
				chord.push(all_notes[curNoteIndex + MINOR_OFFSET[1]]);
			} else if(ionian_chords[i] == "dim") {
				chord.push(all_notes[curNoteIndex + DIM_OFFSET[0]]);
				chord.push(all_notes[curNoteIndex + DIM_OFFSET[1]]);
			} else if(ionian_chords[i] == "dom") {
				chord.push(all_notes[curNoteIndex + DOM_OFFSET[0]]);
				chord.push(all_notes[curNoteIndex + DOM_OFFSET[1]]);
			}

			scale_chords.push(chord);
		}
	} else if (mode == "dorian") {
		for (var i = 0; i < dorian_steps.length; i++) {
			var curNoteIndex = curNoteIndex + dorian_steps[i];
			scale_notes.push(all_notes[curNoteIndex]);
			
			var chord = [];

			chord.push(all_notes[curNoteIndex]);
			if(dorian_chords[i] == "maj") {
				chord.push(all_notes[curNoteIndex + MAJOR_OFFSET[0]]);
				chord.push(all_notes[curNoteIndex + MAJOR_OFFSET[1]]);
			} else if(dorian_chords[i] == "min") {
				chord.push(all_notes[curNoteIndex + MINOR_OFFSET[0]]);
				chord.push(all_notes[curNoteIndex + MINOR_OFFSET[1]]);
			} else if(dorian_chords[i] == "dim") {
				chord.push(all_notes[curNoteIndex + DIM_OFFSET[0]]);
				chord.push(all_notes[curNoteIndex + DIM_OFFSET[1]]);
			} else if(dorian_chords[i] == "dom") {
				chord.push(all_notes[curNoteIndex + DOM_OFFSET[0]]);
				chord.push(all_notes[curNoteIndex + DOM_OFFSET[1]]);
			}

			scale_chords.push(chord);
		}
	} else if (mode == "phrygian") {
		for (var i = 0; i < phrygian_steps.length; i++) {
			var curNoteIndex = curNoteIndex + phrygian_steps[i];
			scale_notes.push(all_notes[curNoteIndex]);
			
			var chord = [];

			chord.push(all_notes[curNoteIndex]);
			if(phrygian_chords[i] == "maj") {
				chord.push(all_notes[curNoteIndex + MAJOR_OFFSET[0]]);
				chord.push(all_notes[curNoteIndex + MAJOR_OFFSET[1]]);
			} else if(phrygian_chords[i] == "min") {
				chord.push(all_notes[curNoteIndex + MINOR_OFFSET[0]]);
				chord.push(all_notes[curNoteIndex + MINOR_OFFSET[1]]);
			} else if(phrygian_chords[i] == "dim") {
				chord.push(all_notes[curNoteIndex + DIM_OFFSET[0]]);
				chord.push(all_notes[curNoteIndex + DIM_OFFSET[1]]);
			} else if(phrygian_chords[i] == "dom") {
				chord.push(all_notes[curNoteIndex + DOM_OFFSET[0]]);
				chord.push(all_notes[curNoteIndex + DOM_OFFSET[1]]);
			}

			scale_chords.push(chord);
		}
	} else if (mode == "lydian") {
		for (var i = 0; i < lydian_steps.length; i++) {
			var curNoteIndex = curNoteIndex + lydian_steps[i];
			scale_notes.push(all_notes[curNoteIndex]);
			
			var chord = [];

			chord.push(all_notes[curNoteIndex]);
			if(lydian_chords[i] == "maj") {
				chord.push(all_notes[curNoteIndex + MAJOR_OFFSET[0]]);
				chord.push(all_notes[curNoteIndex + MAJOR_OFFSET[1]]);
			} else if(lydian_chords[i] == "min") {
				chord.push(all_notes[curNoteIndex + MINOR_OFFSET[0]]);
				chord.push(all_notes[curNoteIndex + MINOR_OFFSET[1]]);
			} else if(lydian_chords[i] == "dim") {
				chord.push(all_notes[curNoteIndex + DIM_OFFSET[0]]);
				chord.push(all_notes[curNoteIndex + DIM_OFFSET[1]]);
			} else if(lydian_chords[i] == "dom") {
				chord.push(all_notes[curNoteIndex + DOM_OFFSET[0]]);
				chord.push(all_notes[curNoteIndex + DOM_OFFSET[1]]);
			}

			scale_chords.push(chord);
		}
	} else if (mode == "myxolydian") {
		for (var i = 0; i < myxolydian_steps.length; i++) {
			var curNoteIndex = curNoteIndex + myxolydian_steps[i];
			scale_notes.push(all_notes[curNoteIndex]);
			
			var chord = [];

			chord.push(all_notes[curNoteIndex]);
			if(myxolydian_chords[i] == "maj") {
				chord.push(all_notes[curNoteIndex + MAJOR_OFFSET[0]]);
				chord.push(all_notes[curNoteIndex + MAJOR_OFFSET[1]]);
			} else if(myxolydian_chords[i] == "min") {
				chord.push(all_notes[curNoteIndex + MINOR_OFFSET[0]]);
				chord.push(all_notes[curNoteIndex + MINOR_OFFSET[1]]);
			} else if(myxolydian_chords[i] == "dim") {
				chord.push(all_notes[curNoteIndex + DIM_OFFSET[0]]);
				chord.push(all_notes[curNoteIndex + DIM_OFFSET[1]]);
			} else if(myxolydian_chords[i] == "dom") {
				chord.push(all_notes[curNoteIndex + DOM_OFFSET[0]]);
				chord.push(all_notes[curNoteIndex + DOM_OFFSET[1]]);
			}

			scale_chords.push(chord);
		}
	} else if (mode == "aeolian") {
		for (var i = 0; i < aeolian_steps.length; i++) {
			var curNoteIndex = curNoteIndex + aeolian_steps[i];
			scale_notes.push(all_notes[curNoteIndex]);
			
			var chord = [];

			chord.push(all_notes[curNoteIndex]);
			if(aeolian_chords[i] == "maj") {
				chord.push(all_notes[curNoteIndex + MAJOR_OFFSET[0]]);
				chord.push(all_notes[curNoteIndex + MAJOR_OFFSET[1]]);
			} else if(aeolian_chords[i] == "min") {
				chord.push(all_notes[curNoteIndex + MINOR_OFFSET[0]]);
				chord.push(all_notes[curNoteIndex + MINOR_OFFSET[1]]);
			} else if(aeolian_chords[i] == "dim") {
				chord.push(all_notes[curNoteIndex + DIM_OFFSET[0]]);
				chord.push(all_notes[curNoteIndex + DIM_OFFSET[1]]);
			} else if(aeolian_chords[i] == "dom") {
				chord.push(all_notes[curNoteIndex + DOM_OFFSET[0]]);
				chord.push(all_notes[curNoteIndex + DOM_OFFSET[1]]);
			}

			scale_chords.push(chord);
		}
	} else if (mode == "locrian") {
		for (var i = 0; i < locrian_steps.length; i++) {
			var curNoteIndex = curNoteIndex + locrian_steps[i];
			scale_notes.push(all_notes[curNoteIndex]);
			
			var chord = [];

			chord.push(all_notes[curNoteIndex]);
			if(locrian_chords[i] == "maj") {
				chord.push(all_notes[curNoteIndex + MAJOR_OFFSET[0]]);
				chord.push(all_notes[curNoteIndex + MAJOR_OFFSET[1]]);
			} else if(locrian_chords[i] == "min") {
				chord.push(all_notes[curNoteIndex + MINOR_OFFSET[0]]);
				chord.push(all_notes[curNoteIndex + MINOR_OFFSET[1]]);
			} else if(locrian_chords[i] == "dim") {
				chord.push(all_notes[curNoteIndex + DIM_OFFSET[0]]);
				chord.push(all_notes[curNoteIndex + DIM_OFFSET[1]]);
			} else if(locrian_chords[i] == "dom") {
				chord.push(all_notes[curNoteIndex + DOM_OFFSET[0]]);
				chord.push(all_notes[curNoteIndex + DOM_OFFSET[1]]);
			}

			scale_chords.push(chord);
		}
	}
	
	scale_chord_notes = scale_chords;
	scale_bass_notes  = scale_notes;
}