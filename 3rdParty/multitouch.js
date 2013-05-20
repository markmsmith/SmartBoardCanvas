// canvasDrawr originally from Mike Taylr  http://miketaylr.com/
// Tim Branyen massaged it: http://timbranyen.com/
// and i did too. with multi touch.
// and boris fixed some touch identifier stuff to be more specific.

var CanvasDrawr = function(options) {
  // grab canvas element
  var canvas = document.getElementById(options.id);
	//console.log(showObject("Canvas", canvas));
	var ctxt = canvas.getContext("2d");
	//console.log(showObject("Context", ctxt));

	var drawing_params = {colour: "black", thickness: 1 };

	canvas.width = canvas.offsetWidth;

	// set props from options, but the defaults are for the cool kids
	ctxt.lineWidth = options.size || Math.ceil(Math.random() * 1);
	ctxt.lineCap = options.lineCap || "round";

	var lines = [,,,,];
	var offset = jQuery(canvas).offset();
	// if (BrowserDetect.browser == "Chrome" || BrowserDetect.browser == "Safari") offset.left += 438; // empirical value
	//console.log(showObject("Offset", offset));

	var event_id;

	var xKey = BrowserDetect.browser == "Explorer" ? 'clientX' : 'pageX';
	var yKey = BrowserDetect.browser == "Explorer" ? 'clientY' : 'pageY';

	var self = {
    //bind click events
    init: function() {
    	canvas.addEventListener('touchstart', self.preDraw, false);
    	canvas.addEventListener('touchmove', self.draw, false);
    },

    preDraw: function(event) {
    	// if(event.toolData.tool == "finger") return;

    	var touchCoord = { x : BrowserDetect.browser == "Explorer" ? event.clientX : event.pageX,
    	y : BrowserDetect.browser == "Explorer" ? event.clientY : event.pageY };
			// Make a hit test, if not in the canvas return
			if ((touchCoord.x - offset.left) < 0 || (touchCoord.y - offset.top) < 0 ||
				(touchCoord.x - offset.left) > canvas.offsetWidth || (touchCoord.y - offset.top) > canvas.offsetHeight) return;

				event_id = event.identifier;
			//console.log("preDraw Event: " + event.identifier + " " + event.toolData.tool + " at (" + event.pageX + "," + event.pageY + ")");
			jQuery.each(event.touches, function(i, touch) {
				var id      = touch.identifier,
				mycolor = event.toolData.colorAsHTML == null ? drawing_params.colour : event.toolData.colorAsHTML;
				if (event_id == id) {
					//createMsgDetail("preDraw Event: " + event.identifier, event);
					lines[id] = {
						x: touchCoord.x - offset.left,
						y: touchCoord.y - offset.top,
						color: mycolor,
						thickness : options.size,
						cnt: 0
					};
					console.log("preDraw Touch: " +
						touch.identifier + " position: (" + touchCoord.x + "," + touchCoord.y + ") point: (" + lines[id].x + "," + lines[id].y + ")");
				}
			});
			event.preventDefault();
		},

		draw: function(event) {
			// if (event.toolData.tool == "pen" || event.toolData.tool == "eraser") {
				event_id = event.identifier;
				var touchCoord = {
					x : event[xKey],
					y : event[yKey]
				};
				//console.log(showObject("draw Event: ", event));
				//console.log(showObject("Event.toolData", event.toolData));

				jQuery.each(event.touches, function(i, touch) {
					var id = touch.identifier;
					if(typeof lines[id] === "undefined") return;

					var	moveX = touchCoord.x - offset.left - lines[id].x,
					moveY = touchCoord.y - offset.top - lines[id].y;
					if (event_id == id) {
						if (moveX !=0 || moveY != 0) {
							var canvasBackgroundColor = $(canvas).css('background-color') || '#FFFFFF';
							if( /rgba\(.*,\s?0\)/.test(canvasBackgroundColor) ){
								canvasBackgroundColor = '#FFFFFF';
							}
							lines[id].color = event.toolData.tool == "eraser" ? canvasBackgroundColor :
							(event.toolData.colorAsHTML == null ? drawing_params.colour : event.toolData.colorAsHTML);
							lines[id].thickness = event.toolData.width;
							var ret = self.move(id, moveX, moveY);
							lines[id].cnt++;
							lines[id].x = ret.x;
							lines[id].y = ret.y;
						}
					}
				});
			// }
			event.preventDefault();
		},

		move: function(i, changeX, changeY) {
			ctxt.lineWidth = lines[i].thickness;
			ctxt.strokeStyle = lines[i].color;
			ctxt.beginPath();
			ctxt.moveTo(lines[i].x, lines[i].y);
			ctxt.lineTo(lines[i].x + changeX, lines[i].y + changeY);
			ctxt.stroke();
			ctxt.closePath();

			return { x: lines[i].x + changeX, y: lines[i].y + changeY };
		}
	};

	return self.init();
};


/*JQuery.(function(){
  var super_awesome_multitouch_drawing_canvas_thingy = new CanvasDrawr({id: "sbCanvas", size: 2 });
  var drawing_params = {colour: "black", thickness: 1 };
});*/

// var super_awesome_multitouch_drawing_canvas_thingy = new CanvasDrawr({id: "sbCanvas", size: 2 });
// var drawing_params = {colour: "black", thickness: 1 };
