const NODE_ENV = import.meta.env.VITE_NODE_ENV;

const DEV_API_URL = import.meta.env.VITE_DEV_API_URL
const PROD_API_URL = import.meta.env.VITE_PROD_API_URL
const API_URL = NODE_ENV === 'development' ? DEV_API_URL : PROD_API_URL;

const DEV_REDIRECT_URL = import.meta.env.VITE_DEV_REDIRECTION_URL
const PROD_REDIRECT_URL = import.meta.env.VITE_PROD_REDIRECTION_URL
const REDIRECT_URL = NODE_ENV === 'development' ? DEV_REDIRECT_URL : PROD_REDIRECT_URL;

export {
    API_URL,
    REDIRECT_URL,
};


