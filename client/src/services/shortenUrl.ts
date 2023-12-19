import axios from 'axios';
import { API_URL } from '@/config/config.ts';

const UrlShortener = async (originalUrl: string) => {
    try {
        const response = await axios.post(`${API_URL}/url/shorten`, {
            originalUrl,
        });

        return response.data.shortUrl;
    } catch (error) {
        console.error('Error sending request to the backend:', error);
        throw error;
    }
};

export default UrlShortener;
