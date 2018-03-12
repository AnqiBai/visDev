var rawUrl = 'http://localhost:9090/MicroStrategy/servlet/taskProc?taskId=reportDataService&taskEnv=juil_iframe&taskContentType=json&server=localhost&project=MicroStrategy+Tutorial&userid=administrator&password=&styleName=ReportDataVisualizationXMLStyle&reportViewMode=1&reportID=EF3A673A4BD1866B6BD25FADE2FBBDFD';
$.get(rawUrl, function(rawXMLdata){ console.log(rawXMLdata);
//////////////////////////////////////////////
var $data = $.parseXML(rawXMLdata);
var $items = $($data).find( "r" );
var rows = [];
var num = $items.length;
// parse data
for(var i = 0; i < num; i = i+3){
    var t_item = $items[i];
    var t_node = {};
    var contents = $(t_item).find('v');
    t_node['call_center'] = contents[0].innerHTML;
    t_node['region'] = contents[1].innerHTML;
    t_node['year'] = contents[2].innerHTML;
    t_node['cost'] = contents[3].innerHTML;
    t_node['profit'] = contents[4].innerHTML;
    t_node['revenue'] = contents[5].innerHTML;
    rows.push(t_node);
}
//

debugger;
// Plotly.d3.csv('./data/gapminderDataFiveYear.csv.txt', function(err, rows){

  ////////// begin get csv content;

var YEAR = 2014;
var regions = ['Central', 'Mid-Atlantic', 'Northeast', 'Northwest', 'South', 'Southeast','Southwest', 'Web'];
var POP_TO_PX_SIZE = 2e3;
function unpack(rows, key) {
  return rows.map(function(row) { return row[key]; });
}

var data = regions.map(function(region) {
  var rowsFiltered = rows.filter(function(row) {
      return (row.region === region) && (+row.year === YEAR);
  });
  return {
      mode: 'markers',
      name: region,
      x: unpack(rowsFiltered, 'cost'),
      y: unpack(rowsFiltered, 'profit'),
      text: unpack(rowsFiltered, 'call_center'),
      marker: {
          sizemode: 'area',
          size: unpack(rowsFiltered, 'revenue'),
          sizeref: POP_TO_PX_SIZE
      }
  };
});
console.log(data);
var layout = {
  xaxis: {title: 'Cost'},
  yaxis: {title: 'Profit'},
  margin: {t: 20},
  hovermode: 'closest'
};
Plotly.plot('my-graph', data, layout, {showLink: false});


// });  // end get csv content;

});