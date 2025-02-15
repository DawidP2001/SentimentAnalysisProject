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
let search;

function setGlobalVariables(jsondata, searchTopic){
  setjsonData(jsondata);
  setSearch(searchTopic);
}
function setjsonData(data){
  jsonData = JSON.parse(data);
}
function setSearch(searchTopic){
  searchTopic = searchTopic.toLowerCase();
  search = searchTopic;
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
    } 
  });
}
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
function displayWordCloud(){
  // List of words
  let myWords = getDataForWorldCloud();
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
/*
//////////////////////////////////

Section for breakdown.html

//////////////////////////////////

*/
/**
 * Sets the data in the breakdown table in breakdown.html page
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

  //Variables for most common subreddit
  

  jsonData.forEach(entry => {
    if(entry.label == "POSITIVE"){
      positiveCountPercentOfOverall++;
      positiveScore += entry.score;
      positiveNumOfComments += entry.num_comments;
      positiveAverageNumOfUpvotes += entry.upvotes;
      positiveUpvoteRatio += entry.upvote_ratio;
    } else if (entry.label == "NEUTRAL"){
      neutralCountPercentOfOverall++;
      neutralScore += entry.score;
      neutralNumOfComments += entry.num_comments;
      neutralAverageNumOfUpvotes += entry.upvotes;
      neutralUpvoteRatio += entry.upvote_ratio;
    } else if (entry.label == "NEGATIVE"){
      negativeCountPercentOfOverall++;
      negativeScore += entry.score;
      negativeNumOfComments += entry.num_comments;
      negativeAverageNumOfUpvotes += entry.upvotes;
      negativeUpvoteRatio += entry.upvote_ratio;
    }
  });
  setBreakdownPercentageOfOverall(positiveCountPercentOfOverall, 
    neutralCountPercentOfOverall, negativeCountPercentOfOverall, size);
  setAverageScore(positiveScore, neutralScore, negativeScore, size);
  setAverageNumOfComments(positiveNumOfComments, neutralNumOfComments, negativeNumOfComments, size);
  setMostCommonWords();
  setAverageNumOfUpvotes(positiveAverageNumOfUpvotes, neutralAverageNumOfUpvotes, 
    negativeAverageNumOfUpvotes, size);
  setAverageUpvoteRatio(positiveUpvoteRatio, neutralUpvoteRatio, negativeUpvoteRatio, size);
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
 * @param {number} size - The size of the jsonData variable
 */
function setAverageScore(positiveScore, neutralScore, negativeScore, size){
  if(positiveScore > 0){
    let fieldContents = Math.round((positiveCount / size) * 100) + "%";
    document.getElementById("averageScorePositive").innerHTML = positiveField;
  } else {
    document.getElementById("averageScorePositive").innerHTML = "N/A";
  }
  if(neutralScore > 0){
    let fieldContents = Math.round((neutralScore / size) * 100) + "%";
    document.getElementById("averageScoreNeutral").innerHTML = fieldContents;
  } else {
    document.getElementById("averageScoreNeutral").innerHTML = "N/A";
  }
  if(negativeScore > 0){
    let fieldContents = Math.round((negativeScore / size) * 100) + "%";
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
 * @param {number} size - The size of the jsonData variable
 */
function setAverageNumOfComments(positiveNumOfComments, neutralNumOfComments, negativeNumOfComments, size){
  if(positiveNumOfComments>0){
    let fieldContents = Math.round(positiveNumOfComments/size);
    document.getElementById("averageNumberOfCommentsPositive").innerHTML = fieldContents;
  } else {
    document.getElementById("averageNumberOfCommentsPositive").innerHTML = "N/A";
  }
  if(neutralNumOfComments>0){
    let fieldContents = Math.round(neutralNumOfComments/size);
    document.getElementById("averageNumberOfCommentsNeutral").innerHTML = fieldContents;
  } else {
    document.getElementById("averageNumberOfCommentsNeutral").innerHTML = "N/A";
  }
  if (negativeNumOfComments>0){
    let fieldContents = Math.round(negativeNumOfComments/size);
    document.getElementById("averageNumberOfCommentsNegative").innerHTML = fieldContents;
  } else {
    document.getElementById("averageNumberOfCommentsNegative").innerHTML = "N/A";
  }
}
/**
 * Sets the Most Common Words row in the breakdown table
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
function removeWords(words){
  let searchWord = search;
  let removeList = [searchWord, '', 'undefined'];
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
 * @param {number} size - The size of the jsonData variable
  */
function setAverageNumOfUpvotes(positiveAverageNumOfUpvotes, neutralAverageNumOfUpvotes, 
  negativeAverageNumOfUpvotes, size){
    if(positiveAverageNumOfUpvotes>0){
      let fieldContents = Math.round(positiveAverageNumOfUpvotes/size);
      document.getElementById("averageNumberOfUpvotesPositive").innerHTML = fieldContents;
    } else {
      document.getElementById("averageNumberOfUpvotesPositive").innerHTML = "N/A";
    }
    if(neutralAverageNumOfUpvotes>0){
      let fieldContents = Math.round(neutralAverageNumOfUpvotes/size);
      document.getElementById("averageNumberOfUpvotesNeutral").innerHTML = fieldContents;
    } else {
      document.getElementById("averageNumberOfUpvotesNeutral").innerHTML = "N/A";
    }
    if (negativeAverageNumOfUpvotes>0){
      let fieldContents = Math.round(negativeAverageNumOfUpvotes/size);
      document.getElementById("averageNumberOfUpvotesNegative").innerHTML = fieldContents;
    } else {
      document.getElementById("averageNumberOfUpvotesNegative").innerHTML = "N/A";
    }
}
  /**
  * Sets the Average Number Of Upvotes row in the breakdown table
  *
 * @param {string} positiveUpvoteRatio - The sum of all the upvotes ratios from the positive posts whos sentiment was analyzed
 * @param {string} neutralUpvoteRatio - The sum of all the upvotes ratios from the neutral posts whos sentiment was analyzed
 * @param {string} negativeUpvoteRatio - The sum of all the upvotes ratios from the negative posts whos sentiment was analyzed
 * @param {number} size - The size of the jsonData variable
  */
function setAverageUpvoteRatio(positiveUpvoteRatio, neutralUpvoteRatio, negativeUpvoteRatio, size){
  if(positiveUpvoteRatio>0){
    let fieldContents = Math.round(positiveUpvoteRatio/size * 100) + "%";
    document.getElementById("averageUpvoteRatioPositive").innerHTML = fieldContents;
  } else {
    document.getElementById("averageUpvoteRatioPositive").innerHTML = "N/A";
  }
  if(neutralUpvoteRatio>0){
    let fieldContents = Math.round(neutralUpvoteRatio/size * 100) + "%";
    document.getElementById("averageUpvoteRatioNeutral").innerHTML = fieldContents;
  } else {
    document.getElementById("averageUpvoteRatioNeutral").innerHTML = "N/A";
  }
  if (negativeUpvoteRatio>0){
    let fieldContents = Math.round(negativeUpvoteRatio/size * 100) + "%";
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
function addPost(entry, section){
  htmlString = 
  `<button
    class="modalBtn"
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
          Text: ${entry.title}<br>
          Score:${entry.compoundScore}<br>
    </button>`;
    section.innerHTML += htmlString;
}
function seperateIntoLists(){

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
  permalinkSection.innerHTML = `<a href=${permalink}>link</>`;

  upvotes = button.getAttribute("data-upvotes");
  upvotesSection = document.getElementById("upvotesSection");
  upvotesSection.innerHTML = upvotes;

  upvoteRatio = button.getAttribute("data-upvoteRatio");
  upvoteRatioSection = document.getElementById("upvoteRatioSection");
  upvoteRatioSection.innerHTML = upvoteRatio;

  url = button.getAttribute("data-url");
  urlSection = document.getElementById("urlSection");
  urlSection.innerHTML = `<a href="${url}">link</a>`;
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