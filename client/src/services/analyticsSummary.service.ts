import axios from 'axios';
import { API_URL } from '@/config/urls';

export const fetchLocations = async (authToken: string) => {
    try {
        const response = await axios.get(`${API_URL}/summary/locations`, {
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

export const fetchTopLocations = async (authToken: string) => {
    try {
        const response = await axios.get(`${API_URL}/summary/toplocations`, {
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

export const fetchReferrers = async (authToken: string) => {
    try {
        const response = await axios.get(`${API_URL}/summary/referrers`, {
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


export const fetchDevices = async (authToken: string) => {
    try {
        const response = await axios.get(`${API_URL}/summary/devices`, {
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

export const fetchClicks = async (authToken: string) => {
    try {
        const response = await axios.get(`${API_URL}/summary/clicks`, {
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


export const fetchClicksWithDates = async (authToken: string) => {
    try {
        const response = await axios.get(`${API_URL}/summary/clickswithdates`, {
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