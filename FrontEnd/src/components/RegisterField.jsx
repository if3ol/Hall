import { useState } from "react";
import { motion } from "framer-motion";

function RegisterField({ registerToggle }) {
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    // Example check (optional for login, but useful for registration)
    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    // TODO: Handle submit logic (API call etc.)
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
          type="email"
          name="email"
          className="formInput"
          placeholder="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
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

        <input
          type="password"
          name="confirmPassword"
          className="formInput"
          placeholder="retype password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />

        <button type="submit" className="submitBtn">
          Log In
        </button>
      </form>

      <div className="signUpLinkContainer">
        <span className="signUpLink gradientText">Already a member?</span> <span onClick={registerToggle}>Login</span>
      </div>
    </motion.div>
  );
}

export default RegisterField;
