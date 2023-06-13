import { ethers } from "ethers";
import LpReserveContract from "abis/reserves/LpContract.json";
import StableContract from "abis/reserves/StableContract.json";
import { usdcQua, testUsdcQua } from "./bond";
import { ARBITRUM } from "config/chains";

export async function getMarketPrice(networkID: number, provider: ethers.Signer | ethers.providers.Provider): Promise<number> {
    const mimTimeAddress = networkID == ARBITRUM? usdcQua.getAddressForReserve(networkID) : testUsdcQua.getAddressForReserve(networkID);
    const pairContract = new ethers.Contract(mimTimeAddress, LpReserveContract.abi, provider);
    const reserves = await pairContract.getReserves();
    const token0 = await pairContract.token0();
    const tokenContract0 = new ethers.Contract(token0, StableContract.abi, provider);
    const symbol0 = await tokenContract0.symbol();
    const marketPrice = symbol0 == "QUA"? reserves[1] / reserves[0] : reserves[0] / reserves[1];
    return marketPrice;
}
