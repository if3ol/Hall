import {Link} from 'react-router-dom'
import {ReactComponent as Lock} from '../images/lock.svg'

function SchoolSideBarPrev({ name, icon }) {
    return (
      <div className='schoolPrevContainer'>
        <img src={icon}></img>
        <div className='prevNameAndLockContainer'>
            <p>{name}</p>
            <div className='containerLockPrivate'>
                <Lock />
                <span className='privateP'>Private</span>
            </div>
        </div>
      </div>
    );
  }
  
  export default SchoolSideBarPrev;
  