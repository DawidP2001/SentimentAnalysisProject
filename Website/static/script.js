// This is a simple Pie Chart that displays the proportion of sentiment for the querry user made
function displayPieChart(positiveValue, neutralValue, negativeValue, searchTopic){
  var xValues = ["Positive", "Neutral", "Negative"];
  var yValues = [positiveValue, neutralValue, negativeValue];
  var barColors = ["green", "gray", "red"];

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
      },
      responsive: true,
      maintainAspectRatio: false
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
      },
      responsive: true,
      maintainAspectRatio: false
    }
  });
}

function sentimentOverTimeLineGraph(){
  var xValues = [1,2,3,4,5,6,7,8,9,10];
  var yValues = [1,2,3,4,5,4,3,2,1,0];

  new Chart(document.getElementById("sentimentOverTimeLineGraph"), {
    type: "line",
    data: {
      labels: xValues,
      datasets: [{
        fill: false,
        pointRadius: 1,
        borderColor: "rgba(255,0,0,0.5)",
        data: yValues
      }]
    },
    options: {
      title: {
      display: true,
      text: `Sentiment Over Time`
      },
      responsive: true,
      maintainAspectRatio: false
    }
  });

}

function topKeywordsBySentimentBarChart(){
  var xValues = ["Italy", "France", "Spain", "USA", "Argentina"];
  var yValues = [55, 49, 44, 24, 15];
  var barColors = ["red", "green","blue","orange","brown"];

  new Chart(document.getElementById("topKeywordsBySentimentBarChart"), {
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
      },
      responsive: true,
      maintainAspectRatio: false
    }
  });
}

function sentimentVSEngagementSection(){
  const xyValues = [
    {x:50, y:7},
    {x:60, y:8},
    {x:70, y:8},
    {x:80, y:9},
    {x:90, y:9},
    {x:100, y:9},
    {x:110, y:10},
    {x:120, y:11},
    {x:130, y:14},
    {x:140, y:14},
    {x:150, y:15}
  ];

  new Chart(document.getElementById("sentimentVSEngagementScatterGraph"), {
    type: "scatter",
    data: {
      datasets: [{
        pointRadius: 4,
        pointBackgroundColor: "rgba(0,0,255,1)",
        data: xyValues
      }]
    },
    options:{
      title: {
        display: true,
        text: `Sentiment VS engagementSection`
        },
      responsive: true,
      maintainAspectRatio: false
    }
  });
}

// This function is called when the view more grpahs button is cl;icked
function moreGraphsClicked(){
  chartsSection = document.getElementById("moreChartSection");
  postSection = document.getElementById("viewPostsSection");
  chartsSection.style.display = "block";
  postSection.style.display = "none";
}

// This function is called when the view specific posts button is clicked
function viewPostsClicked(){
  chartsSection = document.getElementById("moreChartSection");
  postSection = document.getElementById("viewPostsSection");
  chartsSection.style.display = "none";
  postSection.style.display = "block";
}

function postButtonClicked(){
  expandableArea = document.getElementById("expandablePostDetails");
  expandableArea.style.display = "flex";
  expandableArea.style.flexDirection = "row";
  expandableArea.style.justifyContent = "space-around";
}

// This section is responsible for displaying the form associated with a tab
function openCity(evt, section) {
  document.getElementById("searchBarTopic").style.display = "none";
  tabcontent = document.getElementsByClassName("tabContent");
  tab = document.getElementsByClassName("tab");
  // Hides other tab content and turns off the active element
  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
    tab[i].className = tab[i].className.replace(" active", "");
  }
  document.getElementById(section).style.display = "block";
  evt.currentTarget.className += " active";
}

function scrollToElement(evt, section){
  element = document.getElementById(section);
  element.scrollIntoView()
}