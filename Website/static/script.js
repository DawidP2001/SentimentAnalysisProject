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
      responsive: false,
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
      responsive: false,
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
      responsive: false,
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
      responsive: false,
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
      responsive: false,
      maintainAspectRatio: false
    }
  });
}

// This function is called when the view more grpahs button is cl;icked
function moreGraphsClicked(){
  userInfo = document.getElementById("userInfoContainer");
  chartsSection = document.getElementById("moreChartSection");
  postSection = document.getElementById("viewPostsSection");
  userInfo.style.display = "none";
  chartsSection.style.display = "block";
  postSection.style.display = "none";
}

// This function is called when the view specific posts button is clicked
function viewPostsClicked(){
  userInfo = document.getElementById("userInfoContainer");
  chartsSection = document.getElementById("moreChartSection");
  postSection = document.getElementById("viewPostsSection");
  userInfo.style.display = "none";
  chartsSection.style.display = "none";
  postSection.style.display = "block";
}
// This function is called when the user clicks the extra user information button
function userInfoButtonClicked(){
  userInfo = document.getElementById("userInfoContainer");
  chartsSection = document.getElementById("moreChartSection");
  postSection = document.getElementById("viewPostsSection");
  userInfo.style.display = "block";
  chartsSection.style.display = "none";
  postSection.style.display = "none";
}

// This function is called when the user clicks the post button
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

// This function scrolls to a given element
function scrollToElement(evt, section){
  element = document.getElementById(section);
  element.scrollIntoView()
}

// This function is called when the user clicks a specifc post on the view posts page
function postClicked(button){
  var modal = document.getElementById("myModal");
  modal.style.display = "block";

  title= button.getAttribute("data-title");
  titleSection = document.getElementById("titleSection");
  titleSection.innerHTML = title;

  score = button.getAttribute("data-score");
  scoreSection = document.getElementById("scoreSection");
  scoreSection.innerHTML = score;

  author = button.getAttribute("data-author");
  authorSection = document.getElementById("authorSection");
  authorSection.innerHTML = author;

  created = button.getAttribute("data-created");
  creationTimeSection = document.getElementById("creationTimeSection");
  creationTimeSection.innerHTML = created;

  numComments = button.getAttribute("data-numComments");
  numCommentsSection = document.getElementById("numCommentsSection");
  numCommentsSection.innerHTML = numComments;

  over18 = button.getAttribute("data-over18");
  over18Section = document.getElementById("over18Section");
  over18Section.innerHTML = over18;

  permalink = button.getAttribute("data-permalink");
  permalink = `https://www.reddit.com/${permalink}`;
  permalinkSection = document.getElementById("permalinkSection");
  permalinkSection.innerHTML = `<a href=${permalink}>link</>`;

  score = button.getAttribute("data-upvotes");
  scoreSection = document.getElementById("upvotesSection");
  scoreSection.innerHTML = score;

  upvoteRatio = button.getAttribute("data-upvoteRatio");
  upvoteRatioSection = document.getElementById("upvoteRatioSection");
  upvoteRatioSection.innerHTML = upvoteRatio;
}

// Shows the loader when the user submits a form
function showLoader(){
  loader = document.getElementById("formModal");
  loader.style.display = "block";
}