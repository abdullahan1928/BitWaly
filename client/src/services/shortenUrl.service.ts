import axios from 'axios';
import { API_URL } from '@/config/config.ts';

interface ShortenUrlResponse {
    shortUrl: string;
    totalTime: number;
    collisions: number;
}

const UrlShortener = async (originalUrl: string, customUrl: string, title: string): Promise<ShortenUrlResponse> => {
    try {
        const authToken = localStorage.getItem('token'); // Retrieve token from localStorage

        // Check if authToken exists
        if (!authToken) {
            throw new Error("No authentication token found");
        }

        const response = await axios.post(`${API_URL}/url/shorten`,
            { originalUrl, customUrl, title },
            {
                headers: {
                    authToken: `${authToken}` // Include the authToken in the request header
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
