import axios from 'axios';
import { API_URL } from '@/config/urls';

interface Url {
    _id: string;
    originalUrl: string;
    shortUrl: string;
    createdAt: string;
}

const getUserUrls = async (authToken: string | null): Promise<Url[]> => {
    try {
        const response = await axios.get(`${API_URL}/url/userUrls`, {
            headers: {
                authToken: `${authToken}`
            }
        });

        if (response) {
            const data = await response.data;
            return data;
        } else {
            console.error('Failed to fetch user URLs');
            return [];
        }
    } catch (error) {
        console.error('Error fetching user URLs:', error);
        throw error;
    }
};

const deleteUrl = async (authToken: string | null, urlId: string): Promise<void> => {
    try {
        await axios.delete(`${API_URL}/url/delete/${urlId}`, {
            headers: {
                authToken: `${authToken}`
            }
        });
    } catch (error) {
        console.error('Error deleting URL:', error);
        throw error;
    }
};

export { getUserUrls, deleteUrl };
