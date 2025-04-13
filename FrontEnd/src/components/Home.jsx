import NavBar from './NavBar';
import BottomNav from './BottomNav';
import Post from './Post';
import PostFilter from './PostFilter'
import TrendingChannels from './TrendingChannels';
import { useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';


function Home() {
  //test data***
  const data = [{ channel : 'AMA', channelLogo: 'https://thefound.com/cdn/shop/products/SGN238_ASK_ME_ANYTHING.jpg?v=1662760598'
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
  
  const trendingData = [
    {logo: 'https://thefound.com/cdn/shop/products/SGN238_ASK_ME_ANYTHING.jpg?v=1662760598', name: "AMA", category: "Social", id:21},
    {logo: 'https://blog.appleone.com/wp-content/uploads/2016/02/referrals.jpg', name: "Tech Referrals", category: "Job", id:11},
    {logo: 'https://dims.apnews.com/dims4/default/f56d6df/2147483647/strip/true/crop/3000x1688+0+108/resize/1440x810!/quality/90/?url=https%3A%2F%2Fassets.apnews.com%2Fc9%2F06%2Fdf46144df6491a4ea7a136830687%2F4139b6324eb246a0bc4618a02c08988c', name: "Canada", category: "Country", id:1},
    {logo: 'https://thefound.com/cdn/shop/products/SGN238_ASK_ME_ANYTHING.jpg?v=1662760598', name: "AMA", category: "Social", id:5},
    {logo: 'https://blog.appleone.com/wp-content/uploads/2016/02/referrals.jpg', name: "Tech Referrals", category: "Job", id:4}
  ]




    const location = useLocation();
    //const userId = location.state?.userId;//userId passed from login
    const userId = "2bdf827f-4219-4031-bce5-3010fe482d7d";
    const isHome = location.pathname === '/' || location.pathname === '/home';

    const [filterType, setFilterType] = useState('recent');//choose filter type inside the component
    const [posts, setPosts] = useState([]); //will hold posts
    const [loading, setLoading] = useState(false);//say if we are loading
    const [error, setError] = useState(null); //error handilign
    const [trendingChannels, setTrendingChannels] = useState([]);

    const toggleFilterType = (type) => {
      setFilterType(type);
    };

  // 🔁 Fetch trending channels once on first render
  useEffect(() => {
    const fetchTrendingChannels = async () => {
      try {
        const response = await fetch('http://127.0.0.1:5000/trending_channels');
        if (!response.ok) throw new Error('Failed to fetch trending channels');
        const data = await response.json();
        setTrendingChannels(data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchTrendingChannels();
  }, []);


  // Fetch posts when filterType changes or on initial render
  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(
          filterType === 'recent' ? '/api/posts/recent' : '/api/posts/popular'
        );
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setPosts(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [filterType]);


    return (
      <div>
        <NavBar userId={userId}/>

        {isHome && trendingChannels.channels && (
          <TrendingChannels data={trendingChannels.channels} userId={userId} />
        )}

        {isHome && <div className="overlay" style={{'paddingBottom':'0.1em'}}> 
            <h4 className='filterHeader'>Posts</h4>
            <PostFilter filterType={filterType} toggle={toggleFilterType} />
          </div>}
        <div className='overlay'>
          {data.map((post, index) => (
          <Post
            key={index}
            channel={post.channel}
            channelLogo={post.channelLogo}
            linkToChannel={post.linkToChannel}
            time={post.time}
            ifFollow={post.ifFollow}
            school={post.school}
            title={post.title}
            bodySummary={post.bodySummary}
            numOfLikes={post.numOfLikes}
            numOfComments={post.numOfComments}
            views={post.views}
            linkToPost={post.linkToPost}
          />
        ))}
      </div>

        <BottomNav />
      </div>
    );
  }
  
  export default Home;
  