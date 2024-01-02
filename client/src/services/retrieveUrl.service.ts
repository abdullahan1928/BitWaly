import axios from 'axios';
import { API_URL } from '@/config/config.ts';

const UrlRetreival = async (originalUrl: string): Promise<string> => {
    try {
        const response = await axios.get(`${API_URL}/url/retreive/${originalUrl}`);
        return response.data.originalUrl;
    } catch (error) {
        
        return Promise.reject(error); // Reject the promise with the error
    }
};

export default UrlRetreival;
