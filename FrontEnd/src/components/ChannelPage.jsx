import BottomNav from "./BottomNav";
import Post from "./Post";
import {ReactComponent as Arrow} from '../images/downArrow.svg'
import {ReactComponent as Globe} from '../images/globe.svg'
import {ReactComponent as Lock} from '../images/lock.svg'
import { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { useUser } from './UserContext';
import LoadingScreen from './LoadingScreen';

//***Test Data***//
const data = {
  backDrop:"https://images.pexels.com/photos/1264210/pexels-photo-1264210.jpeg",
  name:"Photos",
  logo:"https://www.creativefabrica.com/wp-content/uploads/2021/09/11/Camera-Logo-Design-Inspirations-Graphics-17143566-1.jpg",
  ifFollow:true,
  ifPublic:true,
  numOfFollowers:'50k',
  summary:"A place to discuss and share your favorite pictures"
};
  //test data***
  const postData = [{ channel : 'AMA', channelLogo: 'https://thefound.com/cdn/shop/products/SGN238_ASK_ME_ANYTHING.jpg?v=1662760598'
    , linkToChannel:'google.com', time:'12m', ifFollow:true, school:'University Of South Florida', title:'What is the meaning of life?', 
    bodySummary:"My proffessor asked me this and all I could say is that we live in a society...", numOfLikes:32 ,numOfComments:564, views:234, linkToPost:"nah.com"},
    { channel : 'Canada', channelLogo: 'https://dims.apnews.com/dims4/default/f56d6df/2147483647/strip/true/crop/3000x1688+0+108/resize/1440x810!/quality/90/?url=https%3A%2F%2Fassets.apnews.com%2Fc9%2F06%2Fdf46144df6491a4ea7a136830687%2F4139b6324eb246a0bc4618a02c08988c'
      , linkToChannel:'google.com', time:'12m', ifFollow:true, school:'University Of Ontario', title:'What is wrong with America?', 
      bodySummary:"Bro forreal idk what it be doing you know what i mean when i was...", numOfLikes:332 ,numOfComments:5114, views:934, linkToPost:"nah.com"},
      { channel : 'Tech Refferals', channelLogo: 'https://blog.appleone.com/wp-content/uploads/2016/02/referrals.jpg'
        , linkToChannel:'google.com', time:'12m', ifFollow:true, school:'University Of South Florida', title:'BRO PLZ GIVE ME A JOB', 
        bodySummary:"My proffessor asked me this and all I could say is that we live in a society...", numOfLikes:1 ,numOfComments:1, views:2234, linkToPost:"nah.com"},
        { channel : 'Tech Refferals', channelLogo: 'https://blog.appleone.com/wp-content/uploads/2016/02/referrals.jpg'
          , linkToChannel:'google.com', time:'12m', ifFollow:true, school:'University Of South Florida', title:'BRO PLZ GIVE ME A JOB', 
          bodySummary:"My proffessor asked me this and all I could say is that we live in a society...", numOfLikes:1 ,numOfComments:1, views:2234, linkToPost:"nah.com"}
      ]
  

//channel will be routed with the channelId and we make a fetch call here
function ChannelPage() {

  const { channelId } = useParams();
  const { userId } = useUser();
  

  const [channelData, setChannelData] = useState(null);
  const [channelPosts, setChannelPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => { //finished here need to connect the data
    const fetchChannelData = async () => {
      try {
        setLoading(true);

        // Replace with actual API endpoints
        const channelRes = await fetch(`${process.env.REACT_APP_API_BASE_URL}/channel_info_for_user?user_id=${userId}&channel_id=${channelId}`);
        const postRes = await fetch(`${process.env.REACT_APP_API_BASE_URL}/channel_posts?user_id=${userId}&channel_id=${channelId}`);

        if (!channelRes.ok || !postRes.ok) throw new Error('Failed to fetch');

        const channelData = await channelRes.json();
        const postData = await postRes.json();

        setChannelData(channelData);
        setChannelPosts(postData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchChannelData();
  }, [channelId]);

    if (loading || !channelData) return <LoadingScreen />; // You can customize this
    return (
      <div className="channelPageContainer">
        
        <div className="channelPageTitle" style={{backgroundImage:`url(${channelData.channel_banner})`}}>
          <div className="channelInfoContainer">
            <div className="topRow">
                <img src={channelData.channel_photo} alt="" />
                <div className="nameAndFCountContainer">
                  <h3>{channelData.channel_name}</h3>
                  <div className="followerCountRow">
                    {!channelData.is_private ? <Globe className="globe"/> : <Lock className="globe"/>}
                    <span>{channelData.is_private ? "Private" : "Public"} · {channelData.follower_count} followers</span>
                  </div>
                </div>
                <div className="ifFollowBtn">{channelData.is_followed ? "Following" : "Follow"}</div>
            </div>
            <div className="bottomRow">
              <span className="summary">{channelData.channel_desc}</span>
            </div>
          </div>
          <div className="titleBottomBar">
            <div className="channelFilterPostsBtn">
              <span>Recent</span>
              <Arrow />
            </div>
          </div>
        </div>
        {console.log(channelPosts.post)}
        <div className="channelPageBodyContainer">
          {channelPosts.post.map((post) => (
            <Post
              id={post.owner.id}
              channel={post.channel}
              channelLogo={post.school_photo}
              linkToChannel={post.linkToChannel}
              time={post.time_since_post}
              ifFollow={post.ifFollow}
              school={post.school}
              title={post.title}
              bodySummary={post.content_preview}
              numOfLikes={post.likes_count}
              numOfComments={post.comments_count}
              views={post.view_count}
              linkToPost={post.linkToPost}
            />
          ))}
        </div>


        <BottomNav />
      </div>
    );
  }
  
  export default ChannelPage;
  