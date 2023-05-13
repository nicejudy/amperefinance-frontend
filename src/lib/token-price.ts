import axios from "axios";

export const getTokenPrice = async (symbol: string) => {
    const url = "https://api.coingecko.com/api/v3/simple/price?ids=avalanche-2,olympus,magic-internet-money&vs_currencies=usd";
    const { data } = await axios.get(url);

    console.log(data);

    const cache: { [key: string]: number } = {};

    cache["AVAX"] = data["avalanche-2"].usd;
    cache["MIM"] = data["magic-internet-money"].usd;
    return Number(cache[symbol]);
};
