import Web3 from 'web3';
import React, { useState, useEffect } from 'react';
import detectEthereumProvider from '@metamask/detect-provider'
import { loadContract } from './utils/loadContract';
//import 'bootstrap/dist/css/bootstrap.css'
const Miner = () => {
    const [account, setAccount] = useState("not yet");
    const [balance, setBalance] = useState(null);
    const [desc, setDesc] = useState("");
    const [checkBool, setCheckBool] = useState(false);
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

    const minerLastApprovalStatus = async () => {
        const { contract } = web3Api;
        await contract.minerLastApprovalStatus({
            from: account,

        })

    }

    const minerCheckUserDetailForApproval = async () => {
        const { web3, contract } = web3Api;
        await contract.minerCheckUserDetailForApproval({
            from: account,
        }).then((res) => {
            console.log(res);
            alert(res);
        }

        )
        // setDesc(s);
        // console.log(s);
    }

    const minerAprroval = async () => {
        const { contract } = web3Api;
        var b = true;
        await contract.minerAprroval(b, {
            from: account,
        });

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
                <div className='landing-header--title'><h3>Employee</h3> <br /> <p>A way toward new technology</p> </div>
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
                                <button type="button" className='btn btn--primary btn-wt-form' onClick={connectAccount}>
                                    connectAccount
                                </button>
                            </div>

                            <div className="container__item">
                                <button type="button" className='btn btn--primary btn-wt-form' onClick={minerLastApprovalStatus}>
                                    LastApprovalStatus
                                </button>
                            </div>

                            <div className="container__item">
                                <button type="button" className='btn btn--primary btn-wt-form' onClick={minerCheckUserDetailForApproval}>
                                    CheckClaimDetail
                                </button>
                            </div>

                            <div className="container__item">
                                <button type="button" className='btn btn--primary  btn-wt-form' onClick={minerAprroval}>
                                    Approve
                                </button>
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
export default Miner;