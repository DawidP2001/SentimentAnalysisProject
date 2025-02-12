/*
Author: Dawid Pionk
Description: This file contains majority of the javascript used by the website
Date: 09/02/2025
*/
/*
//////////////////////////////////

Section for global variables

//////////////////////////////////
*/

let jsonData;

function setGlobalVariables(jsondata){
  setjsonData(jsondata);
}
function setjsonData(data){
  jsonData = JSON.parse(data);
}
/*
//////////////////////////////////

Section for the functions used on form.html

//////////////////////////////////
*/
/** 
 * This function changes the placeholder on the searchComment element based on which option 
 * in typeOfSearchComment is selected 
 * 
 * @param {HTMLSelectElement} select - The dropdown that triggered the change event
*/
function typeOfPostSearchChanged(select){
  commentInputField = document.getElementById("searchComment");
  if (select.value == "link") {
    commentInputField.value = "";
    commentInputField.placeholder = "https://www.reddit.com/r/rugbyunion/comments/1iku1ud/post_match_thread_england_v_france/"
  } else if (select.value == "id") {
    commentInputField.value = "";
    commentInputField.placeholder = 12345;
  }
}
/*
//////////////////////////////////
 
Section for extraInformation.html functions

//////////////////////////////////
*/
function viewMoreTrends(button){
  table = document.getElementById("trendingTopicsTable");
  rows = table.rows;
  for(i=6;i<rows.length-1;i++){
    rows[i].removeAttribute("hidden");
  }
  button.hidden = true;
  document.getElementById("viewLessTrends").removeAttribute("hidden");
}
function viewLessTrends(button){
  table = document.getElementById("trendingTopicsTable");
  rows = table.rows;
  for(i=6;i<rows.length-1;i++){
    rows[i].hidden = true;
  }
  button.hidden = true;
  document.getElementById("viewMoreTrends").removeAttribute("hidden");
}
/*
//////////////////////////////////

Section for charts.html functions

//////////////////////////////////
*/
/** This section contains function for the pie Chart */

// This is a simple Pie Chart that displays the proportion of sentiment for the querry user made
function displayPieChart(searchTopic){
  var xValues = ["Positive", "Neutral", "Negative"];
  var yValues = getValuesForPieChart();
  var barColors = ["green", "gray", "red"];

  new Chart(document.getElementById('pieChart'), {
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
      maintainAspectRatio: false,
    });
}
function getValuesForPieChart(){
  let positiveValue = 0;
  let neutralValue = 0;
  let negativeValue = 0;
  jsonData.forEach(entry => {
    if(entry.label === "POSITIVE"){
      positiveValue += 1;
    } else if(entry.label === "NEUTRAL"){
      neutralValue += 1;
    } else if (entry.label === "NEGATIVE"){
      negativeValue += 1;
    }
  })
  return [positiveValue, neutralValue, negativeValue];
}
/** This section contains function for the subreddit bar chart */

// This function creates the bar chart for the subreddit count
function displaySubredditBarChart(){
  let barChartDatasets = getBarChartDatasets();
  let positiveDataset = barChartDatasets[0];
  let neutralDataset = barChartDatasets[1];
  let negativeDataset = barChartDatasets[2];
  let xValues = barChartDatasets[3];
  // Creates the bar chart
  new Chart(document.getElementById('subredditBarChart'), {
    type: "bar",
    data: {
      labels: xValues,
      datasets: [{
        label: "Positive",
        backgroundColor: "green",
        data: positiveDataset,
      },
      {
        label: "Neutral",
        backgroundColor: "grey",
        data: neutralDataset
      },
      {
        label: "Negative",
        backgroundColor: "red",
        data: negativeDataset
      }
    ]
    },
    options: {
      title: {
        display: true,
        text: `Subreddit Occurences`
      },
      scales: {
          x: {
            stacked: true
        },
        y: {
            // Set stacked to true on the y-axis to stack bars
            beginAtZero: true // Start the y-axis at 0
        }
      },
      responsive: true,
      maintainAspectRatio: true,
    } 
  });
}
function getBarChartData(){
  let barData = {}
  jsonData.forEach(entry => {
    subreddit = entry.subreddit;
    if (!(subreddit in barData)){
      barData[subreddit] = [0,0,0];
    }
    if(entry.label=="POSITIVE"){
      barData[subreddit][0]+= 1
    } else if (entry.label == "NEUTRAL"){
      barData[subreddit][1]+= 1
    } else if (entry.label == "NEGATIVE"){
      barData[subreddit][2]+= 1
    } else {
      console.log("ERROR WITH getBarChartData() function");
    }
  });
  return barData;
}
function getBarChartDatasets(){
  barData = getBarChartData();
  let xValues = Object.keys(barData);
  let positiveDataset = [];
  let neutralDataset = [];
  let negativeDataset = [];
  
  xValues.forEach(entry => {
    positiveCount = barData[entry][0];
    neutralCount = barData[entry][1];
    negativeCount = barData[entry][2];
    positiveDataset.push(positiveCount);
    neutralDataset.push(neutralCount);
    negativeDataset.push(negativeCount);
  })
  return [positiveDataset, neutralDataset, negativeDataset, xValues];
}
// This function creates the line graph for the sentiment over time
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
      maintainAspectRatio: true,
      devicePixelRatio: 4
    }
  });

}
// This function creates the bar chart for the top keywords by sentiment
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
      maintainAspectRatio: true,
      devicePixelRatio: 4
    }
  });
}
// This function creates the scatter graph for sentiment vs engagement
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
      maintainAspectRatio: true,
      devicePixelRatio: 4
    }
  });
}

