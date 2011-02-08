<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.1//EN" "http://www.w3.org/TR/xhtml11/DTD/xhtml11.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
	<meta http-equiv="content-type" content="text/html; charset=utf-8" />
	<title>simCellVisio</title>
	<link rel="stylesheet" type="text/css" href="css/simcell.css" />
</head>
<body>
	<div id="container">
		<div id="header">
			<h1><a href="/~drambald/simcellvisio/">SimCellViso</a></h1>
		</div>
		<div id="content" style="text-align: center;">
		<?php
		if ($_FILES["file"]["error"] > 0) {
		  echo "Error: " . $_FILES["file"]["error"] . "<br />";
		} else {
		  echo "Upload: " . $_FILES["file"]["name"] . "<br />";
		  echo "Type: " . $_FILES["file"]["type"] . "<br />";
		  echo "Size: " . ($_FILES["file"]["size"] / 1024) . " Kb<br />";
		  echo "Stored in: " . $_FILES["file"]["tmp_name"] . "<br/>";
		  
		  $file_name = $_FILES["file"]["name"];
		  $random_digit=rand(0000,9999);
		  $mtime = time();
		  $new_file_name = 'simul'.$random_digit.$mtime.$file_name;
		  $path= "upload/".$new_file_name;
		  
		  if (move_uploaded_file($_FILES["file"]["tmp_name"], $path)) {
			echo "Moved in: " . $path . "<br/>";
			echo "Visualize: <a href=\"simcellvisio.html?network_file=" . $new_file_name . "\">Go</a>";
		  } else {
			echo "Problems moving the file";
		  }
		}
		?>
		</div>
		<div id="footer">
			<a href="http://cytoscapeweb.cytoscape.org/">
				<img src="http://cytoscapeweb.cytoscape.org/img/logos/cw_s.png" alt="Cytoscape Web"/>
			</a>
		</div>
	</div>
</body>
</html>