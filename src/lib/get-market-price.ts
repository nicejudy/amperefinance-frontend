import { ethers } from "ethers";
import LpReserveContract from "abis/reserves/LpContract.json";
import { mimTime } from "./bond";

export async function getMarketPrice(networkID: number, provider: ethers.Signer | ethers.providers.Provider): Promise<number> {
    const mimTimeAddress = mimTime.getAddressForReserve(networkID);
    const pairContract = new ethers.Contract(mimTimeAddress, LpReserveContract.abi, provider);
    const reserves = await pairContract.getReserves();
    const marketPrice = reserves[0] / reserves[1];
    return marketPrice;
}
