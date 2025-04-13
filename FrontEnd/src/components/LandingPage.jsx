import NavBar from "./NavBar";
import { motion, AnimatePresence } from "framer-motion";
import { ReactComponent as Logo } from '../images/bigLogo1.svg';
import { useState } from "react";
import LogInField from "./LoginField";
import RegisterField from "./RegisterField";

function LandingPage() {
  const [isStarted, setIsStarted] = useState(false);
  const [isLogin, setIsLogin] = useState(true);

  const toggleMenu = () => setIsStarted(true);
  const toggleLogin = () => setIsLogin(prev => !prev);

  return (
    <div className="LandingContainer">
      <motion.div 
        className="blackOverlay"
        initial={{ opacity: 1 }}
        animate={{ opacity: 0 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
      />

      <motion.div 
        className="welcomeContainer"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeIn" }} 
      >
        <h2 className="gradientText welcomeText">Welcome to the</h2>
        <h1 className="bottomText">Hall</h1>
        <Logo className="bigLogo" />

        <AnimatePresence mode="wait"> {/* We conditionally render the first landing component or register or login */}
          {!isStarted ? (
            <motion.div
              key="intro"
              className="divMiddle"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              <p className="summary">
                Meet new people, chat with classmates, join school-only spaces, and make your campus experience even better.
              </p>
              <motion.div
                onClick={toggleMenu}
                className="getStartedBtn"
                animate={{ scale: [1, 1.04, 1], opacity: [1, 0.8, 1] }}
                transition={{
                  duration: 2.5,
                  repeat: Infinity,
                  repeatType: "loop",
                  ease: "easeInOut",
                }}
              >
                Get Started
              </motion.div>
            </motion.div>
          ) : isLogin ? (
            <motion.div
              key="login"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
            >
              <LogInField registerToggle={toggleLogin} />
            </motion.div>
          ) : (
            <motion.div
              key="register"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
            >
              <RegisterField registerToggle={toggleLogin} />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

export default LandingPage;
