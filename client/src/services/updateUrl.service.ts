import axios from 'axios';
import { API_URL } from '@/config/urls';

interface UpdateUrlData {
    origUrl: string;
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
