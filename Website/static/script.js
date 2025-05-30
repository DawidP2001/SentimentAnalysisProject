/**
 * @file script.js
 * @brief This file contains the majority of the JavaScript used by the website.
 * @details It includes functions for handling forms, charts, modals, and other interactive elements on the website.
 * @date 27/04/2025
 * @author Dawid Pionk
 */
/*
//////////////////////////////////

Section for global variables

//////////////////////////////////
*/

let jsonData;
let redditorJSONData;
let search;

/**
 * @brief Sets global variables for the application.
 * @param {string} jsondata - The JSON data to set.
 * @param {string} searchTopic - The search topic to set.
 */
function setGlobalVariables(jsondata, searchTopic){
  setjsonData(jsondata);
  setSearch(searchTopic);
}
/**
 * @brief Parses and sets the JSON data.
 * @param {string} data - The JSON data to parse and set.
 */
function setjsonData(data){
  jsonData = JSON.parse(data);
}
/**
 * @brief Sets the search topic in lowercase.
 * @param {string} searchTopic - The search topic to set.
 */
function setSearch(searchTopic){
  searchTopic = searchTopic.toLowerCase();
  search = searchTopic;
}
/**
 * @brief Sets the Redditor JSON data.
 * @param {Object} data - The Redditor JSON data to set.
 */
function setRedditorJSONData(data){
  redditorJSONData = data;
}
/*
//////////////////////////////////

Section for the functions used on form.html

//////////////////////////////////
*/
/** 
 * @brief This function changes the placeholder on the searchComment element based on which option 
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
/**
 * @brief Displays more rows in the trending topics table.
 * @param {HTMLButtonElement} button - The button that triggered the event.
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
/**
 * @brief Hides extra rows in the trending topics table.
 * @param {HTMLButtonElement} button - The button that triggered the event.
 */
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
/**
 * @brief Toggles whether the graphs are displayed 
 */
function moreGraphsClicked(){
  userInfo = document.getElementById("userInfoContainer");
  chartsSection = document.getElementById("moreChartSection");
  postSection = document.getElementById("viewPostsSection");
  userInfo.style.display = "none";
  chartsSection.style.display = "flex";
  postSection.style.display = "none";
}
/**
 * @brief This function is called when the view specific posts button is clicked
 */
function viewPostsClicked(){
  userInfo = document.getElementById("userInfoContainer");
  chartsSection = document.getElementById("moreChartSection");
  postSection = document.getElementById("viewPostsSection");
  userInfo.style.display = "none";
  chartsSection.style.display = "none";
  postSection.style.display = "block";
}
/**
 * @brief This function is called when the user clicks the extra user information button
 */
function userInfoButtonClicked(){
  userInfo = document.getElementById("userInfoContainer");
  chartsSection = document.getElementById("moreChartSection");
  postSection = document.getElementById("viewPostsSection");
  userInfo.style.display = "block";
  chartsSection.style.display = "none";
  postSection.style.display = "none";
}
/** This section contains function for the pie Chart */


/**
 * @brief This is a simple Pie Chart that displays the proportion of sentiment for the querry user made
 * @param {string} searchTopic - The topic for the setniment analysis
 */
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
/**
 * @brief Calculates the counts of positive, neutral, and negative sentiments from the dataset for the pie chart.
 * @return {number[]} Array containing the counts for each sentiment type (positive, neutral, negative).
 */
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

/**
 * @brief This function creates the bar chart for the subreddit count
 */
function displaySubredditBarChart(){
  let barChartDatasets = getBarChartDatasets();
  let positiveDataset = barChartDatasets[0];
  let neutralDataset = barChartDatasets[1];
  let negativeDataset = barChartDatasets[2];
  let xValues = barChartDatasets[3];
  let maxY = getMaxXValue(positiveDataset, neutralDataset, negativeDataset,xValues)
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
            stacked: true,
            beginAtZero: true, // Start the y-axis at 0
            max: maxY
        }
      },
      responsive: true,
      maintainAspectRatio: true,
      width: 800,  // Width of the canvas
      height: 400  // Height of the canvas
    } 
  });
}
/**
 * @brief Calculates the maximum value across all sentiment values to determine the y-axis for the chart.
 * @param {number[]} positiveDataset - The dataset containing the positive sentiment values.
 * @param {number[]} neutralDataset - The dataset containing the neutral sentiment values.
 * @param {number[]} negativeDataset - The dataset containing the negative sentiment values.
 * @param {string[]} xValues - The labels for the x-axis.
 * @return {number} The maximum y-value for the chart.
 */
