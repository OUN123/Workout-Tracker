import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, TextField, Typography } from '@material-ui/core';
import axios from 'axios';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const EditExercise = () => {
  const [exercise, setExercise] = useState({
    description: '',
    duration: 0,
    date: new Date(),
  });
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`http://localhost:5000/exercises/${id}`)
      .then(response => {
        setExercise({
          description: response.data.description,
          duration: response.data.duration,
          date: new Date(response.data.date)
        });
      })
      .catch((error) => console.log(error));
  }, [id]);

  const handleInputChange = (e) => {
    setExercise({ ...exercise, [e.target.name]: e.target.value });
  };

  const handleDateChange = (date) => {
    setExercise({ ...exercise, date: date });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const config = {
      headers: {
        'Authorization': 'Bearer ' + localStorage.getItem('token')
      }
    };

    axios.put(`http://localhost:5000/exercises/update/${id}`, exercise, config)
      .then(response => {
        console.log(response.data);
        navigate('/'); // Redirect back to the list of exercises
      })
      .catch(err => {
        console.error(err);
      });
  };

  return (
    <div>
      <Typography variant="h6">Edit Exercise</Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          name="description"
          label="Description"
          value={exercise.description}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
        />
        <TextField
          name="duration"
          label="Duration (in minutes)"
          value={exercise.duration}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
          type="number"
        />
        <DatePicker
          label="Date"
          value={exercise.date}
          onChange={handleDateChange}
          renderInput={(params) => <TextField {...params} />}
        />
        <Button variant="contained" color="primary" type="submit">
          Update
        </Button>
      </form>
    </div>
  );
};

export default EditExercise;
