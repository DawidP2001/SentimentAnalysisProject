function displayPieChart(positiveValue, neutralValue, negativeValue){
  
  var xValues = ["Positive", "Neutral", "Negative"];
  var yValues = [positiveValue, neutralValue, negativeValue];
  var barColors = ["green", "gray","red"];

  new Chart(document.getElementById('myChart'), {
      type: "pie",
      data: {
        labels: xValues,
        datasets: [{
          backgroundColor: barColors,
          data: yValues
        }]
      },
      options: {
        title: {
          display: true,
          text: "World Wide Wine Production"
        }
      }
    });
}

