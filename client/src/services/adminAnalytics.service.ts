import axios from 'axios';
import { API_URL } from '@/config/urls';

export const fetchLocationsWithAdmin = async (authToken: any, id:any) => {
    try {
        const response = await axios.get(`${API_URL}/admin/locations/${id}`, {
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

export const fetchTopLocationsWithAdmin = async (authToken: any, id:any) => {
    try {
        const response = await axios.get(`${API_URL}/admin/toplocations/${id}`, {
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

export const fetchReferrersWithAdmin = async (authToken: any, id:any) => {
    try {
        const response = await axios.get(`${API_URL}/admin/referrers/${id}`, {
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


export const fetchDevicesWithAdmin = async (authToken: any, id:any) => {
    try {
        const response = await axios.get(`${API_URL}/admin/devices/${id}`, {
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

export const fetchClicksWithAdmin = async (authToken: any, id:any) => {
    try {
        const response = await axios.get(`${API_URL}/admin/clicks/${id}`, {
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


export const fetchClicksWithDatesWithAdmin = async (authToken: any, id:any) => {
    try {
        const response = await axios.get(`${API_URL}/admin/clickswithdates/${id}`, {
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