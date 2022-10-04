import 'assets/css/index.assets.css';
import 'assets/css/global.assets.css';
import 'assets/css/blocks/restricted.assets.css';
import 'assets/css/blocks/mobile/restrictedMobile.assets.css'
import React from "react";
import Web3 from 'web3'
import Notiflix from 'notiflix';
import Web3Modal from 'web3modal'
import WalletConnectProvider from "@walletconnect/web3-provider";
import network from 'contracts/network.contracts.js'
import LoadingHelper from 'helpers/loadingData.helpers.js'
import { ethers } from 'ethers'
import { connect } from 'react-redux'
import { LoginActions } from 'store/actions/login.actions.js'
import { DashboardActions } from 'store/actions/dashboard.actions.js'

const MapStateToProps = (state) => {
  return { 
    address: state.login.address,
  }; 
};

const mapDispatchToProps = (dispatch) => {
    return {
        loginAction: (data) => { dispatch(LoginActions(data)); },
        dashboardAction: (data) => { dispatch(DashboardActions(data)); },
    };
};

class LoadingData extends React.Component 
{

    constructor(props) 
    {
        super(props);

        this.state = 
        {
            address: this.props.address,
            isMetamaskSupported: false,
            isLoggedIn: false,
        };
    }

    async UNSAFE_componentWillMount() 
    {
        console.log(document.querySelectorAll('.home'))
        if (window.ethereum) 
        {
            this.state.isMetamaskSupported = true
            if(this.props.address != "") { this.state.isLoggedIn = true }
        }
    }
        
    componentDidMount() { document.querySelectorAll('.home').forEach((element) => { element.classList.add("menu-toggle") }) }
    componentWillUnmount() { document.querySelectorAll('.home').forEach((element) => { element.classList.remove("menu-toggle") })}

    componentDidUpdate(prevProps, prevState, snapshot) 
    {
        for(const [key, value] of Object.entries(this.state))
        {
            if (prevProps[key] !== this.props[key] && this.state[key] != undefined)
            {   
                this.state[key] = this.props[key]
                this.forceUpdate();
            }
        }
    }


    connectWallet = async () => 
    {
        if (this.state.isMetamaskSupported) 
        {
            const providerOptions = { walletconnect: { package: WalletConnectProvider, options: { rpc: { [network.chainId]: network.rpcUrls[0] } } } }
            let web3Modal = new Web3Modal( { cacheProvider: true, providerOptions, disableInjectedProvider: false, theme: "dark" })

            const instance = await web3Modal.connect()
            const newProvider = new ethers.providers.Web3Provider(instance);
            const chainId = (await newProvider.getNetwork()).chainId

            if (chainId == network.chainId) 
            {
                this.state.isLoggedIn = true
                this.props.loginAction({address: await newProvider.getSigner().getAddress(), action: 'address'})
                this.props.dashboardAction({loading : {}, action: "start-loading"})

                let loadingHelper = new LoadingHelper()
                await loadingHelper.loadAllContractFunction(await newProvider.getSigner().getAddress(), newProvider, this.props)

            }else 
            {
            Notiflix.Notify.failure(
            "Required Network - " + network.chainName, { timeout: 2500, width: '300px', position: 'right-top' });
            }

        }else if (window.web3) window.web3 = new Web3(window.web3.currentProvider)
        else window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
    }

    render()
    {
        return(
            <div className="restricted-core flex column center">
                <div className="restricted-card flex column">
                    <h1 className="restricted-title">Connect your wallet to unlock this panel !</h1>
                    <button className="button restricted-button flex row center border-gradient-bluePink" onClick={() => this.connectWallet()}> <p>Connect Wallet</p> </button>
                </div>
                
            </div>
        )
    }
}

export default connect(MapStateToProps, mapDispatchToProps)(LoadingData);
