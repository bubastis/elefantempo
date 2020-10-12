var Airtable = require('airtable');
var base = new Airtable({apiKey: 'key01ANDl0gk20K6T'}).base('appw1UG1ZgXVUtSJv');

var maxtemp = document.getElementById("maxtemp");
var maxtempdate = document.getElementById("maxtempdate");

base('Current Data').select({

    view: "All Time",
    fields: ["Temperature"],
    sort: [{field: "Temperature", direction: "desc"}],
    maxRecords: 1

}).eachPage(function page(records, fetchNextPage) {

    records.forEach(function(record) {
        maxtemp.innerText = record.fields.Temperature + "ºC";
        let recordDate = new Date(record._rawJson.createdTime)
        maxtempdate.innerText = recordDate.getDate() + "/" + (recordDate.getMonth() + 1) + "/" + recordDate.getFullYear();
    });

}, function done(err) {
    if (err) { console.error(err); return; }
});

var mintemp = document.getElementById("mintemp");
var mintempdate = document.getElementById("mintempdate");

base('Current Data').select({

    view: "All Time",
    fields: ["Temperature"],
    sort: [{field: "Temperature", direction: "asc"}],
    maxRecords: 1

}).eachPage(function page(records, fetchNextPage) {

    records.forEach(function(record) {
        mintemp.innerText = record.fields.Temperature + "ºC";
        let recordDate = new Date(record._rawJson.createdTime)
        mintempdate.innerText = recordDate.getDate() + "/" + (recordDate.getMonth() + 1) + "/" + recordDate.getFullYear();
    });

}, function done(err) {
    if (err) { console.error(err); return; }
});

base('Current Data').select({

    view: "Last Week",
    fields: ["Temperature"]

}).eachPage(function page(records, fetchNextPage) {

    records.forEach(function(record) {
        console.log(record)
    });

}, function done(err) {
    if (err) { console.error(err); return; }
});
