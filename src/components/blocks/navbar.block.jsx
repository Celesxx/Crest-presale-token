import 'assets/css/global.assets.css'
import 'assets/css/blocks/navbar.assets.css'
import React from "react"
import Logo from 'assets/img/crest-icon.png'
import LogoName from 'assets/img/crest-name.svg'
import Web3 from 'web3'
import Notiflix from 'notiflix'
import Web3Modal from 'web3modal'
import WalletConnectProvider from "@walletconnect/web3-provider"
import network from 'contracts/network.contracts.js'
import ContractHelper from "helpers/contract.helper"
import Language from 'assets/data/language.json'
import LoadingHelper from 'helpers/loadingData.helpers.js'
import BuyPopup from 'components/popup/buy.popup.jsx'
import { ethers } from 'ethers'
import { connect } from 'react-redux'
import { LoginActions } from 'store/actions/login.actions.js'
import { DashboardActions } from 'store/actions/dashboard.actions.js'

const MapStateToProps = (state) => {
  return { 
    address: state.login.address,
    language: state.login.language,
    activateListener: state.login.activateListener,

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
        address: this.props.address,
        language: this.props.language,
        isMetamaskSupported: false,
        isLoggedIn: false,
        interval: null,
        listening : false,
        activateListener: this.props.activateListener,

      }

      this.handleChange = this.handleChange.bind(this)
      this.handleChangeLink = this.handleChangeLink.bind(this)
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
        const loadingHelper = new LoadingHelper()
        
        const {instance, provider} = await contractHelper.getInstance()
        document.getElementById('WEB3_CONNECT_MODAL_ID').remove()
        if(this.state.listening !== true) this.addListeners(instance, provider)

        await loadingHelper.loadAllContractFunction(this.state.address, provider, this.props)
        if(this.state.interval == null) this.state.interval = setInterval(async () => 
        {
          let remainingToken = await contractHelper.getRemainingToken(provider, 18)
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

  async componentDidUpdate(prevProps, prevState, snapshot) 
  {
      for(const [key, value] of Object.entries(this.state))
      {
          if (prevProps[key] !== this.props[key])
          {  
            this.state[key] = this.props[key]
            if(key === "activateListener" && this.state[key] === true)
            {
              let contractHelper = new ContractHelper()
              const {instance, provider} = await contractHelper.getInstance()
              document.getElementById('WEB3_CONNECT_MODAL_ID').remove()
              if(this.state.listening !== true) this.addListeners(instance, provider)
            }
            this.forceUpdate()
          }
      }
  }

  handleChange(event)
  {
    let target = event.target
    if(target.id == "french") this.props.loginAction({language: "fr", action: "language"})
    else if(target.id == "english") this.props.loginAction({language: "en", action: "language"})
  }

  handleChangeLink(event)
  {
    let target = event.target
    if(target.id == "opt2") window.location='https://playcrest.xyz'
    else if(target.id == "opt3") window.location='https://medium.com/@playCrest'
    else if(target.id == "opt4") window.location='https://twitter.com/playCrest'
    else if(target.id == "opt5") window.location='https://discord.com/invite/mUHGNqN8Vj'
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
          this.props.dashboardAction({loading : {}, action: "start-loading"})
          
          const contractHelper = new ContractHelper()
          const loadingHelper = new LoadingHelper()
          await loadingHelper.loadAllContractFunction(await newProvider.getSigner().getAddress(), newProvider, this.props)
         
          if(this.state.listening !== true) this.addListeners(instance, newProvider)
          
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


  async addListeners(instance, provider) 
  {
    this.state.listening = true
    instance.on('accountsChanged', async (accounts) => 
    {
      if(this.state.address )
      {
        let account = accounts[0] !== null && accounts[0] !== undefined ? accounts[0] : ""
        let loadingHelper = new LoadingHelper()
        this.props.loginAction({address: account, action: 'address'})
        await this.props.dashboardAction({data : {}, action: "reset"})
        if(account != "")
        {
          this.props.dashboardAction({loading : {}, action: "start-loading"})
          await loadingHelper.loadAllContractFunction(accounts[0], provider, this.props)
        }
      }
    })
    
    instance.on("disconnect",() => 
    {
      instance.close();
      instance.clearCachedProvider();
      this.props.loginAction({address: "", action: 'address'})
    });
  }


  render()
    {
      
      return(
        <div className="navbar flex row">

          <div className="navbar-logo flex row center">
            <img className="logo-crest" src={Logo} alt={Logo} />  
          </div>

          <div className="navbar-core flex row">

              
            <form className="navbar-select" tabIndex="1" onChange={this.handleChange}>
              <input name="language-select" className="navbar-input" type="radio" id="english" defaultChecked/>
              <label htmlFor="english" className="navbar-option">English</label>
              <input name="language-select" className="navbar-input" type="radio" id="french"/>
              <label htmlFor="french" className="navbar-option">French</label>
            </form>


            <form className="navbar-select" tabIndex="1" onChange={this.handleChangeLink}>
              <input name="doc-select" className="navbar-input" type="radio" id="opt1" defaultChecked/>
              <label htmlFor="opt1" className="navbar-option"> { Language[this.state.language].navbar.selectDocs.default } </label>
              <input name="doc-select" className="navbar-input" type="radio" id="opt2"/>
              <label htmlFor="opt2" className="navbar-option"> {Language[this.state.language].navbar.selectDocs.website } </label>
              <input name="doc-select" className="navbar-input" type="radio" id="opt3"/>
              <label htmlFor="opt3" className="navbar-option"> {Language[this.state.language].navbar.selectDocs.doc } </label>
              <input name="doc-select" className="navbar-input" type="radio" id="opt4"/>
              <label htmlFor="opt4" className="navbar-option"> {Language[this.state.language].navbar.selectDocs.twitter }</label>
              <input name="doc-select" className="navbar-input" type="radio" id="opt5"/>
              <label htmlFor="opt5" className="navbar-option"> {Language[this.state.language].navbar.selectDocs.discord } </label>
            </form>
              
          </div>

          <div className="navbar-title flex row center">
            <img className="title-crest" src={LogoName} alt={LogoName} />
          </div>

          <div className="navbar-button flex row">
            <div className="navbar-button-core flex row">
              <BuyPopup currentPage="navbar"/>
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
