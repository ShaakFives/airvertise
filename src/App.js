import React, { Fragment, useState } from "react";

const connectWallet = () => {
  console.log("Connect");
}

function App() {

  const [datos, setDatos] = useState({
    address: '',
    target: '',
    fee: ''
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
      let targetAccounts = retrieveAddressesFromContract(datos.address);
      console.log(targetAccounts);
      
  }
  
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
        <div className="row">
          <div className="col-md-6">
            <h2>Select your target</h2>
            <form onSubmit={sendData}>
              <p><label>Address</label></p>
              <p><input type="text" name="address" placeholder="0xD3F" onChange={handleInputChange}/></p>
              <p><label>Scope</label></p>
              <p><input type="text" name="target" placeholder="Finance" onChange={handleInputChange}/></p>
              <p><label>Fee</label></p>
              <p><input type="number" step="0.0001" name="fee" placeholder="0.002" onChange={handleInputChange}/></p>
              <button type="submit" >Send</button>
            </form>
          </div>
          <div className="col-md-6">
            <div className="container"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;