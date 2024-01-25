import axios from 'axios';
import { API_URL } from '@/config/config.ts';

interface ShortenUrlResponse {
    shortUrl: string;
    totalTime: number;
    collisions: number;
}

const UrlShortener = async (originalUrl: string, customUrl: string, title: string): Promise<ShortenUrlResponse> => {

    const data = { originalUrl, customUrl, title };

    try {
        const authToken = localStorage.getItem('token');

        if (!authToken) {
            throw new Error("No authentication token found");
        }

        const response = await axios.post(`${API_URL}/url/shorten`,
            data,
            {
                headers: {
                    authToken: `${authToken}`
                }
            }
        );

        const responseData: ShortenUrlResponse = response.data;
        return responseData;
    } catch (error) {
        console.error('Error sending request to the backend:', error);
        throw error;
    }
};

export default UrlShortener;