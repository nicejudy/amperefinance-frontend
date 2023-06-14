import { LPBond, CustomLPBond } from "./lp-bond";
import { StableBond, CustomBond } from "./stable-bond";

import UsdcIcon from "img/ic_usdc_40.svg";
import EthIcon from "img/ic_eth_40.svg";
import UsdtIcon from "img/ic_usdt_40.svg";
import DaiIcon from "img/ic_dai_40.svg";
import UsdcQuaIcon from "img/usdc-qua.png";
import UsdtQuaIcon from "img/usdt-qua.png";
import DaiQuaIcon from "img/dai-qua.png";
import EthQuaIcon from "img/eth-qua.png";

import StableBondContract from "abis/bonds/StableContract.json";
import LpBondContract from "abis/bonds/LpContract.json";
import WavaxBondContract from "abis/bonds/WavaxContract.json";
import StableReserveContract from "abis/reserves/StableContract.json";
import LpReserveContract from "abis/reserves/LpContract.json";


export const usdc = new StableBond({
    name: "usdc",
    displayName: "USDC",
    bondToken: "USDC",
    decimals: 6,
    lpDecimals: 6,
    bondIconSvg: UsdcIcon,
    bondContractABI: StableBondContract.abi,
    reserveContractAbi: StableReserveContract.abi,
    networkAddrs: {
        bondAddress: "0x054b48f4F5fCE52D91C8C54e013F4Dde350EFe8B",
        reserveAddress: "0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8",
    },
    tokensInStrategy: "60500000000000000000000000",
});

export const usdt = new StableBond({
    name: "usdt",
    displayName: "USDT",
    bondToken: "USDT",
    decimals: 6,
    lpDecimals: 6,
    bondIconSvg: UsdtIcon,
    bondContractABI: StableBondContract.abi,
    reserveContractAbi: StableReserveContract.abi,
    networkAddrs: {
        bondAddress: "0xBf7D459dB67e563a75589628A7F972cE147d0a6a",
        reserveAddress: "0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9",
    },
    tokensInStrategy: "60500000000000000000000000",
});

export const dai = new StableBond({
    name: "dai",
    displayName: "DAI",
    bondToken: "DAI",
    decimals: 18,
    lpDecimals: 18,
    bondIconSvg: DaiIcon,
    bondContractABI: StableBondContract.abi,
    reserveContractAbi: StableReserveContract.abi,
    networkAddrs: {
        bondAddress: "0x09AC3EdD603B0dA3B486bc31b7Fa3D0A45970020",
        reserveAddress: "0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1",
    },
    tokensInStrategy: "60500000000000000000000000",
});

export const weth = new CustomBond({
    name: "weth",
    displayName: "WETH",
    bondToken: "ETH",
    decimals: 18,
    lpDecimals: 18,
    bondIconSvg: EthIcon,
    bondContractABI: WavaxBondContract.abi,
    reserveContractAbi: StableReserveContract.abi,
    networkAddrs: {
        bondAddress: "0xC8C8Dba6182815762E054cFE372aAab4896f0c89",
        reserveAddress: "0x82aF49447D8a07e3bd95BD0d56f35241523fBab1",
    },
    tokensInStrategy: "756916000000000000000000",
});

export const usdcQua = new LPBond({
    name: "usdc_qua_lp",
    displayName: "QUA-USDC LP",
    bondToken: "USDC",
    decimals: 6,
    lpDecimals: 18,
    bondIconSvg: UsdcQuaIcon,
    bondContractABI: LpBondContract.abi,
    reserveContractAbi: LpReserveContract.abi,
    networkAddrs: {
        bondAddress: "0xa2B7Fcd5dB4db5dF736DC04Dc2c1A242B914661d",
        reserveAddress: "0x5f6aE3bC389b06624444B14d14b97C852301533D",
    },
    lpUrl: "https://www.sushi.com/pools/42161:0x5f6aE3bC389b06624444B14d14b97C852301533D",
});

export const usdtQua = new LPBond({
    name: "usdt_qua_lp",
    displayName: "QUA-USDT LP",
    bondToken: "USDT",
    decimals: 6,
    lpDecimals: 18,
    bondIconSvg: UsdtQuaIcon,
    bondContractABI: LpBondContract.abi,
    reserveContractAbi: LpReserveContract.abi,
    networkAddrs: {
        bondAddress: "0xecf98aC8feF8Bb8F063D3BE5c80BbfaFC051d85e",
        reserveAddress: "0x95F6913E2713c8fd9845Be16AC886AfAdFccf85c",
    },
    lpUrl: "https://www.sushi.com/pools/42161:0x95F6913E2713c8fd9845Be16AC886AfAdFccf85c",
});

export const daiQua = new LPBond({
    name: "dai_qua_lp",
    displayName: "QUA-DAI LP",
    bondToken: "DAI",
    decimals: 18,
    lpDecimals: 18,
    bondIconSvg: DaiQuaIcon,
    bondContractABI: LpBondContract.abi,
    reserveContractAbi: LpReserveContract.abi,
    networkAddrs: {
        bondAddress: "0x2C7388022470698A5f5E112fCDdcbBb3e73C9E55",
        reserveAddress: "0x8816149e803310D45bDAa444769A895D97EE83bD",
    },
    lpUrl: "https://www.sushi.com/pools/42161:0x8816149e803310D45bDAa444769A895D97EE83bD",
});

export const ethQua = new CustomLPBond({
    name: "eth_qua_lp",
    displayName: "QUA-ETH LP",
    bondToken: "ETH",
    decimals: 18,
    lpDecimals: 18,
    bondIconSvg: EthQuaIcon,
    bondContractABI: LpBondContract.abi,
    reserveContractAbi: LpReserveContract.abi,
    networkAddrs: {
        bondAddress: "0x901eB7A4845628d337Ee0c97bf34F987DabF652D",
        reserveAddress: "0xe0748d3aCFf17c63CD787b452848F84B326c160f",
    },
    lpUrl: "https://www.sushi.com/pools/42161:0xe0748d3aCFf17c63CD787b452848F84B326c160f",
});

export const testUsdc = new StableBond({
    name: "usdc",
    displayName: "USDC",
    bondToken: "USDC",
    decimals: 6,
    lpDecimals: 6,
    bondIconSvg: UsdcIcon,
    bondContractABI: StableBondContract.abi,
    reserveContractAbi: StableReserveContract.abi,
    networkAddrs: {
        bondAddress: "0x4Ff929FBC0CC018Fa8aCD2FE359D9CAe29f8B627",
        reserveAddress: "0xa2B7Fcd5dB4db5dF736DC04Dc2c1A242B914661d",
    },
    tokensInStrategy: "60500000000000000000000000",
});

export const testUsdcQua = new LPBond({
    name: "usdc_qua_lp",
    displayName: "QUA-USDC LP",
    bondToken: "USDC",
    decimals: 6,
    lpDecimals: 18,
    bondIconSvg: UsdcQuaIcon,
    bondContractABI: LpBondContract.abi,
    reserveContractAbi: LpReserveContract.abi,
    networkAddrs: {
        bondAddress: "0xE5e68fCbc4fCEF771CFC8A339aA9C25A00E3e2b7",
        reserveAddress: "0xe97e66242dBAEDf14CC2544250dEA888B01e2809",
    },
    lpUrl: "https://www.sushi.com/pools/42161:0x5f6aE3bC389b06624444B14d14b97C852301533D",
});

// export default [mim, wavax, mimTime, avaxTime];
export const testBonds = [testUsdc, testUsdcQua];
export default [weth, usdc, usdt, dai, ethQua, usdcQua, usdtQua, daiQua];
