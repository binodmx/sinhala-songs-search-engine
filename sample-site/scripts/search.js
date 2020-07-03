var loadingdiv = $('#loading');
var noresults = $('#noresults');
var resultdiv = $('#results');
var searchbox = $('input#search');
var timer = 0;

// Executes the search function 1500 milliseconds after user stops typing
searchbox.keyup(function () {
  clearTimeout(timer);
  timer = setTimeout(search, 1500);
});


// Get response from elasticsearch
var getResponse = async function (search_term) {
  var url = 'http://100.26.236.128:9200/songs/_search';
  var bodyObj = '';

  var size = search_term.replace(/\D/g,'');

  bodyObj += '{';
    bodyObj += '"size":' + ((size>0) ? size : 50) + ','
    // bodyObj += '"sort":[{"track_rating":{"order":"desc"}}],'
    bodyObj += '"query":{'
      bodyObj += '"multi_match":{'
        bodyObj += '"query":"' + search_term + '",'
        // bodyObj += '"fuzziness":"AUTO",'
        // bodyObj += '"type":"phrase",'
        // bodyObj += '"slop":3,'
        bodyObj += '"fields": ['
          bodyObj += '"lyrics",'
          bodyObj += '"track_name_en",'
          bodyObj += '"track_name_si^2",'
          bodyObj += '"artist_name_en",'
          bodyObj += '"artist_name_si",'
          bodyObj += '"album_name_en",'
          bodyObj += '"album_name_si"'
        bodyObj += ']'
      bodyObj += '}'
    bodyObj += '}'
  bodyObj += '}'

  return fetch(url, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: bodyObj
  })
  .then(function(response) {
    console.log('Response recieved.');
    return response.text();
  })
  .then(function(data){
    console.log('Data recieved.');
    var data_obj = JSON.parse(data);
    console.log(data_obj)
    return data_obj
  })
}

async function search() {
  // Clear results before searching
  noresults.hide();
  resultdiv.empty();
  loadingdiv.show();
  // Get the query from the user
  let query = searchbox.val();
  // Only run a query if the string contains at least three characters
  if (query.length > 1) {
    // Make the HTTP request with the query as a parameter and wait for the JSON results
    let response = await getResponse(query)
    // Get the part of the JSON response that we care about
    let results = response['hits']['hits'];
    if (results.length > 0) {
      loadingdiv.hide();
      // Iterate through the results and write them to HTML
      resultdiv.append('<center><p style="color:#808080">"' + query + '" සෙවුම් පදය සඳහා ගීත ' + results.length + ' ක් හමුවුණි.</p></center>');
      for (var item in results) {
        let track_name_si = results[item]._source.track_name_si;
        let artist_name_si = results[item]._source.artist_name_si;
        let album_name_si = results[item]._source.album_name_si;
        let lyrics = results[item]._source.lyrics;

        while (lyrics.includes('%')) {
          lyrics = lyrics.replace('%', '  ')
        }

        // Construct the full HTML string that we want to append to the div
        resultdiv.append('<div class="result">' +
        '<div><h2><b><a style="color:#1906A7">' + track_name_si +
        '</a></b></h2><p>' + 'ගායනය' + ' &mdash; ' + artist_name_si +
        '<br>ඇල්බමය' + ' &mdash; ' + album_name_si +
        '</p><p style="color:#545454">' + lyrics + '...</p></div></div>');
      }
    } else {
      noresults.show();
    }
  }
  loadingdiv.hide();
}