function getMaxXValue(positiveDataset, neutralDataset, negativeDataset, xValues){
  let totalValues = [];
  let maxY = 0;
  for (let i=0;i<xValues.length;i++){
    let total = positiveDataset[i] + neutralDataset[i] + negativeDataset[i];
    totalValues.push(total);
  }
  for (let i=0; i<totalValues.length;i++){
    let num = totalValues[i];
    if (num > maxY){
      maxY = num;
    }
  }
  return maxY;
}
/**
 * @brief Gets the data for the bar chart, counting the occurrences of each sentiment type for each subreddit.
 * @return {Object} An object containing subreddits as keys and an array of sentiment counts [positive, neutral, negative] as values.
 */
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
/**
 * @brief Retrieves the sentiment datasets for the bar chart, including positive, neutral, and negative counts.
 * @return {Array} An array containing three sentiment datasets (positive, neutral, negative) and the x-axis labels (subreddits).
 */
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
/**
 * @brief This function creates the line graph for the sentiment over time
 */
function sentimentOverTimeLineGraph(){
  getTimeFrame()
  var xValues = [];
  var yValues = [];
  jsonData.forEach(entry =>{
    xValues.push(entry.created_utc);
    yValues.push(entry.compoundScore);
  });
  for (let i=0;i<xValues.length;i++){
    date = new Date(Number(xValues[i]));
    let formattedDate = date.toISOString().slice(0, 19).replace("T", " ");
    xValues[i] = formattedDate
  }

  new Chart(document.getElementById("sentimentOverTimeLineGraph"), {
    type: "line",
    data: {
      labels: xValues,
      datasets: [{
        label: "Sentiment",
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
/**
 * @brief Determines the lowest and highest timestamps from the dataset.
 */
function getTimeFrame(){
  let lowestTime = jsonData[0].created_utc;
  let highestTime = jsonData[0].created_utc;
  jsonData.forEach(entry=>{
    createdTime = entry.created_utc;
    if(lowestTime>createdTime){
      lowestTime = createdTime;
    }
    if(highestTime < createdTime){
      highestTime = createdTime;
    }
  })
}
/**
 * @brief This function creates the bar chart for the top keywords by sentiment
 */
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
/**
 * @brief This function creates the scatter graph for sentiment vs engagement
 */
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
/**
 * @brief This function creates the word cloud for the top keywords
 * @note A lot of the code was taken from here: https://d3-graph-gallery.com/graph/wordcloud_size.html
 */
function displayWordCloud(){
  // List of words
  let myWords = getDataForWorldCloud();
  myWords = scaleWords(myWords);
  // set the dimensions and margins of the graph
  var containerWidth = document.getElementById("sentimentOverTimeLineGraph").offsetWidth;
  var containerHeight = document.getElementById("sentimentOverTimeLineGraph").offsetHeight;
  
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
  
  /**
   * @brief This function takes the output of 'layout' above and draw the words
   * 
   * Wordcloud features that are THE SAME from one word to the other can be here
   * 
   * @param {*} words an array of words to be drawn in the word cloud
   */
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
  /**
   * @brief This function is used to scale the words in the word cloud to an appropriate size
   * @param {Array} words - An array of word objects containing text and size data.
   * @return {Array} The modified array of words with scaled sizes.
   */
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
/**
 * @brief Prepares the data from JSON data for the word cloud.
 * @return {Array} The processed words formatted for the word cloud.
 */
function getDataForWorldCloud(){
  let text = "";
  jsonData.forEach(entry =>{
    text += " " + entry.title + " " + entry.selftext;
  });
  let words = getWordList(text);
  let filteredWords = removeWords(words);
  wordCount = countWords(filteredWords);
  let formattedWords = convertToWorldCloudFormat(wordCount);
  return formattedWords;
}
/**
 * @brief Converts the word count data into the format required for the word cloud.
 * @param {Object} wordCount - An object containing word counts where keys are words and values are frequencies.
 * @return {Array} An array of objects, each containing a word and its corresponding size.
 */
function convertToWorldCloudFormat(wordCount){
  let formattedWords = [];
  for(let word in wordCount){
    formattedWords.push({
      word: word,
      size: wordCount[word]
    });
  };
  return formattedWords;
}
/**
 * @brief Prepares and renders a scatter plot showing the relationship between sentiment scores and number of comments.
 */
function setSentimentAndCommentsSection(){

  let positiveScatterData = [];
  let neutralScatterData = [];
  let negativeScatterData = [];
     
    jsonData.forEach(entry => { 
      if(entry.label === "POSITIVE"){
        positiveScatterData.push({
          x: entry.num_comments,
          y: entry.compoundScore,
        });
      } else if (entry.label === "NEUTRAL"){
        neutralScatterData.push({
          x: entry.num_comments,
          y: entry.compoundScore,
        });
      } else if (entry.label === "NEGATIVE"){
        negativeScatterData.push({
          x: entry.num_comments,
          y: entry.compoundScore,
        });
      }
    });

  const data = {
    datasets: [{
      label: 'Positive',
      data: positiveScatterData,
      backgroundColor: 'rgb(0, 255, 0)'
    }, {
      label: 'Neutral',
      data: neutralScatterData,
      backgroundColor: 'rgb(99, 99, 99)'
    }, {
      label: 'Negative',
      data: negativeScatterData,
      backgroundColor: 'rgb(255, 0, 0)'
    }]
  };

  const config = {
    type: 'scatter',
    data: data,
    options: {
      scales: {
        y: {
          title: {
            display: true,
            text: 'Sentiment',
          },
          max: 1,
          min: -1,
        },
        x: {
          title: {
            display: true,
            text: 'Number of Comments'
          }
        }
      },
      responsive: true,
    }
  };

  const ctx = document.getElementById('sentimentAndCommentsChart').getContext('2d');
  new Chart(ctx, config);
}
/**
 * @brief Prepares and renders a scatter plot showing the relationship between sentiment scores and number of upvotes.
 */
function setSentimentAndUpvotesSection(){

  let positiveScatterData = [];
  let neutralScatterData = [];
  let negativeScatterData = [];
     
    jsonData.forEach(entry => { 
      if(entry.label === "POSITIVE"){
        positiveScatterData.push({
          x: entry.upvotes,
          y: entry.compoundScore,
        });
      } else if (entry.label === "NEUTRAL"){
        neutralScatterData.push({
          x: entry.upvotes,
          y: entry.compoundScore,
        });
      } else if (entry.label === "NEGATIVE"){
        negativeScatterData.push({
          x: entry.upvotes,
          y: entry.compoundScore,
        });
      }
    });

  const data = {
    datasets: [{
      label: 'Positive',
      data: positiveScatterData,
      backgroundColor: 'rgb(0, 255, 0)'
    }, {
      label: 'Neutral',
      data: neutralScatterData,
      backgroundColor: 'rgb(99, 99, 99)'
    }, {
      label: 'Negative',
      data: negativeScatterData,
      backgroundColor: 'rgb(255, 0, 0)'
    }]
  };

  const config = {
    type: 'scatter',
    data: data,
    options: {
      scales: {
        y: {
          title: {
            display: true,
            text: 'Sentiment',
          },
          max: 1,
          min: -1,
        },
        x: {
          title: {
            display: true,
            text: 'Number of Upvotes'
          }
        }
      },
      responsive: true,
    }
  };

  const ctx = document.getElementById('sentimentAndUpvotesChart').getContext('2d');
  new Chart(ctx, config);
}

/*
//////////////////////////////////

Section for breakdown.html

//////////////////////////////////
*/
/**
 * @brief Sets the data in the breakdown table in breakdown.html page
 *
 */
function setBreakdownData(){
  let size = jsonData.length;
  // Variables for percentage of overall row
  let positiveCountPercentOfOverall = 0;
  let neutralCountPercentOfOverall = 0;
  let negativeCountPercentOfOverall = 0;

  //Variables for average score
  let positiveScore = 0;
  let neutralScore = 0;
  let negativeScore = 0;

  //Variables for average number of comments
  let positiveNumOfComments = 0;
  let neutralNumOfComments = 0;
  let negativeNumOfComments = 0;

  //Variables for average number of upvotes
  let positiveAverageNumOfUpvotes = 0;
  let neutralAverageNumOfUpvotes = 0;
  let negativeAverageNumOfUpvotes = 0;

  //Average upvote ratio
  let positiveUpvoteRatio = 0;
  let neutralUpvoteRatio = 0;
  let negativeUpvoteRatio = 0;
  
  // Counts the amount of each sentiment
  let positiveSize = 0;
  let neutralSize = 0;
  let negativeSize = 0;

  jsonData.forEach(entry => {
    if(entry.label == "POSITIVE"){
      positiveCountPercentOfOverall++;
      positiveScore += entry.compoundScore;
      positiveNumOfComments += entry.num_comments;
      positiveAverageNumOfUpvotes += entry.upvotes;
      positiveUpvoteRatio += entry.upvote_ratio;
      positiveSize += 1;
    } else if (entry.label == "NEUTRAL"){
      neutralCountPercentOfOverall++;
      neutralScore += entry.compoundScore;
      neutralNumOfComments += entry.num_comments;
      neutralAverageNumOfUpvotes += entry.upvotes;
      neutralUpvoteRatio += entry.upvote_ratio;
      neutralSize += 1;
    } else if (entry.label == "NEGATIVE"){
      negativeCountPercentOfOverall++;
      negativeScore += entry.compoundScore;
      negativeNumOfComments += entry.num_comments;
      negativeAverageNumOfUpvotes += entry.upvotes;
      negativeUpvoteRatio += entry.upvote_ratio;
      negativeSize += 1;
    }
  });
  setBreakdownPercentageOfOverall(positiveCountPercentOfOverall, 
    neutralCountPercentOfOverall, negativeCountPercentOfOverall, size);
  setAverageScore(positiveScore, neutralScore, negativeScore, positiveSize, neutralSize, negativeSize);
  setAverageNumOfComments(positiveNumOfComments, neutralNumOfComments, negativeNumOfComments, positiveSize, neutralSize, negativeSize);
  setMostCommonWords();
  setAverageNumOfUpvotes(positiveAverageNumOfUpvotes, neutralAverageNumOfUpvotes, 
    negativeAverageNumOfUpvotes, positiveSize, neutralSize, negativeSize);
  setAverageUpvoteRatio(positiveUpvoteRatio, neutralUpvoteRatio, negativeUpvoteRatio, positiveSize, neutralSize, negativeSize);
  setMostCommonSubreddit();
}

/**
 * Sets the percentage of overall row in the breakdown table
 *
 * @param {string} positiveCount - The number of positive posts whos sentiment was analyzed
 * @param {string} neutralCount - The number of neutral posts whos sentiment was analyzed
 * @param {string} negativeCount - The number of negative posts whos sentiment was analyzed
 * @param {number} size - The size of the jsonData variable
 */
function setBreakdownPercentageOfOverall(positiveCount, neutralCount, negativeCount, size){
  if(positiveCount > 0){
    let positivePercent = Math.round((positiveCount / size) * 100) + "%";
    document.getElementById("percentageOfOverallPositive").innerHTML = positivePercent;
  } else {
    document.getElementById("percentageOfOverallPositive").innerHTML = "0%";
  }
  if(neutralCount > 0){
    let neutralPercent = Math.round((neutralCount / size) * 100) + "%";
    document.getElementById("percentageOfOverallNeutral").innerHTML = neutralPercent;
  } else {
    document.getElementById("percentageOfOverallNeutral").innerHTML = "0%";
  }
  if(negativeCount > 0){
    let negativePercent = Math.round((negativeCount / size) * 100) + "%";
    document.getElementById("percentageOfOverallNegative").innerHTML = negativePercent;
  } else {
    document.getElementById("percentageOfOverallNegative").innerHTML = "0%";
  }
}
/**
 * Sets the average score row in the breakdown table
 *
 * @param {string} positiveScore - The sum of all scores from the positive posts whos sentiment was analyzed
 * @param {string} neutralScore - The sum of all scores from the neutral posts whos sentiment was analyzed
 * @param {string} negativeScore - The sum of all scores from the negative posts whos sentiment was analyzed
 * @param {number} positiveSize - The samount of positive posts whos sentiment was analyzed
 * @param {number} neutralSize - The amount of neutral posts whos sentiment was analyzed
 * @param {number} negativeSize - The amount of negative posts whos sentiment was analyzed
 */
function setAverageScore(positiveScore, neutralScore, negativeScore, positiveSize, neutralSize, negativeSize){
  if(positiveScore > 0){
    let fieldContents = Math.round((positiveScore / positiveSize) * 100) + "%";
    document.getElementById("averageScorePositive").innerHTML = fieldContents;
  } else {
    document.getElementById("averageScorePositive").innerHTML = "N/A";
  }
  if(neutralScore > 0 || neutralScore < 0){
    let fieldContents = Math.round((neutralScore / neutralSize) * 100) + "%";
    document.getElementById("averageScoreNeutral").innerHTML = fieldContents;
  } else {
    document.getElementById("averageScoreNeutral").innerHTML = 0;
  }
  if(negativeScore < 0){
    let fieldContents = Math.round((negativeScore / negativeSize) * 100) + "%";
    document.getElementById("averageScoreNegative").innerHTML = fieldContents;
  } else {
    document.getElementById("averageScoreNegative").innerHTML = "N/A";
  }
}
/**
 * Sets the Average Number of Comments row in the breakdown table
 *
 * @param {string} positiveNumOfComments - The sum of all comments from the positive posts whos sentiment was analyzed
 * @param {string} neutralNumOfComments - The sum of all comments from the neutral posts whos sentiment was analyzed
 * @param {string} negativeNumOfComments - The sum of all comments from the negative posts whos sentiment was analyzed
 * @param {number} positiveSize - The samount of positive posts whos sentiment was analyzed
 * @param {number} neutralSize - The amount of neutral posts whos sentiment was analyzed
 * @param {number} negativeSize - The amount of negative posts whos sentiment was analyzed
 */
function setAverageNumOfComments(positiveNumOfComments, neutralNumOfComments, negativeNumOfComments, 
  positiveSize, neutralSize, negativeSize){
  if(positiveNumOfComments>0){
    let fieldContents = Math.round(positiveNumOfComments/positiveSize);
    document.getElementById("averageNumberOfCommentsPositive").innerHTML = fieldContents;
  } else {
    document.getElementById("averageNumberOfCommentsPositive").innerHTML = 0;
  }
  if(neutralNumOfComments>0){
    let fieldContents = Math.round(neutralNumOfComments/neutralSize);
    document.getElementById("averageNumberOfCommentsNeutral").innerHTML = fieldContents;
  } else {
    document.getElementById("averageNumberOfCommentsNeutral").innerHTML = 0;
  }
  if (negativeNumOfComments>0){
    let fieldContents = Math.round(negativeNumOfComments/negativeSize);
    document.getElementById("averageNumberOfCommentsNegative").innerHTML = fieldContents;
  } else {
    document.getElementById("averageNumberOfCommentsNegative").innerHTML = 0;
  }
}
/**
 * @brief Sets the Most Common Words row in the breakdown table
 */
function setMostCommonWords(){

  /**
  * Finds out which word appeared the most amount of times
  *
  * @param {string} wordCount - An object containing a key value pair of each word and the amount of time it appeared
  * @returns {string} - Returns the most common word in the passed in argument
  */
  function findMostCommonWord(wordCount){
    let mostCommonWord = '';
    let maxCount = 0;
  
    for (const word in wordCount) {
      if (wordCount[word] > maxCount) {
        mostCommonWord = word;
        maxCount = wordCount[word];
      }
    }
    return mostCommonWord;
  }
  positiveText = "";
  neutralText = "";
  negativeText = "";

  jsonData.forEach(entry => {
    if (entry.label === "POSITIVE"){
      positiveText += " " + entry.title + " " + entry.selfText;
    } else if (entry.label === "NEUTRAL"){
      neutralText += " " + entry.title + " " + entry.selfText;
    } else if (entry.label === "NEGATIVE"){
      negativeText += " " + entry.title + " " + entry.selfText;
    }
  })

  let positiveWords = getWordList(positiveText);
  let neutralWords = getWordList(neutralText);
  let negativeWords = getWordList(negativeText);

  let postiveWordCount = countWords(positiveWords);
  let neutralWordCount = countWords(neutralWords);
  let negativeWordCount = countWords(negativeWords);

  let positiveMostCommonWord = findMostCommonWord(postiveWordCount);
  let neutralMostCommonWord = findMostCommonWord(neutralWordCount);
  let negativeMostCommonWord = findMostCommonWord(negativeWordCount);

  if (positiveMostCommonWord === ''){
    positiveMostCommonWord = "N/A";
  }
  if (neutralMostCommonWord === ''){
    neutralMostCommonWord = "N/A";
  }
  if (negativeMostCommonWord === ''){
    negativeMostCommonWord = "N/A";
  }

  document.getElementById("mostCommonWordPositive").innerHTML = positiveMostCommonWord;
  document.getElementById("mostCommonWordNeutral").innerHTML = neutralMostCommonWord;
  document.getElementById("mostCommonWordNegative").innerHTML = negativeMostCommonWord;
}
/**
* Gets the list of words in a piece of text
*
* @param {string} text - The sum of all comments from the positive posts whos sentiment was analyzed
* @returns {object} - Returns an array of strings from a piece of text
*/
function getWordList(text){
  text = text.toLowerCase().replace(/[^\w\s]/g, '');
  words = text.split(/\s+/);
  words = removeWords(words);
  return words;
}
  /**
* Counts how much each word appeared in the array
*
* @param {string} words - An Array of Strings
* @returns {object} - Returns an object containing a key value pair of each word and the amount of time it appeared
*/
function countWords(words){
  const wordCount = {};
  words.forEach(word => {
    wordCount[word] = (wordCount[word] || 0) + 1;
  });
  return wordCount;
}
/**
 * @brief Removes specified stopwords and a custom set of words from the provided list of words.
 * @param {Array} words - An array of words to be filtered.
 * @return {Array} The filtered array of words.
 */
function removeWords(words){
  let searchWord = search;
  let removeList = [searchWord, '', 'undefined', 'why', 'when'];
  let filteredWords = sw.removeStopwords(words);
  filteredWords = sw.removeStopwords(filteredWords, removeList);
  return filteredWords;
}
  /**
  * Sets the Average Number Of Upvotes row in the breakdown table
  *
 * @param {string} positiveAverageNumOfUpvotes - The sum of all the upvotes from the positive posts whos sentiment was analyzed
 * @param {string} neutralAverageNumOfUpvotes - The sum of all the upvotes from the neutral posts whos sentiment was analyzed
 * @param {string} negativeAverageNumOfUpvotes - The sum of all the upvotes from the negative posts whos sentiment was analyzed
 * @param {number} positiveSize - The samount of positive posts whos sentiment was analyzed
 * @param {number} neutralSize - The amount of neutral posts whos sentiment was analyzed
 * @param {number} negativeSize - The amount of negative posts whos sentiment was analyzed
  */
function setAverageNumOfUpvotes(positiveAverageNumOfUpvotes, neutralAverageNumOfUpvotes, 
  negativeAverageNumOfUpvotes, positiveSize, neutralSize, negativeSize){
    if(positiveAverageNumOfUpvotes>0){
      let fieldContents = Math.round(positiveAverageNumOfUpvotes/positiveSize);
      document.getElementById("averageNumberOfUpvotesPositive").innerHTML = fieldContents;
    } else {
      document.getElementById("averageNumberOfUpvotesPositive").innerHTML = 0;
    }
    if(neutralAverageNumOfUpvotes>0){
      let fieldContents = Math.round(neutralAverageNumOfUpvotes/neutralSize);
      document.getElementById("averageNumberOfUpvotesNeutral").innerHTML = fieldContents;
    } else {
      document.getElementById("averageNumberOfUpvotesNeutral").innerHTML = 0;
    }
    if (negativeAverageNumOfUpvotes>0){
      let fieldContents = Math.round(negativeAverageNumOfUpvotes/negativeSize);
      document.getElementById("averageNumberOfUpvotesNegative").innerHTML = fieldContents;
    } else {
      document.getElementById("averageNumberOfUpvotesNegative").innerHTML = 0;
    }
}
  /**
  * Sets the Average Number Of Upvotes row in the breakdown table
  *
 * @param {string} positiveUpvoteRatio - The sum of all the upvotes ratios from the positive posts whos sentiment was analyzed
 * @param {string} neutralUpvoteRatio - The sum of all the upvotes ratios from the neutral posts whos sentiment was analyzed
 * @param {string} negativeUpvoteRatio - The sum of all the upvotes ratios from the negative posts whos sentiment was analyzed
 * @param {number} positiveSize - The samount of positive posts whos sentiment was analyzed
 * @param {number} neutralSize - The amount of neutral posts whos sentiment was analyzed
 * @param {number} negativeSize - The amount of negative posts whos sentiment was analyzed
  */
function setAverageUpvoteRatio(positiveUpvoteRatio, neutralUpvoteRatio, negativeUpvoteRatio, 
  positiveSize, neutralSize, negativeSize){
  if(positiveUpvoteRatio>0){
    let fieldContents = Math.round(positiveUpvoteRatio/positiveSize * 100) + "%";
    document.getElementById("averageUpvoteRatioPositive").innerHTML = fieldContents;
  } else {
    document.getElementById("averageUpvoteRatioPositive").innerHTML = "N/A";
  }
  if(neutralUpvoteRatio>0){
    let fieldContents = Math.round(neutralUpvoteRatio/neutralSize * 100) + "%";
    document.getElementById("averageUpvoteRatioNeutral").innerHTML = fieldContents;
  } else {
    document.getElementById("averageUpvoteRatioNeutral").innerHTML = "N/A";
  }
  if (negativeUpvoteRatio>0){
    let fieldContents = Math.round(negativeUpvoteRatio/negativeSize * 100) + "%";
    document.getElementById("averageUpvoteRatioNegative").innerHTML = fieldContents;
  } else {
    document.getElementById("averageUpvoteRatioNegative").innerHTML = "N/A";
  }
}
  /**
  * Sets the most common subreddit row in the breakdown table
  */
function setMostCommonSubreddit(){
  let positiveSubredditCount = [];
  let neutralSubredditCount = [];
  let negativeSubredditCount = [];
  jsonData.forEach(entry => {
    const subreddit = entry.subreddit;
    if(entry.label === "POSITIVE"){
      if(!(subreddit in positiveSubredditCount)){
        positiveSubredditCount[subreddit] = 1;
      } else {
        positiveSubredditCount[subreddit] += 1
      }
    } else if (entry.label === "NEUTRAL"){
      if(!(subreddit in neutralSubredditCount)){
        neutralSubredditCount[subreddit] = 1;
      } else {
        neutralSubredditCount[subreddit] += 1
      }
    } else if (entry.label === "NEGATIVE"){
      if(!(subreddit in negativeSubredditCount)){
        negativeSubredditCount[subreddit] = 1;
      } else {
        negativeSubredditCount[subreddit] += 1
      }
    }
  });
  /**
  * Sets the Average Number Of Upvotes row in the breakdown table
  *
  * @param {object} subredditCount - An object of key value pairs of subreddits and the amount of times they appeared
  * @returns {string} - Returns the key (subreddit) with the largest value
  */
  function getLargestSubreddit(subredditCount){
    maxSize = 0;
    maxSubreddit = "";
    for (subreddit in subredditCount){
      if (subredditCount[subreddit] > maxSize){
        maxSize = subredditCount[subreddit];
        maxSubreddit = subreddit;
      }
    }
    return maxSubreddit;
  }
  if(Object.keys(positiveSubredditCount).length > 0){
    fieldContents = getLargestSubreddit(positiveSubredditCount);
    document.getElementById("mostCommonSubredditPositive").innerHTML = fieldContents;
  } else {
    document.getElementById("mostCommonSubredditPositive").innerHTML = "N/A";
  }
  if(Object.keys(neutralSubredditCount).length > 0){
    fieldContents = getLargestSubreddit(neutralSubredditCount);
    document.getElementById("mostCommonSubredditNeutral").innerHTML = fieldContents;
  } else {
    document.getElementById("mostCommonSubredditNeutral").innerHTML = "N/A";
  }
  if(Object.keys(negativeSubredditCount).length > 0){
    fieldContents = getLargestSubreddit(negativeSubredditCount);
    document.getElementById("mostCommonSubredditNegative").innerHTML = fieldContents;
  } else {
    document.getElementById("mostCommonSubredditNegative").innerHTML = "N/A";
  } 
}
/*
//////////////////////////////////

Section for the view posts section

//////////////////////////////////
*/
/**
 * @brief Fills in the sentiment sections (Positive, Neutral, Negative) with posts based on their sentiment labels.
 */
function setViewPostsSection(){
  jsonData.forEach(entry => {
    if(entry.label === "POSITIVE"){
      section = document.getElementById("positiveSentimentSection");
      addPost(entry, section)
    } else if (entry.label === "NEUTRAL"){
      section = document.getElementById("neutralSentimentSection");
      addPost(entry, section)
    } else if (entry.label === "NEGATIVE"){
      section = document.getElementById("negativeSentimentSection");
      addPost(entry, section)
    }
  });
}
/**
 * @brief Adds a single post into a specified section of the view posts page.
 * @param {object} entry - The post entry object containing post data.
 * @param {HTMLElement} section - The section element where the post will be added.
 */
function addPost(entry, section){
  if(entry.title == "N/A"){
    text = entry.selftext;
  } else {
    text = entry.title;
  }
  if(text.length > 100){
    text = text.substring(0, 100) + "...";
  }
  htmlString = 
  `<button
    class="modalBtn my-2"
      data-title="${entry.title}"
      data-subreddit="${entry.subreddit}"
      data-compoundScore="${entry.compoundScore}"
      data-positiveScore="${entry.positiveScore}"
      data-neutralScore="${entry.neutralScore}"
      data-negativeScore="${entry.negativeScore}"
      data-author="${entry.author}" 
      data-created="${entry.created_utc}"
      data-numComments="${entry.num_comments}"
      data-over18="${entry.over_18}"
      data-permalink="${entry.permalink}"
      data-upvotes="${entry.upvotes}"
      data-upvoteRatio="${entry.upvote_ratio}"
      data-selfText="${entry.selftext}"
      data-url="${entry.url}"
      onclick="postClicked(this)">           
          ${text}<br>
          Score: ${entry.compoundScore}<br>
    </button>`;
    section.innerHTML += htmlString;
}
/**
 * @brief This function is called when the user clicks the download CSV button.
 */
function downloadCSV(){
  let csv = 'Type,Author,Compound Score,Content,Content Type,Created UTC,Label,Negative Score,Neutral Score,Number of Comments,Over 18, Permalink,Positive Score,Self Text,Subreddit,Title,Upvote Ratio,Upvotes,URL\n';
  i=0;
  jsonData.forEach(entry => {
    console.log(i + " " + entry.title);
    i++;
    title = entry.title.replace(/"/g, '""').replace(/,/g, '').replace(/\n/g, ' ').replace(/\r/g, ' ');
    selftext = entry.selftext.replace(/"/g, '""').replace(/,/g, '').replace(/\n/g, ' ').replace(/\r/g, ' ');
    csv += `"${entry.Type}","${entry.author}","${entry.compoundScore}","${entry.content}","${entry.contentType}","${entry.created_utc}","${entry.label}","${entry.negativeScore}",` +
    `"${entry.neutralScore}","${entry.num_comments}","${entry.over_18}","${entry.permalink}","${entry.positiveScore}","${selftext}","${entry.subreddit}","${title}",` +
    `"${entry.upvote_ratio}","${entry.upvotes}","${entry.url}"\n`;
  });
  console.log(csv)
  let hiddenElement = document.createElement('a');
  hiddenElement.href = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv);
  hiddenElement.target = '_blank';
  hiddenElement.download = 'RedditData.csv';
  hiddenElement.click();
}
/*
//////////////////////////////////

Section for ViewPosts.html

//////////////////////////////////
*/ 
/**
 * @brief This function is called when the user clicks a specifc post on the view posts page
 * @param {HTMLElement} button - The button element that was clicked.
 */
function postClicked(button){
  var modal = document.getElementById("myModal");
  modal.style.display = "block";
  document.body.classList.add("modal-open"); // Disable background scroll
  
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

  compoundScore = button.getAttribute("data-compoundScore");
  compoundScoreSection = document.getElementById("compoundScoreSection");
  compoundScoreSection.innerHTML = compoundScore;

  positiveScore = button.getAttribute("data-positiveScore");
  positiveScoreSection = document.getElementById("positiveScoreSection");
  positiveScoreSection.innerHTML = positiveScore;

  neutralScore = button.getAttribute("data-neutralScore");
  neutralScoreSection = document.getElementById("neutralScoreSection");
  neutralScoreSection.innerHTML = neutralScore;

  negativeScore = button.getAttribute("data-negativeScore");
  negativeScoreSection = document.getElementById("negativeScoreSection");
  negativeScoreSection.innerHTML = negativeScore;

  author = button.getAttribute("data-author");
  authorSection = document.getElementById("authorSection");
  authorSection.innerHTML = author;

  created = button.getAttribute("data-created");
  creationTimeSection = document.getElementById("creationTimeSection");
  date = new Date(Number(created));
  let formattedDate = date.toISOString().slice(0, 19).replace("T", " ");
  creationTimeSection.innerHTML = formattedDate.toString();

  numComments = button.getAttribute("data-numComments");
  numCommentsSection = document.getElementById("numCommentsSection");
  numCommentsSection.innerHTML = numComments;

  over18 = button.getAttribute("data-over18");
  over18Section = document.getElementById("over18Section");
  over18Section.innerHTML = over18;

  permalink = button.getAttribute("data-permalink");
  permalink = `https://www.reddit.com/${permalink}`;
  permalinkSection = document.getElementById("permalinkSection");
  permalinkSection.innerHTML = `<a class="btn btn-primary" href=${permalink}>View Post</a>`;

  upvotes = button.getAttribute("data-upvotes");
  upvotesSection = document.getElementById("upvotesSection");
  upvotesSection.innerHTML = upvotes;

  upvoteRatio = button.getAttribute("data-upvoteRatio");
  upvoteRatioSection = document.getElementById("upvoteRatioSection");
  upvoteRatioSection.innerHTML = upvoteRatio;
}
/*
//////////////////////////////////

Section for other

//////////////////////////////////
*/
/**
 * @brief This function is called when the user clicks the post button
 */
function postButtonClicked(){
  expandableArea = document.getElementById("expandablePostDetails");
  expandableArea.style.display = "flex";
  expandableArea.style.flexDirection = "row";
  expandableArea.style.justifyContent = "space-around";
}
/**
 * @brief This section is responsible for displaying the form associated with a tab
 * @param {Object} evt - The event object that triggered the function.
 * @param {string} section - The ID of the section to be displayed.
 */
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
/**
 * @brief This function scrolls to a given element
 * @param {string} section - The ID of the section to be scrolled to.
 */
function scrollToElement(section){
  element = document.getElementById(section);
  let offset = 50; // Adjust this value for desired spacing
  let elementPosition = element.getBoundingClientRect().top + window.scrollY;
  window.scrollTo({ top: elementPosition - offset, behavior: "smooth" });
}
/**
 * @brief Shows the loader when the user submits a form
 */
function showLoader(){
  loader = document.getElementById("formModal");
  loader.style.display = "block";
}
/**
 * @brief This function displays the time frame dropdown list in the subreddit form
 * @param {string} target - The ID of the target element to be displayed.
 */
function showTimeFrameDropDown(target){
  timeFrame = document.getElementById(target);
  timeFrame.style.display = "inline-block";
}
/**
 * @brief This function hides the time frame dropdown list in the subreddit form
 * @param {string} target - The ID of the target element to be hidden.
 */
function hideTimeFrameDropDown(target){
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
/**
 * @brief Displays the "Type of Post" row in the user interface by setting its display style to "table-row".
 */
function showTypeOfPostUserRow(){
  typeOfPost = document.getElementById("typeOfPostUserRow");
  typeOfPost.style.display = "table-row";
}
/**
 * @brief Hides the "Type of Post" row in the user interfac
 */
function hideTypeOfPostUserRow(){
  typeOfPost = document.getElementById("typeOfPostUserRow");
  typeOfPost.style.display = "none";
}