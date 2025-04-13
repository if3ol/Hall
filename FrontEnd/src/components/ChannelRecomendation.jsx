
function ChannelRecomendation({ logo, name, summary }) {
    return (
        <div className="channelTile" style={{ backgroundImage: `url(${logo})` }}>
        <div className="channelOverlay">
            <div className="tileTextContainer">          
                <p className="channelName">{name}</p>
            <p className="channelSummary">{summary}</p>
            </div>

        </div>
      </div>
    );
  }
  
  export default ChannelRecomendation;
  