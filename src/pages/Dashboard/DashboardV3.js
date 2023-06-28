import { useState } from "react";
import { useWeb3React } from "@web3-react/core";
import { useLocalStorage } from "react-use";
import { Trans } from "@lingui/macro";
import ExchangeBanner from "components/Exchange/ExchangeBanner";
import ExternalLink from "components/ExternalLink/ExternalLink";

import {
  getPageTitle,
  useAppDetails,
  useAccountDetails,
  useCalcBondDetails,
} from "lib/legacy";

import Footer from "components/Footer/Footer";

import "./DashboardV2.css";

import AssetDropdown from "./AssetDropdown";
import SEO from "components/Common/SEO";
import { useLocalStorageSerializeKey } from "lib/localStorage";
import { useChainId } from "lib/chains";
import { trim } from "lib/trim";
import { prettifySeconds } from "lib/prettify-seconds";
import { secondsUntilBlock } from "lib/seconds-until-block";
import { getIcons } from "config/icons";
import bonds from "lib/bond";
import { testBonds } from "lib/bond";
import TokenImg from "img/smalltoken.png";
import SquaImg from "img/SQUA-small.png";
import HeadImg from "img/smallhead.png";
import SettingImg from "img/setting.png";
import StakingImg from "img/stakingicon.png";
import BankImg from "img/bank.png";
import chartLogo from "img/chart.png";
import { ARBITRUM } from "config/chains";
import StakeModal from "./components/StakeModal";
import UnStakeModal from "./components/UnStakeModal";
import MintModal from "./components/MintModal";
import RedeemModal from "./components/RedeemModal";
import ChartModal from "./components/ChartModal";
import { BondType } from "lib/bond/constants";
import { getAddress } from "ethers/lib/utils";
import { getContract } from "config/contracts";
import { TOKENS } from "config/tokens";

