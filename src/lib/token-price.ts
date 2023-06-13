import axios from "axios";
import { BigNumber, Contract, ethers } from "ethers";
import AggregatorABI from "abis/EACAggregatorProxy.json";
import { getContract } from "config/contracts";
import { getStaticProvider } from "./rpc";

export const getTokenPrice = async (symbol: string, chainId: number) => {
    const provider = getStaticProvider(chainId);
    const aggregatorAddress = getContract(chainId, "AGGREGATOR");
    const aggregatorContract = new Contract(aggregatorAddress, AggregatorABI.abi, provider);
    const data = await aggregatorContract.latestAnswer();
    return Number(data);
};
