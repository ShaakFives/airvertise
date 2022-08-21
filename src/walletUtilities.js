import WalletConnectProvider from "@walletconnect/web3-provider";
import Web3Modal from "web3modal";
import Web3 from "web3"
import { ethers } from "ethers" ;

// import { handleAuth  } from './WalletConnect';

const providerOptions = {
    walletconnect: {
      package: WalletConnectProvider, 
      options: {
        infuraId: "da5788510cac487aa9aa09ce47de1fd8", 
        rpc: {
          80001: "https://polygon-mumbai.infura.io/v3/da5788510cac487aa9aa09ce47de1fd8"
          },
      }
    }
  };

const web3modal = new Web3Modal(
    {
        network : "mumbai",
        theme : "dark",
        cacheProvider : false,
        providerOptions
    } 
);

export const handleConnectWallet = async function connectWallet({setAccount,setWeb3modal,setProvider}) {
    var provider = await web3modal.connect()

    await provider.enable();
    var web3 = new Web3(provider)
    const acc = await web3.eth.getAccounts(); 

    // var provider2 =  new ethers.providers.Web3Provider(provider);

    
    // handleAuth(web3,provider2);
    // provider.getSigner();??
    setAccount(acc[0]);
    setWeb3modal(web3modal); 
    setProvider(provider);


};