import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useWeb3React } from "@web3-react/core";
import { Trans, t } from "@lingui/macro";
import useSWR from "swr";
import { PieChart, Pie, Cell, Tooltip } from "recharts";
import Modal from "components/Modal/Modal";
import TooltipComponent from "components/Tooltip/Tooltip";

import hexToRgba from "hex-to-rgba";
import { ethers } from "ethers";

import {
  USD_DECIMALS,
  GMX_DECIMALS,
  GLP_DECIMALS,
  BASIS_POINTS_DIVISOR,
  DEFAULT_MAX_USDG_AMOUNT,
  getPageTitle,
  getProcessedData,
  importImage,
  arrayURLFetcher,
  useAppDetails,
  useAccountDetails,
  useBondDetails,
  useCalcBondDetails,
  useCalculateUserBondDetails
} from "lib/legacy";
import { useTotalGmxInLiquidity, useGmxPrice, useTotalGmxStaked, useTotalGmxSupply } from "domain/legacy";
import useFeesSummary from "domain/useFeesSummary";

import { getContract } from "config/contracts";

import VaultV2 from "abis/VaultV2.json";
import ReaderV2 from "abis/ReaderV2.json";
import GlpManager from "abis/GlpManager.json";
import RewardRouter from "abis/RewardRouter.json";
import Token from "abis/Token.json";
import StakingContract from "abis/StakingContract.json";
import StakingHelperContract from "abis/StakingHelperContract.json";
import Footer from "components/Footer/Footer";

import "./DashboardV2.css";

import AssetDropdown from "./AssetDropdown";
import ExternalLink from "components/ExternalLink/ExternalLink";
import SEO from "components/Common/SEO";
import useTotalVolume from "domain/useTotalVolume";
import StatsTooltip from "components/StatsTooltip/StatsTooltip";
import StatsTooltipRow from "components/StatsTooltip/StatsTooltipRow";
import { ARBITRUM, AVALANCHE, getChainName } from "config/chains";
import { getServerUrl } from "config/backend";
import { approveTokens } from "domain/tokens";
import { callContract, contractFetcher } from "lib/contracts";
import { helperToast } from "lib/helperToast";
import { useInfoTokens } from "domain/tokens";
import { getTokenBySymbol, getWhitelistedTokens, GLP_POOL_COLORS } from "config/tokens";
import { bigNumberify, expandDecimals, formatAmount, formatKeyAmount, formatAmountFree, parseValue } from "lib/numbers";
import { useChainId } from "lib/chains";
import { formatDate } from "lib/dates";
import { trim } from "lib/trim";
import { prettifySeconds } from "lib/prettify-seconds";
import { secondsUntilBlock } from "lib/seconds-until-block";
import { getIcons } from "config/icons";
import bonds from "lib/bond";

const ACTIVE_CHAIN_IDS = [ARBITRUM, AVALANCHE];

const { AddressZero } = ethers.constants;

function StakeModal(props) {
  const {
    isVisible,
    setIsVisible,
    chainId,
    maxAmount,
    value,
    setValue,
    address,
    library,
    allowance,
    setPendingTxns,
  } = props;
  const [isStaking, setIsStaking] = useState(false);
  const [isApproving, setIsApproving] = useState(false);

  const getError = () => {
    if (!amount || amount.eq(0)) {
      return t`Enter an amount`;
    }
    if (maxAmount && amount.gt(maxAmount)) {
      return t`Max amount exceeded`;
    }
  };

  let amount = parseValue(value, 9);
  const needApproval = amount?.gt(allowance);

  const onClickPrimary = () => {
    if (needApproval) {
      approveTokens({
        setIsApproving,
        library,
        tokenAddress: getContract(chainId, "TIME_ADDRESS"),
        spender: getContract(chainId, "STAKING_HELPER_ADDRESS"),
        chainId,
      });
      return;
    }

    setIsStaking(true);
    const contract = new ethers.Contract(getContract(chainId, "STAKING_HELPER_ADDRESS"), StakingHelperContract.abi, library.getSigner());

    callContract(chainId, contract, "stake", [amount, address], {
      sentMsg: t`Stake submitted!`,
      failMsg: t`Stake failed.`,
      setPendingTxns,
    })
      .then(async (res) => {
        setIsVisible(false);
      })
      .finally(() => {
        setIsStaking(false);
      });
  };

  const isPrimaryEnabled = () => {
    const error = getError();
    if (error) {
      return false;
    }
    if (isApproving) {
      return false;
    }
    if (isStaking) {
      return false;
    }
    return true;
  };

  const getPrimaryText = () => {
    const error = getError();
    if (error) {
      return error;
    }
    if (isApproving) {
      return t`Approving TIME...`;
    }
    if (needApproval) {
      return t`Approve TIME`;
    }
    if (isStaking) {
      return t`Staking...`;
    }
    return t`Stake`;
  };

  return (
    <div className="StakeModal">
      <Modal isVisible={isVisible} setIsVisible={setIsVisible} label="Stake TIME">
        <div className="Exchange-swap-section">
          <div className="Exchange-swap-section-top">
            <div className="muted">
              <div className="Exchange-swap-usd">
                <Trans>Stake</Trans>
              </div>
            </div>
            <div className="muted align-right clickable" onClick={() => setValue(formatAmountFree(maxAmount, 18, 18))}>
              <Trans>Max: {formatAmount(maxAmount, 18, 4, true)}</Trans>
            </div>
          </div>
          <div className="Exchange-swap-section-bottom">
            <div>
              <input
                type="number"
                placeholder="0.0"
                className="Exchange-swap-input"
                value={value}
                onChange={(e) => setValue(e.target.value)}
              />
            </div>
            <div className="PositionEditor-token-symbol">TIME</div>
          </div>
        </div>
        <div className="Exchange-swap-button-container">
          <button className="App-cta Exchange-swap-button" onClick={onClickPrimary} disabled={!isPrimaryEnabled()}>
            {getPrimaryText()}
          </button>
        </div>
      </Modal>
    </div>
  );
}

