import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import detectEthereumProvider from '@metamask/detect-provider'
import { loadContract } from './utils/loadContract';
//import 'bootstrap/dist/css/bootstrap.css'
const User = () => {
    const [money, setMoney] = useState(0);
    const [account, setAccount] = useState("Not Set Yet");
    const [balance, setBalance] = useState(0);
    const [desc, setDesc] = useState("");
    const [due, setDue] = useState(0);
    // const ether=require("ether");

    const [web3Api, setWeb3Api] = useState({
        provider: null,
        web3: null,
        contract: null
    });

    useEffect(() => {
        const loadProvider = async () => {
            const provider = await detectEthereumProvider();
            const contract = await loadContract("Insurance", provider);
            if (provider) {
                const chainId = await provider.request({
                    method: 'eth_requestAccounts'
                })
                setWeb3Api({
                    web3: new Web3(provider),
                    provider,
                    contract
                })
            }
            else {
                console.log('Please install MetaMask!')
            }
        }
        loadProvider()
    }, []);

    useEffect(() => {
        const getAccount = async () => {
            const account = await web3Api.web3.eth.getAccounts(); //get ethereum account
            setAccount(account[0]);
        }
        web3Api.web3 && getAccount(); //call when web3 api
    }, [web3Api.web3])

    const connectAccount = async () => {
        alert("connect wallet");
        try {
            if (typeof window != null && typeof window.ethereum) {
                window.ethereum.request({ method: "eth_requestAccounts" });
            }
            else {
                alert("sry");
            }
        }
        catch (err) {
            alert("not connected yet");
        }

    }

    const addUser = async () => {
        const { web3, contract } = web3Api;

        await contract.addUser({
            from: account,
            value: web3.utils.toWei(money, 'ether'),
        }
        );
    }

    const subsequentPayment = async () => {
        const { web3, contract } = web3Api;
        await contract.subsequentPayment({
            from: account,
            value: web3.utils.toWei(balance, 'ether'),
        })
    }

    const dueAmountUser = async () => {
        const { contract } = web3Api;
        await contract.get({
            from: account,
        })
        let v = await contract.dueAmountUser({
            from: account,
        });
        console.log(v.words);

        setDue(v.words[0]);

    }

    const insuranceClaim = async () => {
        const { contract } = web3Api;
        await contract.insuranceClaim(desc, {
            from: account,
        })

    }



    return (
        <div className='landing'>
            <div>
                <div className='landing-button'>
                    <button type="button" className='btn-r' onClick={connectAccount}>
                        <span>connectAccount</span>
                    </button>
                </div>
            </div>
            <div className='landing-header'>
                <div className='landing-header--title'><h3>User</h3> <br /> <p>secure your property as like we secure your data</p> </div>
            </div>
            <div className='landing-content'>
                <div className='landing-content--left'>
                    <div className='hidden'>
                        <div className='hidden-box'>
                            <div> <i class="fa-solid fa-circle-check" style={{ color: "green" }}></i> <span>IMMUTABLE</span> </div>
                            <div> <i class="fa-solid fa-lock" style={{ color: "black" }}></i> <span>SECURE</span></div>
                            <div> <i class="fa-solid fa-bolt" style={{ color: "#FF5F00" }}></i> <span>FAST</span></div>
                        </div>
                    </div>
                    <div style={{ marginTop: "2rem" }}> Bringing to you, the first cryptocurrency company !</div>
                </div>
                <div className='landing-content--right'>
                    <div className='container'>
                        <div className='conntainer-fluid'>
                            <div className="container__item">
                                <form className="form">
                                    <input type="number" className="form__field" require="true" value={money} onChange={e => setMoney(e.target.value)} />
                                    <button type="button" className='btn btn--primary' onClick={addUser}>
                                        Register
                                    </button>
                                </form>
                            </div>
                            <div className="container__item">
                                <form className="form">
                                    <input type="number" className="form__field" require="true" value={balance} onChange={e => setBalance(e.target.value)} />
                                    <button type="button" className='btn btn--primary' onClick={subsequentPayment}>
                                        subsequentPayment
                                    </button>
                                </form>
                            </div>
                            <div className="container__item">
                                <form className="form">
                                    <input type="text" require="true" value={desc} onChange={e => setDesc(e.target.value)} className="form__field" />
                                    <button type="button" className='btn btn--primary' onClick={insuranceClaim}>
                                        insuranceClaim
                                    </button>
                                </form>
                            </div>
                            <div className="container__item">
                                <button type="button" className='btn btn--primary' onClick={dueAmountUser}>
                                    dueAmountUser
                                </button>
                                <h3 className='due'>{due > 0 ? due : "0"}</h3>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* <div>
                <Waves />
            </div> */}
        </div>
    );
}
export default User;