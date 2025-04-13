import TrendingTiles from "./TrendingTile";
import { Link } from 'react-router-dom';

function TrendingChannels({ data, userId }) {
    return (
        <div className="trendingContainer">
            <h4>Trending Channels</h4>
            <div className="trendingChannels">
                {data.map((tile) => (
                    <Link to={`/channel/${tile.channel_id}`} key={tile.channel_id} state={{ userId }} style={{ textDecoration: 'none', color: 'inherit' }}>
                        <TrendingTiles  logo={tile.channel_photo_url} name={tile.display_name} category={tile.category}/>
                    </Link>
                ))}
            </div>
      </div>
    );
  }
  
  export default TrendingChannels;
  