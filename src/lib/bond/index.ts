import { LPBond, CustomLPBond } from "./lp-bond";
import { StableBond, CustomBond } from "./stable-bond";

import UsdcIcon from "img/ic_usdc_40.svg";
import EthIcon from "img/ic_eth_40.svg";
import UsdtIcon from "img/ic_usdt_40.svg";
import DaiIcon from "img/ic_dai_40.svg";
import WbtcIcon from "img/ic_wbtc_40.svg";
import UsdcQuaIcon from "img/usdc-qua.png";
import UsdtQuaIcon from "img/usdt-qua.png";
import DaiQuaIcon from "img/dai-qua.png";
import EthQuaIcon from "img/eth-qua.png";
import WbtcQuaIcon from "img/wbtc-qua.png";

import StableBondContract from "abis/bonds/StableContract.json";
import LpBondContract from "abis/bonds/LpContract.json";
import WavaxBondContract from "abis/bonds/WavaxContract.json";
import StableReserveContract from "abis/reserves/StableContract.json";
import LpReserveContract from "abis/reserves/LpContract.json";


export const usdc = new StableBond({
    name: "usdc",
    displayName: "USDC.e",
    bondToken: "USDC",
    decimals: 6,
    lpDecimals: 6,
    bondIconSvg: UsdcIcon,
    bondContractABI: StableBondContract.abi,
    reserveContractAbi: StableReserveContract.abi,
    networkAddrs: {
        bondAddress: "0xfB808265f180d52f915842F95eA1677dA341fca8",
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
        bondAddress: "0x74A2AD0D2aE0Fdb9E5FfdeBD0e530A868Db3350d",
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
        bondAddress: "0x9C24F928A69eA78C100Be5eE4B897CCB1398c447",
        reserveAddress: "0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1",
    },
    tokensInStrategy: "60500000000000000000000000",
});

export const weth = new CustomBond({
    name: "weth",
    displayName: "ETH",
    bondToken: "ETH",
    decimals: 18,
    lpDecimals: 18,
    bondIconSvg: EthIcon,
    bondContractABI: WavaxBondContract.abi,
    reserveContractAbi: StableReserveContract.abi,
    networkAddrs: {
        bondAddress: "0x7d50c369c701DC15E23b84B1084436371b4854C5",
        reserveAddress: "0x82aF49447D8a07e3bd95BD0d56f35241523fBab1",
    },
    tokensInStrategy: "756916000000000000000000",
});

export const wbtc = new CustomBond({
    name: "wbtc",
    displayName: "WBTC",
    bondToken: "BTC",
    decimals: 8,
    lpDecimals: 8,
    bondIconSvg: WbtcIcon,
    bondContractABI: WavaxBondContract.abi,
    reserveContractAbi: StableReserveContract.abi,
    networkAddrs: {
        bondAddress: "0x4Adf25be353031b504a67c56c2ef709a3Af00D74",
        reserveAddress: "0x2f2a2543B76A4166549F7aaB2e75Bef0aefC5B0f",
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
        bondAddress: "0x456f83Ec088efdE13f33fc7D06E48bBB811c98B6",
        reserveAddress: "0xE5aa7768aa6eF18Bd86c6667725c635d21dC169F",
    },
    lpUrl: "https://www.sushi.com/pools/42161:0xE5aa7768aa6eF18Bd86c6667725c635d21dC169F/add",
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
        bondAddress: "0x9811b55fcB52EFC52Bd90f1975a28e38fBB98464",
        reserveAddress: "0x8fB1A46ae02a5F2b15327b6287a2ba35856dD262",
    },
    lpUrl: "https://www.sushi.com/pools/42161:0x8fB1A46ae02a5F2b15327b6287a2ba35856dD262/add",
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
        bondAddress: "0x97A7887913818dac3A1E34cdA6205c97e86D360F",
        reserveAddress: "0x8c0dC4f02D5A46763A82827c850330c10a74cc15",
    },
    lpUrl: "https://www.sushi.com/pools/42161:0x8c0dC4f02D5A46763A82827c850330c10a74cc15/add",
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
        bondAddress: "0x4dF4B977891FA072b9e923468AB152ad131c3d4D",
        reserveAddress: "0xddc522a833E3A7C10545cF5972091bCc91DbA727",
    },
    lpUrl: "https://www.sushi.com/pools/42161:0xddc522a833E3A7C10545cF5972091bCc91DbA727/add",
});

export const btcQua = new CustomLPBond({
    name: "wbtc_qua_lp",
    displayName: "QUA-WBTC LP",
    bondToken: "WBTC",
    decimals: 8,
    lpDecimals: 18,
    bondIconSvg: WbtcQuaIcon,
    bondContractABI: LpBondContract.abi,
    reserveContractAbi: LpReserveContract.abi,
    networkAddrs: {
        bondAddress: "0x146e19af3950CC365595076623f8C503161533a9",
        reserveAddress: "0x3820822582B29990c0b9f46a162b32726c756108",
    },
    lpUrl: "https://www.sushi.com/pools/42161:0x3820822582B29990c0b9f46a162b32726c756108/add",
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
export default [usdc, usdt, dai, usdcQua, usdtQua, daiQua];
