import React from 'react';
import { Link } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import LogoutButton from './LogoutButton';

const useStyles = makeStyles({
  nav: {
    backgroundColor: "#464159",
  },
  link: {
    color: "white",
    textDecoration: "none",
  },
  toolbar: {
    display: "flex",
    justifyContent: "space-between",
  },
});

const Navbar = () => {
  const classes = useStyles();
  const isLoggedIn = localStorage.getItem('token');

  return (
    <AppBar className={classes.nav} position="static">
      <Toolbar className={classes.toolbar}>
        <Typography variant="h6">Exercise Tracker</Typography>
        <div>
          <Link className={classes.link} to="/">
            <Button color="inherit">Exercises</Button>
          </Link>
          {isLoggedIn ? (
            <>
              <Link className={classes.link} to="/create">
                <Button color="inherit">Add Exercise</Button>
              </Link>

              <Link className={classes.link} to="/stats">
                <Button color="inherit">MonthlyExerciseStats</Button>
              </Link>
              <LogoutButton />
            </>
          ) : (
            <>
              <Link className={classes.link} to="/login">
                <Button color="inherit">Login</Button>
              </Link>
              <Link className={classes.link} to="/register">
                <Button color="inherit">Register</Button>
              </Link>
            </>
          )}
        </div>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
