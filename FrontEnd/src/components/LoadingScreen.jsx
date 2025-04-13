import { motion } from 'framer-motion';

function LoadingScreen() {
  return (
    <motion.div 
      className="loadingScreen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      <div className="spinner"></div>
      <p>Loading...</p>
    </motion.div>
  );
}

export default LoadingScreen;
