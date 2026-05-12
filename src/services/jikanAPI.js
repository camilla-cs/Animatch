const BASE_URL = "https://api.jikan.moe/v4";

export const fetchAnimeById = async (id) => {
  try {
    const response = await fetch(`${BASE_URL}/anime/${id}`);        
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data.data; // Return the anime data
  } catch (error) {
    console.error("Error fetching anime by ID:", error);
    throw error; // Rethrow the error to be handled by the caller
  } 
};

export const fetchAnimeByTitle = async (title) => {
    try {   
        const response = await fetch(`${BASE_URL}/anime?q=${encodeURIComponent(title)}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data.data; // Return the list of anime matching the title
    } catch (error) {
        console.error("Error fetching anime by title:", error);
        throw error; // Rethrow the error to be handled by the caller
    }
};

export const fetchTopAnime = async () => {
    try {

        const response = await fetch(`${BASE_URL}/top/anime`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }   
        const data = await response.json();
        return data.data; // Return the list of top anime
    }
    catch (error) {
        console.error("Error fetching top anime:", error);
        throw error; // Rethrow the error to be handled by the caller
    }
};

export const fetchAnimeGenres = async () => {
    try {
        const response = await fetch(`${BASE_URL}/genres/anime`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }


        const data = await response.json();
        return data.data; // Return the list of anime genres
    }   catch (error) { 
        console.error("Error fetching anime genres:", error);
        throw error; // Rethrow the error to be handled by the caller
    }   
};



