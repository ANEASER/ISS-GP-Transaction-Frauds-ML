import React, { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import './App.css';

function App() {
  const [formData, setFormData] = useState({
    amount: 0,
    type: 0, 
  });

  const handleChange = (e) => {
    const { name, value } = e.target;


    const updatedValue = name.includes('amount') ? parseFloat(value) : value;

    
    setFormData({
      ...formData,
      [name]: updatedValue,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:4000/send-post-request', formData);
      if (response.status === 200) {
        console.log('Response from express server:', response.data);

        if (response.data.prediction[0] === 1) {
          Swal.fire({
            icon: 'warning',
            title: 'Fraud Transaction',
            text: 'This is a fraud transaction!',
          });
        } else if (response.data.prediction[0] === 0){
          Swal.fire({
            icon: 'success',
            title: 'Genuine Transaction',
            text: 'This is a genuine transaction.',
          });
        } else {
          console.error('Invalid prediction value:', response.data.prediction);
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: `Invalid prediction value: ${response.data.prediction}`,
          });
        }
      } else {
        console.error('Failed to send POST request:', response.status);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: `Failed to send POST request. Status: ${response.status}`,
        });
      }
    } catch (error) {
      console.error('Error sending POST request:', error.message);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: `Error sending POST request. ${error.message}`,
      });
    }
  };

  return (
    <div className="App">
      <form onSubmit={handleSubmit}>
        <label>
          Amount:
          <input type="number" name="amount" value={formData.amount} onChange={handleChange} />
        </label>
        <br />
        <label>
          Name Destination:
          <input type="text" name="nameDest" value={formData.nameDest} onChange={handleChange} />
        </label>
        <br />
        <label>
          Payment Type:
        </label>
        <select name='type' value={formData.type} onChange={handleChange}>
          <option value="0">PAYMENT</option>
          <option value="1">Debit</option>
          <option value="2">TRANSFER</option>
          <option value="3">CASH_OUT</option>
          <option value="4">CASH_IN</option>
        </select>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default App;
