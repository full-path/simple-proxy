const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser')

const app = express();
const PORT = process.env.PORT || 3000;
const TARGET_URL = process.env.TARGET_URL;

app.use(bodyParser.text({type:'*/*'}));

function constructApiUrl(query, baseUrl) {
  const queryString = new URLSearchParams(query).toString();
  return `${baseUrl}${queryString ? `?${queryString}` : ''}`;
}

function handleSuccessResponse(res, targetResponse) {
  console.log(targetResponse.data)
  let status
  if (typeof targetResponse.data === 'object') {
    status = targetResponse.data.status
  } else {
    try {
      const responseData = JSON.parse(targetResponse)
      status = responseData.data.status
    } catch (e) {
      res.status(400).send(targetResponse.data);
      return
    }
  }
  if (status !== 'OK') {
    const statusCode = parseInt(status)
    if (statusCode) {
      res.status(statusCode).send(targetResponse.data);
    } else {
      res.status(400).send(targetResponse.data);
    }
  } else {
    res.status(targetResponse.status).send(targetResponse.data);
  }
}

function handleErrorResponse(res, error) {
  console.error('Error:', error);
  res.status(500).send({ error: 'Internal Server Error' });
}

function urlQueryString(params) {
  try {
    const keys = Object.keys(params)
    const result = keys.map((key) => {
      return key + "=" + encodeURIComponent(params[key])
    }).join("&")
    return result
  } catch(e) { console.error('Error:', e) }
}

app.get('*', async (req, res) => {
  try {
    const { query } = req;
    const apiUrl = constructApiUrl(query, TARGET_URL);

    axios.get(apiUrl)
      .then(targetResponse => handleSuccessResponse(res, targetResponse))
      .catch(e => handleErrorResponse(res, e));
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send({ error: 'Internal Server Error' });
  }
});

async function proxyRequest(req, res) {
  try {
    const { headers, path } = req;
    const authorizationHeader = headers.authorization;

    const params = {
      authorization: authorizationHeader,
      endpointPath: path,
    };

    const queryString = urlQueryString(params);
    const apiUrl = `${TARGET_URL}?${queryString}`;

    console.log('Forwarding POST to ', apiUrl);
    console.log('Message body: ', req.body)

    axios.post(apiUrl, req.body)
      .then((targetResponse) => handleSuccessResponse(res, targetResponse))
      .catch((e) => handleErrorResponse(res, e));
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send({ error: 'Internal Server Error' });
  }
}

app.post('/v1/TripRequestResponse', async (req, res) => {
  proxyRequest(req, res);
});

app.post('/v1/TripRequest', async (req, res) => {
  proxyRequest(req, res)
});

app.post('/v1/ClientOrderConfirmation', async (req, res) => {
  proxyRequest(req, res)
});

app.post('/v1/CustomerReferral', async (req, res) => {
  proxyRequest(req, res)
});

app.post('/v1/CustomerReferralResponse', async (req, res) => {
  proxyRequest(req, res)
});

app.post('/v1/TripStatusChange', async (req, res) => {
  proxyRequest(req, res)
});

app.post('/v1/ProviderOrderConfirmation', async (req, res) => {
  proxyRequest(req, res)
});

app.post('/v1/TripTaskCompletion', async (req, res) => {
  proxyRequest(req, res)
});

app.post('*', async (req, res) => {
  try {
    res.status(400).send({ error: 'Endpoint not supported' })
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send({ error: 'Internal Server Error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

