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

var ionian_chords     = ["maj", "min", "min", "maj", "dom", "min", "dim"];
var dorian_chords     = ["min", "min", "maj", "dom", "min", "dim", "maj"];
var phrygian_chords   = ["min", "maj", "dom", "min", "dim", "maj", "min"];
var lydian_chords     = ["maj", "dom", "min", "dim", "maj", "min", "min"];
var myxolydian_chords = ["dom", "min", "dim", "maj", "min", "min", "maj"];
var aeolian_chords    = ["min", "dim", "maj", "min", "min", "maj", "dom"];
var locrian_chords    = ["dim", "maj", "min", "min", "maj", "dom", "min"];

var MAJOR_OFFSET = 4;
var MINOR_OFFSET = 3;
var DIM_OFFSET   = 3;
var DOM_OFFSET   = 3;

function relativeChordFinder(scale, mode) {

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
				chord.push(all_notes[curNoteIndex + MAJOR_OFFSET]);
				chord.push(all_notes[curNoteIndex]);
			} else if(ionian_chords[i] == "min") {
				chord.push(all_notes[curNoteIndex + MINOR_OFFSET]);
				chord.push(all_notes[curNoteIndex]);
			} else if(ionian_chords[i] == "dim") {
				chord.push(all_notes[curNoteIndex + DIM_OFFSET]);
				chord.push(all_notes[curNoteIndex + DIM_OFFSET + DIM_OFFSET]);
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
				chord.push(all_notes[curNoteIndex + MAJOR_OFFSET]);
				chord.push(all_notes[curNoteIndex]);
			} else if(aeolian_chords[i] == "min") {
				chord.push(all_notes[curNoteIndex + MINOR_OFFSET]);
				chord.push(all_notes[curNoteIndex]);
			} else if(aeolian_chords[i] == "dim") {
				chord.push(all_notes[curNoteIndex + DIM_OFFSET]);
				chord.push(all_notes[curNoteIndex + DIM_OFFSET + DIM_OFFSET]);
			}

			scale_chords.push(chord);
		}
	}
	console.log(scale_notes);
	console.log(scale_chords);
}

relativeChordFinder("D4", "minor");