import { useState } from 'react'; 
import './animeSearch.css';
import AnimeResults from './animeResults';

const AnimeSearch = ({ onSearch }) => {
  const [query, setQuery] = useState('');   
    const handleSubmit = (e) => {
        e.preventDefault();
        onSearch(query);
    };  
    
    return (
        <form onSubmit={handleSubmit} className="anime-search">
            <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search for anime..."
            />
            <button type="submit">Search</button>
        </form>
    

    );
}; 
   

export default AnimeSearch;