function UnStakeModal(props) {
  const {
    isVisible,
    setIsVisible,
    chainId,
    maxAmount,
    value,
    setValue,
    address,
    library,
    allowance,
    setPendingTxns,
  } = props;
  const [isStaking, setIsStaking] = useState(false);
  const [isApproving, setIsApproving] = useState(false);

  const getError = () => {
    if (!amount || amount.eq(0)) {
      return t`Enter an amount`;
    }
    if (maxAmount && amount.gt(maxAmount)) {
      return t`Max amount exceeded`;
    }
  };

  let amount = parseValue(value, 9);
  const needApproval = amount?.gt(allowance);

  const onClickPrimary = () => {
    if (needApproval) {
      approveTokens({
        setIsApproving,
        library,
        tokenAddress: getContract(chainId, "MEMO_ADDRESS"),
        spender: getContract(chainId, "STAKING_ADDRESS"),
        chainId,
      });
      return;
    }

    setIsStaking(true);
    const contract = new ethers.Contract(getContract(chainId, "STAKING_ADDRESS"), StakingContract.abi, library.getSigner());

    callContract(chainId, contract, "unstake", [amount, true], {
      sentMsg: t`Unstake submitted!`,
      failMsg: t`Unstake failed.`,
      setPendingTxns,
    })
      .then(async (res) => {
        setIsVisible(false);
      })
      .finally(() => {
        setIsStaking(false);
      });
  };

  const isPrimaryEnabled = () => {
    const error = getError();
    if (error) {
      return false;
    }
    if (isApproving) {
      return false;
    }
    if (isStaking) {
      return false;
    }
    return true;
  };

  const getPrimaryText = () => {
    const error = getError();
    if (error) {
      return error;
    }
    if (isApproving) {
      return t`Approving MEMO...`;
    }
    if (needApproval) {
      return t`Approve MEMO`;
    }
    if (isStaking) {
      return t`Unstaking...`;
    }
    return t`Unstake`;
  };

  return (
    <div className="StakeModal">
      <Modal isVisible={isVisible} setIsVisible={setIsVisible} label="Unstake MEMO">
        <div className="Exchange-swap-section">
          <div className="Exchange-swap-section-top">
            <div className="muted">
              <div className="Exchange-swap-usd">
                <Trans>Unstake</Trans>
              </div>
            </div>
            <div className="muted align-right clickable" onClick={() => setValue(formatAmountFree(maxAmount, 18, 18))}>
              <Trans>Max: {formatAmount(maxAmount, 18, 4, true)}</Trans>
            </div>
          </div>
          <div className="Exchange-swap-section-bottom">
            <div>
              <input
                type="number"
                placeholder="0.0"
                className="Exchange-swap-input"
                value={value}
                onChange={(e) => setValue(e.target.value)}
              />
            </div>
            <div className="PositionEditor-token-symbol">MEMO</div>
          </div>
        </div>
        <div className="Exchange-swap-button-container">
          <button className="App-cta Exchange-swap-button" onClick={onClickPrimary} disabled={!isPrimaryEnabled()}>
            {getPrimaryText()}
          </button>
        </div>
      </Modal>
    </div>
  );
}

function MintModal(props) {
  const {
    isVisible,
    setIsVisible,
    chainId,
    maxAmount,
    value,
    setValue,
    address,
    bond,
    slippage,
    library,
    allowance,
    setPendingTxns,
  } = props;
  const [isStaking, setIsStaking] = useState(false);
  const [isApproving, setIsApproving] = useState(false);

  const getError = () => {
    if (!amount || amount.eq(0)) {
      return t`Enter an amount`;
    }
    if (maxAmount && amount.gt(maxAmount)) {
      return t`Max amount exceeded`;
    }
  };

  const userdetails = useCalculateUserBondDetails(bond);
  const userbond = userdetails[0];

  let amount = parseValue(value, 18);
  const needApproval = amount?.gt(userbond?.allowance);

  console.log(bond)
  console.log(userdetails)

  const onClickPrimary = () => {
    if (needApproval) {
      approveTokens({
        setIsApproving,
        library,
        tokenAddress: bond.networkAddrs.reserveAddress,
        spender: bond.networkAddrs.bondAddress,
        chainId,
      });
      return;
    }

    setIsStaking(true);
    const bondContract = bond.getContractForBond(chainId, library.getSigner());
    // const contract = new ethers.Contract(getContract(chainId, "STAKING_HELPER_ADDRESS"), StakingHelperContract.abi, library.getSigner());

    const acceptedSlippage = slippage / 100 || 0.005;
    const calculatePremium = bond.bondPrice;
    const maxPremium = Math.round(calculatePremium * (1 + acceptedSlippage));


    callContract(chainId, bondContract, "deposit", [amount, maxPremium, address], {
      sentMsg: t`Mint submitted!`,
      failMsg: t`Mint failed.`,
      setPendingTxns,
    })
      .then(async (res) => {
        setIsVisible(false);
      })
      .finally(() => {
        setIsStaking(false);
      });
  };

  const isPrimaryEnabled = () => {
    const error = getError();
    if (error) {
      return false;
    }
    if (isApproving) {
      return false;
    }
    if (isStaking) {
      return false;
    }
    return true;
  };

  const getPrimaryText = () => {
    const error = getError();
    if (error) {
      return error;
    }
    if (isApproving) {
      return t`Approving...`;
    }
    if (needApproval) {
      return t`Approve`;
    }
    if (isStaking) {
      return t`Minting...`;
    }
    return t`Mint`;
  };

  return (
    <div className="StakeModal">
      <Modal isVisible={isVisible} setIsVisible={setIsVisible} label={bond.displayName}>
        <div className="Exchange-swap-section">
          <div className="Exchange-swap-section-top">
            <div className="muted">
              <div className="Exchange-swap-usd">
                <Trans>Mint</Trans>
              </div>
            </div>
            <div className="muted align-right clickable" onClick={() => setValue(formatAmountFree(maxAmount, 18, 18))}>
              <Trans>Max: {formatAmount(maxAmount, 18, 4, true)}</Trans>
            </div>
          </div>
          <div className="Exchange-swap-section-bottom">
            <div>
              <input
                type="number"
                placeholder="0.0"
                className="Exchange-swap-input"
                value={value}
                onChange={(e) => setValue(e.target.value)}
              />
            </div>
            <div className="PositionEditor-token-symbol">{bond.displayName}</div>
          </div>
        </div>
        <div className="Exchange-swap-button-container">
          <button className="App-cta Exchange-swap-button" onClick={onClickPrimary} disabled={!isPrimaryEnabled()}>
            {getPrimaryText()}
          </button>
        </div>
      </Modal>
    </div>
  );
}

