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

    let amount = parseInt(formData.amount);

    let oldbalanceOrg =  15;
    let oldbalanceDest =  20;
    
    let newbalanceOrig =  oldbalanceOrg - amount;
    let newbalanceDest =  oldbalanceDest + amount;

    const additionalData = {
      oldbalanceOrg: oldbalanceOrg,
      newbalanceOrig: newbalanceOrig,
      oldbalanceDest: oldbalanceDest,
      newbalanceDest: newbalanceDest,
    };

    console.log('Additional Data:', additionalData);

    formData = { ...formData, ...additionalData };

    console.log('Received POST request data from React:', formData);

    const apiUrl = 'http://127.0.0.1:8000/predict/';

    const response = await axios.post(apiUrl, formData);

    console.log('Response from the Python endpoint:', response.data);

    res.status(200).json(response.data);
  } catch (error) {
    console.error('Error handling POST request:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
