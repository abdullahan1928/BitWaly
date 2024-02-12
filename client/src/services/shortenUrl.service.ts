import axios from 'axios';
import { API_URL } from '@/config/urls';

interface ShortenUrlResponse {
    shortUrl: string;
    totalTime: number;
    collisions: number;
}

interface ShortenUrlRequest {
    origUrl: string;
    customUrl: string;
    title: string;
    tags: string[];
    utmSource: string;
    utmMedium: string;
    utmCampaign: string;
    utmTerm: string;
    utmContent: string;
}

const UrlShortener = async (data: ShortenUrlRequest): Promise<ShortenUrlResponse> => {

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
