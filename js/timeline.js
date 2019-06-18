function addPatternInTimeline(id) {
	var container = document.getElementById("deepdrum-timeline");

	document.getElementById("deepdrum-timeline-add").classList.remove("infinite");

	// create a new box with current selectedTagId
	var npId = "deepdrum-pattern-" + selectedTagId + "-" + timelinePatternCount; 

	var wrapper= document.createElement('div');
	var newPattern = "<div id='" + npId + "' class='deepdrum-timeline-pattern-box' style='width: " + player_length + "px;'><p>" + selectedTagId.toUpperCase() + "</p><span onclick='removeTimelinePattern(\"" + npId + "\")'>x</span></div>";
	wrapper.innerHTML= newPattern;

	var ptr = container.childNodes.length - 4;
	container.insertBefore(wrapper.firstChild, container.childNodes[ptr]);

	timelinePatternCount += 1;
	global_tags.push(selectedTagId);
	updateGlobalTimelinePatterns();
	global_count_limit = global_timeline_patterns[0].length;
}

function removeTimelinePattern(id) {
	var node      = document.getElementById(id);
	var container = document.getElementById("deepdrum-timeline");

	var tagId  = id.split("-")[2];
	var tagIdx = id.split("-")[3];
	for (var row_id = 0; row_id <= master_tag_patterns[tagId].length; row_id++) {
		if(row_id == master_tag_patterns[tagId].length) {
			var row = master_tag_patterns[tagId][0];
			for (var col_id = 0; col_id < row.length; col_id++) {
				global_timeline_patterns[row_id].pop();
			}
		} else {
			var row = master_tag_patterns[tagId][row_id];
			for (var col_id = 0; col_id < row.length; col_id++) {
				global_timeline_patterns[row_id].pop();
			}
		}	
	}

	global_tags.splice(tagIdx, 1);
	container.removeChild(node);
	global_count_limit = global_timeline_patterns[0].length;
	timelinePatternCount -= 1;
	updateGlobalTimelinePatterns();

	if (timelinePatternCount == 0) {
		document.getElementById("deepdrum-timeline-add").classList.add("infinite");
	}
}

function updateGlobalTimelinePatterns() {
	if(boolPlayMode == 1) {
		global_timeline_patterns = [];
		for (var i = 0; i < global_timeline_rows; i++) {
			global_timeline_patterns.push([]);
		}
		for (var tag = 0; tag < global_tags.length; tag++) {
			var curTag = global_tags[tag];

			for (var row_id = 0; row_id < global_timeline_rows; row_id++) {
				for (var col_id = 0; col_id < player_length; col_id++) {
					if(row_id == global_timeline_rows-1) {
						var val = curTag;
						global_timeline_patterns[row_id].push(val);
					} else {
						var val = master_tag_patterns[curTag][row_id][col_id];
						global_timeline_patterns[row_id].push(val);
					}
				}
			}
		}
	}
}

function clearPatternInTimeline() {
	if(toggle_play == 1) {
		playDeepDrum("deepdrum-play");
	}

	global_tags = [];
	global_timeline_patterns = [];
	global_count_limit = 0;
	for (var i = 0; i < global_timeline_rows; i++) {
		global_timeline_patterns.push([]);
	}
	timelineInitialized = 1;

	var container = document.getElementById("deepdrum-timeline");

	try {
		var boxes = document.getElementsByClassName("deepdrum-timeline-pattern-box");
		for (var i = boxes.length - 1; i >= 0; i--) {
			container.removeChild(boxes[i]);
		}
		document.getElementById("deepdrum-timeline-add").classList.add("infinite");
	} catch (err) {
		// do nothing!
	}
}