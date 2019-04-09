var pie = new d3pie("output-diagram", {
	"header": {
		"title": {
			"fontSize": 24,
			"font": "open sans"
		},
		"subtitle": {
			"color": "#999999",
			"fontSize": 12,
			"font": "open sans"
		},
		"titleSubtitlePadding": 9
	},
	"footer": {
		"color": "#999999",
		"fontSize": 10,
		"font": "open sans",
		"location": "bottom-left"
	},
	"size": {
		"canvasHeight": 300,
		"canvasWidth": 300,
		"pieOuterRadius": "100%"
	},
	"data": {
		"sortOrder": "value-desc",
		"content": [ // Отрисовка диаграммы по рассчитанным данным выше
			{
				"label": "",
				"value": itemsGood,
				"color": "#51c123" // Good
			},
			{
				"label": "",
				"value": itemsBad,
				"color": "#da4e0a" // Bad
			},
			{
				"label": "",
				"value": itemsUnknown,
				"color": "#489fca" // Unknown
			}
		]
	},
	"labels": {
		"outer": {
			"format": "none",
			"pieDistance": 32
		},
		"inner": {
			"format": "none"
		},
		"mainLabel": {
			"fontSize": 11
		},
		"percentage": {
			"color": "#ffffff",
			"decimalPlaces": 0
		},
		"value": {
			"color": "#adadad",
			"fontSize": 11
		},
		"lines": {
			"enabled": true
		},
		"truncation": {
			"enabled": true
		}
	},
	"effects": {
		"load": {
			"effect": "none"
		},
		"pullOutSegmentOnClick": {
			"effect": "none",
			"speed": 400,
			"size": 8
		},
		"highlightSegmentOnMouseover": false,
		"highlightLuminosity": -0.5
	},
	"callbacks": {
		"onMouseoverSegment": null,
		"onMouseoutSegment": null,
		"onClickSegment": null
	}
});