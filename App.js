Ext.define('CustomApp', {
	extend: 'Rally.app.App',
	componentCls: 'app',
	items:[
		{
			xtype: 'container',
			itemId: 'sketchArea',
			autoEl: {
				tag: 'canvas',
				width: 500,
				height: 300,
				style: {
					border: "solid black 2px",
					borderRadius: "15px;"
				}
			},
			width: 500,
			height: 300
		},
		{
			xtype:'container',
			itemId: 'toolColor',
			width: 100,
			height: 100,
			layout: 'fit',
			styleHtmlContent: true,
			items:[
				{
					xtype: 'label',
					text: 'Tool Color'
				}
			]
		},
		{
			xtype: 'rallybutton',
			text: 'Magic me a board!',
			handler: this.extractBoard,
			scope: this
		}
	],

	launch: function() {
		var app = this;
		SB.disableBanners = true;

		// required for touch events to drive drawing program
		SB.wantsTouches = true;

		// required for onPoint to be called
		SB.wantsSDKEvents = true;

		// window._SB_debugToConsole = true;

		SB.onToolChange = function(evt) {
			if(!evt.colorAsHTML){
				return;
			}

			var toolColorContainer = app.down('#toolColor');
			toolColorContainer.getEl().applyStyles({
				'background': evt.colorAsHTML
			});
		};

	  // SB.useMouseEvents(true);
		SB.onPoint = function(x, y, contactId, toolData){
			// only interested in pen events
			if(toolData.tool !== 'pen'){
				return;
			}
			// console.log("Mark App point ", x, y, contactId, toolData);
		};

		SB.init();
	},

	afterRender: function(){
		this.callParent(arguments);

		this.sketchArea = this.down('#sketchArea').getEl().dom;

		var logger = function(event){
			console.log(event.type, event);
		};

		// this.sketchArea.addEventListener('touchstart', logger, false);
  // 	this.sketchArea.addEventListener('touchmove', logger, false);
  // 	this.sketchArea.addEventListener('touchend', logger, false);

		var jqSketchArea = SB.jQuery(this.sketchArea);
		jqSketchArea.sketch();
		jqSketchArea.sketch().set("tool", "no-tool");

		var drawing_params = {colour: "black", thickness: 1 };
		var multitouchDrawingCanvas = new CanvasDrawr({
			id: this.sketchArea.id,
			size: 2
		});
	}
/*
	extractBoard: function(){

		// how far from vertically below the previous point a line can meander
		var lineDeviation = 1;

		// check straight down + either side
		var columnsToCheck = 1 + lineDeviation * 2;
		var verticalLines = [];

		var sa = this.sketchArea;
		var ctx = sa.getContext('2d');
		var width = sa.width;
		var height = sa.height;

		var data = ctx.getImageData(0, 0, width, height);
		var numRows = height / width;
		var numCols = width;
		for(var r=0; r < numRows; r++){
			var rowStart = r * width *4; //RGBA
			for(var c=0; c < numCols; c++){
				var pixelIndex = rowStart + c*4;

				// don't care about alpha, since always 255 in this app
				for(var channel=0; channel < 3; channel++)
					// if any of the channels are greater than half intensity, consider this pixel shaded
					//TODO need to detect black ink, so this won't work
					// just check not equal to canvas background
					if( data[pixelIndex + channel] >= 128 ){
						for(var pos=0; pos < columnsToCheck; l++)
							if()
						verticalLines
					}

			}
		}
	}
	*/

});
