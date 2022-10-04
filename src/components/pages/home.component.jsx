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


  UNSAFE_componentWillMount() 
  { 
    window.addEventListener('resize', this.handleWindowSizeChange);
    this.state.width = document.documentElement.clientWidth
    if(this.state.width <= 1500) this.state.isMobile = true
    else this.state.isMobile = false
    this.forceUpdate()
  }
  componentWillUnmount() { window.removeEventListener('resize', this.handleWindowSizeChange); }
  handleWindowSizeChange(event) 
  { 
    this.state.width = document.documentElement.clientWidth
    if(this.state.width <= 1500) this.state.isMobile = true
    else this.state.isMobile = false
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
        <HomeBlock />
        {
          this.state.address === "" &&
          ( <Restricted /> )
        }
        {
          this.state.startLoading === true && this.state.endLoading === false && this.state.address !== "" &&
          ( <LoadingData /> )
        }

      
      </div>

    );
  }
}

export default connect(MapStateToProps)(Home);