function getVolumeInfo(hourlyVolumes) {
  if (!hourlyVolumes || hourlyVolumes.length === 0) {
    return {};
  }
  const dailyVolumes = hourlyVolumes.map((hourlyVolume) => {
    const secondsPerHour = 60 * 60;
    const minTime = parseInt(Date.now() / 1000 / secondsPerHour) * secondsPerHour - 24 * secondsPerHour;
    const info = {};
    let totalVolume = bigNumberify(0);
    for (let i = 0; i < hourlyVolume.length; i++) {
      const item = hourlyVolume[i].data;
      if (parseInt(item.timestamp) < minTime) {
        break;
      }

      if (!info[item.token]) {
        info[item.token] = bigNumberify(0);
      }

      info[item.token] = info[item.token].add(item.volume);
      totalVolume = totalVolume.add(item.volume);
    }
    info.totalVolume = totalVolume;
    return info;
  });
  return dailyVolumes.reduce(
    (acc, cv, index) => {
      acc.totalVolume = acc.totalVolume.add(cv.totalVolume);
      acc[ACTIVE_CHAIN_IDS[index]] = cv;
      return acc;
    },
    { totalVolume: bigNumberify(0) }
  );
}

function getPositionStats(positionStats) {
  if (!positionStats || positionStats.length === 0) {
    return null;
  }
  return positionStats.reduce(
    (acc, cv, i) => {
      acc.totalLongPositionSizes = acc.totalLongPositionSizes.add(cv.totalLongPositionSizes);
      acc.totalShortPositionSizes = acc.totalShortPositionSizes.add(cv.totalShortPositionSizes);
      acc[ACTIVE_CHAIN_IDS[i]] = cv;
      return acc;
    },
    {
      totalLongPositionSizes: bigNumberify(0),
      totalShortPositionSizes: bigNumberify(0),
    }
  );
}

function getCurrentFeesUsd(tokenAddresses, fees, infoTokens) {
  if (!fees || !infoTokens) {
    return bigNumberify(0);
  }

  let currentFeesUsd = bigNumberify(0);
  for (let i = 0; i < tokenAddresses.length; i++) {
    const tokenAddress = tokenAddresses[i];
    const tokenInfo = infoTokens[tokenAddress];
    if (!tokenInfo || !tokenInfo.contractMinPrice) {
      continue;
    }

    const feeUsd = fees[i].mul(tokenInfo.contractMinPrice).div(expandDecimals(1, tokenInfo.decimals));
    currentFeesUsd = currentFeesUsd.add(feeUsd);
  }

  return currentFeesUsd;
}

