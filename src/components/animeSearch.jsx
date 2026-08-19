import React, { useState } from "react";
import SearchIcon from "@mui/icons-material/Search";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import "../components/animeSearch.css";

const API_URL = "https://api.tenrai.org/v1";

function AnimeSearch() {
    const [searchQuery, setSearchQuery] = useState("");
    const [genre, setGenre] = useState("");
    const [year, setYear] = useState("");
    const [animeList, setAnimeList] = useState([]);
    const [recommendations, setRecommendations] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    // Search anime by title
    const handleSearch = async (e) => {
        e.preventDefault();

        if (!searchQuery.trim()) {
            return;
        }

        setLoading(true);
        setError(null);
        setRecommendations([]);

        try {
            const response = await fetch(
                `${API_URL}/anime?q=${encodeURIComponent(
                    searchQuery
                )}&limit=10`
            );

            if (!response.ok) {
                throw new Error(
                    `Failed to fetch anime: ${response.status}`
                );
            }

            const data = await response.json();

            setAnimeList(data.data || []);
            setSearchQuery("");
        } catch (error) {
            console.error("Anime search error:", error);
            setError(error.message);
            setAnimeList([]);
        } finally {
            setLoading(false);
        }
    };

    // Filter anime by genre and year
    const handleFilter = async (e) => {
        e.preventDefault();

        setLoading(true);
        setError(null);
        setRecommendations([]);

        try {
            let url = `${API_URL}/anime?`;

            if (genre) {
                url += `genres=${genre}&`;
            }

            if (year) {
                url += `start_date=${year}-01-01&end_date=${year}-12-31&`;
            }

            const response = await fetch(url);

            if (!response.ok) {
                throw new Error(
                    `Failed to fetch anime: ${response.status}`
                );
            }

            const data = await response.json();

            console.log("Filtered anime data:", data);

            setAnimeList(data.data || []);
        } catch (error) {
            console.error("Anime filter error:", error);
            setError(error.message);
            setAnimeList([]);
        } finally {
            setLoading(false);
        }
    };

    // Get anime recommendations
    const fetchRecommendations = async (e) => {
    e.preventDefault();

    const query = searchQuery.trim().toLowerCase();

    if (!query) {
        return;
    }

    setLoading(true);
    setError(null);
    setAnimeList([]);
    setRecommendations([]);

    try {
        // Step 1: Search for the anime
        const searchRes = await fetch(
            `${API_URL}/anime?q=${encodeURIComponent(query)}&limit=10`
        );

        if (!searchRes.ok) {
            throw new Error(
                `Failed to search anime: ${searchRes.status}`
            );
        }

        const searchData = await searchRes.json();

        if (
            !searchData.data ||
            searchData.data.length === 0
        ) {
            throw new Error("Anime not found.");
        }

        // Step 2: Sort by popularity
        const sorted = searchData.data.sort(
            (a, b) => (b.members || 0) - (a.members || 0)
        );

        // Step 3: Find the most popular TV anime
        const bestMatch =
            sorted.find((anime) => anime.type === "TV") ||
            sorted[0];

        console.log("Best match:", bestMatch);

        // Step 4: Get recommendations
        const recRes = await fetch(
            `${API_URL}/anime/${bestMatch.mal_id}/recommendations`
        );

        if (!recRes.ok) {
            throw new Error(
                `Failed to fetch recommendations: ${recRes.status}`
            );
        }

        const recData = await recRes.json();

        if (
            !recData.data ||
            recData.data.length === 0
        ) {
            throw new Error(
                `No thematic recommendations found for "${bestMatch.title}".`
            );
        }

        // Step 5: Get the full anime information
        // for each recommendation
        const detailedRecommendations = await Promise.all(
            recData.data
                .map(async (recommendation) => {

                    const malId =
                        recommendation?.entry?.mal_id;

                    if (!malId) {
                        return null;
                    }

                    try {
                        const detailRes = await fetch(
                            `${API_URL}/anime/${malId}`
                        );

                        if (!detailRes.ok) {
                            console.warn(
                                `Could not fetch anime ${malId}: ${detailRes.status}`
                            );

                            return null;
                        }

                        const detailData =
                            await detailRes.json();

                        return detailData.data;
                    } catch (error) {
                        console.warn(
                            `Failed to fetch anime ${malId}:`,
                            error
                        );

                        return null;
                    }
                })
        );

        // Remove failed requests
        const validRecommendations =
            detailedRecommendations.filter(
                (anime) => anime !== null
            );

        console.log(
            "Detailed recommendations:",
            validRecommendations
        );

        setRecommendations(
            validRecommendations
        );

        setSearchQuery("");

    } catch (error) {
        console.error(
            "Recommendation error:",
            error
        );

        setError(error.message);
    } finally {
        setLoading(false);
    }
};

    return (
        <div>
            <div className="discover-wrapper">
                <div className="discover-form-container">

                    <h1>Animatch</h1>

                    <h3>
                        🧿 𝒟𝒾𝓈𝒸ℴ𝓋ℯ𝓇 𝒜𝓃𝒾𝓂ℯ 🍥
                    </h3>

                    {/* Search anime by title */}
                    <form onSubmit={handleSearch}>
                        <input
                            className="input-button"
                            type="text"
                            placeholder="Type anime title..."
                            value={searchQuery}
                            onChange={(e) =>
                                setSearchQuery(
                                    e.target.value
                                )
                            }
                        />

                        <Tooltip
                            title="Search"
                            arrow
                        >
                            <IconButton
                                type="submit"
                                className="search-button"
                            >
                                <SearchIcon />
                            </IconButton>
                        </Tooltip>
                    </form>

                    {/* Filter anime */}
                    <form onSubmit={handleFilter}>

                        <select
                            value={genre}
                            style={{
                                fontFamily:
                                    "Pixelify Sans",
                                fontSize: "16px",
                            }}
                            onChange={(e) =>
                                setGenre(
                                    e.target.value
                                )
                            }
                        >
                            <option value="">
                                Select genre
                            </option>

                            <option value="1">
                                Action
                            </option>

                            <option value="2">
                                Adventure
                            </option>

                            <option value="5">
                                Avant Garde
                            </option>

                            <option value="46">
                                Award Winning
                            </option>

                            <option value="28">
                                Boys Love
                            </option>

                            <option value="4">
                                Comedy
                            </option>

                            <option value="8">
                                Drama
                            </option>

                            <option value="10">
                                Fantasy
                            </option>

                            <option value="26">
                                Girls Love
                            </option>

                            <option value="47">
                                Gourmet
                            </option>

                            <option value="14">
                                Horror
                            </option>

                            <option value="7">
                                Mystery
                            </option>

                            <option value="22">
                                Romance
                            </option>

                            <option value="24">
                                Sci-Fi
                            </option>

                            <option value="36">
                                Slice of Life
                            </option>

                            <option value="30">
                                Sports
                            </option>

                            <option value="37">
                                Supernatural
                            </option>

                            <option value="41">
                                Suspence
                            </option>

                            <option value="9">
                                Ecchi
                            </option>

                            <option value="49">
                                Erotica
                            </option>

                            <option value="12">
                                Hentai
                            </option>

                            <option value="50">
                                Adult Cast
                            </option>

                            <option value="51">
                                Antropomorphic
                            </option>

                            <option value="52">
                                CGDCT
                            </option>

                            <option value="53">
                                Childcare
                            </option>

                            <option value="54">
                                Combat Sports
                            </option>

                            <option value="81">
                                Crossdressing
                            </option>

                            <option value="55">
                                Delinquents
                            </option>

                            <option value="39">
                                Detective
                            </option>

                            <option value="56">
                                Educational
                            </option>

                            <option value="57">
                                Gag Humor
                            </option>

                            <option value="58">
                                Gore
                            </option>

                            <option value="35">
                                Harem
                            </option>

                            <option value="59">
                                High Stakes Game
                            </option>

                            <option value="13">
                                Historical
                            </option>

                            <option value="60">
                                Idols (Female)
                            </option>

                            <option value="61">
                                Idols (Male)
                            </option>

                            <option value="62">
                                Isekai
                            </option>

                            <option value="63">
                                Iyashikei
                            </option>

                            <option value="64">
                                Love Polygon
                            </option>

                            <option value="65">
                                Magical Sex Shift
                            </option>

                            <option value="66">
                                Mahou Shoujo
                            </option>

                            <option value="17">
                                Martial Arts
                            </option>

                            <option value="18">
                                Mecha
                            </option>

                            <option value="67">
                                Medical
                            </option>

                            <option value="38">
                                Military
                            </option>

                            <option value="19">
                                Music
                            </option>

                            <option value="6">
                                Mythology
                            </option>

                            <option value="68">
                                Organized Crime
                            </option>

                            <option value="69">
                                Otaku Culture
                            </option>

                            <option value="20">
                                Parody
                            </option>

                            <option value="70">
                                Performing Arts
                            </option>

                            <option value="71">
                                Pets
                            </option>

                            <option value="40">
                                Psychological
                            </option>

                            <option value="3">
                                Racing
                            </option>

                            <option value="72">
                                Reincarnation
                            </option>

                            <option value="73">
                                Reverse Harem
                            </option>

                            <option value="74">
                                Love Status Quo
                            </option>

                            <option value="21">
                                Samurai
                            </option>

                            <option value="23">
                                School
                            </option>

                            <option value="75">
                                Showbiz
                            </option>

                            <option value="29">
                                Space
                            </option>

                            <option value="11">
                                Strategy Game
                            </option>

                            <option value="31">
                                Super Power
                            </option>

                            <option value="76">
                                Survival
                            </option>

                            <option value="77">
                                Team Sports
                            </option>

                            <option value="78">
                                Time Travel
                            </option>

                            <option value="32">
                                Vampire
                            </option>

                            <option value="79">
                                Video Game
                            </option>

                            <option value="80">
                                Visual Arts
                            </option>

                            <option value="48">
                                Workplace
                            </option>

                            <option value="82">
                                Urban Fantasy
                            </option>

                            <option value="83">
                                Villainess
                            </option>

                            <option value="43">
                                Josei
                            </option>

                            <option value="15">
                                Kids
                            </option>

                            <option value="42">
                                Seinen
                            </option>

                            <option value="25">
                                Shoujo
                            </option>

                            <option value="27">
                                Shounen
                            </option>
                        </select>

                        <button
                            className="filter-button"
                            type="submit"
                        >
                            *ੈ✩‧₊˚༺ 𝔉𝔦𝔩𝔱𝔢𝔯 ༻*ੈ✩‧₊˚
                        </button>
                    </form>

                    {/* Recommendations */}
                    <form
                        onSubmit={
                            fetchRecommendations
                        }
                    >
                        <input
                            className="input-button"
                            type="text"
                            placeholder="Type anime title..."
                            value={searchQuery}
                            onChange={(e) =>
                                setSearchQuery(
                                    e.target.value
                                )
                            }
                        />

                        <button
                            className="recs-button"
                            type="submit"
                        >
                            ·:*¨༺ ♱ 𝓰𝓮𝓽 ✮
                            𝓻𝓮𝓬𝓸𝓶𝓶𝓮𝓷𝓭𝓪𝓽𝓲𝓸𝓷𝓼
                            ♱ ༻¨*:·
                        </button>
                    </form>

                    {/* Loading */}
                    {loading && (
                        <p>Loading...</p>
                    )}

                    {/* Error */}
                    {error && (
                        <p className="error">
                            {error}
                        </p>
                    )}

                    {/* Search / Filter Results */}
                    <div className="anime-results">

                        {animeList.length > 0 ? (
                            animeList.map(
                                (anime, index) => {

                                    if (
                                        !anime?.mal_id ||
                                        !anime?.images
                                            ?.jpg
                                            ?.image_url ||
                                        !anime?.title
                                    ) {
                                        return null;
                                    }

                                    return (
                                        <div
                                            key={`${anime.mal_id}-${index}`}
                                            className="anime-card"
                                        >

                                            <img
                                                src={
                                                    anime
                                                        .images
                                                        .jpg
                                                        .image_url
                                                }
                                                alt={
                                                    anime.title
                                                }
                                            />

                                            <h4>
                                                {
                                                    anime.title
                                                }
                                            </h4>

                                            <h5>
                                                {
                                                    anime.title_japanese
                                                }
                                            </h5>

                                            <p>
                                                {
                                                    anime.type
                                                }
                                            </p>

                                            <p>
                                                {
                                                    anime
                                                        .aired
                                                        ?.string
                                                }
                                            </p>

                                            <p>
                                                {
                                                    anime.synopsis
                                                }
                                            </p>

                                        </div>
                                    );
                                }
                            )
                        ) : (
                            !loading && <p></p>
                        )}

                    </div>

                    {/* Recommendations */}
                        {/* Recommendations */}
<div className="anime-results">

    {recommendations.map((anime, index) => {

        if (!anime?.mal_id) {
            return null;
        }

        const year = anime.aired?.from
            ? new Date(anime.aired.from).getFullYear()
            : null;

        return (
            <div
                key={`${anime.mal_id}-${index}`}
                className="anime-card"
            >

                <img
                    src={anime.images?.jpg?.image_url}
                    alt={anime.title}
                />

                <div className="anime-info">

                    {/* English title */}
                    <h4>
                        {anime.title}
                    </h4>

                    {/* Japanese title */}
                    {anime.title_japanese && (
                        <h5>
                            {anime.title_japanese}
                        </h5>
                    )}

                    {/* Release year */}
                    {year && (
                        <p>
                            {year}
                        </p>
                    )}

                </div>

            </div>
        );
    })}

</div>

                </div>
            </div>
        </div>
    );
}

export default AnimeSearch;