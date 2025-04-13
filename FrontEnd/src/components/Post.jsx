import {ReactComponent as Heart} from '../images/heart.svg'
import {ReactComponent as Comment} from '../images/chat-square.svg'
import {ReactComponent as ViewEye} from '../images/eye.svg'
import { useLocation } from 'react-router-dom';

function Post({ channel, channelLogo, linkToChannel, time, ifFollow, school, title, bodySummary, numOfLikes ,numOfComments, views, linkToPost}) {

    const location = useLocation();
    const isChannelPage = location.pathname === '/channel';

    return (
      <div className="postContainer">
        <div className="postTop">
            <img src={channelLogo} ></img>
            <div className={!isChannelPage ? "channelTime" : ""}>
              <p className='channel'>{!isChannelPage && channel}</p>
              <p className={!isChannelPage ? 'time' : 'timeChannel'}> {time}</p>
              <p style={{'fontSize':'1.5em'}}> {!isChannelPage && '·'}</p>
              <p className='ifFollow'> {!isChannelPage &&(ifFollow ? 'Unfollow' : 'Follow')}</p>
            </div>
            <p className='university'>{school}</p>
        </div>
        <div className="postBody">
          <h4 className='title'>{title}</h4>
          <p className='summary' >{bodySummary}</p>
        </div>

        <div className="postBottom">
          <div className='iconAndCountContainer'>
            <Heart />
            <p>{numOfLikes}</p>
          </div>
          <div className='iconAndCountContainer'>
            <Comment />
            <p>{numOfComments}</p>
          </div>
          <div className='iconAndCountContainer'>
            <ViewEye />
            <p>{views}</p>
          </div>
        </div>
      </div>
    );
  }
  
  export default Post;
  