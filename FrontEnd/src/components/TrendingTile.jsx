

function TrendingTiles({ logo, name, category }) {
    return (
        <div className="trendingTileContainer">
            <img className="" src={logo}></img> 
            <p className="middleTextTrending">{name}</p>
            <p className="bottomTextTrending">{category}</p>
        </div>
    );
  }
  
  export default TrendingTiles;
  