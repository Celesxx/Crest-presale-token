import React from "react"
import Popup from 'reactjs-popup'
import 'assets/animation/keyframes.assets.css'
import 'assets/css/index.assets.css'
import 'assets/css/global.assets.css'
import 'assets/css/popup/buy.assets.css'
import { connect } from 'react-redux'
import { LoginActions } from 'store/actions/login.actions.js'
import { DashboardActions } from 'store/actions/dashboard.actions.js'
import Ruby from 'assets/img/ruby.mp4'
import Amber from 'assets/img/amber.mp4'
import Amethyst from 'assets/img/amethyst.mp4'
import ContractHelper from "helpers/contract.helper.js"
import Address from 'contracts/address.contracts.json'
import Language from 'assets/data/language.json'

const MapStateToProps = (state) => {
    return { 
      address: state.login.address,
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
        console.log(`target price : ${this.state.amountPrice}`)

        if(this.state.amountPrice === "") this.state.cost = null
        else if(this.state.whitelist) this.state.cost = parseFloat(this.state.amountPrice) * this.state.crestPrice.private
        else this.state.cost = parseFloat(this.state.amountPrice) * this.state.crestPrice.public

        console.log(`target price : ${this.state.cost}`)
        
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
        await contractHelper.setPurchase(provider, this.state.amountPrice, 6)
        let data = 
        {
            stableBalance: await contractHelper.getBalanceOf(provider, Address.stable, this.state.address, 6),
            crestBalance: await contractHelper.getBalanceOf(provider, Address.token, this.state.address, 6),
            crestBuy: await contractHelper.getUserBuyToken(provider, this.state.address, 6)
        }
        this.props.dashboardAction({data: data, action: "save-data"})
    }
    
    render()
    {
        let contractHelper = new ContractHelper()
        return(
            <Popup trigger={<button className="button shop-items-button">Buy $Crest</button>} modal nested>
            {
                close => (
                    <div className="buy-popup-base flex column">
                        
                        <div className="buy-popup-input-core flex column center">
                            <div className="buy-popup-input-head flex row">
                                <p className="buy-popup-input-title">Amount</p>
                                <p className="buy-popup-input-desc">balance: {contractHelper.getNb(this.state.crestBalance, 2)}</p>
                            </div>
                            <input className="buy-popup-input" placeholder="Amount CREST" type="text" name="crest" id="balanceIn" onKeyPress={this.checkNumber} onChange={this.handleChange}></input>
                        </div>

                        <div className="buy-popup-balance-core flex column center">
                            <div className="buy-popup-balance-head flex row">
                                <p className="buy-popup-balance-title">Cost BUSD</p>
                                <p className="buy-popup-balance-desc">balance: {contractHelper.getNb(this.state.stableBalance, 2)}</p>
                            </div>
                            <div className="buy-popup-balance">{this.state.cost}</div>
                        </div>

                        <div className="buy-popup-button-core flex center">              
                            {
                                this.state.allowance
                                ? <button className="button buy-popup-button" onClick={() => this.buyCrest()}>Buy</button>
                                : <button className="button buy-popup-button" onClick={() => this.setAllowance()}>Approve</button>
                            }
                        </div>
                            
                    </div>
                )
            }
            </Popup>
        )
    }
}


export default connect(MapStateToProps, mapDispatchToProps)(BuyPopup)
    