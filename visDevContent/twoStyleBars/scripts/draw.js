// The xz array has m elements, representing the x-values shared by all series.
// The yz array has n elements, representing the y-values of each of the n series.
// Each yz[i] is an array of m non-negative numbers representing a y-value for xz[i].
// The y01z array has the same structure as yz, but with stacked [y₀, y₁] instead of y.

var anqi = d3.csv("./data/twoStyleBars.csv", function(data) {

    // get base attribute list 
    var anqi = data.map(d => d[data['columns'][0]])
    var uniqueArray = anqi.filter(function(item, pos) {
        return anqi.indexOf(item) == pos;
    });
    var xLabel = uniqueArray;

    var xz = d3.range(xLabel.length);

    var n = anqi.filter(function(d) { return d == anqi[0] }).length;
    var yz = [];
    var metricLoc = data['columns'].length - 1; 
    for (var iCategory = 0; iCategory < n; iCategory++) {

        var tArray = data.filter(function(d, i) { return i % n == iCategory }).map(d => d[data['columns'][metricLoc]]);
        var parsedArray = tArray.map(d => parseFloat(d.replace(/[,$]/g, '')));
        yz.push(parsedArray);
    }


    var y01z = d3.stack().keys(d3.range(n))(d3.transpose(yz));
    var yMax = d3.max(yz, function(y) { return d3.max(y); });
    var y1Max = d3.max(y01z, function(y) { return d3.max(y, function(d) { return d[1]; }); });

    var svg = d3.select('svg');

    var margin = { top: 40, right: 10, bottom: 60, left: 10 },
        width = svg.attr("width") - margin.left - margin.right,
        height = svg.attr("height") - margin.top - margin.bottom,
        g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    debugger;
    var x = d3.scaleBand()
        .domain(xz)
        .rangeRound([0, width])
        .padding(0.08);

    var y = d3.scaleLinear()
        .domain([0, y1Max])
        .range([height, 0]);

    var color = d3.scaleOrdinal()
        .domain(d3.range(n))
        .range(d3.schemeCategory20b);

    var series = g.selectAll(".series")
        .data(y01z)
        .enter().append("g")
        .attr("fill", function(d, i) { return color(i); });

    var rect = series.selectAll("rect")
        .data(function(d) { return d; })
        .enter().append("rect")
        .attr("x", function(d, i) { return x(i); })
        .attr("y", height)
        .attr("width", x.bandwidth())
        .attr("height", 0);

    rect.transition()
        .delay(function(d, i) { return i * 10; })
        .attr("y", function(d) { return y(d[1]); })
        .attr("height", function(d) { return y(d[0]) - y(d[1]); });
    debugger;

    g.append("g")
        .attr("class", "axis axis--x")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x).tickFormat(function(d, i) {
            return xLabel[i];
        })
        .tickSize(0)
        .tickPadding(6))
        .attr("font-size", '14')
        .selectAll('text')
        .attr("transform", "translate(0,20) rotate(30) ");

    d3.selectAll("input")
        .on("change", changed);


    var timeout = d3.timeout(function() {
        d3.select("input[value=\"grouped\"]")
            .property("checked", true)
            .dispatch("change");
    }, 2000);

    function changed() {
        timeout.stop();
        if (this.value === "grouped") transitionGrouped();
        else transitionStacked();
    }

    function transitionGrouped() {
        y.domain([0, yMax]);

        rect.transition()
            .duration(500)
            .delay(function(d, i) { return i * 10; })
            .attr("x", function(d, i) { return x(i) + x.bandwidth() / n * this.parentNode.__data__.key; })
            .attr("width", x.bandwidth() / n)
            .transition()
            .attr("y", function(d) { return y(d[1] - d[0]); })
            .attr("height", function(d) { return y(0) - y(d[1] - d[0]); });
    }

    function transitionStacked() {
        y.domain([0, y1Max]);

        rect.transition()
            .duration(500)
            .delay(function(d, i) { return i * 10; })
            .attr("y", function(d) { return y(d[1]); })
            .attr("height", function(d) { return y(d[0]) - y(d[1]); })
            .transition()
            .attr("x", function(d, i) { return x(i); })
            .attr("width", x.bandwidth());
    }

});