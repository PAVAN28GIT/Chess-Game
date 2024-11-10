import { useNavigate } from 'react-router-dom';
import { showToast } from '../utils/toast';
import BackendURL from '../utils/config.js';

export const userAuth = () => {
    const navigate = useNavigate();


    const handleRegister = async (userData) => {
        try {
          showToast("Creating account...", "loading");
          
          const response = await fetch(`${BackendURL}/api/auth/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(userData),
          });
      
          const data = await response.json();
          
          showToast("", "dismiss");
      
          if (response.ok) {
            showToast("Account created successfully", "success");
            navigate("/sign-in")// redirect to sign-in page
          } else {
                if (data.message === "User already exists") {
                    showToast("Please Sign In", "info");
                    navigate("/sign-in") // Redirect to sign-in page
                } else {
                    showToast(data.message, "error");
                }
          }
        } catch (error) {
          showToast("", "dismiss");
          console.error(error);
          showToast(error.message, "error");
        }
    };

    const handleLogIn = async (userData) => {
        try {
          showToast("Logging in...", "loading");

          const response = await fetch(`${BackendURL}/api/auth/sign-in`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(userData), // Converting object to JSON string
          });
      
          const data = await response.json();

          showToast("", "dismiss");
          if (response.ok) {
            showToast("Logged in successfully", "success");
            navigate("/dashboard") // Redirect to dashboard
          } else {
            showToast(data.message, "error");
          }
        } catch (error) {
          showToast("", "dismiss");
          console.error(error);
          showToast(error.message, "error");
        }
    }


    return { handleRegister , handleLogIn };
}