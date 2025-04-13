import { useState } from "react";
import {motion} from "framer-motion";
import { Navigate } from "react-router-dom";

function LogInField({ registerToggle }) {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [userId, setUserId] = useState(null); // To store the returned user ID
    

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('/api/login', {
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
        setUserId(data.userId); // Store the userId from response
        console.log('Logged in. User ID:', data.userId);
        // Proceed to redirect or update auth context
      } else {
        console.error('Login failed:', data.message);
        // Optional: show error message to user
      }
    } catch (error) {
      console.error('Network error:', error);
    }
  };

  // ✅ Automatically redirect if logged in
  if (userId) {
    return <Navigate to="/home" state={{ userId }}/>;
  }
  
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
  