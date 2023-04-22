import 'assets/css/global.assets.css'
import 'assets/css/blocks/leftbar.assets.css'
import React from "react"
import Twitter from 'assets/img/twitter.svg'
import Medium from 'assets/img/medium.svg'
import Discord from 'assets/img/discord.svg'


class Leftbar extends React.Component 
{


  render()
    {
      return(
          <div className="leftbar flex column">

            <div className="leftbar-hidden"></div>

            <div className="leftbar-core flex column">
                  <a href="https://twitter.com/playCrest" target="_blank" rel="noopener noreferrer" className="link"><img src={Twitter} alt={Twitter} /> </a>
                  <a href="https://medium.com/@playCrest" target="_blank" rel="noopener noreferrer" className="link"><img src={Medium} alt={Medium} /></a>
                  <a href="https://discord.com/invite/mUHGNqN8Vj" target="_blank" rel="noopener noreferrer" className="link"><img src={Discord} alt={Discord} /></a>
            </div>

          </div>
      );
    }
}

export default Leftbar;
