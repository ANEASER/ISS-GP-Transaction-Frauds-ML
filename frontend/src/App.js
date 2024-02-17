import React, { useState } from 'react';
import axios from 'axios';

import './App.css';

function App() {
  const [formData, setFormData] = useState({
    amount: 0,
    nameDest: "M2044282225",
    type: 0, // Change the state property name to 'type'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Ensure that numeric inputs are parsed as numbers
    const updatedValue = name.includes('balance') ? parseFloat(value) : value;

    // Update formData directly without referencing previous state
    setFormData({
      ...formData,
      [name]: updatedValue,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:4000/send-post-request', formData);

      console.log('Response from express server:', response.data);
    } catch (error) {
      console.error('Error sending POST request:', error.message);
    }
  };

  return (
    <div className="App">
      <form onSubmit={handleSubmit}>
        <label>
          amount:
          <input type="number" name="amount" value={formData.amount} onChange={handleChange} />
        </label>
        <br />
        <label>
          nameDest:
          <input type="text" name="nameDest" value={formData.nameDest} onChange={handleChange} />
        </label>
        <br />
        <label>
          Payment Type
        </label>
        <select name='type' value={formData.type} onChange={handleChange}>
          <option value="0">PAYMENT</option>
          <option value="1">Debit</option>
          <option value="2">TRANSFER</option>
        </select>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default App;
