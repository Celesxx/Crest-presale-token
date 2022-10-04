import 'assets/css/index.assets.css'
import 'assets/css/global.assets.css'
import 'assets/css/index.assets.css'
import React from "react";
import NavbarPresale from "components/blocks/navbar.block.jsx"
import LeftbarPresale from "components/blocks/leftbar.block.jsx"
import HomeBlock from "components/blocks/home.block.jsx"

class Home extends React.Component 
{

  constructor(props) 
  {
      super(props);

      this.state = { };

  }

  render()
  {
    return(
      <div className="home">

        <NavbarPresale currentPage="home" />
        <LeftbarPresale />
        <HomeBlock />
      
      </div>

    );
  }
}

export default Home;
