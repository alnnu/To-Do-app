"use client"
import ConnectWalletButton from "@/components/ConnectWalletButton";
import WrongNetworkMessage from "@/components/WrongNetworkMessage";
import TodoList from "@/components/TodoList";
import { ContractAddress } from "../../config"
import ToDoApp from "../../../build/contracts/ToDoApp.json"
import { ethers } from 'ethers';
import {useState} from "react";
import {Simulate} from "react-dom/test-utils";
import input = Simulate.input;
import exportedTypeSuite from "sucrase/dist/types/Options-gen-types";

export default function Home() {

  const [CorrectNetwork, SetCorrectNetwork] = useState(false)
  const [userLogged, setUserLogged] = useState(false)
  const [account, seAccount] = useState()
  const [input, setInput] = useState("")
  const [tasks, setTasks] = useState<{taskText: string, isDeleted: boolean}[]>([])

  // Calls Metamask to connect wallet on clicking Connect Wallet button
  const connectWallet = async () => {

    try {
      // @ts-ignore
      const { ethereum } = window

      if(!ethereum){
        console.error("Meta mask not detected")
        return
      }

      const chainId = await ethereum.request({method: "eth_chainId"})

      const rinkedbyChainId = '0x4'

      const truffleId = "0x539"

      if( chainId !== rinkedbyChainId && chainId !== truffleId) {
        alert("your aren't connected to the rinkeby testnet!")
        SetCorrectNetwork(false)
        return
      } else {
        SetCorrectNetwork(true)
      }

      const accounts = await ethereum.request({method: "eth_requestAccounts"})

      setUserLogged(true)
      seAccount(accounts[0])

    } catch (e) {
      console.error(e)
    }
  }

  // Just gets all the tasks from the contract
  const getAllTasks = async () => {

  }

  // Add tasks from front-end onto the blockchain
  const addTask = async (e:any) => {
    e.preventDefault()

    let task = {
      taskText: input,
      isDeleted: false
    }

    try {
      // @ts-ignore
      const { ethereum } = window

      if(ethereum) {
        const provider = new ethers.BrowserProvider(ethereum)
        const signer = await provider.getSigner()
        const TaskContract = new ethers.Contract( ContractAddress, ToDoApp.abi, signer)

        TaskContract.addTask(task.taskText, task.isDeleted).then( res => {
          setTasks([...tasks, task])
        }).catch(err => {
          console.error(err)
        })
      }else {
        console.error("ethereum object does not exist")
      }


    }catch (e) {
      console.error(e)
    }

  }

  // Remove tasks from front-end by filtering it out on our "back-end" / blockchain smart contract
  const deleteTask = (key: any) => async () => {

  }
  return (
  <div className='bg-[#97b5fe] h-screen w-screen flex justify-center py-6'>
    {!userLogged ? <ConnectWalletButton connect={connectWallet}/> :
        CorrectNetwork ? <TodoList input={input} addTask={addTask} setInput={setInput}/> : <WrongNetworkMessage/>}
  </div>
);
}
