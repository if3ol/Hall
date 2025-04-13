import {Link} from 'react-router-dom'

function ChannelSideBarPrev({ name, icon }) {
    return (
      <div className='channelIcon'>
        <img src={icon}></img>
        <p>{name}</p>
      </div>
    );
  }
  
  export default ChannelSideBarPrev;
  