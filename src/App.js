import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Container, Paper } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import Navbar from './components/layout/Navbar';
import ExercisesList from './components/exercises/ExercisesList';
import EditExercise from './components/exercises/EditExercise';
import CreateExercise from './components/exercises/CreateExercise';
import LoginForm from './components/auth/LoginForm';
import RegistrationForm from './components/auth/RegistrationForm';
import PrivateRoute from './components/routes/PrivateRoute';
import { AuthProvider } from './components/auth/AuthContext';
import MonthlyExerciseStats from './components/exercises/MonthlyExerciseStats';

// Define App before using it in ReactDOM.render
const useStyles = makeStyles({
  main: {
    marginTop: '85px',
    padding: '20px',
    minHeight: '60vh',
  },
});

const App = () => {
  const classes = useStyles();

  return (
    // No need for another <Router>, as you have already wrapped <App /> with <Router> in ReactDOM.render
    <>
      <Navbar />
      <Container>
        <Paper className={classes.main} square>
          <Routes>
            <Route path="/stats" element={<MonthlyExerciseStats />} /> 
            <Route path="/" element={<ExercisesList />} />
            <Route path="/edit/:id" element={<PrivateRoute><EditExercise /></PrivateRoute>} />
            <Route path="/create" element={<PrivateRoute><CreateExercise /></PrivateRoute>} />
            <Route path="/login" element={<LoginForm />} />
            <Route path="/register" element={<RegistrationForm />} />
          </Routes>
        </Paper>
      </Container>
    </>
  );
};

// Now ReactDOM.render can access the App since it's defined above
ReactDOM.render(
  <React.StrictMode>
    <Router>
      <AuthProvider>
        <App />
      </AuthProvider>
    </Router>
  </React.StrictMode>,
  document.getElementById('root')
);

export default App;