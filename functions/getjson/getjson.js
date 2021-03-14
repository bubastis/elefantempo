const fetch = require('node-fetch')

const handler = async function (event) {

  try {

    let type = event.queryStringParameters.type;
    let url;

    if (type == "year") {
      url = 'https://api.thingspeak.com/channels/1326754/feeds.json?api_key=Q5OWHXXDO0DFTGCA&results=300';
    }
    else if (type = "week") {
      url = 'https://api.thingspeak.com/channels/1297821/feeds.json?api_key=Q5OWHXXDO0DFTGCA&days=7'
    }

    const response = await fetch(url)
    if (!response.ok) {
      // NOT res.status >= 200 && res.status < 300
      return { statusCode: response.status, body: response.statusText }
    }
    const data = await response.json()

    return {
      statusCode: 200,
      body: JSON.stringify(data),
    }
  } catch (error) {
    // output to netlify function log
    console.log(error)
    return {
      statusCode: 500,
      // Could be a custom message or object i.e. JSON.stringify(err)
      body: JSON.stringify({ msg: error.message }),
    }
  }
}

module.exports = { handler }
