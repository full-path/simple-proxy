const express = require('express');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;
const TARGET_URL = process.env.TARGET_URL

app.use(express.json());

app.all('*', async (req, res) => {
  try {
    const { query, headers, method, originalUrl, body } = req;

    //const queryString = new URLSearchParams(query).toString();

    // Construct the URL with query parameters appended to TARGET_URL
    //const apiUrl = `${TARGET_URL}${queryString ? `?${queryString}` : ''}`;

    const axiosConfig = {
      method,
      data: body
    };
    
    console.log(axiosConfig);

    const targetResponse = await axios(TARGET_URL, axiosConfig);

    console.log('Target Response');
    console.log(targetResponse);

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


