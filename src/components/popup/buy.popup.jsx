import React from "react"
import Popup from 'reactjs-popup'
import 'assets/animation/keyframes.assets.css'
import 'assets/css/index.assets.css'
import 'assets/css/global.assets.css'
import 'assets/css/popup/buy.assets.css'
import 'assets/css/popup/mobile/buyMobile.assets.css'
import { connect } from 'react-redux'
import { LoginActions } from 'store/actions/login.actions.js'
import { DashboardActions } from 'store/actions/dashboard.actions.js'
import ContractHelper from "helpers/contract.helper.js"
import Address from 'contracts/address.contracts.json'
import LogoVideo from 'assets/img/swap-dev.mp4'
import Language from 'assets/data/language.json'

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
      crestBalance: state.dashboard.crestBalance
    }; 
  };
  
const mapDispatchToProps = (dispatch) => {
    return {
        loginAction: (data) => { dispatch(LoginActions(data)); },
        dashboardAction: (data) => { dispatch(DashboardActions(data)); },
    }
}

class BuyPopup extends React.Component 
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
            amountPrice: null,
            cost: null,
            currentPage : props.currentPage,
            
        }
        this.handleChange = this.handleChange.bind(this)
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

    checkNumber(event)
    {
      let target = event.target
      let theEvent = event
      let key
      if (theEvent.type === 'paste') 
      {
          key = event.clipboardData.getData('text/plain');
      } else 
      {
          key = theEvent.keyCode || theEvent.which;
          key = String.fromCharCode(key);
      }

      let regex = /^[0-9]+[.]{0,1}[0-9]{0,6}$/
      
      if( !regex.test(target.value + key) )
      {
        theEvent.returnValue = false;
        if(theEvent.preventDefault) theEvent.preventDefault();
      }
    }

    handleChange(event)
    {
        let target = event.target
        this.state.amountPrice = target.value
        if(this.state.amountPrice === "") this.state.cost = null
        else if(this.state.whitelist) this.state.cost = parseFloat(this.state.amountPrice) * this.state.crestPrice.private
        else this.state.cost = parseFloat(this.state.amountPrice) * this.state.crestPrice.public
        
        this.forceUpdate()
    }

    async setAllowance()
    {
        let contractHelper = new ContractHelper()
        let provider = await contractHelper.getProvider()
        await contractHelper.setApprove(provider, Address.stable)
        this.props.dashboardAction({data: {allowance: true }, action: "save-data"})
    }

   
    async buyCrest()
    {
        const contractHelper = new ContractHelper()
        const provider = await contractHelper.getProvider()
        await contractHelper.setPurchase(provider, this.state.amountPrice, 18)
        let data = 
        {
            stableBalance: await contractHelper.getBalanceOf(provider, Address.stable, this.state.address, 18),
            crestBalance: await contractHelper.getBalanceOf(provider, Address.token, this.state.address, 18),
            crestBuy: await contractHelper.getUserBuyToken(provider, this.state.address, 18)
        }
        this.props.dashboardAction({data: data, action: "save-data"})
    }
    
    render()
    {
        let contractHelper = new ContractHelper()
        return(
            
            <Popup trigger={<button className="button shop-items-button buy-popup-navbar" id={this.state.currentPage}>{ Language[this.state.language].buyPopup.buy } $CREST</button>} modal nested>
            {
                close => (
                    <div className="buy-popup-base flex row">
                        
                        <div className="buy-popup-head flex column">

                            <div className="buy-popup-head-core flex column">
                                <h1 className="buy-popup-head-title no-margin">{ Language[this.state.language].buyPopup.title } $CREST</h1>

                                <div className="buy-popup-head-exchange flex column">
                                    <h1 className="buy-popup-exchange-title no-margin">{ Language[this.state.language].buyPopup.exchange }</h1>
                                    <div className="buy-popup-exchange-core flex row center">
                                        <p className="buy-popup-exchange-desc no-margin">1 $CREST</p>
                                        <div className="buy-popup-exchange-separator" />
                                        <p className="buy-popup-exchange-desc no-margin">10 $BUSD</p>
                                    </div>
                                </div>
                            </div>

                            <div className="buy-popup-input-core flex column center">

                                <div className="buy-popup-base-core flex column center">
                                    <div className="buy-popup-input-head flex row">
                                        <p className="buy-popup-input-title no-margin">{ Language[this.state.language].buyPopup.amount }</p>
                                        <p className="buy-popup-input-desc no-margin">{ Language[this.state.language].buyPopup.balance } : {contractHelper.getNb(this.state.crestBalance, 2)}</p>
                                    </div>
                                    <input className="buy-popup-input" placeholder="Amount CREST" type="text" name="crest" id="balanceIn" onKeyPress={this.checkNumber} onChange={this.handleChange}></input>
                                </div>
                                
                                <div className="buy-popup-base-core flex column center">
                                    <div className="buy-popup-balance-head flex row">
                                        <p className="buy-popup-balance-title no-margin">{ Language[this.state.language].buyPopup.cost } BUSD</p>
                                        <p className="buy-popup-balance-desc no-margin">{ Language[this.state.language].buyPopup.balance } : {contractHelper.getNb(this.state.stableBalance, 2)}</p>
                                    </div>
                                    <div className="buy-popup-balance">{this.state.cost}</div>
                                </div>

                            </div>

                            

                            <div className="buy-popup-button-core flex center">              
                                {
                                    this.state.allowance
                                    ? <button className="button buy-popup-button" onClick={() => this.buyCrest()}>{ Language[this.state.language].buyPopup.buy }</button>
                                    : <button className="button buy-popup-button" onClick={() => this.setAllowance()}>{ Language[this.state.language].buyPopup.approve }</button>
                                }
                            </div>

                        </div>

                        <div className="buy-popup-video-core">
                            <video playsInline className="buy-popup-video" autoPlay muted loop>
                                <source src={LogoVideo} type="video/mp4" />
                            </video>
                        </div>
                            
                    </div>
                )
            }
            </Popup>
        )
    }
}


export default connect(MapStateToProps, mapDispatchToProps)(BuyPopup)
    