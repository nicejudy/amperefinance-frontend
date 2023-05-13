import { StaticJsonRpcProvider } from "@ethersproject/providers";
import BondingCalc from "abis/BondingCalcContract.json";
import { ethers } from "ethers";
import { getContract } from "config/contracts";

export function getBondCalculator(networkID: number, provider: StaticJsonRpcProvider) {
    return new ethers.Contract(getContract(networkID, "TIME_BONDING_CALC_ADDRESS"), BondingCalc.abi, provider);
}
