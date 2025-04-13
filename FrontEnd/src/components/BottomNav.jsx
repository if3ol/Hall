import {Link} from 'react-router-dom'
import {ReactComponent as Home} from '../images/house-door-fill.svg'
import {ReactComponent as Cap} from '../images/cap.svg'
import {ReactComponent as Channels} from '../images/grid-3x2-gap.svg'
import {ReactComponent as Jobs} from '../images/briefcase.svg'
import {ReactComponent as Profile} from '../images/person-circle.svg'
import { useUser } from './UserContext';
import { useState, useEffect } from 'react';

function BottomNav() {
  const { userId } = useUser();
  const [schoolChannelId, setSchoolChannelId] = useState(null);

  // Fetch the user's school's main channel id
  useEffect(() => {
    const fetchUserSchool = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/school_main_channel_id?user_id=${userId}`);
        if (!response.ok) throw new Error('Failed to fetch trending channels');
        const data = await response.json();
        setSchoolChannelId(data.school_channel_id);
      } catch (err) {
        console.error(err);
      }
    };

    fetchUserSchool();
  }, [userId]);
  
    return (
      <div className='bottomNavBackdrop'>
        <div className='bottomNavContainer'>
          <Link to="/home">
            <Home className="bottomNavIcons"/>
          </Link>
          <Link to={`/channel/${schoolChannelId}`}>
            < Cap className="bottomNavIcons"/>
          </Link>
          <Link to="/discover">
            <Channels className="bottomNavIcons"/>
          </Link>
          <Jobs className="bottomNavIcons"/>
          <Profile className="bottomNavIcons"/>
        </div>
      </div>
    );
  }
  
  export default BottomNav;
  