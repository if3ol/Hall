import {Link} from 'react-router-dom'
import ChannelSideBarPrev from './ChannelSideBarPrev';
import SchoolSideBarPrev from './SchoolSideBarPrev';
import {ReactComponent as Back} from '../images/arrow-left.svg';
import { motion } from 'framer-motion';
import { useEffect } from "react";

function SideBar({ isMenuOpen, toggleMenu, channels, schoolData }) {

  useEffect(() => {//this will toggle off this property for the body so that it is not scrollable and only the sidebar is
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  
    // Clean up on unmount
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isMenuOpen]);

    return (
      <motion.div 
      className='sideBar'
      initial={{ x: '-100%' }}
      animate={{ x: 0 }}
      exit={{ x: '-100%' }}
      transition={{ type: 'tween', duration: 0.2 }}
      >
        <div className='topContainer'>
          <h4 className='header'>My School</h4>
          <Back onClick={toggleMenu} className="sideBarBackBtn" />
        </div>
        <SchoolSideBarPrev name={schoolData.name} icon={schoolData.icon}/>

        <h4 className='header'>Following</h4>

        <div className="channelList">
            {channels.map((channel) => (
              <Link to={`/channel/${channel.id}`} key={channel.id} style={{ textDecoration: 'none', color: 'inherit' }}>
                <ChannelSideBarPrev name={channel.name} icon={channel.icon}/>
              </Link>
            ))}
          </div>
      </motion.div>//under channels we want a list of channels this user follows so we need a component for channel link
    );
  }
  
  export default SideBar;
  