import './App.css';
import React from 'react';
import {Routes,Route} from "react-router-dom"
import Home from './pages/Home';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/h" element={<h1>Hello World1</h1>} />
      </Routes>
    </div>
  );
}

export default App;
