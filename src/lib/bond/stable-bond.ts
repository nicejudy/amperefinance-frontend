import { ContractInterface } from "ethers";
import { Bond, BondOpts } from "./bond";
import { BondType } from "./constants";
import { StaticJsonRpcProvider } from "@ethersproject/providers";
import { getContract } from "config/contracts";
import { BigNumber } from "ethers";

export interface StableBondOpts extends BondOpts {
    readonly reserveContractAbi: ContractInterface;
    readonly tokensInStrategy?: string;
}

export class StableBond extends Bond {
    readonly isLP = false;
    readonly reserveContractAbi: ContractInterface;
    readonly displayUnits: string;
    readonly tokensInStrategy?: string;

    constructor(stableBondOpts: StableBondOpts) {
        super(BondType.StableAsset, stableBondOpts);

        // For stable bonds the display units are the same as the actual token
        this.displayUnits = stableBondOpts.displayName;
        this.reserveContractAbi = stableBondOpts.reserveContractAbi;
        this.tokensInStrategy = stableBondOpts.tokensInStrategy;
    }

    public async getTreasuryBalance(networkID: number, provider: StaticJsonRpcProvider) {
        const token = this.getContractForReserve(networkID, provider);
        let tokenAmount = await token.balanceOf(getContract(networkID, "TREASURY_ADDRESS"));
        // let tokenAmount = await token.balanceOf("0x1c46450211CB2646cc1DA3c5242422967eD9e04c");
        if (this.tokensInStrategy) {
            tokenAmount = BigNumber.from(tokenAmount).add(BigNumber.from(this.tokensInStrategy)).toString();
        }
        return tokenAmount / Math.pow(10, 18);
    }

    public async getTokenAmount(networkID: number, provider: StaticJsonRpcProvider) {
        return this.getTreasuryBalance(networkID, provider);
    }

    public getTimeAmount(networkID: number, provider: StaticJsonRpcProvider) {
        return new Promise<number>(reserve => reserve(0));
    }
}

// These are special bonds that have different valuation methods
export interface CustomBondOpts extends StableBondOpts {}

export class CustomBond extends StableBond {
    constructor(customBondOpts: CustomBondOpts) {
        super(customBondOpts);

        this.getTreasuryBalance = async (networkID: number, provider: StaticJsonRpcProvider) => {
            const tokenAmount = await super.getTreasuryBalance(networkID, provider);
            const tokenPrice = await this.getTokenPrice();

            return tokenAmount * tokenPrice;
        };
    }
}
