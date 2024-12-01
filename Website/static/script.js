function displayPieChart(positiveValue, neutralValue, negativeValue, searchTopic){
  
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
          text: `Overall Sentiment of ${searchTopic}`
        }
      }
    });
}

// This function creates the bar chart for the subreddit count
function displaySubredditBarChart(subKeyList, subItemList){
  // Sets up the X axis for bar chart
  subKeyListCleaned = subKeyList.replace(/&#39;/g, "'");
  subNameList = subKeyListCleaned.split(",");
  var xValues = subKeyListCleaned.replace(/[\[\]']+/g, '').split(',').map(item => item.trim());;
  
  // Sets up the y axis for bar  chart
  subItemList = subItemList.replace(/[\[\]]/g, '');
  subCountList = subItemList.split(",");
  var yValues = subCountList.map(Number);

  var barColors = "red"; // Sets color 
  // Creates the bar chart
  new Chart(document.getElementById('subredditBarChart'), {
    type: "bar",
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
        text: `Subreddit Occurences`
      },
      scales: {
        yAxes: [{
            ticks: {
                beginAtZero: true
            }
        }]
      }
    }
  });
}
