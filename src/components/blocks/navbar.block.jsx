import 'assets/css/global.assets.css'
import 'assets/css/blocks/navbar.assets.css'
import React from "react"
import Logo from 'assets/img/crest-icon.png'
import LogoName from 'assets/img/crest-name.png'
import Web3 from 'web3'
import Notiflix from 'notiflix'
import Web3Modal from 'web3modal'
import WalletConnectProvider from "@walletconnect/web3-provider"
import network from 'contracts/network.contracts.js'
import ContractHelper from "helpers/contract.helper"
import Address from 'contracts/address.contracts.json'
import Language from 'assets/data/language.json'
import { ethers, providers } from 'ethers'
import { Link } from "react-router-dom";
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

class Navbar extends React.Component 
{
  
  constructor(props) 
  {
      super(props)

      this.state = 
      {
        isMetamaskSupported: false,
        isLoggedIn: false,
        language: this.props.language,
        currentPage: props.currentPage,

        address: this.props.address,
        crestPrice: this.props.crestPrice,
        maxUserToken: this.props.maxUserToken,
        maxToken: this.props.maxToken,
        isWhitelist: this.props.isWhitelist,
        remainingToken: this.props.remainingToken,
        allowance: this.props.allowance,
        stableBalance: this.props.stableBalance,
        crestBalance: this.props.crestBalance,
        crestBuy: this.props.crestBuy,
        interval: null,
      }

      this.handleChange = this.handleChange.bind(this)
  }

  async UNSAFE_componentWillMount() 
  {
    if (window.ethereum) 
    {
      this.state.isMetamaskSupported = true
      if(this.props.address != "") 
      { 
        this.state.isLoggedIn = true 
        const contractHelper = new ContractHelper()
        let provider = await contractHelper.getProvider()
        let data = 
        {
          crestPrice : await contractHelper.getCrestPrice(provider),
          maxUserToken : await contractHelper.getMaxUserToken(provider, 6),
          maxToken : await contractHelper.getMaxToken(provider, 6),
          isWhitelist : await contractHelper.getIsWhitelist(provider),
          remainingToken : await contractHelper.getRemainingToken(provider, 6),
          crestBuy : await contractHelper.getUserBuyToken(provider, this.state.address, 6),
          stableBalance : await contractHelper.getBalanceOf(provider, Address.stable, this.state.address, 6),
          crestBalance : await contractHelper.getBalanceOf(provider, Address.token, this.state.address, 6),
          allowance : await contractHelper.getAllowance(provider, this.state.address, Address.stable),
        }
        this.props.dashboardAction({data: data, action: "save-data"})
        if(this.state.interval == null) this.state.interval = setInterval(async () => 
        {
          let remainingToken = await contractHelper.getRemainingToken(provider, 6)
          this.props.dashboardAction({data: {remainingToken: remainingToken}, action: "save-data"})
        }, 1000)

      }
    }
  }

  componentWillUnmount()
  {
      clearInterval(this.state.interval)
      this.state.interval = null
  }

  componentDidUpdate(prevProps, prevState, snapshot) 
  {
      for(const [key, value] of Object.entries(this.state))
      {
          if (prevProps[key] !== this.props[key])
          {  
            console.log("test1")
            this.state[key] = this.props[key]
            this.forceUpdate()
          }
      }
  }

