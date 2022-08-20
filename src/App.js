import React, { Fragment, useState } from "react";
import FileUpload from "./components/FileUpload";
import "./components/styles/main.css"

const connectWallet = () => {
  console.log("Connect");
}

function App() {

  // Form
  const [datos, setDatos] = useState({
    address: '',
    target: '',
    fee: '',
    nft: ''
  })

  const handleInputChange = (event) => {
      setDatos({
          ...datos,
          [event.target.name] : event.target.value
      })
  }

  const sendData = (event) => {
      event.preventDefault();
      console.log(datos.address);
      console.log(datos.target);
      console.log(datos.fee);
      console.log(datos.nft);
      let targetAccounts = retrieveAddressesFromContract(datos.address);
      console.log(targetAccounts);
      let image = getFiles();
      console.log(image);
  }

  function getFiles () {
    const fileInput = document.querySelector('input[type="file"]')
    return fileInput.files
  }

  // async function storeFiles (files) {
  //   const client = makeStorageClient()
  //   const cid = await client.put(files)
  //   console.log('stored files with cid:', cid)
  //   return cid
  // }
  
  const retrieveAddressesFromContract = (address) => {
    return ["0xAB", "0xBB"]
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
              <h2>Select your target</h2>
                <p><label>Address</label></p>
                <p><input type="text" name="address" placeholder="0xD3F" onChange={handleInputChange}/></p>
                <p><label>Scope</label></p>
                <p><input type="text" name="target" placeholder="Finance" onChange={handleInputChange}/></p>
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
    </div>
  );
}

export default App;