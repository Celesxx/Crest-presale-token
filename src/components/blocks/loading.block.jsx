import 'assets/css/global.assets.css'
import 'assets/css/blocks/loading.assets.css'
import LoadingAnimation from 'assets/img/crest-loading.mp4'
import React from "react"


class Loading extends React.Component 
{

  render()
    {
      return(
          <div className="loading-home flex column center">

              <video className="shop-video" autoPlay muted loop>
                  <source src={LoadingAnimation} type="video/mp4" />
              </video>

          </div>
      );
    }
}

export default Loading;



