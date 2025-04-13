import NavBar from "./NavBar";
import BottomNav from "./BottomNav";
import ChannelRecomendation from "./ChannelRecomendation"

const data = [
    {logo:'https://thefound.com/cdn/shop/products/SGN238_ASK_ME_ANYTHING.jpg?v=1662760598', name:'AMA', summary:"The inequality of the summary"},
    {logo:'https://dims.apnews.com/dims4/default/f56d6df/2147483647/strip/true/crop/3000x1688+0+108/resize/1440x810!/quality/90/?url=https%3A%2F%2Fassets.apnews.com%2Fc9%2F06%2Fdf46144df6491a4ea7a136830687%2F4139b6324eb246a0bc4618a02c08988c', name:'Canada', summary:"The inequality of the summary"},
    {logo:'https://blog.appleone.com/wp-content/uploads/2016/02/referrals.jpg', name:'Tech Refferals', summary:"PLZ BRO PLZ"},
    {logo:'https://thefound.com/cdn/shop/products/SGN238_ASK_ME_ANYTHING.jpg?v=1662760598', name:'AMA', summary:"The inequality of the summary"}
]

function DiscoverChannels() {
    return (
      <div className="discoverPageContainer">
        <NavBar />
        <div className="reccomendedContainer">
            <h4 className="suggestedHeader">Sugested Channels</h4>
            <div className="recomendedTilesContainer">
                {data.map((channel) => {
                    return <ChannelRecomendation logo={channel.logo} name={channel.name} summary={channel.summary}/>
                })}
            </div>
        </div>
        <BottomNav />
      </div>
    );
  }
  
  export default DiscoverChannels;
  