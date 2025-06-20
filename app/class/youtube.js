

async function fetchYouTubeVideos(query) {
    const API_KEY = 'AIzaSyAHqpHnF0ltaDodbnyQM8Up7ibuRVUyn-U'; // Reemplaza con tu clave de API de YouTube
    const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=10&q=${(query)}&key=${API_KEY}`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Error al obtener los datos de YouTube');
        }
        const data = await response.json();
        return data.items[0].id.videoId.trim()

    } catch (error) {
        console.error('Error:', error);
        return false
    }
}

module.exports = fetchYouTubeVideos