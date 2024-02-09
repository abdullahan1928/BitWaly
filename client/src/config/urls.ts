const NODE_ENV = import.meta.env.VITE_NODE_ENV;

const DEV_API_URL = import.meta.env.VITE_DEV_API_URL || 'http://localhost:3000';
const PROD_API_URL = import.meta.env.VITE_PROD_API_URL || 'http://bitwaly-server.vercel.app';
const API_URL = NODE_ENV === 'development' ? DEV_API_URL : PROD_API_URL;

const DEV_REDIRECT_URL = import.meta.env.VITE_DEV_REDIRECTION_URL || 'http://localhost:8080';
const PROD_REDIRECT_URL = import.meta.env.VITE_PROD_REDIRECTION_URL || 'http://bitwaly.vercel.app';
const REDIRECT_URL = NODE_ENV === 'development' ? DEV_REDIRECT_URL : PROD_REDIRECT_URL;

export {
    API_URL,
    REDIRECT_URL,
};
