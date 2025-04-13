import SideBar from './SideBar'
import {ReactComponent as Lines} from '../images/list.svg'
import { AnimatePresence } from 'framer-motion';
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import {ReactComponent as Logo} from '../images/logowhite.svg';
import { useUser } from './UserContext';



function NavBar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [channels, setChannels] = useState([]);
    const [school, setSchool] = useState(null);
    const { userId } = useUser();

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
      };


    useEffect(() => {//api calls for the info in the sidebar. *******Will need to add cache to this eventually******
      if (isMenuOpen) {
        // Fetch channels
        fetch(`${process.env.REACT_APP_API_BASE_URL}/sidbebar_info?user_id=${userId}`) // Replace with actual endpoint and give userId
          .then((res) => res.json())
          .then((data) => {
            setChannels(data);
          })
          .catch((err) => console.error('Failed to fetch channelsdddd', err));
      }
    }, [isMenuOpen]);



    const location = useLocation();
    const isHome = location.pathname === '/' || location.pathname === '/home';
    const isDiscovery = location.pathname === '/discover';
    const isLanding = location.pathname === '/landing';
  
    return (
    <container>
        <div className='navBar'>
            {!isLanding && <Lines className="navBarimg" onClick={toggleMenu} />}
            {(isHome || isLanding) && (<> <Logo className="logo"/> <h1>Hall</h1></>)}
            <h1>{isDiscovery && 'Discover'}</h1>
        </div>
        <AnimatePresence>
        {isMenuOpen && channels.other_channels && (
        <SideBar
          isMenuOpen={isMenuOpen}
          toggleMenu={toggleMenu}
          channels={channels.other_channels}
          schoolData={channels}
        />
      )}
        </AnimatePresence>
      </container>
    );
  }
  
  export default NavBar;
  