const express = require('express');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;
const TARGET_URL = process.env.TARGET_URL

app.use(express.json());

app.all('*', async (req, res) => {
  try {
    const { query, headers, method, originalUrl, body } = req;

    // Include X-Original-URL header in the request to the target API
    const axiosConfig = {
      headers: {
        ...headers,
        'X-Original-URL': originalUrl,
      },
      method,
      data: body
    };

    console.log(axiosConfig);

    const targetResponse = await axios(`${TARGET_URL}${originalUrl}`, axiosConfig);

    console.log('Target Response');
    console.log(targetResponse)

    // Send back the response from the target API
    res.status(targetResponse.status).send(targetResponse.data);
  } catch (error) {
    console.log(error)
    res.status(500).send({ error: 'Internal Server Error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});


