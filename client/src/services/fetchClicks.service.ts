import axios from 'axios';
import { API_URL } from '@/config/urls';

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


export const FetchWeeklyCount = async (authToken: string, id: string) => {
    try {
        const response = await axios.get(`${API_URL}/analytics/weeklycount/${id}`, {
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


export const FetchWeeklyChange = async (authToken: string, id: string) => {
    try {
        const response = await axios.get(`${API_URL}/analytics/weeklychange/${id}`, {
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
