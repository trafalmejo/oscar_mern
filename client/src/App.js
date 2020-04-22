import React from 'react';
import AppNavbar from './components/AppNavbar'
import ProjectList from './components/ProjectList'
import ProjectModal from './components/ProjectModal'
import {Container} from 'reactstrap'
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

import {Provider} from 'react-redux'
import store from './store'


function App() {
  return (
    <Provider store={store}>
    <div className="App">
      <AppNavbar/>
      <Container>
      <ProjectModal/>
      <ProjectList/>
      </Container>
    </div>
    </Provider>
  );
}

export default App;
