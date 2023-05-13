import { ContractInterface } from "ethers";
import { Bond, BondOpts } from "./bond";
import { BondType } from "./constants";
import { StaticJsonRpcProvider } from "@ethersproject/providers";
import { getBondCalculator } from "../bond-calculator";
import { getContract } from "config/contracts";

// Keep all LP specific fields/logic within the LPBond class
export interface LPBondOpts extends BondOpts {
    readonly reserveContractAbi: ContractInterface;
    readonly lpUrl: string;
}

export class LPBond extends Bond {
    readonly isLP = true;
    readonly lpUrl: string;
    readonly reserveContractAbi: ContractInterface;
    readonly displayUnits: string;

    constructor(lpBondOpts: LPBondOpts) {
        super(BondType.LP, lpBondOpts);

        this.lpUrl = lpBondOpts.lpUrl;
        this.reserveContractAbi = lpBondOpts.reserveContractAbi;
        this.displayUnits = "LP";
    }

    async getTreasuryBalance(networkID: number, provider: StaticJsonRpcProvider) {
        const token = this.getContractForReserve(networkID, provider);
        const tokenAddress = this.getAddressForReserve(networkID);
        const bondCalculator = getBondCalculator(networkID, provider);
        const tokenAmount = await token.balanceOf(getContract(networkID, "TREASURY_ADDRESS"));
        // const tokenAmount = await token.balanceOf("0x1c46450211CB2646cc1DA3c5242422967eD9e04c");
        const valuation = await bondCalculator.valuation(tokenAddress, tokenAmount);
        const markdown = await bondCalculator.markdown(tokenAddress);
        const tokenUSD = (valuation / Math.pow(10, 9)) * (markdown / Math.pow(10, 18));

        return tokenUSD;
    }

    public getTokenAmount(networkID: number, provider: StaticJsonRpcProvider) {
        return this.getReserves(networkID, provider, true);
    }

    public getTimeAmount(networkID: number, provider: StaticJsonRpcProvider) {
        return this.getReserves(networkID, provider, false);
    }

    private async getReserves(networkID: number, provider: StaticJsonRpcProvider, isToken: boolean): Promise<number> {
        const token = this.getContractForReserve(networkID, provider);

        let [reserve0, reserve1] = await token.getReserves();
        const token1: string = await token.token1();
        const isTime = token1.toLowerCase() === getContract(networkID, "TIME_ADDRESS").toLowerCase();

        return isToken ? this.toTokenDecimal(false, isTime ? reserve0 : reserve1) : this.toTokenDecimal(true, isTime ? reserve1 : reserve0);
    }

    private toTokenDecimal(isTime: boolean, reserve: number) {
        return isTime ? reserve / Math.pow(10, 9) : reserve / Math.pow(10, 18);
    }
}

// These are special bonds that have different valuation methods
export interface CustomLPBondOpts extends LPBondOpts {}

export class CustomLPBond extends LPBond {
    constructor(customBondOpts: CustomLPBondOpts) {
        super(customBondOpts);

        this.getTreasuryBalance = async (networkID: number, provider: StaticJsonRpcProvider) => {
            const tokenAmount = await super.getTreasuryBalance(networkID, provider);
            const tokenPrice = await this.getTokenPrice();

            return tokenAmount * tokenPrice;
        };

        this.getTokenAmount = async (networkID: number, provider: StaticJsonRpcProvider) => {
            const tokenAmount = await super.getTokenAmount(networkID, provider);
            const tokenPrice = await this.getTokenPrice();

            return tokenAmount * tokenPrice;
        };
    }
}
