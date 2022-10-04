import Address from 'contracts/address.contracts.json'
import ContractHelper from './contract.helper'



class LoadingHelper
{


    /*------------------------------  ------------------------------*/
    /** 
    * @param {String} address
    * @param {Structure} provider
    * @param {Structure} props
    **/
    async loadAllContractFunction(address, provider, props)
    {
      console.log("test")
      let contractHelper = new ContractHelper()
    
      props.dashboardAction({loading : {}, action: "loading"})
      props.dashboardAction({loading : {}, action: "loading"})
      let data = { crestPrice : null, maxUserToken : null, maxToken : null, isWhitelist : null, remainingToken : null, crestBuy : null, stableBalance : null, crestBalance : null, allowance : null, }        
      props.dashboardAction({loading : {}, action: "loading"})
      data.crestPrice = await contractHelper.getCrestPrice(provider)
      props.dashboardAction({loading : {}, action: "loading"})
      data.maxUserToken = await contractHelper.getMaxUserToken(provider, 6)
      props.dashboardAction({loading : {}, action: "loading"})
      data.maxToken = await contractHelper.getMaxToken(provider, 6)
      props.dashboardAction({loading : {}, action: "loading"})
      data.isWhitelist = await contractHelper.getIsWhitelist(provider)
      props.dashboardAction({loading : {}, action: "loading"})
      data.remainingToken = await contractHelper.getRemainingToken(provider, 6)
      props.dashboardAction({loading : {}, action: "loading"})
      data.crestBuy = await contractHelper.getUserBuyToken(provider, address, 6)
      props.dashboardAction({loading : {}, action: "loading"})
      data.stableBalance = await contractHelper.getBalanceOf(provider, Address.stable, address, 6)
      props.dashboardAction({loading : {}, action: "loading"})
      data.crestBalance = await contractHelper.getBalanceOf(provider, Address.token, address, 6)
      props.dashboardAction({loading : {}, action: "loading"})
      data.allowance = await contractHelper.getAllowance(provider, address, Address.stable)
      props.dashboardAction({loading : {}, action: "loading"})

      await new Promise(r => setTimeout(r, 2000));
      props.dashboardAction({loading : {}, action: "loading"})
      console.log(data)
      props.dashboardAction({data: data, action: "save-data"})
      props.dashboardAction({loading : {}, action: "end-loading"})
      return
    }

}

export default LoadingHelper