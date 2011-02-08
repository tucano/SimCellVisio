window.onload=function() {
	// id of Cytoscape Web container div
    var div_proliferation = "proliferation";
	var div_mammosphere = "mammosphere";
	
	// network data grabbed via ajax
	var xml = $.ajax({
		url: 'upload/' + $.getUrlVar('network_file'),
		async: false,
	}).responseText;
	
	// initialization options
	var options = {
		// where you have the Cytoscape Web SWF
		swfPath: "swf/CytoscapeWeb",
		// where you have the Flash installer SWF
		flashInstallerPath: "swf/playerProductInstall"
	};
	
	// visual style we will use
	var visual_style = {
		
		global: {
			backgroundColor: "#E5E5E5"
		},
		
		nodes: {
			shape: {
				discreteMapper: {
					attrName: "stemness",
					entries: [
						{ attrValue: false, value: "OCTAGON" },
						{ attrValue: true, value: "ELLIPSE" }
					]
				}
			},
			borderWidth: {
				discreteMapper: {
					attrName: "stemness",
					entries: [
						{ attrValue: false, value: 1.5 },
						{ attrValue: true, value: 4.5 }
					]
				}
			},
			borderColor: {
				discreteMapper: {
					attrName: "stemness",
					entries: [
						{ attrValue: false, value: "#ffffff" },
						{ attrValue: true,  value: "#000000"}
					]
				}
			},
			size: 25,
			color: {
				continuousMapper: {
					attrName: "pkh", minValue: "#FFFFFF", maxValue: "#FF0000"
				}
			},
			labelHorizontalAnchor: "center"
		},
		
		edges: {
			width: 3,
			opacity: 0.8,
			color: "#000000"
		}
	};
	
	var draw_options_proliferation = {
		// your data goes here
		network: xml,
		
		// show edge labels too
		edgeLabelsVisible: true,
		
		// let's try another layout
		layout: "Tree",
		
		// set the style at initialisation
		visualStyle: visual_style,
		
		// hide/show pan zoom
		panZoomControlVisible: true 
	};
	
	var draw_options_mammosphere = {
		// your data goes here
		network: xml,
		
		// set the style at initialisation
		visualStyle: visual_style,
		
		// let's try another layout
		layout: "Circle"
	}
	
	// init 
	var vis_proliferation = new org.cytoscapeweb.Visualization(div_proliferation, options);
	var vis_mammosphere = new org.cytoscapeweb.Visualization(div_mammosphere, options);
	
	// callback when Cytoscape Web has finished drawing
	vis_proliferation.ready(function() {
		
		// INIT time point
		vis_proliferation.filter("edges", function(edge) { return edge.data.time <= $('#time').val(); },	false );
		vis_proliferation.filter("nodes", function(node) { return node.data.mothertime <= $('#time').val(); },	false );
		vis_proliferation.layout('Tree');	
		vis_mammosphere.filter("edges", function(edge) { return edge.data.time <= $('#time').val(); },	false );
		vis_mammosphere.filter("nodes", function(node) { return node.data.mothertime <= $('#time').val(); },	false );
		vis_mammosphere.layout('Circle');

		
		// add a listener for when nodes and edges are clicked
		vis_proliferation.addListener("click", "nodes", function(event) {
			handle_click(event);
		})
		vis_proliferation.addListener("click", "edges", function(event) {
			handle_click(event);
		});
		
		// WHEN I CLICK A NODE or EDGE...
		function handle_click(event) {
			 var target = event.target;     
			 clear();
			 print(event.group);
			 for (var i in target.data) {
				var variable_name = i;
				var variable_value = target.data[i];
				print( variable_name + " = " + variable_value );
			 }
		}
		
		// CLEAR and PRINT for NOTES
		function clear() {
			document.getElementById("note").innerHTML = "";
		}
		
		function print(msg) {
			document.getElementById("note").innerHTML += "<p>" + msg + "</p>";
		}
		
		// TEST CONTEXT MENU
		vis_proliferation.addContextMenuItem("Select first neighbors", "nodes", 
        	function (evt) {
				// Get the right-clicked node:
				var rootNode = evt.target;
			
				// Get the first neighbors of that node:
				var fNeighbors = vis_proliferation.firstNeighbors([rootNode]);
				var neighborNodes = fNeighbors.neighbors;
			
				// Select the root node and its neighbors:
				vis_proliferation.select([rootNode]).select(neighborNodes);
        	}
    	);

		vis_proliferation.addContextMenuItem("Select childs", "nodes",
			function(evt) {
				// Get the right-clicked node:
				var rootNode = evt.target;
				
				// Get the childs of that node:
				var fChilds = vis_proliferation.childDegree([rootNode]);
				print("lol");
			}
		);

		// Filtering button
		document.getElementById("filter").onclick = function(){
			vis_proliferation.filter("edges", function(edge) { return edge.data.time <= $('#time').val(); },	false );
			vis_proliferation.filter("nodes", function(node) { return node.data.mothertime <= $('#time').val(); },	false );
			vis_proliferation.layout('Tree');
			vis_mammosphere.filter("edges", function(edge) { return edge.data.time <= $('#time').val(); },	false );
			vis_mammosphere.filter("nodes", function(node) { return node.data.mothertime <= $('#time').val(); },	false );
			vis_mammosphere.layout('Circle');
		};
    	
	});
	
	vis_mammosphere.ready(function(){ });
	
	// and draw
	vis_proliferation.draw(draw_options_proliferation);
	vis_mammosphere.draw(draw_options_mammosphere);
};

// JQUERY
$(document).ready(function() {
	$("#slider").slider({
		value: 1, 
		max: 20,
		min: 0,
		step: 0.1,
		change: function (event, ui) { $("#time").val(ui.value); }
	});
	$("#time").val($("#slider").slider("value"));
	
	$("#time").change( function() {
		$("#slider").slider("value", $("#time").val());
	});
	
});

// Read a page's GET URL variables and return them as an associative array.
$.extend({
	getUrlVars: function(){
		var vars = [], hash;
		var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
		for(var i = 0; i < hashes.length; i++)
		{
			hash = hashes[i].split('=');
			vars.push(hash[0]);
			vars[hash[0]] = hash[1];
		}
			return vars;
		},
		getUrlVar: function(name){
		return $.getUrlVars()[name];
	}
});