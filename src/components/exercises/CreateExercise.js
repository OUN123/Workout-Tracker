import React, { Component } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";

class CreateExercise extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "", 
      description: "",
      duration: 0,
      date: new Date(),
      users: []
    };
  }

  componentDidMount() {
    this.setState({
      users: ['test user'], 
      username: 'test user' 
    });
  }

  onChangeDescription = (e) => {
    this.setState({
      description: e.target.value
    });
  };

  onChangeDuration = (e) => {
    this.setState({
      duration: e.target.value
    });
  };

  onChangeDate = (date) => {
    this.setState({
      date: date
    });
  };

  onSubmit = (e) => {
    e.preventDefault();
    const exercise = {
      username: this.state.username,
      description: this.state.description,
      duration: this.state.duration,
      date: this.state.date
    };

    console.log(exercise);

    const config = {
      headers: {
        'Authorization': 'Bearer ' + localStorage.getItem('token')
      }
    };

    axios.post('http://localhost:5000/exercises/add', exercise, config)
      .then(res => console.log(res.data))
      .catch(err => console.error(err));

    window.location = '/'; 
  };

  render() {
    return (
      <div>
        <h3>Create New Exercise Log</h3>
        <form onSubmit={this.onSubmit}>
          {/* ... your other form fields ... */}
          <div className="form-group">
            <label>Description: </label>
            <input type="text"
                   required
                   className="form-control"
                   value={this.state.description}
                   onChange={this.onChangeDescription}
            />
          </div>
          <div className="form-group">
            <label>Duration (in minutes): </label>
            <input 
                   type="text" 
                   className="form-control"
                   value={this.state.duration}
                   onChange={this.onChangeDuration}
            />
          </div>
          <div className="form-group">
            <label>Date: </label>
            <div>
              <DatePicker
                  selected={this.state.date}
                  onChange={this.onChangeDate}
              />
            </div>
          </div>

          <div className="form-group">
            <input type="submit" value="Create Exercise Log" className="btn btn-primary" />
          </div>
        </form>
      </div>
    );
  }
}

export default CreateExercise;
