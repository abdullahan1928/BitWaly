import axios from 'axios';
import { API_URL } from '@/config/config.ts';

interface UpdateUrlData {
    title: string;
    shortUrl: string;
    tags: string[];
}

export const UpdateUrl = async (authToken: string, id: string, data: UpdateUrlData) => {
    try {
        const response = await axios.put(`${API_URL}/url/update/${id}`,
            data,
            {
                headers: {
                    authToken: `${authToken}`
                }
            }
        );
        return response.data;
    } catch (error) {
        console.log(error)
        throw error;
    }
};
