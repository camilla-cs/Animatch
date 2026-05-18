import React, {useState} from "react";
import SearchIcon from '@mui/icons-material/Search';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import {Link} from "react-router-dom"




function AnimeSearch () {
    const [searchQuery, setSearchQuery] = useState("");
    const [genre, setGenre] = useState(""); 
    const[year, setYear]= useState("");  
    const [animeList, setAnimeList] = useState([]); 
    const [recommendations, setRecommendations] = useState([]); 
    const [error, setError] = useState(null);
    const [loading, setLoading]= useState(false); 

    // search anime by title
    const handleSearch = async (e) => {
        e.preventDefault(); 
        setLoading (true); 
        setError(null); 

        try {
            const response = await fetch(`https://api.jikan.moe/v4/anime?q=${searchQuery}&limit=10`);
            if (!response.ok) {
                throw new Error ("Failed to fetch anime"); 
            }

            const data = await response.json(); 
            setAnimeList (data.data || []); 
        } catch (error) {
            setError (error.message);
        } finally {
            setLoading(false); 
        }
    };

    // filter anime search 
    const handleFilter = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
        
          let url = `https://api.jikan.moe/v4/anime?`;

            if (genre) url += `genres=${genre}&`;

            if (year) url += `start_date=${year}-01-01&end_date=${year}-12-31&`;

            const response = await fetch(url);

        const data = await response.json();
        console.log("Filtered anime data:" , data);
        setAnimeList(data.data || []); 

    } catch (error) {
        setError(error.message); 
    } finally {
        setLoading(false); 
    }
    }; 

   
    const fetchRecommendations = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
        // STEP 1: Search for the anime to get the correct MAL ID
        const searchRes = await fetch(`https://api.jikan.moe/v4/anime?q=${searchQuery}&limit=1`);
        const searchData = await searchRes.json();

        if (!searchData.data || searchData.data.length === 0) {
            throw new Error("Anime not found. Please check the spelling.");
        }

        const animeId = searchData.data[0].mal_id;

        // STEP 2: Use that ID to get recommendations
        const recRes = await fetch(`https://api.jikan.moe/v4/anime/${animeId}/recommendations`);
        
        if (!recRes.ok) {
            throw new Error("Failed to fetch recommendations for this title.");
        }

        const recData = await recRes.json();
        
        // Jikan returns an array in data.data
        setRecommendations(recData.data || []);

    } catch (error) {
        setError(error.message);
    } finally {
        setLoading(false);
    }
};

    return (
        <div>
           
            <div className="discover-wrapper">
                <div className="discover-form-container">

                    <h3>🧿 𝒟𝒾𝓈𝒸ℴ𝓋ℯ𝓇 𝒜𝓃𝒾𝓂ℯ 🍥</h3>

                    {/* search anime by title */}
                    <form onSubmit={handleSearch}>
                        <input className="input-button" type="anime" placeholder="Type anime title... " value={searchQuery} onChange={(e)=> setSearchQuery(e.target.value)}/>
                        <Tooltip title="Search" arrow>
                            <IconButton type="submit" className="search-button" type="search">
                            
                            <SearchIcon/>
                        
                            </IconButton>
                        </Tooltip>

                    </form>

                    <form onSubmit={handleFilter}>
                    
                        <select value={genre} onChange={(e) => setGenre(e.target.value)}>
                            <option value="">Select genre</option>
                            <option value="1">Action</option>
                            <option value="2">Adventure</option>
                            <option value="5">Avant Garde</option>
                            <option value="46">Award Winning</option>
                            <option value="28">Boys Love</option>
                            <option value="4">Comedy</option>
                            <option value="8">Drama</option>
                            <option value="10">Fantasy</option>
                            <option value="26">Girls Love</option>
                            <option value="47">Gourmet</option>
                            <option value="14">Horror</option>
                            <option value="7">Mystery</option>
                            <option value="22">Romance</option>
                            <option value="24">Sci-Fi</option>
                            <option value="36">Slice of Life</option>
                            <option value="30">Sports</option>
                            <option value="37">Supernatural</option>
                            <option value="41">Suspence</option>
                            <option value="9">Ecchi</option>
                            <option value="49">Erotica</option>
                            <option value="12">Hentai</option>
                            <option value="50">Adult Cast</option>
                            <option value="51">Antropomorphic</option>
                            <option value="52">CGDCT</option>
                            <option value="53">Childcare</option>
                            <option value="54">Combat Sports</option>
                            <option value="81">Crossdressing</option>
                            <option value="55">Delinquents</option>
                            <option value="39">Detective</option>
                            <option value="56">Educational</option>
                            <option value="57">Gag Humor</option>
                            <option value="58">Gore</option>
                            <option value="35">Harem</option>
                            <option value="59">High Stackes Game</option>
                            <option value="13">Historical</option>
                            <option value="60">Idols (Female)</option>
                            <option value="61">Idols (Male)</option>
                            <option value="62">Isekai</option>
                            <option value="63">Iyashikei</option>
                            <option value="64">Love Polygon</option>
                            <option value="65">Magical Sex Shift</option>
                            <option value="66">Mahou Shoujo</option>
                            <option value="17">Martial Arts</option>
                            <option value="18">Mecha</option>
                            <option value="67">Medical</option>
                            <option value="38">Military</option>
                            <option value="19">Music</option>
                            <option value="6">Mythology</option>
                            <option value="68">Organized Crime</option>
                            <option value="69">Otaku Culture</option>
                            <option value="20">Parody</option>
                            <option value="70">Performing Arts</option>
                            <option value="71">Pets</option>
                            <option value="40">Psychological</option>
                            <option value="3">Racing</option>
                            <option value="72">Reincarnation</option>
                            <option value="73">Reverse Harem</option>
                            <option value="74">Love Status Quo</option>
                            <option value="21">Samurai</option>
                            <option value="23">School</option>
                            <option value="75">Showbiz</option>
                            <option value="29">Space</option>
                            <option value="11">Strategy Game</option>
                            <option value="31">Super Power</option>
                            <option value="76">Survival</option>
                            <option value="77">Team Sports</option>
                            <option value="78">Time Travel</option>
                            <option value="32">Vampire</option>
                            <option value="79">Video Game</option>
                            <option value="80">Visual Arts</option>
                            <option value="48">Workplace</option>
                            <option value="82">Urban Fantasy</option>
                            <option value="83">Villainess</option>
                            <option value="43">Josei</option>
                            <option value="15">Kids</option>
                            <option value="42">Seinen</option>
                            <option value="25">Shoujo</option>
                            <option value="27">Shounen</option>
                        </select>
                        
                            
                        <button className="filter-button" type="filter" onClick={handleFilter}>Filter</button>
                    </form>
                
                    <form onSubmit={fetchRecommendations}>
                        <input className="input-button" type="text" placeholder="Type anime title for recommendations ..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}/>
                        <button className="recs-button"type="recommendations">Get recommendations ✨</button>
                    </form>
                
                

                    {loading && <p>Loading...</p>}
                    {error && <p className="error">{error}</p>}

                    <div className="anime-results">
                        {animeList.length > 0 ? (
                        animeList.map((anime, index) => {
                            if (!anime?.mal_id || !anime?.images?.jpg?.image_url || !anime?.title) {
                                return null; // Skip invalid entries without logging every time
                            }

                            return (
                            // every key is unique even if duplicate values in jikan api exist so two different anime with the same key value won't appear in the search result. 
                            <div key={`${anime.mal_id}-${index}`} className="anime-card">
                                <img src={anime.images.jpg.image_url} alt={anime.title} />
                                <h4>{anime.title}</h4>
                                <h5>{anime.title_japanese}</h5>
                                <p>{anime.type}</p>
                                <p>{anime.aired.string}</p>
                                <p>{anime.synopsis}</p>
                            </div>
                            );
                        })
                        ) : (
                        !loading && <p></p>
                        )}
                    </div>

                    <div className="anime-results">
                            {recommendations.length > 0 &&
                                recommendations.map((anime, index) => (
                                    <div key={`${anime.entry.mal_id}-${index}`} className="anime-card">
                                        <img src={anime.entry.images.jpg.image_url} alt={anime.entry.title} />
                                        <h4>{anime.entry.title}</h4>
                                        
                                        

                                    </div>
                                ))}
                    </div>



                </div>
            </div>


            
        </div>
    ); 
}

export default AnimeSearch; 