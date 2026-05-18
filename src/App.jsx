import { BrowserRouter, Route,Routes } from 'react-router-dom';
import './App.css'
import AnimeSearch from './components/animeSearch'
import React from 'react';
import '../src/index.css';



function App() {
  return (
   
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AnimeSearch />} />
      </Routes>
    </BrowserRouter>  


  )
}

export default App
