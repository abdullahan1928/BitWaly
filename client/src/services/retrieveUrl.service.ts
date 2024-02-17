import axios from 'axios';
import { API_URL } from '@/config/urls';
import { browserName, osName, mobileVendor, deviceType } from 'react-device-detect';

const UrlRetrieval = async (originalUrl: string, referrer: string): Promise<string> => {
    try {
        const ipResponse = await axios.get('https://api.ipify.org?format=json');
        const userIP = ipResponse.data.ip;

        const response = await axios.post(`${API_URL}/url/retreive/${originalUrl}`, {
            userIP: userIP,
            browserName,
            osName,
            mobileVendor,
            deviceType,
            referrer,
        });
        return response.data.originalUrl;
    } catch (error) {

        return Promise.reject(error);
    }
};

const UrlRetrievalById = async (authToken: string, id: string) => {
    try {
        const response = await axios.get(`${API_URL}/url/retreive/id/${id}`, {
            headers: {
                authToken: `${authToken}`
            }
        });
        if (response) {
            const data = await response.data;
            return data;
        } else {
            console.error('Failed to fetch user URLs');
        }
    } catch (error) {
        console.log(error)
    }
}

// export all functions
export {
    UrlRetrieval,
    UrlRetrievalById
};