import { BrowserRouter, Route,Routes } from 'react-router-dom';
import './App.css'
import AnimeSearch from './components/animeSearch'
import './components/animeSearch.css'

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