export default function DashboardV2({setPendingTxns, savedSlippageAmount, connectWallet}) {
  const { active, library, account } = useWeb3React();
  const { chainId } = useChainId();

  const currentIcons = getIcons(chainId);

  const appdetails = useAppDetails();

  const userdetails = useAccountDetails();

  const timeUntilRebase = prettifySeconds(secondsUntilBlock(appdetails[0]["currentBlockTime"], appdetails[0]["nextRebase"]));

  const allbonds = chainId == ARBITRUM? bonds : testBonds

  const bondadd = useCalcBondDetails(allbonds, null);
  let bonddetails = [];

  let i = 0;

  allbonds.forEach(bond => {
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

  const [isRedeemModalVisible, setIsRedeemModalVisible] = useState(false);
  const [isChartModalVisible, setIsChartModalVisible] = useState(false);

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

  const showRedeemModal = (bond1) => {
    setBond(bond1);
    setIsRedeemModalVisible(true);
  };

  const [showBanner, setShowBanner] = useLocalStorageSerializeKey("showBanner", true);

  const hideBanner = () => {
    setShowBanner(false);
  };

  return (
    <SEO title={getPageTitle("Capital")}>
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
        <RedeemModal
          isVisible={isRedeemModalVisible}
          setIsVisible={setIsRedeemModalVisible}
          chainId={chainId}
          address={account}
          bond={bond}
          currentBlockTime={appdetails[0]["currentBlockTime"]}
          library={library}
          setPendingTxns={setPendingTxns}
        />
        <ChartModal
          isVisible={isChartModalVisible}
          setIsVisible={setIsChartModalVisible}
        />
        <div className="DashboardV2-content">
          <div className="Tab-title-section">
            <div className="Page-title">
            <img src={HeadImg} width="37" height="37" alt="Quasar Icon" /><span>uasar Capital</span>
            </div>
            <div className="Page-description">
              <Trans>Quasar Capital is a decentralized reserve currency and hedge fund featuring a proprietary treasury-reverse protocol.</Trans>
            </div>
          </div>
          <ExchangeBanner hideBanner={hideBanner} page="capital" chainId={chainId} />
          <div className="DashboardV2-token-cards">
            <div className="stats-wrapper stats-wrapper--gmx">
              <div className="App-card">
                <div className="stats-block">
                  <div className="App-card-title">
                    <div className="App-card-title-mark">
                      <div className="App-card-title-mark-icon">
                        <img src={SettingImg} width="20px" alt="GMX Token Icon" />
                      </div>
                      <div className="App-card-title-mark-info">
                        <div className="App-card-title-mark-title-1">Dashboard</div>
                      </div>
                    </div>
                    <div className="App-card-title-mark-1">
                      <div className="App-card-title-mark-icon">
                        <img src={TokenImg} width="40" alt="GMX Token Icon" />
                      </div>
                      <div className="App-card-title-mark-info">
                        <div className="App-card-title-mark-title">QUA</div>
                        <div className="App-card-title-mark-subtitle">Native Token</div>
                      </div>
                      <div className="App-card-title-dropdown">
                        <AssetDropdown assetSymbol="QUA" setVisible={setIsChartModalVisible}/>
                      </div>
                    </div>
                  </div>
                  <div className="App-card-divider"></div>
                  <div className="App-card-content-wrapper">
                    <div className="App-card-content">
                      <div className="App-card-row">
                        <div className="label">
                          <Trans>QUA Price</Trans>
                        </div>
                        <div className="label-flex">
                          <div onClick={() => setIsChartModalVisible(true)} className="label-chart">
                            <img className="asset-item-icon" width="16px" src={chartLogo} alt="Chart" />
                          </div>
                          &nbsp;$ {!appdetails[0]["marketPrice"] && "..."}
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
                          {/* {appdetails[0]["marketPrice"] && (trim(appdetails[0]["rfv"], 2))} */}
                          {appdetails[0]["marketPrice"] && 1}
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
                        <img src={StakingImg} width="20px" alt="Staking Icon" />
                      </div>
                      <div className="App-card-title-mark-info">
                        <div className="App-card-title-mark-title-1">Stake/Unstake</div>
                      </div>
                    </div>
                    <div className="App-card-title-mark-1">
                      <div className="App-card-title-mark-icon">
                        <img src={SquaImg} width="40" alt="SQUA" />
                      </div>
                      <div className="App-card-title-mark-info">
                        <div className="App-card-title-mark-title">SQUA</div>
                        <div className="App-card-title-mark-subtitle">Staked QUA</div>
                      </div>
                      <div className="App-card-title-dropdown">
                        <AssetDropdown assetSymbol="SQUA" setVisible={setIsChartModalVisible} />
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
                          {userdetails[0]["balances"] && (trim(userdetails[0]["balances"]["time"] / 10 ** 9, 3))} QUA
                        </div>
                      </div>
                      <div className="App-card-row">
                        <div className="label">
                          <Trans>Your Staked Balance</Trans>
                        </div>
                        <div>
                          {!userdetails[0]["balances"] && "..."}
                          {userdetails[0]["balances"] && (trim(userdetails[0]["balances"]["memo"] / 10 ** 9, 3))} SQUA
                        </div>
                      </div>
                      <div className="App-card-row">
                        <div className="label">
                          <Trans>Next Reward Amount</Trans>
                        </div>
                        <div>
                          {!userdetails[0]["balances"] && "..."}
                          {userdetails[0]["balances"] && (trim(appdetails[0]["stakingRebase"] * userdetails[0]["balances"]["memo"] / 10 ** 9, 3))} SQUA
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
              <div className="stats-block">
                <div className="App-card-title">
                  <div className="App-card-title-mark">
                    <div className="App-card-title-mark-icon">
                      <img src={BankImg} width="20px" alt="GMX Token Icon" />
                    </div>
                    <div className="App-card-title-mark-info">
                      <div className="App-card-title-mark-title-1">Bond</div>
                    </div>
                  </div>
                </div>
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
                                <div className="App-card-info-subtitle">
                                </div>
                              </div>
                              <div>
                                <AssetDropdown assetSymbol={bond.displayName} setVisible={setIsChartModalVisible} />
                              </div>
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
                          {active && (
                            <>
                              <button className="App-button-option App-card-option" onClick={() => showMintModal(bond)}>
                                <Trans>Mint</Trans>
                              </button>
                              <button className="App-button-option App-card-option" onClick={() => showRedeemModal(bond)}>
                                <Trans>Redeem</Trans>
                              </button>
                            </>
                          )}
                          {!active && (
                            <button className="App-button-option App-card-option" onClick={() => connectWallet()}>
                              Connect Wallet
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              <div className="token-grid">
                {bonddetails.map((bond) => {
                  return (
                    <div className="App-card" key={bond.name}>
                      <div className="App-card-title">
                        <div className="mobile-token-card">
                          <img src={bond.bondIconSvg} alt={bond.displayName} width="40" />
                          <div className="token-symbol-text">{bond.displayName}</div>
                          <AssetDropdown assetSymbol={bond.displayName} setVisible={setIsChartModalVisible} />
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
                          {active && (
                            <>
                              <button className="App-button-option App-card-option" onClick={() => showMintModal(bond)}>
                                <Trans>Mint</Trans>
                              </button>
                              <button className="App-button-option App-card-option" onClick={() => showRedeemModal(bond)}>
                                <Trans>Redeem</Trans>
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
                  );
                })}
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </SEO>
  );
}
