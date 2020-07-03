# sinhala-songs-search-engine
Simple search engine developed using Elasticsearch to search Sinhala songs

## Instructions

1. Install Elasticsearch from https://www.elastic.co/downloads/ to localhost or web server.
2. Upload sinhala-songs.bulk using Elasticsearch API

`curl -XPOST http://localhost:9200/_bulk?pretty --data-binary @sinhala-songs.bulk -H "Content-Type: application/json"`

3. Change 
