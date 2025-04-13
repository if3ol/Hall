import { useState } from "react";
import {motion} from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useUser } from "./UserContext";

function LogInField({ registerToggle }) {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const { userId, setUserId } = useUser(); // ✅ use context
  const navigate = useNavigate(); // ✅ initialize navigate
    

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username: userName,
          password: password
        })
      });

      const data = await response.json();

      if (response.ok) {
        console.log(data)
        setUserId(data.user_id); // ✅ update global context
        console.log("Logged in. User ID:", data.user_id);
        navigate("/home"); // ✅ redirect immediately
        // Proceed to redirect or update auth context
      } else {
        console.error('Login failed:', data.message);
        // Optional: show error message to user
      }
    } catch (error) {
      console.error('Network error:', error);
    }
  };

  
    return (
      <motion.div 
        className="logInFieldContainer"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 50 }}
        transition={{ duration: 0.2, ease: "easeInOut" }}
      >
            <form className="loginForm" onSubmit={handleSubmit}>
              <input
                type="text"
                name="username"
                className="formInput"
                placeholder="username"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                required
              />

                <input
                    type="password"
                    name="password"
                    className="formInput"
                    placeholder="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />

                <button type="submit" className="submitBtn">
                Log In
                </button>
        </form>
        <div className="signUpLinkContainer">
            <span className="signUpLink gradientText">New here?</span>  <span onClick={registerToggle}>Register</span>
        </div>
      </motion.div>
    );
  }
  
  export default LogInField;
  