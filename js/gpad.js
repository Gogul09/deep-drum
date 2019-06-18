var container_gpad = document.getElementById("deepdrum-gpad-box");
var gpad_drawing = false;
var gpad_bubble_0, gpad_canvas, gpad_lead_0, gpad_lead_1;

var gpad_bubble_threshold = 20;

var gpad_num_boxes = 14;
var gpad_box_width = 0;

var canvasStrokeStyle = "#29272e";
var canvasLineJoin    = "round";
var canvasLineWidth   = 1;

var num_touches = 0;

//-----------------------
// create GPAD elements
//-----------------------
function createGPadElements() {
	gpad_box_width = parseInt((container_gpad.clientWidth)/gpad_num_boxes);

	//--------------------------------------
	// gpad bubble display - max 3 touches
	//--------------------------------------
	gpad_bubble_0 = document.createElement("div");
	gpad_bubble_0.id  = "deepdrum-gpad-bubble-0"; 
	gpad_bubble_0.className = "deepdrum-gpad-bubble";
	gpad_bubble_0.style.display = "none";

	container_gpad.appendChild(gpad_bubble_0);

	//----------------------
	// gpad canvas display
	//----------------------
	gpad_canvas = document.createElement("canvas");
	gpad_canvas.setAttribute("width", screen.width);
	gpad_canvas.setAttribute("height", "100%");
	gpad_canvas.setAttribute("id", "gpad_canvas");
	gpad_canvas.style.backgroundColor = "#1d1d1dad";
	
	var ctx = gpad_canvas.getContext("2d");
	ctx.strokeStyle = canvasStrokeStyle;
	ctx.lineJoin    = canvasLineJoin;
  	ctx.lineWidth   = canvasLineWidth;

  	var temp_x = gpad_box_width;
	for (var i = 0; i < gpad_num_boxes; i++) {
		ctx.beginPath();
		ctx.moveTo(temp_x, 0);
		ctx.lineTo(temp_x, container_gpad.offsetHeight);
		ctx.stroke();
		temp_x += gpad_box_width;
	}
	container_gpad.appendChild(gpad_canvas);

	//----------------------
	// gpad tone lead
	//----------------------
	gpad_lead_0 = new Tone.Synth({
		"oscillator" : {
			"type" : "amtriangle",
			"harmonicity" : 0.5,
			"modulationType" : "sine"
		},
		"envelope" : {
			"attackCurve" : 'exponential',
			"attack" : 0.05,
			"decay" : 0.2,
			"sustain" : 0.2,
			"release" : 1.5,
		},
		"portamento" : 0.05
	});

	gpad_lead_0.connect(lead_gain);
}

//---------------------
// MOUSE DOWN function
//---------------------
$("#deepdrum-gpad-box").mousedown(function(e) {
  var mouseX = e.pageX - this.offsetLeft;
  var mouseY = e.pageY - this.offsetTop;

  // display the bubble indicator
  gpad_bubble_0.style.display = "block";
  gpad_bubble_0.style.left    = (mouseX - gpad_bubble_threshold) + "px";
  gpad_bubble_0.style.top     = (mouseY - gpad_bubble_threshold) + "px";

  // what note to trigger?
  let start_note = scale_all_notes[parseInt(mouseX/gpad_box_width)];
  gpad_lead_0.triggerAttack(start_note, Tone.now());
  gpad_drawing = true;
});

//---------------------
// TOUCH START function
//---------------------
container_gpad.addEventListener("touchstart", function (e) {
	if (e.target == container_gpad) {
		e.preventDefault();
	}

	if (e.target == gpad_canvas) {
		e.preventDefault();
	}

	var rect  = container_gpad.getBoundingClientRect();

	var touch = e.touches[0];
	var mouseX = touch.clientX - rect.left;
	var mouseY = touch.clientY - rect.top;

	// display the bubble indicator
	gpad_bubble_0.style.display = "block";
	gpad_bubble_0.style.left    = (mouseX - gpad_bubble_threshold) + "px";
	gpad_bubble_0.style.top     = (mouseY - gpad_bubble_threshold) + "px";

	// what note to trigger?
	let start_note = scale_all_notes[parseInt(mouseX/gpad_box_width)];
	gpad_lead_0.triggerAttack(start_note, Tone.now());

	gpad_drawing = true;

}, false);

