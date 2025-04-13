import {Link} from 'react-router-dom'
import {ReactComponent as Home} from '../images/house-door-fill.svg'
import {ReactComponent as Cap} from '../images/cap.svg'
import {ReactComponent as Channels} from '../images/grid-3x2-gap.svg'
import {ReactComponent as Jobs} from '../images/briefcase.svg'
import {ReactComponent as Profile} from '../images/person-circle.svg'


function BottomNav() {
    return (
      <div className='bottomNavBackdrop'>
        <div className='bottomNavContainer'>
          <Link to="/home">
            <Home className="bottomNavIcons"/>
          </Link>
          <Cap className="bottomNavIcons"/>
          <Link to="/discover">
            <Channels className="bottomNavIcons"/>
          </Link>
          <Link to="/channel">
          <Jobs className="bottomNavIcons"/>
          </Link>
          <Link to="/landing">
          <Profile className="bottomNavIcons"/>
          </Link>
        </div>
      </div>
    );
  }
  
  export default BottomNav;
  