  handleChange(event)
  {
    let target = event.target
    if(target.name == "french") 
    {
      document.getElementById("french").checked = true
      document.getElementById("english").checked = false
      document.getElementById("japanese").checked = false
      this.props.loginAction({language: "fr", action: "language"})
    
    }else if(target.name == "english") 
    {
      document.getElementById("french").checked = false
      document.getElementById("english").checked = true
      document.getElementById("japanese").checked = false
      this.props.loginAction({language: "en", action: "language"})
    
    }else if(target.name == "japanese") 
    {
      document.getElementById("french").checked = false
      document.getElementById("english").checked = false
      document.getElementById("japanese").checked = true
      this.props.loginAction({language: "jp", action: "language"})
    
    }
  }

  
  connectWallet = async () => 
  {
      if (this.state.isMetamaskSupported) 
      {
        const providerOptions = { walletconnect: { package: WalletConnectProvider, options: { rpc: { [network.chainId]: network.rpcUrls[0] } } } }
        let web3Modal = new Web3Modal( { cacheProvider: true, providerOptions, disableInjectedProvider: false, theme: "dark" })

        const instance = await web3Modal.connect()
        const newProvider = new ethers.providers.Web3Provider(instance)
        const chainId = (await newProvider.getNetwork()).chainId

        if (chainId == network.chainId) 
        {
          this.state.isLoggedIn = true
          this.props.loginAction({address: await newProvider.getSigner().getAddress(), action: 'address'})

          const contractHelper = new ContractHelper()
          let data = 
          {
            crestPrice : await contractHelper.getCrestPrice(newProvider),
            maxUserToken : await contractHelper.getMaxUserToken(newProvider, 6),
            maxToken : await contractHelper.getMaxToken(newProvider, 6),
            isWhitelist : await contractHelper.getIsWhitelist(newProvider),
            remainingToken : await contractHelper.getRemainingToken(newProvider, 6),
            crestBuy : await contractHelper.getUserBuyToken(newProvider, this.state.address, 6),
            stableBalance : await contractHelper.getBalanceOf(newProvider, Address.stable, this.state.address, 6),
            crestBalance : await contractHelper.getBalanceOf(newProvider, Address.token, this.state.address, 6),
            allowance : await contractHelper.getAllowance(newProvider, this.state.address, Address.stable),
          }        
          this.props.dashboardAction({data: data, action: "save-data"})
          if(this.state.interval == null) this.state.interval = setInterval(async () => 
          {
            let remainingToken = await contractHelper.getRemainingToken(newProvider, 6)
            this.props.dashboardAction({data: {remainingToken: remainingToken}, action: "save-data"})
          }, 1000)

        }else 
        {
          Notiflix.Notify.warning(
          "Required Network - " + network.chainName, { timeout: 1500, width: '500px', position: 'center-top', fontSize: '22px' })
        }

      }else if (window.web3) window.web3 = new Web3(window.web3.currentProvider)
      else window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
  }

  render()
    {
      
      return(
          <div className="navbar flex row">

            <div className="navbar-logo flex row center">
              <img className="logo-crest" src={Logo} alt={Logo} />  
            </div>

            <div className="navbar-core flex row">

                
                <div className="navbar-select" tabIndex="1">
                  <input name="english" className="navbar-input" type="radio" id="english" checked onChange={event => {}} onClick={this.handleChange}/>
                  <label htmlFor="english" className="navbar-option">English</label>
                  <input name="french" className="navbar-input" type="radio" id="french" onChange={event => {}} onClick={this.handleChange}/>
                  <label htmlFor="french" className="navbar-option">French</label>
                  <input name="japanese" className="navbar-input" type="radio" id="japanese" onChange={event => {}} onClick={this.handleChange}/>
                  <label htmlFor="japanese" className="navbar-option navbar-option-last">Don't click</label>
                </div>


                <div className="navbar-select" tabIndex="1">
                  <input name="Charts" className="navbar-input" type="radio" id="opt1" checked onChange={event => {}}/>
                  <label htmlFor="opt1" className="navbar-option"> { Language[this.state.language].navbar.selectDocs.chart } </label>
                  <input name="Documentation" className="navbar-input" type="radio" id="opt2" onChange={event => {}}/>
                  <label htmlFor="opt2" className="navbar-option">{ Language[this.state.language].navbar.selectDocs.doc }</label>
                  <input name="Disclaimer" className="navbar-input" type="radio" id="opt3" onChange={event => {}}/>
                  <label htmlFor="opt3" className="navbar-option">{ Language[this.state.language].navbar.selectDocs.disclaimer }</label>
                  <input name="Teams" className="navbar-input" type="radio" id="opt3" onChange={event => {}}/>
                  <label htmlFor="opt3" className="navbar-option navbar-option-last">{ Language[this.state.language].navbar.selectDocs.team }</label>
                </div>
                
            </div>

            <div className="navbar-title flex row center">
              <img className="title-crest" src={LogoName} alt={LogoName} />
            </div>

            
            <div className="navbar-button flex row">
              <div className="navbar-button-core flex row">
                <button className="button market-button flex row center"> <p>{ Language[this.state.language].navbar.buyButton }</p> </button>
                {
                  this.state.address !== "" 
                  ?<div className="navbar-address-core flex row center"><p className='navbar-address'>{ this.state.address.substr(0, 6) + '...' +  this.state.address.substr( this.state.address.length - 6,  this.state.address.length)  }</p></div>
                  :<button className="button dapp-button flex row center" onClick={() => this.connectWallet()}> <p>Connect Wallet</p> </button>
                }
                
              </div>
            </div>

          </div>

      )
    }
}


export default connect(MapStateToProps, mapDispatchToProps)(Navbar)
