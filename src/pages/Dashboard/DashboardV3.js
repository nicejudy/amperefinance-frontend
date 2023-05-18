import React, { useState } from "react";
import { useWeb3React } from "@web3-react/core";
import { Trans, t } from "@lingui/macro";
import Modal from "components/Modal/Modal";
import { ethers } from "ethers";

import {
  getPageTitle,
  useAppDetails,
  useAccountDetails,
  useBondDetails,
  useCalcBondDetails,
  useCalculateUserBondDetails
} from "lib/legacy";

import { getContract } from "config/contracts";

import StakingContract from "abis/StakingContract.json";
import StakingHelperContract from "abis/StakingHelperContract.json";
import Footer from "components/Footer/Footer";

import "./DashboardV2.css";

import AssetDropdown from "./AssetDropdown";
import SEO from "components/Common/SEO";
import { approveTokens } from "domain/tokens";
import { callContract } from "lib/contracts";
import { formatAmount, formatAmountFree, parseValue } from "lib/numbers";
import { useChainId } from "lib/chains";
import { trim } from "lib/trim";
import { prettifySeconds } from "lib/prettify-seconds";
import { secondsUntilBlock } from "lib/seconds-until-block";
import { getIcons } from "config/icons";
import bonds from "lib/bond";
import TokenImg from "img/smalltoken.png";
import HeadImg from "img/smallhead.png";

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
      return t`Approving QUA...`;
    }
    if (needApproval) {
      return t`Approve QUA`;
    }
    if (isStaking) {
      return t`Staking...`;
    }
    return t`Stake`;
  };

  return (
    <div className="StakeModal">
      <Modal isVisible={isVisible} setIsVisible={setIsVisible} label="Stake QUA">
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
            <div className="PositionEditor-token-symbol">QUA</div>
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

export default function DashboardV2({setPendingTxns, savedSlippageAmount, connectWallet}) {
  const { active, library, account } = useWeb3React();
  const { chainId } = useChainId();

  const currentIcons = getIcons(chainId);

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
            <img src={HeadImg} width="32" alt="Network Icon" /><span>uasar Capital</span>
            </div>
            <div className="Page-description">
              <Trans>Quasar Capital is a decentralized reserve currency
and hedge fund featuring a proprietary treasury-reverse protocol.</Trans>
            </div>
          </div>
          <div className="DashboardV2-token-cards">
            <div className="stats-wrapper stats-wrapper--gmx">
              <div className="App-card">
                <div className="stats-block">
                  <div className="App-card-title">
                    <div className="App-card-title-mark">
                      <div className="App-card-title-mark-icon">
                        <img src={TokenImg} width="40" alt="GMX Token Icon" />
                      </div>
                      <div className="App-card-title-mark-info">
                        <div className="App-card-title-mark-title">General Information</div>
                        <div className="App-card-title-mark-subtitle">QUA</div>
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
                          <Trans>Qua Price</Trans>
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
                          {appdetails[0]["marketPrice"] && (new Intl.NumberFormat("en-US").format(Math.floor(appdetails[0]["totalSupply"])))} QUA
                        </div>
                      </div>
                      <div className="App-card-row">
                        <div className="label">
                          <Trans>Circ Supply</Trans>
                        </div>
                        <div>
                          {!appdetails[0]["marketPrice"] && "..."}
                          {appdetails[0]["marketPrice"] && (new Intl.NumberFormat("en-US").format(Math.floor(appdetails[0]["circSupply"])))} QUA
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
                          {appdetails[0]["marketPrice"] && (trim(appdetails[0]["currentIndex"], 2))} QUA
                        </div>
                      </div>
                      <div className="App-card-row">
                        <div className="label">
                          <Trans>Backing per QUA</Trans>
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
                        <div className="App-card-title-mark-title">QUA Staking</div>
                        <div className="App-card-title-mark-subtitle">QUA</div>
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
                          {userdetails[0]["balances"] && (trim(userdetails[0]["balances"]["time"], 3))} QUA
                        </div>
                      </div>
                      <div className="App-card-row">
                        <div className="label">
                          <Trans>Your Staked Balance</Trans>
                        </div>
                        <div>
                          {!userdetails[0]["balances"] && "..."}
                          {userdetails[0]["balances"] && (trim(userdetails[0]["balances"]["memo"], 3))} SQUA
                        </div>
                      </div>
                      <div className="App-card-row">
                        <div className="label">
                          <Trans>Next Reward Amount</Trans>
                        </div>
                        <div>
                          {!userdetails[0]["balances"] && "..."}
                          {userdetails[0]["balances"] && (trim(appdetails[0]["stakingRebase"] * userdetails[0]["balances"]["memo"], 3))} SQUA
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
