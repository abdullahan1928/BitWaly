import axios from 'axios';
import { API_URL } from '@/config/config.ts';

export const FetchClicks = async (authToken: string, id: string,) => {
    try {
        const response = await axios.get(`${API_URL}/analytics/clicks/${id}`, {
            headers: {
                authToken: `${authToken}`
            }
        });
        if (response && response.data[0]) {
            const data = await response.data[0].clicks;
            return data;
        } else if (response && !response.data[0]) {
            const data = 0;
            return data;
        } else {
            console.error('Failed to fetch user URLs');
        }
    } catch (error) {
        console.log(error)
    }
};
