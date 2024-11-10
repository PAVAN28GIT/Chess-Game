const LocalURL = "http://localhost:8000";
const ProductionURL = "https://your-backend-url.com";

export const BackendURL = process.env.NODE_ENV === 'production' ? ProductionURL : LocalURL;