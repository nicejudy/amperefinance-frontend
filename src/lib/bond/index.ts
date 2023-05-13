import { LPBond, CustomLPBond } from "./lp-bond";
import { StableBond, CustomBond } from "./stable-bond";

import MimIcon from "img/MIM.svg";
import AvaxIcon from "img/AVAX.svg";
import MimTimeIcon from "img/TIME-MIM.svg";
import AvaxTimeIcon from "img/TIME-AVAX.svg";

import StableBondContract from "abis/bonds/StableContract.json";
import LpBondContract from "abis/bonds/LpContract.json";
import WavaxBondContract from "abis/bonds/WavaxContract.json";
import StableReserveContract from "abis/reserves/StableContract.json";
import LpReserveContract from "abis/reserves/LpContract.json";


export const mim = new StableBond({
    name: "mim",
    displayName: "MIM",
    bondToken: "MIM",
    bondIconSvg: MimIcon,
    bondContractABI: StableBondContract.abi,
    reserveContractAbi: StableReserveContract.abi,
    networkAddrs: {
        bondAddress: "0x694738E0A438d90487b4a549b201142c1a97B556",
        reserveAddress: "0x130966628846BFd36ff31a822705796e8cb8C18D",
    },
    tokensInStrategy: "60500000000000000000000000",
});

export const wavax = new CustomBond({
    name: "wavax",
    displayName: "wAVAX",
    bondToken: "AVAX",
    bondIconSvg: AvaxIcon,
    bondContractABI: WavaxBondContract.abi,
    reserveContractAbi: StableReserveContract.abi,
    networkAddrs: {
        bondAddress: "0xE02B1AA2c4BE73093BE79d763fdFFC0E3cf67318",
        reserveAddress: "0xb31f66aa3c1e785363f0875a1b74e27b85fd66c7",
    },
    tokensInStrategy: "756916000000000000000000",
});

export const mimTime = new LPBond({
    name: "mim_time_lp",
    displayName: "TIME-MIM LP",
    bondToken: "MIM",
    bondIconSvg: MimTimeIcon,
    bondContractABI: LpBondContract.abi,
    reserveContractAbi: LpReserveContract.abi,
    networkAddrs: {
        bondAddress: "0xA184AE1A71EcAD20E822cB965b99c287590c4FFe",
        reserveAddress: "0x113f413371fc4cc4c9d6416cf1de9dfd7bf747df",
    },
    lpUrl: "https://www.traderjoexyz.com/#/pool/0x130966628846BFd36ff31a822705796e8cb8C18D/0xb54f16fB19478766A268F172C9480f8da1a7c9C3",
});

export const avaxTime = new CustomLPBond({
    name: "avax_time_lp",
    displayName: "TIME-AVAX LP",
    bondToken: "AVAX",
    bondIconSvg: AvaxTimeIcon,
    bondContractABI: LpBondContract.abi,
    reserveContractAbi: LpReserveContract.abi,
    networkAddrs: {
        bondAddress: "0xc26850686ce755FFb8690EA156E5A6cf03DcBDE1",
        reserveAddress: "0xf64e1c5B6E17031f5504481Ac8145F4c3eab4917",
    },
    lpUrl: "https://www.traderjoexyz.com/#/pool/AVAX/0xb54f16fB19478766A268F172C9480f8da1a7c9C3",
});

// export default [mim, wavax, mimTime, avaxTime];
export default [mim, mimTime, avaxTime];
