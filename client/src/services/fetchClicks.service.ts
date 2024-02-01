import axios from 'axios';
import { API_URL } from '@/config/config.ts';

export const FetchClicks = async (authToken: string, id: string) => {
    try {
        const response = await axios.get(`${API_URL}/analytics/accesscount/${id}`, {
            headers: {
                authToken: `${authToken}`
            }
        });
        if (response) {
            return response.data;
        } else {
            console.error('Failed to fetch user URLs');
        }
    } catch (error) {
        console.log(error)
    }
};
