import React, { Fragment, useState } from "react";
import FileUpload from "./components/FileUpload";
import "./components/styles/main.css"
import { Web3Storage } from 'web3.storage/dist/bundle.esm.min.js';
import { WorldIDWidget } from "@worldcoin/id";
import { createClient } from 'urql'
import { handleConnectWallet } from './walletUtilities';
import Advertise from './artifacts/contracts/Advertise.json';

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

  async function retrieveFile (cid) {
    const client = makeStorageClient()
    const res = await client.get(cid)
    console.log(`Got a response! [${res.status}] ${res.statusText}`)
    if (!res.ok) {
      throw new Error(`failed to get ${cid}`)
    }
    const file = await res.files();
    return file;
  }
  
  async function launchMarketingCampaign(quantity, targetAccounts, campaignName, contentId, fee){
    // here we'll call the bulkAirdropERC721 function from the Advertise.sol contract below
    // function bulkAirdropERC721(address[] calldata _to, NFTmetadata calldata _NFTmetadata)
    
    // quantity determines the amount of targetAccounts to include in _to 9 
    // _NFTmetadata = [campaignName, contentId, fee]
    
  }

  function fetchAirdrop(address){
    // here we'll call the getNFTIdsByAddress function from the Advertise.sol contract below
    // function getNFTIdsByAddress(address _address)
    
    // for each Id we'll call the getMetadataByTokenId from the AdvertiseNFT.sol contract
    // function getMetadataByTokenId(uint256 _tokenId)
    // FOR DEMO PURPOSES, JUST DO IT FOR THE FIRST TOKENID

    // Once we have the metadata, get the metadata[1] (the tokenUri/ IPFS token id)

    // renderMarketingFlyer(retrieveFile(metadata[1]), metadata, tokenId);


  }

  async function renderMarketingFlyer(file, metadata, tokenId){

    // render image and create button to redeem airdrop

    // once user cliked on redeem button, execute the following function from the Advertise.sol contract
    // Also, obtain the verificationResponse (see below) to obtain some parameters below
    /*
      {
        "merkle_root": "0x1f38b57f3bdf96f05ea62fa68814871bf0ca8ce4dbe073d8497d5a6b0a53e5e0",
        "nullifier_hash": "0x0339861e70a9bdb6b01a88c7534a3332db915d3d06511b79a5724221a6958fbe",
        "action_id": "wid_staging_fMY8wNIw2AKLjcb7tVyI",
        "signal": "your_signal_here",
        "proof": "0x063942fd7ea1616f17787d2e3374c1826ebcd2d41d2394d915098c73482fa59516145cee11d59158b4012a463f487725cb3331bf90a0472e17385832eeaec7a713164055fc43cc0f873d76752de0e35cc653346ec42232649d40f5b8ded28f202793c4e8d096493dc34b02ce4252785df207c2b76673924502ab56b7e844baf621025148173fc74682213753493e8c90e5c224fc43786fcd09b624115bee824618e57bd28caa301f6b21606e7dce789090de053e641bce2ce0999b64cdfdfb0a0734413914c21e4e858bf38085310d47cd4cc6570ed634faa2246728ad64c49f1f720a39530d82e1fae1532bd7ad389978b6f337fcd6fa6381869637596e63a1"
      }
    */

    // function claimAirdrop(address input, uint256 root, uint256 nullifierHash, uint256[8] calldata proof, uint256 _tokenId)


  }

  return (
    <div className="container">
      <div className="row py-4">
        <div className='col-8'>
          <h1 className="text-right">AIRVERTISE</h1>
        </div>
        <div className='col-4 text-center'>
          
        {
              account?
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
                <p><input type="text" name="address" placeholder="0xD3F" onChange={handleInputChange}/></p>
                <p><label>Scope</label></p>
                <p><input type="number" name="quantity" placeholder="1000" onChange={handleInputChange}/></p>
                <p><label>Fee</label></p>
                <p><input type="number" step="0.0001" name="fee" placeholder="0.002" onChange={handleInputChange}/></p>
                <button type="submit" >Send</button>
            </div>
            <div className="col-md-6">
              <div className="container">
                {/* <input type="file" name="nft" class="form-control-file" onChange={handleInputChange}></input> */}
                <FileUpload />
              </div>
            </div>
          </div>
        </form>
      </div>
      <div>
        {/* Mount the component in your code at the place where you want to render the widget */}
        <WorldIDWidget
          actionId="wid_BPZsRJANxct2cZxVRyh80SFG" // obtain this from developer.worldcoin.org
          signal="my_signal"
          enableTelemetry
          onSuccess={(verificationResponse) => console.log(verificationResponse)} // you'll actually want to pass the proof to the API or your smart contract
          onError={(error) => console.error(error)}
        />;
      </div>
    </div>

    
  );
}

export default App;