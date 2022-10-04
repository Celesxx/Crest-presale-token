import 'assets/css/global.assets.css';
import 'assets/css/index.assets.css';
import 'assets/css/blocks/home.assets.css'
import 'assets/css/blocks/mobile/homeMobile.assets.css'
import React from "react";
import LogoVideo from 'assets/img/token-web.mp4'
import ContractHelper from "helpers/contract.helper"
import Language from 'assets/data/language.json'
import BuyPopup from 'components/popup/buy.popup.jsx'
import { connect } from 'react-redux'
import { LoginActions } from 'store/actions/login.actions.js'
import { DashboardActions } from 'store/actions/dashboard.actions.js'

const MapStateToProps = (state) => {
  return { 
    address: state.login.address,
    language: state.login.language,
    crestPrice: state.dashboard.crestPrice,
    maxUserToken: state.dashboard.maxUserToken,
    maxToken: state.dashboard.maxToken,
    isWhitelist: state.dashboard.isWhitelist,
    remainingToken: state.dashboard.remainingToken,
    allowance: state.dashboard.allowance,
    stableBalance: state.dashboard.stableBalance,
    crestBalance: state.dashboard.crestBalance,
    crestBuy: state.dashboard.crestBuy,
  }; 
};

const mapDispatchToProps = (dispatch) => {
  return {
      loginAction: (data) => { dispatch(LoginActions(data)); },
      dashboardAction: (data) => { dispatch(DashboardActions(data)); },
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
      language: this.props.language,
      crestPrice: this.props.crestPrice,
      maxUserToken: this.props.maxUserToken,
      maxToken: this.props.maxToken,
      isWhitelist: this.props.isWhitelist,
      remainingToken: this.props.remainingToken,
      allowance: this.props.allowance,
      stableBalance: this.props.stableBalance,
      crestBalance: this.props.crestBalance,
      crestBuy: this.props.crestBuy,
      width: null,
      isMobile: false,
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
      let contractHelper = new ContractHelper()
      return (
        <div className='home-base flex row'>
          
          <div className='home-head-core flex column'>
           

            <div className='home-head-info flex column'>
              <h1 className='home-head-title no-margin no-padding'>{ Language[this.state.language].home.headTitleP1 } <span className='gradient-pink'>Token</span></h1>
              <h1 className='home-head-discount no-margin no-padding'>10% { Language[this.state.language].home.headTitleP2 }</h1>
              <p className='home-head-start no-margin no-padding'>{`${ Language[this.state.language].home.start } -> 10/10 00:00`}</p>
              <p className='home-head-end no-margin no-padding'>{`${ Language[this.state.language].home.end } -> 17/10 00:00`}</p>
            </div>

            {
              !this.state.isMobile && 
              <div className='home-head-button flex row'>
                <BuyPopup />
              </div>
            }


            <div className='home-head-remaining-core flex column'>
              { !this.state.isMobile && <h1 className='home-head-remaining no-margin no-padding'>{ Language[this.state.language].home.remainingTime }</h1> }
              <h1 className='home-head-time no-margin no-padding'>3:13:40</h1>
            </div>


            <div className='home-head-data-core flex row'>

              <div className='home-head-data-price flex column center'>
                <p className='home-head-data-desc no-margin no-padding'>$Crest { Language[this.state.language].home.price }</p>
                <h2 className='home-head-data-title no-margin no-padding'> ${ this.state.isWhitelist ? this.state.crestPrice.private : this.state.crestPrice.public } </h2>
              </div>

              <div className='home-head-data-separator'></div>

              <div className='home-head-data-token flex column center'>
                <p className='home-head-data-desc no-margin no-padding'>{ Language[this.state.language].home.max }</p>
                <h2 className='home-head-data-title no-margin no-padding'>{contractHelper.getNb(this.state.maxUserToken,0)}</h2>
              </div>

            </div>


          </div>





          <div className='home-content-core flex column center'>

            <div className='home-content-logo-core flex center'>
              <video playsInline className="home-video" autoPlay muted loop>
                <source src={LogoVideo} type="video/mp4" />
              </video>
            </div>

            <div className='home-content-loading-core flex column'>

                {
                  this.state.isMobile && 
                  <div className='home-head-button flex row'>
                    <BuyPopup />
                  </div>
                }

                <div className='home-loading-bar-core flex column center'>
                  <p className='home-loading-bar-title no-margin no-padding'>{contractHelper.getNb(parseFloat(this.state.maxToken) - parseFloat(this.state.remainingToken), 0)} / {contractHelper.getNb(this.state.maxToken, 0)}</p>
                  <div className='home-loading-bar-outer'>
                    <div className='home-loading-bar-inner' style={{ width: `${((parseFloat(this.state.maxToken) - parseFloat(this.state.remainingToken)) / parseFloat(this.state.maxToken) * 100)}%` }}></div>
                  </div>
                  <p className='home-loading-bar-desc no-margin no-padding'>{ Language[this.state.language].home.remainingTotal }</p>
                </div>

                <div className='home-loading-bar-core flex column center'>
                  <p className='home-loading-bar-title no-margin no-padding'>{contractHelper.getNb(this.state.crestBuy, 2 )} / {contractHelper.getNb(this.state.maxUserToken, 0)}</p>
                  <div className='home-loading-bar-outer'>
                    <div className='home-loading-bar-inner' style={{ width: `${(parseFloat(this.state.crestBuy) / parseFloat(this.state.maxUserToken) * 100)}%` }}></div>
                  </div>
                  <p className='home-loading-bar-desc no-margin no-padding'>{ Language[this.state.language].home.remainingUser }</p>
                </div>

            </div>

          </div>

        </div>
      );
    }
}

export default connect(MapStateToProps, mapDispatchToProps)(Home);