//---------------------
// MOUSE MOVE function
//---------------------
$("#deepdrum-gpad-box").mousemove(function(e) {
  if(gpad_drawing) {
	var mouseX = e.pageX - this.offsetLeft;
    var mouseY = e.pageY - this.offsetTop;

	let cur_note = scale_all_notes[parseInt(mouseX/gpad_box_width)];
	gpad_lead_0.setNote(cur_note, "+8n");

	gpad_bubble_0.style.left = (mouseX - gpad_bubble_threshold) + "px";
	gpad_bubble_0.style.top  = (mouseY - gpad_bubble_threshold) + "px";
  }
});

//---------------------
// TOUCH MOVE function
//---------------------
container_gpad.addEventListener("touchmove", function (e) {
	if (e.target == container_gpad) {
		e.preventDefault();
	}

	if (e.target == gpad_canvas) {
		e.preventDefault();
	}

	num_touches = e.touches.length;
	var rect = container_gpad.getBoundingClientRect();

	if(gpad_drawing) {

		var touch = e.touches[0];

		var mouseX = touch.clientX - rect.left;
		var mouseY = touch.clientY - rect.top;

		let cur_note  = scale_all_notes[parseInt(mouseX/gpad_box_width)];

		let last_note = scale_all_notes[parseInt(mouseX/gpad_box_width)];
		let next_note = scale_all_notes[parseInt(mouseX/gpad_box_width) + 1];

		let last_note_freq = parseFloat(Tonal.Note.freq(last_note).toFixed(2));
		let next_note_freq = parseFloat(Tonal.Note.freq(next_note).toFixed(2));

		var freq_mod = 0;
		if (mouseX % gpad_box_width == 0) {
			freq_mod = gpad_box_width;
		} else {
			freq_mod = mouseX % gpad_box_width;
		}

		let intr_note_freq = freq_mapper(freq_mod, 1, gpad_box_width, last_note_freq, next_note_freq);

		gpad_lead_0.frequency.input.value = parseFloat(intr_note_freq);

		gpad_bubble_0.style.left = (mouseX - gpad_bubble_threshold) + "px";
		gpad_bubble_0.style.top  = (mouseY - gpad_bubble_threshold) + "px";
		
	}

}, false);

function freq_mapper(x, in_min, in_max, out_min, out_max) {
  return parseFloat((x - in_min) * (out_max - out_min) / (in_max - in_min) + out_min);
}


//---------------------
// MOUSE UP function
//---------------------
$("#deepdrum-gpad-box").mouseup(function(e) {
	gpad_drawing = false;
	gpad_bubble_0.style.display = "none";
	gpad_lead_0.triggerRelease();
});

//---------------------
// TOUCH END function
//---------------------
container_gpad.addEventListener("touchend", function (e) {
	if (e.target == container_gpad) {
		e.preventDefault();
	}

	if (e.target == gpad_canvas) {
		e.preventDefault();
	}

	if(num_touches == 1) {
		gpad_bubble_0.style.display = "none";
		gpad_lead_0.triggerRelease();
	}

	gpad_drawing = false;

}, false);

//----------------------
// MOUSE LEAVE function
//----------------------
$("#deepdrum-gpad-box").mouseleave(function(e) {
	gpad_drawing = false;
	gpad_bubble_0.style.display = "none";
	gpad_lead_0.triggerRelease();
});


//---------------------
// TOUCH LEAVE function
//---------------------
container_gpad.addEventListener("touchleave", function (e) {
	if (e.target == container_gpad) {
		e.preventDefault();
	}

	if (e.target == gpad_canvas) {
		e.preventDefault();
	}

	if(num_touches == 1) {
		gpad_bubble_0.style.display = "none";
		gpad_lead_0.triggerRelease();
	}

}, false);