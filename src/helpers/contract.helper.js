import Address from 'contracts/address.contracts.json'
import abiToken from 'contracts/abis/Token.sol/Token.json'
import abiBadges from 'contracts/abis/Badge.sol/Badge.json'
import abiPresaleToken from 'contracts/abis/PresaleToken.sol/PresaleToken.json'
import abiPresaleNFT from 'contracts/abis/PresaleNFT.sol/PresaleNFT.json'
import abiPresaleWhitelist from 'contracts/abis/PresaleWhitelist.sol/PresaleWhitelist.json'
import  {ethers, BigNumber, utils, constants } from "ethers"
import Web3Modal from 'web3modal'
import Notiflix from 'notiflix'

const { formatUnits, parseUnits } = utils

function displayError(str) {
	Notiflix.Notify.warning(
		str,
		{
			timeout: 1500,
			width: '500px',
			position: 'center-top',
			fontSize: '22px'
		}
	)
}

class ContractHelper
{
    async getProvider()
    {
        const web3Modal = new Web3Modal({ cacheProvider: true, theme: "dark" });
        const instance = await web3Modal.connect(); 
        const provider = await new ethers.providers.Web3Provider(instance);

        return provider
    }

	async getInstance()
    {
        const web3Modal = new Web3Modal({ cacheProvider: true });
        let provider, instance
        if (web3Modal.cachedProvider) 
        {
            instance = await web3Modal.connect()
            provider = await new ethers.providers.Web3Provider(instance); 
        }
        else 
        {
            web3Modal = await new Web3Modal({ cacheProvider: true });
            instance = await web3Modal.connect();
            provider = await new ethers.providers.Web3Provider(instance); 
        }
        return {instance, provider}
    }
	
	getNb(number, decimal) 
    {
        let fractionDigits = 0;
        if (decimal) fractionDigits = decimal;
        if (isNaN(number)) return null
        return parseFloat(number).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: fractionDigits })
    }

	async getCrestPrice(provider) 
	{
		const presale = new ethers.Contract(Address.presaleToken, abiPresaleToken, provider)
		return {
			public: (await presale.ratePublic()).toNumber() / 10000,
			private: (await presale.rateWhitelist()).toNumber() / 10000
		}
	}

	async getMaxUserToken(provider, decimals)
	{
		const presale = new ethers.Contract(Address.presaleToken, abiPresaleToken, provider)
		return formatUnits(await presale.maxUserToken(), decimals)
	}
	
	async getMaxToken(provider, decimals)
	{
		const presale = new ethers.Contract(Address.presaleToken, abiPresaleToken, provider)
		return formatUnits(await presale.maxToken(), decimals)
	}
	
	async getIsWhitelist(provider)
	{
		const presale = new ethers.Contract(Address.presaleToken, abiPresaleToken, provider)
		return await presale.openWhitelist()
	}
	
	async getRemainingToken(provider, decimals)
	{
		const token = new ethers.Contract(Address.token, abiToken, provider)
		return formatUnits(await token.balanceOf(Address.presaleToken), decimals)
	}

	async getBalanceOf(provider, erc20Adrr, userAddr, decimals)
	{
		const erc20 = new ethers.Contract(erc20Adrr, abiToken, provider)
		return formatUnits(await erc20.balanceOf(userAddr), decimals)
	}
	
	async getAllowance(provider, userAddr, erc20Adrr)
	{
		const erc20 = new ethers.Contract(erc20Adrr, abiToken, provider)
		return (await erc20.allowance(userAddr, Address.presaleToken)).gt(0)
	}

    async setApprove(provider, erc20Addr) 
    {
		try {
			const erc20 = new ethers.Contract(erc20Addr, abiToken, provider)
			await(await erc20.connect(provider.getSigner())
				.approve(Address.presaleToken, constants.MaxUint256)
			).wait()
		} catch(e) {
			if (e.reason != undefined)
				displayError(e.reason)
			throw "Error"
		}
    }

    async setPurchase(provider, amountOut, decimals) 
	{
		try {
			const presale = new ethers.Contract(Address.presaleToken, abiPresaleToken, provider)
			await(await presale.connect(provider.getSigner())
				.purchase(parseUnits(amountOut, decimals))
			).wait()
		} catch(e) {
			if (e.reason != undefined)
				displayError(e.reason)
			throw "Error"
		}
    }

	async getUserBuyToken(provider, userAddr, decimals)
    {
        const presale = new ethers.Contract(Address.presaleToken, abiPresaleToken, provider)
        return formatUnits(await presale.userToken(userAddr), decimals)
    } 

}


export default ContractHelper