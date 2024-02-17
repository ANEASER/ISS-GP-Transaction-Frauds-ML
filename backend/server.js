const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const port = 4000;

app.use(express.json());
app.use(cors());

app.post('/send-post-request', async (req, res) => {
  try {
    let formData = req.body;

    const additionalData = require('./additionalData.json');

    formData = { ...formData, ...additionalData };

    const apiUrl = 'http://127.0.0.1:8000/predict/';

    const response = await axios.post(apiUrl, formData);

    if (response.status !== 200) {
      throw new Error('Failed to send POST request to the prediction server');
    }
    else {
      res.status(200).json(response.data);
    }

  } catch (error) {
    console.error('Error handling POST request:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