// This function creates the word cloud for the top keywords
// A lot of the code was taken from here: https://d3-graph-gallery.com/graph/wordcloud_size.html
function displayWordCloud(wordCloudData){
  // List of words
  wordCloudData = wordCloudData.replace(/&#34;/g, '"');
  var myWords = JSON.parse(wordCloudData);
  myWords = scaleWords(myWords);

  // set the dimensions and margins of the graph
  var containerWidth = document.getElementById("sentimentVSEngagementSection").offsetWidth;
  var containerHeight = document.getElementById("sentimentVSEngagementSection").offsetHeight;
  
  var margin = {top: 10, right: 10, bottom: 10, left: 10};
  var width = 500;
  var height = 500;
  
  // append the svg object to the body of the page
  var svg = d3.select("#wordcloudContainer").append("svg")
    .attr("width", width)
    .attr("height", height)
      .attr("id", "wordcloudSVG")
    .append("g")
      .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");
  
  // Constructs a new cloud layout instance. It run an algorithm to find the position of words that suits your requirements
  // Wordcloud features that are different from one word to the other must be here
  var layout = d3.layout.cloud()
    .size([width, height])
    .words(myWords.map(function(d) { return {text: d.word, size:d.size}; }))
    .padding(5)        //space between words
    .rotate(function() { return ~~(Math.random() * 2) * 90; })
    .fontSize(function(d) { return d.size; })      // font size of words
    .on("end", draw);
  layout.start();
  
  // This function takes the output of 'layout' above and draw the words
  // Wordcloud features that are THE SAME from one word to the other can be here
  function draw(words) {
    svg
      .append("g")
        .attr("transform", "translate(" + layout.size()[0] / 2 + "," + layout.size()[1] / 2 + ")")
        .selectAll("text")
          .data(words)
        .enter().append("text")
          .style("font-size", function(d) { return d.size; })
          .style("fill", "#69b3a2")
          .attr("text-anchor", "middle")
          .style("font-family", "Impact")
          .attr("transform", function(d) {
            return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
          })
          .text(function(d) { return d.text; });
  }
  // This function is used to scale the words in the word cloud to an appropriate size
  function scaleWords(words){
    var minSize = 10;
    var maxSize = 60;

    words.forEach(word => word.size = Number(word.size));
    // This is the scaling function that will be applied to the words size
    var fontSizeScale = d3.scaleLinear()
    .domain([d3.min(words, d => d.size), d3.max(words, d => d.size)])
    .range([minSize, maxSize]); // Min and max font sizes
    
    // Apply the scaling function to the size of the words
    words.forEach(word => word.size = fontSizeScale(word.size));
    
    return words;
  }
}
/*
//////////////////////////////////

Section for the view posts section

//////////////////////////////////
*/
function setViewPostsSection(){
  jsonData.forEach(setViewPost);
}
function setViewPost(post){
  
}
/*
//////////////////////////////////

Section for other

//////////////////////////////////
*/
// This function is called when the view more grpahs button is cl;icked
function moreGraphsClicked(){
  userInfo = document.getElementById("userInfoContainer");
  chartsSection = document.getElementById("moreChartSection");
  postSection = document.getElementById("viewPostsSection");
  userInfo.style.display = "none";
  chartsSection.style.display = "flex";
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
function selectTab(evt, section) {
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

  subreddit = button.getAttribute("data-subreddit");
  subredditSection = document.getElementById("subredditSection");
  subredditSection.innerHTML = subreddit;

  selfText = button.getAttribute("data-selfText");
  if (selfText == ""){
    selfText="N/A";
  }
  selfTextSection = document.getElementById("selfTextSection");
  selfTextSection.innerHTML = selfText;

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

// This function displays the time frame dropdown list in the subreddit form
function showTimeFrameDropDown(target){
  timeFrame = document.getElementById(target);
  timeFrame.style.display = "inline-block";
}

// This function hides the time frame dropdown list in the subreddit form
function hideTimeFrameDropDown(targets){
  timeFrame = document.getElementById(target);
  timeFrame.style.display = "none";
}

/** 
 * This function handles the change in the type of search on the subreddit form
 * It then decides to display or hide the timeframe for the search type
 * 
 * @param {Object} select - The select element that was changed
*/
function typeOfSearchChange(select){
  if (select.id == "typeOfSearchSubreddit"){
    target = "searchTimeFrameSubreddit";
  } else if (select.id == "typeOfSearchUser"){
    target = "searchTimeFrameUser";
  } else if (select.id == "typeOfSearchDomain"){
    target = "searchTimeFrameDomain";
  }
  selectValue = select.value;
  switch(selectValue){
    case "top":
      showTimeFrameDropDown(target);
      break;
    case "new":
      hideTimeFrameDropDown(target);
      break;
    case "hot":
      hideTimeFrameDropDown(target);
      break;
    case "rising":
      hideTimeFrameDropDown(target);
      break;
    case "controversial":
      showTimeFrameDropDown(target);
      break;
  }
}

function showTypeOfPostUserRow(){
  typeOfPost = document.getElementById("typeOfPostUserRow");
  typeOfPost.style.display = "table-row";
}

function hideTypeOfPostUserRow(){
  typeOfPost = document.getElementById("typeOfPostUserRow");
  typeOfPost.style.display = "none";
}

function displaySentiment(data){

}