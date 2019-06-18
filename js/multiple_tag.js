//---------------------------------
// initialize first tag 'A'
//---------------------------------
function initTagPatterns() {
	var initTag = document.getElementById("btn-tag-a");
	initTag.style.backgroundColor = "rgb(255, 255, 255)";
	initTag.style.color = "rgb(0, 0, 0)";
	selectedTagId = "A";
}

//---------------------------------
// add tag to generate new pattern
//---------------------------------
function addTag(id) {
	var btns_tag   = document.getElementsByClassName("btns-tag");
	var container  = document.getElementById("deepdrum-tag-holder");

	if (btns_tag.length == 6) {
		showSnackMessage("maximum of 6 patterns can be included!");
	} else {
		var uniqueId = tag_ids[btns_tag.length];

		var wrapper= document.createElement('div');
		var btnElement = "<button id='btn-tag-" + uniqueId + "' class='btns-tag' onclick='enableTag(this.id)'>" + uniqueId.toUpperCase() + "</button>";
		wrapper.innerHTML= btnElement;

		var ptr = container.childNodes.length - 2;
		container.insertBefore(wrapper.firstChild, container.childNodes[ptr]);

		master_tag_patterns[uniqueId.toUpperCase()] = [
			[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
		]; 
	}
}

//------------------------------------
// enable tag onclick to view pattern
//------------------------------------
function enableTag(id) {
	var btns_tag = document.getElementsByClassName("btns-tag");

	for (var i = 0; i < btns_tag.length; i++) {
		btns_tag[i].style.backgroundColor = "#1c1c1f";
		btns_tag[i].style.color = "#8d8d8d";
	}

	var clicked_tag = document.getElementById(id);
	clicked_tag.style.backgroundColor = "rgb(255, 255, 255)";
	clicked_tag.style.color = "rgb(0, 0, 0)";

	selectedTagId = id.split("-")[2].toUpperCase();
	updateDisplay(1, master_tag_patterns[selectedTagId]);
}