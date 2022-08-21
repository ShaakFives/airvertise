import React, { Fragment, useState } from "react";
import { Web3Storage } from 'web3.storage/dist/bundle.esm.min.js';

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

      launchMarketingCampaign(campaignData.quantity, targetAccounts, campaignData.campaignName, contentId, fee);

  }
  
  const retrieveAddressesFromContract = (address) => {
    return ["0xAB", "0xBB"]
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

    renderMarketingFlyer(retrieveFile(metadata[1]), metadata, tokenId);


  }

  async function renderMarketingFlyer(file, metadata, tokenId){

    // render image and create button to redeem airdrop

    // once user cliked on redeem button, execute the following function from the Advertise.sol contract
    // function claimAirdrop(address input, uint256 root, uint256 nullifierHash, uint256[8] calldata proof, uint256 _tokenId)


  }

  return (
    <div className="container">
      <div className="row py-4">
        <div className='col-8'>
          <h1 className="text-right">AIRVERTISE</h1>
        </div>
        <div className='col-4 text-center'>
          <button className=" btn btn-primary" onClick={connectWallet}>
            WalletConnect
          </button>
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
                <input type="file" name="nft" class="form-control-file" onChange={handleInputChange}></input>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default App;