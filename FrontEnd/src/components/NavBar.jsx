import SideBar from './SideBar'
import {ReactComponent as Lines} from '../images/list.svg'
import { AnimatePresence } from 'framer-motion';
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import {ReactComponent as Logo} from '../images/logowhite.svg';



function NavBar({ userId }) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [channels, setChannels] = useState([]);
    const [school, setSchool] = useState(null);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
      };


    useEffect(() => {//api calls for the info in the sidebar. *******Will need to add cache to this eventually******
      if (isMenuOpen) {
        // Fetch channels
        fetch('/api/channels') // Replace with actual endpoint and give userId
          .then((res) => res.json())
          .then((data) => {
            setChannels(data);
          })
          .catch((err) => console.error('Failed to fetch channels', err));
  
        // Fetch school data
        fetch('/api/school') // Replace with actual endpoint and give userId
          .then((res) => res.json())
          .then((data) => {
            setSchool(data);
          })
          .catch((err) => console.error('Failed to fetch school', err));
      }
    }, [isMenuOpen]);



    const location = useLocation();
    const isHome = location.pathname === '/' || location.pathname === '/home';
    const isDiscovery = location.pathname === '/discover';
    const isLanding = location.pathname === '/landing';

    const channelsTest = [//****test data****
      {id:1, name: 'AMA', icon:'https://thefound.com/cdn/shop/products/SGN238_ASK_ME_ANYTHING.jpg?v=1662760598'},
      {id:4, name: 'Canada', icon:'https://dims.apnews.com/dims4/default/f56d6df/2147483647/strip/true/crop/3000x1688+0+108/resize/1440x810!/quality/90/?url=https%3A%2F%2Fassets.apnews.com%2Fc9%2F06%2Fdf46144df6491a4ea7a136830687%2F4139b6324eb246a0bc4618a02c08988c'},
      {id:3, name: 'Tech Referrals', icon:'https://blog.appleone.com/wp-content/uploads/2016/02/referrals.jpg'},
    ]
    //****test data****
    const schoolTest = {name:'University of South Florida', icon:"https://lh3.googleusercontent.com/n8nMqFYJfN-7tJNfhC9eigB0odMWdzmh78kjIu545fw7MP6SnKIhat1GFpsl72dIYAXiQtEq813bWoZno9qO_v2u=s1280-w1280-h800"}

    return (
    <container>
        <div className='navBar'>
            {!isLanding && <Lines className="navBarimg" onClick={toggleMenu} />}
            {(isHome || isLanding) && (<> <Logo className="logo"/> <h1>Hall</h1></>)}
            <h1>{isDiscovery && 'Discover'}</h1>
        </div>
        <AnimatePresence>
          {isMenuOpen && <SideBar isMenuOpen={isMenuOpen} toggleMenu={toggleMenu} channels={channelsTest} schoolData={schoolTest}/>}
        </AnimatePresence>
      </container>
    );
  }
  
  export default NavBar;
  