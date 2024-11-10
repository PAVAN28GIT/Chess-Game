const LocalURL = "http://localhost:8000";
const ProductionURL = "https://chess-game-bslt.onrender.com";

const BackendURL = process.env.NODE_ENV === 'production' ? ProductionURL : LocalURL;

export default BackendURL;