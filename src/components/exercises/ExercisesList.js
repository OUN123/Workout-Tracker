import React, { Component } from "react";
import { Link } from "react-router-dom";
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow
} from "@material-ui/core";
import axios from "axios";

export default class ExercisesList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      exercises: []
    };
  }

  componentDidMount() {
    const config = {
      headers: {
        'Authorization': 'Bearer ' + localStorage.getItem('token')
      }
    };
  
    axios.get('http://localhost:5000/exercises', config)
      .then(response => {
        if (Array.isArray(response.data)) {
          console.log('Fetched exercises:', response.data);
          this.setState({ exercises: response.data });
        } else {
          console.error('Unexpected response format:', response.data);
        }
      })
      .catch((error) => {
        console.error('Error fetching exercises:', error);
      });
  }
  
  

  fetchExercises = () => {
    const config = {
      headers: {
        'Authorization': 'Bearer ' + localStorage.getItem('token')
      }
    };
    axios.get("http://localhost:5000/exercises", config)
      .then(response => {
        this.setState({ exercises: response.data });
      })
      .catch(error => console.log(error));
  }

  deleteExercise = (id) => {
    const config = {
      headers: {
        'Authorization': 'Bearer ' + localStorage.getItem('token')
      }
    };
    axios.delete(`http://localhost:5000/exercises/${id}`, config)
      .then(response => {
        console.log(response.data);
        this.setState({
          exercises: this.state.exercises.filter(el => el._id !== id)
        });
      })
      .catch(error => console.log(error));
  }

  exerciseList = () => {
    return this.state.exercises.map(currentExercise => (
      <TableRow key={currentExercise._id}>
        <TableCell>{currentExercise.description}</TableCell>
        <TableCell>{currentExercise.duration}</TableCell>
        <TableCell>{currentExercise.date.substring(0, 10)}</TableCell>
        <TableCell>
          <Link to={"/edit/" + currentExercise._id}>
            <Button variant="outlined">Edit</Button>
          </Link>
          <Button variant="outlined" color="secondary" onClick={() => this.deleteExercise(currentExercise._id)}>
            Delete
          </Button>
        </TableCell>
      </TableRow>
    ));
  }

  render() {
    return (
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Description</TableCell>
            <TableCell>Duration</TableCell>
            <TableCell>Date</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {this.exerciseList()}
        </TableBody>
      </Table>
    );
  }
}
