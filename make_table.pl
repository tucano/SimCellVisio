#!/usr/bin/perl -T
use strict;
use warnings;
use CGI;
use File::Basename;

my $usage = "$0 <datadir> > <index.html>\n";

unless ($ARGV[0]) {
	print $usage;
	exit 0;
}

my $q = new CGI;

print $q->header();

print $q->start_html(
	-title      => "SimCellVisio",
	-style      => [
		{'src'=>'css/simcell.css'},
	],
);

my $head = <<EOF;
<div id="header">
	<h1><a href="/~drambald/SimCellVisio/">SimCellVisio</a></h1>
</div>
EOF

my $foot = <<AOF;
<div id="footer">
	<a href="http://cytoscapeweb.cytoscape.org/">
		<img src="http://cytoscapeweb.cytoscape.org/img/logos/cw_s.png" alt="Cytoscape Web"/>
	</a>
</div>
AOF

print "<div id=\"container\">";
print $head;
print "<div id=\"content\">";
print "<center><ul>";

my @files = <$ARGV[0]/*>;

foreach my $file (@files) {
	my $filename = basename($file);
	print "<li><a href=\"simcellvisio.html?network_file=$file\">$filename</a></li>\n";
} 

print "</center></ul>";
print "</div>";
print "</div>";
print $foot;
print $q -> end_html();
exit 0;
