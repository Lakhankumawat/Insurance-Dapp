import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import detectEthereumProvider from '@metamask/detect-provider'
import { loadContract } from './utils/loadContract';
import Waves from './wave';
const Company = () => {
    const [aminer, setAminer] = useState("");
    const [rminer, setRminer] = useState("");
    const [account, setAccount] = useState("not yet");
    const [balance, setBalance] = useState(null);
    const [web3Api, setWeb3Api] = useState({
        provider: null,
        web3: null,
        contract: null
    });
    useEffect(() => {
        const loadProvider = async () => {
            const provider = await detectEthereumProvider();
            const contract = await loadContract("Insurance", provider)
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
    //getting account
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
    const addMiner = async () => {
        if (account.length == aminer.length) {
            const { web3, contract } = web3Api;
            await contract.addMiner(aminer, {
                from: account,
            }
            );
        }
        else {
            alert("incorrect input");
        }

    }
    const removeMiner = async () => {
        if (account.length == rminer.length) {
            const { contract } = web3Api;
            await contract.removeMiner(rminer, {
                from: account,
            }
            );
        }
        else {
            alert("incorrect input");
        }
    }

    const claimPaymentApproval = async () => {
        const { web3, contract } = web3Api;
        let check = await contract.claimPaymentApproval({
            from: account,
            value: web3.utils.toWei(balance, 'ether'),
        }
        );
        console.log(check);
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
                <div className='landing-header--title'><h3>The wave</h3> <br /> <p>A way toward new technology</p> </div>
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
                                    <input type="text" className="form__field" placeholder="Miner-address" require="true" value={aminer} onChange={e => setAminer(e.target.value)} />
                                    <button type="button" className="btn btn--primary " onClick={addMiner}>addMiner</button>
                                </form>
                            </div>

                            <div className="container__item">
                                <form className='form'>
                                    <input type="text" className="form__field" placeholder="Miner-address" require="true" value={rminer} onChange={e => setRminer(e.target.value)} />
                                    <button type="button" className="btn btn--primary " onClick={removeMiner} >
                                        removeMiner
                                    </button>
                                </form>
                            </div>
                            <div className="container__item">
                                <input type="bumber" className="form__field" placeholder="Ether" require="true" value={balance} onChange={e => setBalance(e.target.value)} />
                                <button type="button" className="btn btn--primary " onClick={claimPaymentApproval}>
                                    Approve Payment
                                </button>
                            </div>

                        </div>
                    </div >
                </div>
            </div>
            {/* <div>
                <Waves />
            </div> */}
        </div>
    );
}
export default Company;



