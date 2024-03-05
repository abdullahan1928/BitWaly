import axios from 'axios';
import { API_URL } from '@/config/urls';
import { AxiosError } from 'axios';

axios.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
        if (error.response?.status === 403) {
            window.location.replace('/dashboard');
        }
        return Promise.reject(error);
    }
);

export const fetchUsers = async (authToken: string, queryParams: any) => {
    try {
        const response = await axios.get(`${API_URL}/admin/users`, {
            headers: {
                authToken: `${authToken}`
            },
            params: queryParams,
        });
        if (response) {
            return response.data;
        } else {
            console.error('Failed to fetch user data');
        }
    } catch (error) {
        console.log(error)
    }
};


export const deleteUser = async (authToken: string, id: string) => {
    try {
        const response = await axios.delete(`${API_URL}/admin/users/delete/${id}`, {
            headers: {
                authToken: `${authToken}`
            }
        });
        if (response) {
            return response.data;
        } else {
            console.error('Failed to fetch user data');
        }
    } catch (error) {
        console.log(error)
    }
};