export default function DashboardV2({setPendingTxns, savedSlippageAmount, connectWallet}) {
  const { active, library, account } = useWeb3React();
  const { chainId } = useChainId();
  const totalVolume = useTotalVolume();

  const chainName = getChainName(chainId);
  const currentIcons = getIcons(chainId);

  const { data: positionStats } = useSWR(
    ACTIVE_CHAIN_IDS.map((chainId) => getServerUrl(chainId, "/position_stats")),
    {
      fetcher: arrayURLFetcher,
    }
  );

  const { data: hourlyVolumes } = useSWR(
    ACTIVE_CHAIN_IDS.map((chainId) => getServerUrl(chainId, "/hourly_volume")),
    {
      fetcher: arrayURLFetcher,
    }
  );

  const appdetails = useAppDetails();

  const userdetails = useAccountDetails();

  const timeUntilRebase = prettifySeconds(secondsUntilBlock(appdetails[0]["currentBlockTime"], appdetails[0]["nextRebase"]));

  const bondadd = useCalcBondDetails(bonds, null);
  let bonddetails = [];

  let i = 0;

  bonds.forEach(bond => {
    bonddetails.push(Object.assign({}, bond, bondadd[0][i]));
    i++;
  });

  const isGmxTransferEnabled = true;

  let { total: totalGmxSupply } = useTotalGmxSupply();

  const currentVolumeInfo = getVolumeInfo(hourlyVolumes);

  const positionStatsInfo = getPositionStats(positionStats);

  function getWhitelistedTokenAddresses(chainId) {
    const whitelistedTokens = getWhitelistedTokens(chainId);
    return whitelistedTokens.map((token) => token.address);
  }

  const whitelistedTokens = getWhitelistedTokens(chainId);
  const tokenList = whitelistedTokens.filter((t) => !t.isWrapped);
  const visibleTokens = tokenList.filter((t) => !t.isTempHidden);

  const readerAddress = getContract(chainId, "Reader");
  const vaultAddress = getContract(chainId, "Vault");
  const glpManagerAddress = getContract(chainId, "GlpManager");

  const gmxAddress = getContract(chainId, "GMX");
  const glpAddress = getContract(chainId, "GLP");
  const usdgAddress = getContract(chainId, "USDG");

  const tokensForSupplyQuery = [gmxAddress, glpAddress, usdgAddress];

  const { data: aums } = useSWR([`Dashboard:getAums:${active}`, chainId, glpManagerAddress, "getAums"], {
    fetcher: contractFetcher(library, GlpManager),
  });

  const { data: totalSupplies } = useSWR(
    [`Dashboard:totalSupplies:${active}`, chainId, readerAddress, "getTokenBalancesWithSupplies", AddressZero],
    {
      fetcher: contractFetcher(library, ReaderV2, [tokensForSupplyQuery]),
    }
  );

  const { data: totalTokenWeights } = useSWR(
    [`GlpSwap:totalTokenWeights:${active}`, chainId, vaultAddress, "totalTokenWeights"],
    {
      fetcher: contractFetcher(library, VaultV2),
    }
  );

  const { infoTokens } = useInfoTokens(library, chainId, active, undefined, undefined);
  const { infoTokens: infoTokensArbitrum } = useInfoTokens(null, ARBITRUM, active, undefined, undefined);
  const { infoTokens: infoTokensAvax } = useInfoTokens(null, AVALANCHE, active, undefined, undefined);

  const { data: currentFees } = useSWR(
    infoTokensArbitrum[AddressZero].contractMinPrice && infoTokensAvax[AddressZero].contractMinPrice
      ? "Dashboard:currentFees"
      : null,
    {
      fetcher: () => {
        return Promise.all(
          ACTIVE_CHAIN_IDS.map((chainId) =>
            contractFetcher(null, ReaderV2, [getWhitelistedTokenAddresses(chainId)])(
              `Dashboard:fees:${chainId}`,
              chainId,
              getContract(chainId, "Reader"),
              "getFees",
              getContract(chainId, "Vault")
            )
          )
        ).then((fees) => {
          return fees.reduce(
            (acc, cv, i) => {
              const feeUSD = getCurrentFeesUsd(
                getWhitelistedTokenAddresses(ACTIVE_CHAIN_IDS[i]),
                cv,
                ACTIVE_CHAIN_IDS[i] === ARBITRUM ? infoTokensArbitrum : infoTokensAvax
              );
              acc[ACTIVE_CHAIN_IDS[i]] = feeUSD;
              acc.total = acc.total.add(feeUSD);
              return acc;
            },
            { total: bigNumberify(0) }
          );
        });
      },
    }
  );

  const { data: feesSummaryByChain } = useFeesSummary();
  const feesSummary = feesSummaryByChain[chainId];

  const eth = infoTokens[getTokenBySymbol(chainId, "ETH").address];
  const shouldIncludeCurrrentFees =
    feesSummaryByChain[chainId].lastUpdatedAt &&
    parseInt(Date.now() / 1000) - feesSummaryByChain[chainId].lastUpdatedAt > 60 * 60;

  const totalFees = ACTIVE_CHAIN_IDS.map((chainId) => {
    if (shouldIncludeCurrrentFees && currentFees && currentFees[chainId]) {
      return currentFees[chainId].div(expandDecimals(1, USD_DECIMALS)).add(feesSummaryByChain[chainId].totalFees || 0);
    }

    return feesSummaryByChain[chainId].totalFees || 0;
  })
    .map((v) => Math.round(v))
    .reduce(
      (acc, cv, i) => {
        acc[ACTIVE_CHAIN_IDS[i]] = cv;
        acc.total = acc.total + cv;
        return acc;
      },
      { total: 0 }
    );

  const { gmxPrice, gmxPriceFromArbitrum, gmxPriceFromAvalanche } = useGmxPrice(
    chainId,
    { arbitrum: chainId === ARBITRUM ? library : undefined },
    active
  );

  let { total: totalGmxInLiquidity } = useTotalGmxInLiquidity(chainId, active);

  let { avax: avaxStakedGmx, arbitrum: arbitrumStakedGmx, total: totalStakedGmx } = useTotalGmxStaked();

  let gmxMarketCap;
  if (gmxPrice && totalGmxSupply) {
    gmxMarketCap = gmxPrice.mul(totalGmxSupply).div(expandDecimals(1, GMX_DECIMALS));
  }

  let stakedGmxSupplyUsd;
  if (gmxPrice && totalStakedGmx) {
    stakedGmxSupplyUsd = totalStakedGmx.mul(gmxPrice).div(expandDecimals(1, GMX_DECIMALS));
  }

  let aum;
  if (aums && aums.length > 0) {
    aum = aums[0].add(aums[1]).div(2);
  }

  let glpPrice;
  let glpSupply;
  let glpMarketCap;
  if (aum && totalSupplies && totalSupplies[3]) {
    glpSupply = totalSupplies[3];
    glpPrice =
      aum && aum.gt(0) && glpSupply.gt(0)
        ? aum.mul(expandDecimals(1, GLP_DECIMALS)).div(glpSupply)
        : expandDecimals(1, USD_DECIMALS);
    glpMarketCap = glpPrice.mul(glpSupply).div(expandDecimals(1, GLP_DECIMALS));
  }

  let tvl;
  if (glpMarketCap && gmxPrice && totalStakedGmx) {
    tvl = glpMarketCap.add(gmxPrice.mul(totalStakedGmx).div(expandDecimals(1, GMX_DECIMALS)));
  }

  const ethFloorPriceFund = expandDecimals(350 + 148 + 384, 18);
  const glpFloorPriceFund = expandDecimals(660001, 18);
  const usdcFloorPriceFund = expandDecimals(784598 + 200000, 30);

  let totalFloorPriceFundUsd;

  if (eth && eth.contractMinPrice && glpPrice) {
    const ethFloorPriceFundUsd = ethFloorPriceFund.mul(eth.contractMinPrice).div(expandDecimals(1, eth.decimals));
    const glpFloorPriceFundUsd = glpFloorPriceFund.mul(glpPrice).div(expandDecimals(1, 18));

    totalFloorPriceFundUsd = ethFloorPriceFundUsd.add(glpFloorPriceFundUsd).add(usdcFloorPriceFund);
  }

  let adjustedUsdgSupply = bigNumberify(0);

  for (let i = 0; i < tokenList.length; i++) {
    const token = tokenList[i];
    const tokenInfo = infoTokens[token.address];
    if (tokenInfo && tokenInfo.usdgAmount) {
      adjustedUsdgSupply = adjustedUsdgSupply.add(tokenInfo.usdgAmount);
    }
  }

  const getWeightText = (tokenInfo) => {
    if (
      !tokenInfo.weight ||
      !tokenInfo.usdgAmount ||
      !adjustedUsdgSupply ||
      adjustedUsdgSupply.eq(0) ||
      !totalTokenWeights
    ) {
      return "...";
    }

    const currentWeightBps = tokenInfo.usdgAmount.mul(BASIS_POINTS_DIVISOR).div(adjustedUsdgSupply);
    // use add(1).div(10).mul(10) to round numbers up
    const targetWeightBps = tokenInfo.weight.mul(BASIS_POINTS_DIVISOR).div(totalTokenWeights).add(1).div(10).mul(10);

    const weightText = `${formatAmount(currentWeightBps, 2, 2, false)}% / ${formatAmount(
      targetWeightBps,
      2,
      2,
      false
    )}%`;

    return (
      <TooltipComponent
        handle={weightText}
        position="right-bottom"
        renderContent={() => {
          return (
            <>
              <StatsTooltipRow
                label={t`Current Weight`}
                value={`${formatAmount(currentWeightBps, 2, 2, false)}%`}
                showDollar={false}
              />
              <StatsTooltipRow
                label={t`Target Weight`}
                value={`${formatAmount(targetWeightBps, 2, 2, false)}%`}
                showDollar={false}
              />
              <br />
              {currentWeightBps.lt(targetWeightBps) && (
                <div className="text-white">
                  <Trans>
                    {tokenInfo.symbol} is below its target weight.
                    <br />
                    <br />
                    Get lower fees to{" "}
                    <Link to="/buy_glp" target="_blank" rel="noopener noreferrer">
                      buy GLP
                    </Link>{" "}
                    with {tokenInfo.symbol}, and to{" "}
                    <Link to="/trade" target="_blank" rel="noopener noreferrer">
                      swap
                    </Link>{" "}
                    {tokenInfo.symbol} for other tokens.
                  </Trans>
                </div>
              )}
              {currentWeightBps.gt(targetWeightBps) && (
                <div className="text-white">
                  <Trans>
                    {tokenInfo.symbol} is above its target weight.
                    <br />
                    <br />
                    Get lower fees to{" "}
                    <Link to="/trade" target="_blank" rel="noopener noreferrer">
                      swap
                    </Link>{" "}
                    tokens for {tokenInfo.symbol}.
                  </Trans>
                </div>
              )}
              <br />
              <div>
                <ExternalLink href="https://gmxio.gitbook.io/gmx/glp">
                  <Trans>More Info</Trans>
                </ExternalLink>
              </div>
            </>
          );
        }}
      />
    );
  };

  let stakedPercent = 0;

  if (totalGmxSupply && !totalGmxSupply.isZero() && !totalStakedGmx.isZero()) {
    stakedPercent = totalStakedGmx.mul(100).div(totalGmxSupply).toNumber();
  }

  let liquidityPercent = 0;

  if (totalGmxSupply && !totalGmxSupply.isZero() && totalGmxInLiquidity) {
    liquidityPercent = totalGmxInLiquidity.mul(100).div(totalGmxSupply).toNumber();
  }

  let notStakedPercent = 100 - stakedPercent - liquidityPercent;

  let gmxDistributionData = [
    {
      name: t`staked`,
      value: stakedPercent,
      color: "#4353fa",
    },
    {
      name: t`in liquidity`,
      value: liquidityPercent,
      color: "#0598fa",
    },
    {
      name: t`not staked`,
      value: notStakedPercent,
      color: "#5c0af5",
    },
  ];

  const totalStatsStartDate = chainId === AVALANCHE ? t`06 Jan 2022` : t`01 Sep 2021`;

  let stableGlp = 0;
  let totalGlp = 0;

  let glpPool = tokenList.map((token) => {
    const tokenInfo = infoTokens[token.address];
    if (tokenInfo.usdgAmount && adjustedUsdgSupply && adjustedUsdgSupply.gt(0)) {
      const currentWeightBps = tokenInfo.usdgAmount.mul(BASIS_POINTS_DIVISOR).div(adjustedUsdgSupply);
      if (tokenInfo.isStable) {
        stableGlp += parseFloat(`${formatAmount(currentWeightBps, 2, 2, false)}`);
      }
      totalGlp += parseFloat(`${formatAmount(currentWeightBps, 2, 2, false)}`);
      return {
        fullname: token.name,
        name: token.symbol,
        value: parseFloat(`${formatAmount(currentWeightBps, 2, 2, false)}`),
      };
    }
    return null;
  });

  let stablePercentage = totalGlp > 0 ? ((stableGlp * 100) / totalGlp).toFixed(2) : "0.0";

  glpPool = glpPool.filter(function (element) {
    return element !== null;
  });

  glpPool = glpPool.sort(function (a, b) {
    if (a.value < b.value) return 1;
    else return -1;
  });

  gmxDistributionData = gmxDistributionData.sort(function (a, b) {
    if (a.value < b.value) return 1;
    else return -1;
  });

  const [gmxActiveIndex, setGMXActiveIndex] = useState(null);

  const onGMXDistributionChartEnter = (_, index) => {
    setGMXActiveIndex(index);
  };

  const onGMXDistributionChartLeave = (_, index) => {
    setGMXActiveIndex(null);
  };

  const [glpActiveIndex, setGLPActiveIndex] = useState(null);

  const onGLPPoolChartEnter = (_, index) => {
    setGLPActiveIndex(index);
  };

  const onGLPPoolChartLeave = (_, index) => {
    setGLPActiveIndex(null);
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="stats-label">
          <div className="stats-label-color" style={{ backgroundColor: payload[0].color }}></div>
          {payload[0].value}% {payload[0].name}
        </div>
      );
    }

    return null;
  };

  const [isStakeModalVisible, setIsStakeModalVisible] = useState(false);
  const [stakeModalMaxAmount, setStakeModalMaxAmount] = useState(undefined);
  const [stakeValue, setStakeValue] = useState("");

  const [isUnStakeModalVisible, setIsUnStakeModalVisible] = useState(false);
  const [unStakeModalMaxAmount, setUnStakeModalMaxAmount] = useState(undefined);
  const [unStakeValue, setUnStakeValue] = useState("");

  const [isMintModalVisible, setIsMintModalVisible] = useState(false);
  const [mintModalMaxAmount, setMintModalMaxAmount] = useState(undefined);
  const [mintValue, setMintValue] = useState("");

  const [bond, setBond] = useState(bonds[0]);
  

  const showStakeModal = () => {
    setIsStakeModalVisible(true);
    setStakeModalMaxAmount(!userdetails[0]["balances"]? 0 : userdetails[0]["balances"]["time"]);
    setStakeValue("");
  };

  const showUnStakeModal = () => {
    setIsUnStakeModalVisible(true);
    setUnStakeModalMaxAmount(!userdetails[0]["balances"]? 0 : userdetails[0]["balances"]["memo"]);
    setUnStakeValue("");
  };

  const showMintModal = (bond1) => {
    setBond(bond1);
    setIsMintModalVisible(true);
    setMintModalMaxAmount(!userdetails[0]["balances"]? 0 : userdetails[0]["balances"]["time"]);
    setMintValue("");
  };

  return (
    <SEO title={getPageTitle("Dashboard")}>
      <div className="default-container DashboardV2 page-layout">
        <StakeModal
          isVisible={isStakeModalVisible}
          setIsVisible={setIsStakeModalVisible}
          chainId={chainId}
          maxAmount={stakeModalMaxAmount}
          value={stakeValue}
          setValue={setStakeValue}
          address={account}
          library={library}
          allowance={!userdetails[0]["staking"]? 0 : userdetails[0]["staking"]["time"]}
          setPendingTxns={setPendingTxns}
        />
        <UnStakeModal
          isVisible={isUnStakeModalVisible}
          setIsVisible={setIsUnStakeModalVisible}
          chainId={chainId}
          maxAmount={unStakeModalMaxAmount}
          value={unStakeValue}
          setValue={setUnStakeValue}
          address={account}
          library={library}
          allowance={!userdetails[0]["staking"]? 0 : userdetails[0]["staking"]["memo"]}
          setPendingTxns={setPendingTxns}
        />
        <MintModal
          isVisible={isMintModalVisible}
          setIsVisible={setIsMintModalVisible}
          chainId={chainId}
          maxAmount={mintModalMaxAmount}
          value={mintValue}
          setValue={setMintValue}
          address={account}
          bond={bond}
          slippage={savedSlippageAmount}
          library={library}
          allowance={!userdetails[0]["staking"]? 0 : userdetails[0]["staking"]["time"]}
          setPendingTxns={setPendingTxns}
        />
        <div className="DashboardV2-content">
          <div className="Tab-title-section">
            <div className="Page-title">
              <Trans>Glympus</Trans> <img src={currentIcons.network} width="24" alt="Network Icon" />
            </div>
            <div className="Page-description">
              <Trans>Platform and GLP index tokens.</Trans>
            </div>
          </div>
          <div className="DashboardV2-token-cards">
            <div className="stats-wrapper stats-wrapper--gmx">
              <div className="App-card">
                <div className="stats-block">
                  <div className="App-card-title">
                    <div className="App-card-title-mark">
                      <div className="App-card-title-mark-icon">
                        <img src={currentIcons.gmx} width="40" alt="GMX Token Icon" />
                      </div>
                      <div className="App-card-title-mark-info">
                        <div className="App-card-title-mark-title">General Information</div>
                        <div className="App-card-title-mark-subtitle">TIME</div>
                      </div>
                      <div>
                        <AssetDropdown assetSymbol="GMX" />
                      </div>
                    </div>
                  </div>
                  <div className="App-card-divider"></div>
                  <div className="App-card-content-wrapper">
                    <div className="App-card-content">
                      <div className="App-card-row">
                        <div className="label">
                          <Trans>Time Price</Trans>
                        </div>
                        <div>
                          $ {!appdetails[0]["marketPrice"] && "..."}
                          {appdetails[0]["marketPrice"] && (trim(appdetails[0]["marketPrice"], 2))}
                        </div>
                      </div>
                      <div className="App-card-row">
                        <div className="label">
                          <Trans>Total Supply</Trans>
                        </div>
                        <div>
                          {!appdetails[0]["marketPrice"] && "..."}
                          {appdetails[0]["marketPrice"] && (new Intl.NumberFormat("en-US").format(Math.floor(appdetails[0]["totalSupply"])))} TIME
                        </div>
                      </div>
                      <div className="App-card-row">
                        <div className="label">
                          <Trans>Circ Supply</Trans>
                        </div>
                        <div>
                          {!appdetails[0]["marketPrice"] && "..."}
                          {appdetails[0]["marketPrice"] && (new Intl.NumberFormat("en-US").format(Math.floor(appdetails[0]["circSupply"])))} TIME
                        </div>
                      </div>
                      <div className="App-card-row">
                        <div className="label">
                          <Trans>Total Staked</Trans>
                        </div>
                        <div>
                          $ {!appdetails[0]["marketPrice"] && "..."}
                          {appdetails[0]["marketPrice"] && (new Intl.NumberFormat("en-US").format(Math.floor(appdetails[0]["stakingTVL"])))}
                        </div>
                      </div>
                      <div className="App-card-row">
                        <div className="label">
                          <Trans>Market Cap</Trans>
                        </div>
                        <div>
                          $ {!appdetails[0]["marketPrice"] && "..."}
                          {appdetails[0]["marketPrice"] && (new Intl.NumberFormat("en-US").format(Math.floor(appdetails[0]["marketCap"])))}
                        </div>
                      </div>
                    </div>
                    <div className="App-card-content">
                    <div className="App-card-row">
                        <div className="label">
                          <Trans>Treasury Balance</Trans>
                        </div>
                        <div>
                          $ {!appdetails[0]["marketPrice"] && "..."}
                          {appdetails[0]["marketPrice"] && (new Intl.NumberFormat("en-US").format(Math.floor(appdetails[0]["treasuryBalance"])))}
                        </div>
                      </div>
                      <div className="App-card-row">
                        <div className="label">
                          <Trans>APY</Trans>
                        </div>
                        <div>
                          {!appdetails[0]["marketPrice"] && "..."}
                          {appdetails[0]["marketPrice"] && (new Intl.NumberFormat("en-US").format(Math.floor(appdetails[0]["stakingAPY"])))} %
                        </div>
                      </div>
                      <div className="App-card-row">
                        <div className="label">
                          <Trans>Current Index</Trans>
                        </div>
                        <div>
                          {!appdetails[0]["marketPrice"] && "..."}
                          {appdetails[0]["marketPrice"] && (trim(appdetails[0]["currentIndex"], 2))} TIME
                        </div>
                      </div>
                      <div className="App-card-row">
                        <div className="label">
                          <Trans>Backing per $TIME</Trans>
                        </div>
                        <div>
                          $ {!appdetails[0]["marketPrice"] && "..."}
                          {appdetails[0]["marketPrice"] && (trim(appdetails[0]["rfv"], 2))}
                        </div>
                      </div>
                      <div className="App-card-row">
                        <div className="label">
                          <Trans>Next Rebase</Trans>
                        </div>
                        <div>
                          {!appdetails[0]["marketPrice"] && "..."}
                          {timeUntilRebase}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="stats-wrapper stats-wrapper--gmx">
              <div className="App-card">
                <div className="stats-block">
                  <div className="App-card-title">
                    <div className="App-card-title-mark">
                      <div className="App-card-title-mark-icon">
                        <img src={currentIcons.gmx} width="40" alt="GMX Token Icon" />
                      </div>
                      <div className="App-card-title-mark-info">
                        <div className="App-card-title-mark-title">TIME Staking</div>
                        <div className="App-card-title-mark-subtitle">TIME</div>
                      </div>
                      <div>
                        <AssetDropdown assetSymbol="GMX" />
                      </div>
                    </div>
                  </div>
                  <div className="App-card-divider"></div>
                  <div className="App-card-content-wrapper">
                    <div className="App-card-content">
                      <div className="App-card-row">
                        <div className="label">
                          <Trans>Your Balance</Trans>
                        </div>
                        <div>
                          {!userdetails[0]["balances"] && "..."}
                          {userdetails[0]["balances"] && (trim(userdetails[0]["balances"]["time"], 3))} TIME
                        </div>
                      </div>
                      <div className="App-card-row">
                        <div className="label">
                          <Trans>Your Staked Balance</Trans>
                        </div>
                        <div>
                          {!userdetails[0]["balances"] && "..."}
                          {userdetails[0]["balances"] && (trim(userdetails[0]["balances"]["memo"], 3))} MEMO
                        </div>
                      </div>
                      <div className="App-card-row">
                        <div className="label">
                          <Trans>Next Reward Amount</Trans>
                        </div>
                        <div>
                          {!userdetails[0]["balances"] && "..."}
                          {userdetails[0]["balances"] && (trim(appdetails[0]["stakingRebase"] * userdetails[0]["balances"]["memo"], 3))} MEMO
                        </div>
                      </div>
                      <div className="App-card-row">
                        <div className="label">
                          <Trans>Next Reward Yield</Trans>
                        </div>
                        <div>
                          {!appdetails[0]["marketPrice"] && "..."}
                          {appdetails[0]["marketPrice"] && (trim(appdetails[0]["stakingRebase"] * 100, 4))} %
                        </div>
                      </div>
                      <div className="App-card-row">
                        <div className="label">
                          <Trans>ROI (5-Day Rate)</Trans>
                        </div>
                        <div>
                          {!appdetails[0]["marketPrice"] && "..."}
                          {appdetails[0]["marketPrice"] && (trim(Number(appdetails[0]["fiveDayRate"]) * 100, 4))} %
                        </div>
                      </div>
                    </div>
                    <div className="App-card-content">
                      <div className="App-card-row-1">
                        {active && (
                          <>
                            <button className="App-button-option App-card-option" onClick={() => showStakeModal()}>
                              <Trans>Stake</Trans>
                            </button>
                            <button className="App-button-option App-card-option" onClick={() => showUnStakeModal()}>
                              <Trans>Unstake</Trans>
                            </button>
                          </>
                        )}
                        {!active && (
                          <button className="App-button-option App-card-option" onClick={() => connectWallet()}>
                            Connect Wallet
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="token-table-wrapper App-card">
              <div className="App-card-title">
                <Trans>Bond</Trans> <img src={currentIcons.network} width="16" alt="Network Icon" />
              </div>
              <div className="App-card-divider"></div>
              <table className="token-table">
                <thead>
                  <tr>
                    <th>
                      <Trans>BOND</Trans>
                    </th>
                    <th>
                      <Trans>PRICE</Trans>
                    </th>
                    <th>
                      <Trans>ROI</Trans>
                    </th>
                    <th>
                      <Trans>PURCHASED</Trans>
                    </th>
                    <th>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {bonddetails.map((bond) => {
                    // const tokenInfo = infoTokens[token.address];
                    // let utilization = bigNumberify(0);
                    // if (tokenInfo && tokenInfo.reservedAmount && tokenInfo.poolAmount && tokenInfo.poolAmount.gt(0)) {
                    //   utilization = tokenInfo.reservedAmount.mul(BASIS_POINTS_DIVISOR).div(tokenInfo.poolAmount);
                    // }
                    // let maxUsdgAmount = DEFAULT_MAX_USDG_AMOUNT;
                    // if (tokenInfo.maxUsdgAmount && tokenInfo.maxUsdgAmount.gt(0)) {
                    //   maxUsdgAmount = tokenInfo.maxUsdgAmount;
                    // }
                    // const tokenImage = importImage("ic_" + token.symbol.toLowerCase() + "_40.svg");

                    return (
                      <tr key={bond.name}>
                        <td>
                          <div className="token-symbol-wrapper">
                            <div className="App-card-title-info">
                              <div className="App-card-title-info-icon">
                                <img src={bond.bondIconSvg} alt={bond.displayName} width="40" />
                              </div>
                              <div className="App-card-title-info-text">
                                <div className="App-card-info-title">{bond.displayName}</div>
                                {/* <div className="App-card-info-subtitle">{token.symbol}</div> */}
                              </div>
                              {/* <div>
                                <AssetDropdown assetSymbol={token.symbol} assetInfo={token} />
                              </div> */}
                            </div>
                          </div>
                        </td>
                        <td>
                          ${!bond.bondPriceInUSD && "..."}
                          {bond.bondPriceInUSD && trim(bond.bondPriceInUSD, 2)}
                        </td>
                        <td>
                          {!bond.bondPriceInUSD && "..."}
                          {bond.bondPriceInUSD && trim(bond.bondDiscount * 100, 2)} %
                        </td>
                        <td>
                          {!bond.bondPriceInUSD && "..."}
                          {bond.bondPriceInUSD && new Intl.NumberFormat("en-US", {style: "currency",currency: "USD",maximumFractionDigits: 0,minimumFractionDigits: 0,}).format(bond.purchased)}
                        </td>
                        <td>
                          <button className="App-button-option App-card-option" onClick={() => showMintModal(bond)}>
                            <Trans>Mint</Trans>
                          </button>
                          <button className="App-button-option App-card-option" onClick={() => showStakeModal()}>
                            <Trans>Redeem</Trans>
                          </button>
                        </td>
                        {/* <td>
                          <TooltipComponent
                            handle={`$${formatKeyAmount(tokenInfo, "managedUsd", USD_DECIMALS, 0, true)}`}
                            position="right-bottom"
                            className="nowrap"
                            renderContent={() => {
                              return (
                                <>
                                  <StatsTooltipRow
                                    label={t`Pool Amount`}
                                    value={`${formatKeyAmount(tokenInfo, "managedAmount", token.decimals, 0, true)} ${
                                      token.symbol
                                    }`}
                                    showDollar={false}
                                  />
                                  <StatsTooltipRow
                                    label={t`Target Min Amount`}
                                    value={`${formatKeyAmount(tokenInfo, "bufferAmount", token.decimals, 0, true)} ${
                                      token.symbol
                                    }`}
                                    showDollar={false}
                                  />
                                  <StatsTooltipRow
                                    label={t`Max ${tokenInfo.symbol} Capacity`}
                                    value={formatAmount(maxUsdgAmount, 18, 0, true)}
                                    showDollar={true}
                                  />
                                </>
                              );
                            }}
                          />
                        </td>
                        <td>{getWeightText(tokenInfo)}</td>
                        <td>{formatAmount(utilization, 2, 2, false)}%</td> */}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <div className="token-grid">
              {bonddetails.map((bond) => {
                // const tokenInfo = infoTokens[token.address];
                // let utilization = bigNumberify(0);
                // if (tokenInfo && tokenInfo.reservedAmount && tokenInfo.poolAmount && tokenInfo.poolAmount.gt(0)) {
                //   utilization = tokenInfo.reservedAmount.mul(BASIS_POINTS_DIVISOR).div(tokenInfo.poolAmount);
                // }
                // let maxUsdgAmount = DEFAULT_MAX_USDG_AMOUNT;
                // if (tokenInfo.maxUsdgAmount && tokenInfo.maxUsdgAmount.gt(0)) {
                //   maxUsdgAmount = tokenInfo.maxUsdgAmount;
                // }

                // const tokenImage = importImage("ic_" + token.symbol.toLowerCase() + "_24.svg");
                return (
                  <div className="App-card" key={bond.name}>
                    <div className="App-card-title">
                      <div className="mobile-token-card">
                        <img src={bond.bondIconSvg} alt={bond.displayName} width="40" />
                        <div className="token-symbol-text">{bond.displayName}</div>
                        {/* <div>
                          <AssetDropdown assetSymbol={token.symbol} assetInfo={token} />
                        </div> */}
                      </div>
                    </div>
                    <div className="App-card-divider"></div>
                    <div className="App-card-content-1">
                      <div className="App-card-row">
                        <div className="label">
                          <Trans>Price</Trans>
                        </div>
                        <div>${!bond.bondPriceInUSD && "..."}
                          {bond.bondPriceInUSD && trim(bond.bondPriceInUSD, 2)}</div>
                      </div>
                      <div className="App-card-row">
                        <div className="label">
                          <Trans>ROI</Trans>
                        </div>
                        <div>{!bond.bondPriceInUSD && "..."}
                          {bond.bondPriceInUSD && trim(bond.bondDiscount * 100, 2)} %</div>
                      </div>
                      <div className="App-card-row">
                        <div className="label">
                          <Trans>PURCHASED</Trans>
                        </div>
                        <div>{!bond.bondPriceInUSD && "..."}
                          {bond.bondPriceInUSD && new Intl.NumberFormat("en-US", {style: "currency",currency: "USD",maximumFractionDigits: 0,minimumFractionDigits: 0,}).format(bond.purchased)}</div>
                      </div>
                      <div className="App-card-row-1">
                        <button className="App-button-option App-card-option" onClick={() => showMintModal(bond)}>
                          <Trans>Mint</Trans>
                        </button>
                        <button className="App-button-option App-card-option" onClick={() => showStakeModal()}>
                          <Trans>Redeem</Trans>
                        </button>
                      </div>
                      {/* <div className="App-card-row">
                        <div className="label">
                          <Trans>Pool</Trans>
                        </div>
                        <div>
                          <TooltipComponent
                            handle={`$${formatKeyAmount(tokenInfo, "managedUsd", USD_DECIMALS, 0, true)}`}
                            position="right-bottom"
                            renderContent={() => {
                              return (
                                <>
                                  <StatsTooltipRow
                                    label={t`Pool Amount`}
                                    value={`${formatKeyAmount(tokenInfo, "managedAmount", token.decimals, 0, true)} ${
                                      token.symbol
                                    }`}
                                    showDollar={false}
                                  />
                                  <StatsTooltipRow
                                    label={t`Target Min Amount`}
                                    value={`${formatKeyAmount(tokenInfo, "bufferAmount", token.decimals, 0, true)} ${
                                      token.symbol
                                    }`}
                                    showDollar={false}
                                  />
                                  <StatsTooltipRow
                                    label={t`Max ${tokenInfo.symbol} Capacity`}
                                    value={formatAmount(maxUsdgAmount, 18, 0, true)}
                                  />
                                </>
                              );
                            }}
                          />
                        </div>
                      </div>
                      <div className="App-card-row">
                        <div className="label">
                          <Trans>Weight</Trans>
                        </div>
                        <div>{getWeightText(tokenInfo)}</div>
                      </div>
                      <div className="App-card-row">
                        <div className="label">
                          <Trans>Utilization</Trans>
                        </div>
                        <div>{formatAmount(utilization, 2, 2, false)}%</div>
                      </div> */}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </SEO>
  );
}
