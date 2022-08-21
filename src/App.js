import React, { useState } from "react";
import "./components/styles/main.css"
import marketing from "./assets/images/moon.jpg";
import { WorldIDWidget } from "@worldcoin/id";
import { Web3Storage } from 'web3.storage/dist/bundle.esm.min.js';
import { createClient } from 'urql'
import { handleConnectWallet } from './walletUtilities';
// import Advertise from './artifacts/contracts/Advertise.json';

function getAccessToken () {
  // If you're just testing, you can paste in a token
  // and uncomment the following line:
  // return 'paste-your-token-here'

  // In a real app, it's better to read an access token from an
  // environement variable or other configuration that's kept outside of
  // your code base. For this to work, you need to set the
  // WEB3STORAGE_TOKEN environment variable before you run your code.
  return process.env.REACT_APP_WEB3STORAGE_TOKEN
}

function makeStorageClient () {
  return new Web3Storage({ token: getAccessToken() })
}
const client = makeStorageClient()


const connectWallet = () => {
  console.log("Connect");
}

function App() {

  const [flyerState, changeFlyer] = useState(false);

  const [account, setAccount] = useState(undefined);
  const [web3modal, setWeb3modal] = useState();
  const [provider, setProvider] = useState();
  
  // Form
  const [campaignData, setDatos] = useState({
    address: '',
    quantity: '',
    fee: '',
    nft: '',
    campaignName: ''
  })

  const handleInputChange = (event) => {
      setDatos({
          ...campaignData,
          [event.quantity.name] : event.quantity.value
      })
  }

  const sendData = (event) => {
      event.preventDefault();
      console.log(campaignData.campaignName);
      console.log(campaignData.address);
      console.log(campaignData.quantity);
      console.log(campaignData.fee);
      console.log(campaignData.nft);
      let targetAccounts = retrieveAddressesFromContract(campaignData.address);
      console.log(targetAccounts);
      let image = getFiles();
      console.log(image);
      let contentId= storeFiles(image);

      launchMarketingCampaign(campaignData.quantity, targetAccounts, campaignData.campaignName, contentId, campaignData.fee);

  }
  
  const retrieveAddressesFromContract = (address) => {
    const query = `
    query GetRelatedAddresses($cuenta) {
      collections(where: {id: $cuenta}) {
        transfers {
          from {
            id
          }
        }
      }
    }
      `
    address = fetchData(query, address)
    console.log(address)
    return address
  }

  const graphClient = createClient({
    url: "https://api.thegraph.com/subgraphs/name/messari/erc721-holders"
  })

  async function fetchData(query, address) {
    const response = await graphClient.query(query, { cuenta: address }).toPromise();

    if (response.data.collections.length >=1) {
      const addresses_ = []
      for (var i in response.data.collections[0].transfers) {
          addresses_.push(response.data.collections[0].transfers[i].from.id)
      }
    const addresses = remove_duplicates(addresses_)
    return addresses
    } else {
      console.log("No addresses found")
      return []
    }

  }

  function remove_duplicates(arr) {
    var obj = {};
    var ret_arr = [];
    for (var i = 0; i < arr.length; i++) {
        obj[arr[i]] = true;
    }
    for (var key in obj) {
        ret_arr.push(key);
    }
    return ret_arr;
  }


  function getFiles () {
    const fileInput = document.querySelector('input[type="file"]')
    return fileInput.files
  }

  async function storeFiles (files) {
    const client = makeStorageClient()
    const cid = await client.put(files)
    console.log('stored files with cid:', cid)
    return cid
  }
  
  async function launchMarketingCampaign(quantity, targetAccounts, campaignName, contentId, fee){
    // here we'll call the bulkAirdropERC721 function from the Advertise.sol contract below
    // function bulkAirdropERC721(address[] calldata _to, NFTmetadata calldata _NFTmetadata)
    
    // quantity determines the amount of targetAccounts to include in _to 9 
    // _NFTmetadata = [campaignName, contentId, fee]
  }

  // const fetchAirdrop = (userAddress) => {
  //   return renderMarketingFlyer(retrieveFile(metadata[1]), metadata, tokenId);
  // }

  const [marketingFlyerState, changeMarketingFlyer] = useState(true);

  async function renderMarketingFlyer(file, metadata, tokenId) {
    changeFlyer(!flyerState)
  }

  // function claimAirdrop(address input, uint256 root, uint256 nullifierHash, uint256[8] calldata proof, uint256 _tokenId) {
  //   console.log("a");
  // }

  // Image preview
  const [file, setFile] = useState();
  function handleChange(e) {
      console.log(e.target.files);
      setFile(URL.createObjectURL(e.target.files[0]));
  }

  return (
    <div className="container">
      <div className="row py-4">
        <div className='col-3'></div>
        <div className='col-6'>
          <h1 className="text-center">AIRVERTISE</h1>
        </div>
        <div className='col-3 text-center'>
          
        { account?
          <>
          <button onClick={
            async ()=>{
              await web3modal.clearCachedProvider();
              setAccount(undefined);
              setProvider();}
            }>Disconnect</button>
          </>:
          <>
          <button onClick={
            () => {
              handleConnectWallet({
                setAccount,
                setWeb3modal,
                setProvider
              })
              }
          } >Connect</button>
          </>
            }
            {/* <button className=" btn btn-primary" onClick={connectWallet}>
            WalletConnect
          </button> */}
        </div>
      </div>
      <div className="container">
        <form onSubmit={sendData}>
          <div className="row">
            <div className="col-md-6">
              <h2>How many addresses will target</h2>
                <p><label>Campaign Name</label></p>
                <p><input type="text" name="campaignName" placeholder="My Marketing Campaign" onChange={handleInputChange}/></p>
                <p><label>Address</label></p>
                <p><input className="form-control" type="text" name="address" placeholder="0xD3F" onChange={handleInputChange}/></p>
                <p><label>Scope</label></p>
                <p><input className="form-control" type="number" name="quantity" placeholder="1000" onChange={handleInputChange}/></p>
                <p><label>Fee</label></p>
                <p><input className="form-control" type="number" step="0.0001" name="fee" placeholder="0.002" onChange={handleInputChange}/></p>
                <button className="btn text-uppercase" type="submit" >Send</button>
            </div>
            <div className="col-md-6">
              <div className="container">
                <input type="file" name="nft" onChange={handleChange} />
                <img className="visualize" src={file} />
              </div>
            </div>
          </div>
        </form>
      </div>
      {!flyerState &&
      <div className="row  py-4">
        <div className="col text-center">
          <button className="btn" onClick={renderMarketingFlyer}>
            <h4 className="text-uppercase">Claim reward</h4>
          </button>
        </div>
      </div>
      }
      {flyerState &&
      <div className="row py-4">
        <div className="container">
          <div className="row pb-2">
            <div className="col">
              <h1 className="text-center">Marketing name</h1>
            </div>
          </div>
          <div className="row">
            <div className="col text-center">
              <img src={marketing} />
            </div>
          </div>
          <div className="row pt-4">
            <div className="col-2"></div>
            <div className="col-4 text-center">
              <WorldIDWidget
                actionId="wid_BPZsRJANxct2cZxVRyh80SFG" // obtain this from developer.worldcoin.org
                signal="my_signal"
                enableTelemetry
                onSuccess={(verificationResponse) => console.log(verificationResponse)} // you'll actually want to pass the proof to the API or your smart contract
                onError={(error) => console.error(error)}
              />
            </div>
            <div className="col-6 text-center">
                <button className="btn" onClick={renderMarketingFlyer}>Claim Airdrop</button>
            </div>
          </div>
        </div>
      </div>
      }
      <footer>
        <div className="row py-5 w-25 mx-auto">
          <div className="col text-center">
            <span id="lens-follow-small" data-handle="airvertise.lens" />
          </div>
        </div>
      </footer>
    </div>
  );
}
export default App;