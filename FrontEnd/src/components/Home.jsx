import NavBar from './NavBar';
import BottomNav from './BottomNav';
import Post from './Post';
import PostFilter from './PostFilter'
import TrendingChannels from './TrendingChannels';
import { useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useUser } from './UserContext';


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
    const { userId } = useUser();
    const isHome = location.pathname === '/' || location.pathname === '/home';

    const [filterType, setFilterType] = useState('recent');//choose filter type inside the component
    const [posts, setPosts] = useState(null); //will hold posts
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
        const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/trending_channels`);
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
    if (!userId) return;
    const fetchPosts = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(
          filterType === 'recent' ? `${process.env.REACT_APP_API_BASE_URL}/recent_followed_posts?user_id=${userId}&offset=0&limit=10` : `${process.env.REACT_APP_API_BASE_URL}/popular_posts?offset=0&limit=10`
        );
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setPosts(data);
        console.log(data)
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [filterType, userId]);

    console.log(posts,"gg");
    if (!userId) {
      return <div>Loading user...</div>;
    }
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
        {posts && posts.posts_previews && posts.posts_previews.map((post, index) => (
        <Post
          key={index}
          channelId={post.channel_id}
          channel={post.channel_name}
          channelLogo={post.channel_photo_url}
          linkToChannel={post.linkToChannel}
          time={post.time_since_post}
          ifFollow={true}
          school={post.user_school}
          title={post.title}
          bodySummary={post.content_preview}
          numOfLikes={post.likes_count}
          numOfComments={post.comments_count}
          views={post.views_count}
          linkToPost={post.linkToPost}
        />
      ))}
      </div>

        <BottomNav />
      </div>
    );
  }
  
  export default Home;
  