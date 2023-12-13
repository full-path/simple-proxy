const express = require('express');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;
const TARGET_URL = process.env.TARGET_URL

app.use(express.json());

app.post('*', async (req, res) => {
  try {
    const { query, headers } = req;
    const originalUrl = req.originalUrl;

    // Include X-Original-URL header in the request to the target API
    const axiosConfig = {
      headers: {
        ...headers,
        'X-Original-URL': originalUrl,
      },
    };

    const targetResponse = await axios.post(`${TARGET_URL}${originalUrl}`, query, axiosConfig);

    // Send back the response from the target API
    res.status(targetResponse.status).send(targetResponse.data);
  } catch (error) {
    res.status(500).send({ error: 'Internal Server Error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});


