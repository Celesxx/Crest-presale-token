import 'assets/css/index.assets.css'
import 'assets/css/global.assets.css'
import React from "react";
import NavbarPresale from "components/blocks/navbar.block.jsx"
import NavbarPresaleMobile from "components/blocks/mobile/navbarMobile.block.jsx"
import LeftbarPresale from "components/blocks/leftbar.block.jsx"
import HomeBlock from "components/blocks/home.block.jsx"
import LoadingData from "components/blocks/loading-data.block.jsx"
import Restricted from "components/blocks/restricted.block.jsx"
import { connect } from 'react-redux'


const MapStateToProps = (state) => {
  return { 
    address: state.login.address,
    startLoading: state.dashboard.startLoading,
    endLoading: state.dashboard.endLoading,
  }; 
};

class Home extends React.Component 
{

  constructor(props) 
  {
      super(props);
      this.state = 
      {
        address: this.props.address,
        startLoading: this.props.startLoading,
        endLoading: this.props.endLoading,
        width: null,
        isMobile: false
      };
      this.handleWindowSizeChange = this.handleWindowSizeChange.bind(this)
  }


  UNSAFE_componentWillMount() { window.addEventListener('resize', this.handleWindowSizeChange); }
  componentWillUnmount() { window.removeEventListener('resize', this.handleWindowSizeChange); }
  componentDidMount()
  {
    this.state.width = document.documentElement.clientWidth
    let isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    if (isMobile && this.state.width <= 1200) 
    {
      this.state.isMobile = true
      const root = document.getElementById('root');
      const home = document.querySelector('.home');
      if (window.matchMedia("(orientation: landscape)").matches) 
      {
        root.style["height"] = "100vw"
        home.style["height"] = "100vw"
      }
      else 
      {
        root.style["height"] = "100vh"
        home.style["height"] = null
      }
    }else
    {
      this.state.isMobile = false
      const root = document.getElementById('root');
      const home = document.querySelector('.home');
      root.style["height"] = "100vh"
      home.style["height"] = null
    }
    this.forceUpdate()
  }

  handleWindowSizeChange(event) 
  { 
    this.state.width = document.documentElement.clientWidth
    let isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    if (isMobile && this.state.width <= 1200) 
    {
      this.state.isMobile = true
      const root = document.getElementById('root');
      const home = document.querySelector('.home');
      if (window.matchMedia("(orientation: landscape)").matches) 
      {
        root.style["height"] = "100vw"
        home.style["height"] = "100vw"
      }
      else 
      {
        root.style["height"] = "100vh"
        home.style["height"] = null
      }
    }else 
    {
      this.state.isMobile = false
      const root = document.getElementById('root');
      const home = document.querySelector('.home');
      root.style["height"] = "100vh"
      home.style["height"] = null
    }
    this.forceUpdate()
  }

  componentDidUpdate(prevProps, prevState, snapshot) 
  {
    for(const [key, value] of Object.entries(this.state))
    {
      if (prevProps[key] !== this.props[key])
      {   
        this.state[key] = this.props[key]
        this.forceUpdate();
      }
    }
  }

  render()
  {
    return(
      <div className="home">

        { this.state.isMobile != true ? <NavbarPresale/> : <NavbarPresaleMobile/> }
        { this.state.isMobile != true && <LeftbarPresale /> }
        <HomeBlock isMobile={this.state.isMobile}/>
        {
          this.state.address === "" &&
          ( <Restricted /> )
        }
        {
          this.state.startLoading === true && this.state.endLoading === false &&
          ( <LoadingData/> )
        }

      
      </div>

    );
  }
}

export default connect(MapStateToProps)(Home);
