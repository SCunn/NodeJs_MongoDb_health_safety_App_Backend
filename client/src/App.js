// import React from 'react';
import React, { Component } from 'react';
import { BrowserRouter as Router,  Route } from "react-router-dom";
import Header from './components/structure/Header';
import Dashboard from './components/pages/Dashboard';
import Employees from './components/pages/Employees';
import Equipment from './components/pages/Equipment';
import Elearning from './components/pages/Elearning';
import AddEmployee from './components/pages/employee-components/AddEmployee';
import Login from './components/Login';
import Register from './components/Register';
import ShowEmployee from './components/pages/employee-components/ShowEmployee';
import EditEmployee from './components/pages/employee-components/EditEmployee';
import AddEquipment from './components/pages/asset-components/AddAsset';
import ShowAsset from './components/pages/asset-components/ShowAsset';
import EditAsset from './components/pages/asset-components/EditAsset';

import './App.css';

class App extends Component {


  render() {
    return (
      <div>
        <Router>
          <Header />
          <Route exact path="/" component={Dashboard} />
          <Route exact path="/employees" component={Employees} />
          <Route exact path="/employees/add" component={AddEmployee} />
          <Route exact path="/equipment" component={Equipment} />
          <Route exact path="/elearning" component={Elearning} />
          <Route path='/login' component={Login} />
          <Route path='/register' component={Register} />
          <Route path='/show/:id' component={ShowEmployee} />
          <Route path='/show_asset/:id' component={ShowAsset} />
          <Route path='/edit_asset/:id' component={EditAsset} />
          <Route path='/edit/:id' component={EditEmployee} />
          <Route path='/equipment/add' component={AddEquipment} />
        </Router>
      </div>
    );
  }
}



 export default App;

