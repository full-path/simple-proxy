const express = require('express');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;
const TARGET_URL = process.env.TARGET_URL;

app.use(express.json());

function constructApiUrl(query, baseUrl) {
  const queryString = new URLSearchParams(query).toString();
  return `${baseUrl}${queryString ? `?${queryString}` : ''}`;
}

function handleSuccessResponse(res, targetResponse) {
  res.status(targetResponse.status).send(targetResponse.data);
}

function handleErrorResponse(res, error) {
  console.error('Error:', error);
  res.status(500).send({ error: 'Internal Server Error' });
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

app.post('*', async (req, res) => {
  try {
    const { query, body } = req;
    const apiUrl = constructApiUrl(query, TARGET_URL);

    axios.post(apiUrl, body)
      .then(targetResponse => handleSuccessResponse(res, targetResponse))
      .catch(e => handleErrorResponse(res, e));
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send({ error: 'Internal Server Error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

