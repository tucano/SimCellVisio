// WINDOW LOADED....
window.onload=function() {
	// id of Cytoscape Web container div
    var div_proliferation = "proliferation";
	//var div_mammosphere = "mammosphere";
	
	// network data grabbed via ajax
	var xml = $.ajax({
		url: 'data/' + $.getUrlVar('network_file'),
		async: false,
	}).responseText;
	
	// initialization options
	var options = {
		// where you have the Cytoscape Web SWF
		swfPath: "swf/CytoscapeWeb",
		// where you have the Flash installer SWF
		flashInstallerPath: "swf/playerProductInstall",
		// The text message that should be displayed if the browser does not have the Flash Player plugin.
		flashAlternateContent: "This software require the Flash plugin",	
	};
	
	// visual style we will use for proliferation panel
	var visual_style_proliferation = {
		
		global: {
			backgroundColor: "#E5E5E5"
		},
		
		nodes: {
			shape: {
				discreteMapper: {
					attrName: "stemness",
					entries: [
						{ attrValue: 0, value: "OCTAGON" },
						{ attrValue: 1, value: "ELLIPSE" }
					]
				}
			},
			borderWidth: {
				discreteMapper: {
					attrName: "stemness",
					entries: [
						{ attrValue: 0, value: 1.5 },
						{ attrValue: 1, value: 4.5 }
					]
				}
			},
			borderColor: {
				discreteMapper: {
					attrName: "stemness",
					entries: [
						{ attrValue: 0, value: "#ffffff" },
						{ attrValue: 1,  value: "#000000"}
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
	
	var circle_layout = {
		name: "Circle",
		options: { angleWidth: 360, tree: false }
	}
	
	var tree_layout = {
		name: "Tree",
		options: { orientation: "topToBottom", depthSpace: 30, breadthSpace: 20, subtreeSpace: 30}
	}
		
	var draw_options_proliferation = {
		// your data goes here
		network: xml,
		
		// show edge labels too
		edgeLabelsVisible: true,
		
		// let's try another layout
		layout: tree_layout,
		
		// set the style at initialisation
		visualStyle: visual_style_proliferation,
		
		// hide/show pan zoom
		panZoomControlVisible: true 
	};
	
	// init 
	var vis_proliferation = new org.cytoscapeweb.Visualization(div_proliferation, options);
	//var vis_mammosphere = new org.cytoscapeweb.Visualization(div_mammosphere, options);
	
	// callback when Cytoscape Web has finished drawing
	vis_proliferation.ready(function() {
		
		// INIT time point
		vis_proliferation.filter("edges", function(edge) { return edge.data.time <= $('#time').val(); },	false );
		vis_proliferation.filter("nodes", function(node) { return node.data.mothertime <= $('#time').val(); },	false );
		vis_proliferation.layout(tree_layout);	
		
		// add a listener for when nodes and edges are clicked
		vis_proliferation.addListener("click", "nodes", function(event) {
			handle_click(event);
		})
		vis_proliferation.addListener("click", "edges", function(event) {
			handle_click(event);
		});
		
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
	});
	
	// Filtering button
	document.getElementById("filter").onclick = function(){
		vis_proliferation.filter("edges", function(edge) { return edge.data.time <= $('#time').val(); },	false );
		vis_proliferation.filter("nodes", function(node) { return node.data.mothertime <= $('#time').val(); },	false );
		vis_proliferation.layout(tree_layout);
	};
		
	// export PDF buttons
	document.getElementById("prolif2pdf").onclick = function() {
		vis_proliferation.exportNetwork('pdf', 'export.php?type=pdf');
	};
	
	// and draw
	vis_proliferation.draw(draw_options_proliferation);
};

// JQUERY
$(document).ready(function() {
	$("#slider").slider({
		value: 5, 
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

// CLEAR for NOTES
function clear() {
	document.getElementById("note").innerHTML = "";
}

// PRINT for NOTES
function print(msg) {
	document.getElementById("note").innerHTML += msg;
}

// WHEN I CLICK A NODE or EDGE...
function handle_click(event) {
	 var target = event.target;     
	 clear();
	 if (target.group == 'nodes') {
		 print('<table><tr><td>Born at Time</td><td><b>' + target.data.time + 
			'</b></td></tr><tr><td>PKH ratio</td><td><b>' + target.data.pkh + '</b></td></tr>'+ 
			'<tr><td>N.Divisions</td><td><b>' + target.data.divisions + '</b></td></tr>' + 
			'<tr><td>Stem?</td><td><b>' + target.data.stemness + '</b></td></tr>' +
			'</table>');
	 } else {
	 	// show info for edge...
	 	print('<table><tr><td>Time of Event</td><td><b>' + target.data.time + '</b></td></tr></table>');
	 }
}