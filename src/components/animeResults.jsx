import AnimeSearch from "./animeSearch";
import './animeSearch.css';


const AnimeResults = ({ results }) => {
    return (
        <div className="anime-results"> 
            {results.map((anime) => (
                <div key={anime.mal_id} className="anime-card">
                    <img src={anime.images.jpg.image_url} alt={anime.title} className="anime-image" />
                    <h3 className="anime-title">{anime.title}</h3>  
                </div>
            ))}
        </div>
    );
}   
export default AnimeResults;
