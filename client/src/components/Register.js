import React, { Component } from 'react';
import axios from 'axios';
import './Login.css';

class Register extends Component {

  constructor() {
    super();
    this.state = {
      name: '',
      password: '',
      email: '',
      role: 'employee',
      feedback: '',
      feedbackMessage: ''
    };
  }
  onChange = (e) => {
    const state = this.state
    state[e.target.name] = e.target.value;
    this.setState(state);
  }

  onSubmit = (e) => {
    e.preventDefault();

    const { name, email, password, role } = this.state;
    console.log(this.state);
    axios.post('/auth/register', { name, email, password, role })
      .then((result) => {
        console.log('role',role);
      switch (role) {
        case 'employee':
          this.setState({
            feedbackMessage: 'you have successfully regsitered as an employee, please click here to continue',
          })
        break;
        case 'employer':
          this.setState({
            feedbackMessage: 'you have successfully regsitered as an employer, please click here to continue',
          })
        break;
        case 'admin':
          this.setState({
            feedbackMessage: 'you have successfully regsitered as an admin, please click here to continue',
          })
        break;
        case 'institute':
          this.setState({
            feedbackMessage: 'you have successfully regsitered as an institute, please click here to continue',
          })
        // expected output: "Mangoes and papayas are $2.79 a pound."
        break;
        default:
          this.setState({
            feedback: 'success',
            feedbackMessage: 'user created',
          })
      }
        //this.props.history.push("/login")
        this.setState({
        })
      })
      .catch((response) => {
        console.log("error", response);
        this.setState({
          feedback: 'success',
          feedbackMessage: response
        })

      });
  }

  render() {
    const { name, email, password, role } = this.state;
    let message;
    if(this.state.feedback === "success"){
        message = <div className="alert alert-success" data-role="alert">
            {this.state.feedbackMessage}
        </div>
    }
    else if(this.state.feedback === "error"){
        message = <div className="alert alert-danger" data-role="alert">
            {this.state.feedbackMessage}
        </div>
    }
    return (
      
      <div className="container">
        <form className="form-signin" onSubmit={this.onSubmit}>
          <h2 className="form-signin-heading">Register Now</h2>
          <label htmlFor="name">User Name:</label>
          <input type="text" className="form-control" placeholder="name" name="name" value={name} onChange={this.onChange} required/>
          <label htmlFor="inputPassword">Email: </label>
          <input type="text" className="form-control" placeholder="email" name="email" value={email} onChange={this.onChange} required/>
          <label htmlFor="inputPassword">Password: </label>
          <input type="password" className="form-control" placeholder="Password" name="password" value={password} onChange={this.onChange} required/>
          <label htmlFor="inputRole">Role</label>
            <select name="role" onChange={this.onChange} defaultValue={role}>
                <option value="employee">Employee</option>
                <option value="employer">employer</option>
                <option value="admin">Admin</option>
                <option value="institute">Institute</option>

            </select>         
              <br />
          <button className="btn btn-lg btn-primary btn-block" type="submit">Register</button>
        </form>
        <div className ="row">
                    <div className="response-message">
                        {message}
                    </div>
                </div>
      </div>
    );
  }
}

export default Register;