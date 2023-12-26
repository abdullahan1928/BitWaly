import axios from 'axios';
import { API_URL } from '@/config/config.ts';

interface ShortenUrlResponse {
    shortUrl: string;
    totalTime: number;
    collisions: number;
}

const UrlShortener = async (originalUrl: string): Promise<ShortenUrlResponse> => {
    try {
        const response = await axios.post(`${API_URL}/url/shorten`, {
            originalUrl,
        });

        const responseData: ShortenUrlResponse = response.data;

        return responseData;
    } catch (error) {
        console.error('Error sending request to the backend:', error);
        throw error;
    }
};

export default UrlShortener;
