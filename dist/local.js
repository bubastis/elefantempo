// Fetch year averages

fetch('.netlify/functions/getjson?type=year')
  .then(
    function(response) {
      if (response.status !== 200) {
        console.log('Looks like there was a problem. Status Code: ' +
          response.status);
        return;
      }

      // Examine the text in the response
      response.json().then(function(data) {


        // Get max & min
        let max = 0;
        let min = 50;
        data.feeds.forEach((obj) => {
            if (obj.field3 > max) {
                max = obj.field3.slice()
            }
            if (obj.field1 < min) {
                min = obj.field1.slice()
            }
        })

        let minTempArray = data.feeds.find(obj => obj.field1 === min);
        document.getElementById("mintemp").innerText = min;
        let minTempDate = new Date (minTempArray["created_at"]);
        document.getElementById("mintempdate").innerText = minTempDate.getDate() + '/' + (minTempDate.getMonth() + 1) + '/' + minTempDate.getFullYear();

        let maxTempArray = data.feeds.find(obj => obj.field3 === max);
        document.getElementById("maxtemp").innerText = max;
        let maxTempDate = new Date (maxTempArray["created_at"]);
        document.getElementById("maxtempdate").innerText = maxTempDate.getDate() + '/' + (maxTempDate.getMonth() + 1) + '/' + maxTempDate.getFullYear();
        
        var tempVar = {
            "$schema": "https://vega.github.io/schema/vega-lite/v4.json",
            "title": "Temperature Variation (Year)",
            "data": {
                "values": data,
                "format": {
                    "type": "json",
                    "property": "feeds"
                } 
            },
            "width": "container",
            "height": "container",
            "actions": false,
            "mark": {
                "type": "bar"
            },
            "encoding": {
                "x": {
                    "field": "created_at",
                    "title": "Date",
                    "type": "temporal",
                },
                "y": {
                    "field": "field1",
                    "title": "Celsius",
                    "type": "quantitative",
                    "scale": {"zero": false}
                },
                "tooltip": [
                    {"field": "created_at", "title": "Date", "timeUnit": "yearmonthdate"}, 
                    {"field": "field3", "title": "Max"}, 
                    {"field": "field1", "title": "Min"}
                ]
            },
            "layer": [
                {
                "mark": {
                    "type": "bar",
                    "size": 3,
                    "color": "red"
                },
                "encoding": {
                    "y2": {"field": "field3"}
                }
            }]
        };

        var humVar = {
            "$schema": "https://vega.github.io/schema/vega-lite/v4.json",
            "title": "Humidity Variation (Year)",
            "data": {
                "values": data,
                "format": {
                    "type": "json",
                    "property": "feeds"
                } 
            },
            "width": "container",
            "height": "container",
            "actions": false,
            "mark": {
                "type": "bar",
                "tooltip": true
            },
            "encoding": {
                "x": {
                    "field": "created_at",
                    "title": "Date",
                    "type": "temporal",
                },
                "y": {
                    "field": "field4",
                    "title": "Percentage",
                    "type": "quantitative",
                    "scale": {"zero": false}
                },
                "tooltip": [
                    {"field": "created_at", "title": "Date", "timeUnit": "yearmonthdate"}, 
                    {"field": "field6", "title": "Max RH (%)"}, 
                    {"field": "field4", "title": "Min RH (%)"}
                ]
            },
            "layer": [
                {
                "mark": {
                    "type": "bar",
                    "size": 3,
                    "color": "blue"
                },
                "encoding": {
                    "y2": {"field": "field6"}
                }
            }]
        };

        vegaEmbed('#humvar', humVar);

        vegaEmbed('#tempvar', tempVar);
      });
    }
  )
  .catch(function(err) {
    console.log('Fetch Error :-S', err);
  });

fetch('.netlify/functions/getjson?type=week')
  .then(
    function(response) {
      if (response.status !== 200) {
        console.log('Looks like there was a problem. Status Code: ' +
          response.status);
        return;
      }

      // Examine the text in the response
      response.json().then(function(data) {

        var tempvshum = {
            "$schema": "https://vega.github.io/schema/vega-lite/v4.json",
            "title": "Temperature vs. Humidity (Week)",
            "data": {
                "values": data,
                "format": {
                    "type": "json",
                    "property": "feeds"
                } 
            },
            "width": "container",
            "height": "container",
            "encoding": {
                "x": {
                    "field": "created_at",
                    "type": "temporal",
                    "title": "Date"
                    }
                },
            "layer": [
            {
                "mark": {
                    "type": "bar",
                    "color": "blue",
                    "tooltip": true
                },
                "encoding": {
                    "y": {
                        "field": "field2",
                        "type": "quantitative",
                        "title": "% RH",
                        "scale": {"zero": false}
                    }
                }
            },
            {
                "mark": {
                    "type": "line",
                    "color": "red",
                    "clip": true,
                    "tooltip": true
                },
                "encoding": {
                    "y": {
                    "field": "field1",
                    "type": "quantitative",
                    "title": "Celsius",
                    "scale": {"zero": false}
                    }
                }
            }],
            "resolve": {
                "scale": {"y": "independent"}
            }
        };
        
        var tempvslux = {
            "$schema": "https://vega.github.io/schema/vega-lite/v4.json",
            "title": "Temperature vs. Light (Week)",
            "data": {
                "values": data,
                "format": {
                    "type": "json",
                    "property": "feeds"
                } 
            },
            "width": "container",
            "height": "container",
            "encoding": {
                "x": {
                    "field": "created_at",
                    "type": "temporal",
                    "title": "Date"
                    }
                },
            "layer": [
            {
                "mark": {
                    "type": "bar",
                    "color": "orange",
                    "interpolate": "monotone",
                    "tooltip": true
                },
                "encoding": {
                    "y": {
                    "field": "field3",
                    "aggregate": "mean",
                    "type": "quantitative",
                    "title": "Lux",
                    "scale": {"zero": false}
                    }
                }
            },
            {
                "mark": {
                    "type": "line",
                    "color": "red",
                    "interpolate": "monotone",
                    "clip": true,
                    "tooltip": true
                },
                "encoding": {
                    "y": {
                    "field": "field1",
                    "aggregate": "mean",
                    "type": "quantitative",
                    "title": "Celsius",
                    "scale": {"zero": false}
                    }
                }
                } 
                ],
                "resolve": {"scale": {"y": "independent"}}
        };
        
        vegaEmbed('#tempvshum', tempvshum);
        
        vegaEmbed('#tempvslux', tempvslux);
        
      });
    }
  )
  .catch(function(err) {
    console.log('Fetch Error :-S', err);
  });