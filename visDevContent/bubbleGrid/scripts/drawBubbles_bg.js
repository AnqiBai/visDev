 var svg = dimple.newSvg("#chartContainer", 590, 400);
    d3.tsv("./data/example_data.tsv.txt", function (data) {
      var myChart = new dimple.chart(svg, data);
      myChart.setBounds(95, 25, 475, 335)
      myChart.addCategoryAxis("x", ["Channel", "Price Tier"]);
      myChart.addCategoryAxis("y", "Owner");
      var z = myChart.addMeasureAxis("z", "Distribution");
      var s = myChart.addSeries("Price Tier", dimple.plot.bubble);
      s.aggregate = dimple.aggregateMethod.max;
      z.overrideMax = 200;
      myChart.addLegend(240, 10, 330, 20, "right");
      myChart.draw();
    });