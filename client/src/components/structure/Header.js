import React, { Component } from 'react';
import { NavLink} from "react-router-dom";
import './header.css'

class Header extends Component {
  logout = () => {
    localStorage.removeItem('jwtToken');
    window.location.reload();
  }
    render() {
        return(
<nav className="navbar navbar-expand-lg main-header">
<NavLink to="/" activeClassName='active' exact>RCW</NavLink>
  <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
    <span className="navbar-toggler-icon"></span>
  </button>

  <div className="collapse navbar-collapse" id="navbarSupportedContent">
    <ul className="navbar-nav ml-auto">
      <li className="nav-item active">
        <NavLink to="/" activeClassName='active' exact>Dashboard</NavLink>
      </li>
      <li className="nav-item">
      <NavLink to="/employees" activeClassName='active'>Employees</NavLink>
      </li>
      <li className="nav-item">
        <NavLink to="/equipment" activeClassName='active'>Equipment</NavLink>
      </li>
      <li className="nav-item">
      <NavLink to="/elearning" activeClassName='active'>eLearning</NavLink>
      </li>
      <li className="nav-item account-info">
        {localStorage.getItem('jwtToken') &&
                  <button className="btn btn-primary" onClick={this.logout}>Logout</button>
        }
      </li>
    </ul>
  </div>
</nav>
        );
    }

}

export default Header;