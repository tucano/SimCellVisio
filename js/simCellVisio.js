window.onload=function() {
	// id of Cytoscape Web container div
    var div_id = "cytoscapeweb";
	
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
	
	var draw_options = {
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
	
	// init 
	var vis = new org.cytoscapeweb.Visualization(div_id, options);
	
	// callback when Cytoscape Web has finished drawing
	vis.ready(function() {
	
		// add a listener for when nodes and edges are clicked
		vis.addListener("click", "nodes", function(event) {
			handle_click(event);
		})
		.addListener("click", "edges", function(event) {
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
		vis.addContextMenuItem("Select first neighbors", "nodes", 
        	function (evt) {
				// Get the right-clicked node:
				var rootNode = evt.target;
			
				// Get the first neighbors of that node:
				var fNeighbors = vis.firstNeighbors([rootNode]);
				var neighborNodes = fNeighbors.neighbors;
			
				// Select the root node and its neighbors:
				vis.select([rootNode]).select(neighborNodes);
        	}
    	);
	
		// Show mammosphere
		document.getElementById("mammosphere").onclick = function(){
			vis.filter("edges", function(edge) { return edge.data.mammosphere >= 1; }, false )
			vis.filter("nodes", function(node) { return node.data.mammosphere >= 1; }, false )
			vis.layout('Circle');
		}

		// Filtering mammosphere
		document.getElementById("history").onclick = function(){
			vis.filter("edges", function(edge) { return edge.data.mammosphere == 0; }, false )
			vis.filter("nodes", function(node) { return node.data.mammosphere == 0; }, false )
			vis.layout('Tree');
		}
		
		// Filtering button
		document.getElementById("filter").onclick = function(){
			vis.filter("edges", function(edge) { return edge.data.time <= $('#time').val(); },	false );
			vis.filter("nodes", function(node) { return node.data.mothertime <= $('#time').val(); },	false );
			vis.layout('Tree');
		};
    	
	});
	
	// and draw
	vis.draw(draw_options);

};

// JQUERY
$(document).ready(function() {
	$("#slider").slider({
		value: 15, 
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