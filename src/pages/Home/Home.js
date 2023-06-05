import React from "react";
import SEO from "components/Common/SEO";
import Footer from "components/Footer/Footer";
import "./Home.css";

import simpleSwapIcon from "img/ic_simpleswaps.svg";
import costIcon from "img/ic_cost.svg";
import liquidityIcon from "img/ic_liquidity.svg";
import totaluserIcon from "img/ic_totaluser.svg";

import StakingIcon from "img/staking.png";
import BondingIcon from "img/bonding.png";

import ExchangeIcon from "img/exchange.png";

import statsIcon from "img/ic_stats.svg";
import tradingIcon from "img/ic_trading.svg";
import QuaIcon from "img/dollar.png";
import LockIcon from "img/lock.png";
import BankIcon from "img/bank1.png";

import HeadImg from "img/smallhead.png";
import LadyImg from "img/lady.png";

import useSWR from "swr";

import { USD_DECIMALS, getTotalVolumeSum, getPageTitle } from "lib/legacy";

import { useUserStat } from "domain/legacy";

import arbitrumIcon from "img/ic_arbitrum_96.svg";
import avaxIcon from "img/ic_avalanche_96.svg";

import TokenCard from "components/TokenCard/TokenCard";
import { Trans } from "@lingui/macro";
import { HeaderLink } from "components/Header/HeaderLink";
import { ARBITRUM, AVALANCHE } from "config/chains";
import { getServerUrl } from "config/backend";
import { bigNumberify, formatAmount, numberWithCommas } from "lib/numbers";
import ExternalLink from "components/ExternalLink/ExternalLink";

export default function Home({ showRedirectModal, redirectPopupTimestamp }) {
  // const [openedFAQIndex, setOpenedFAQIndex] = useState(null)
  // const faqContent = [{
  //   id: 1,
  //   question: "What is GMX?",
  //   answer: "GMX is a decentralized spot and perpetual exchange that supports low swap fees and zero price impact trades.<br><br>Trading is supported by a unique multi-asset pool that earns liquidity providers fees from market making, swap fees, leverage trading (spreads, funding fees & liquidations), and asset rebalancing.<br><br>Dynamic pricing is supported by Chainlink Oracles along with TWAP pricing from leading volume DEXs."
  // }, {
  //   id: 2,
  //   question: "What is the GMX Governance Token? ",
  //   answer: "The GMX token is the governance token of the GMX ecosystem, it provides the token owner voting rights on the direction of the GMX platform.<br><br>Additionally, when GMX is staked you will earn 30% of the platform-generated fees, you will also earn Escrowed GMX tokens and Multiplier Points."
  // }, {
  //   id: 3,
  //   question: "What is the GLP Token? ",
  //   answer: "The GLP token represents the liquidity users provide to the GMX platform for Swaps and Margin Trading.<br><br>To provide liquidity to GLP you <a href='https://gmx.io/buy_glp' target='_blank'>trade</a> your crypto asset BTC, ETH, LINK, UNI, USDC, USDT, MIM, or FRAX to the liquidity pool, in exchange, you gain exposure to a diversified index of tokens while earning 50% of the platform trading fees and esGMX."
  // }, {
  //   id: 4,
  //   question: "What can I trade on GMX? ",
  //   answer: "On GMX you can swap or margin trade any of the following assets: ETH, BTC, LINK, UNI, USDC, USDT, MIM, FRAX, with others to be added. "
  // }]

  // const toggleFAQContent = function(index) {
  //   if (openedFAQIndex === index) {
  //     setOpenedFAQIndex(null)
  //   } else {
  //     setOpenedFAQIndex(index)
  //   }
  // }

  // ARBITRUM

  const arbitrumPositionStatsUrl = getServerUrl(ARBITRUM, "/position_stats");
  const { data: arbitrumPositionStats } = useSWR([arbitrumPositionStatsUrl], {
    fetcher: (...args) => fetch(...args).then((res) => res.json()),
  });

  const arbitrumTotalVolumeUrl = getServerUrl(ARBITRUM, "/total_volume");
  const { data: arbitrumTotalVolume } = useSWR([arbitrumTotalVolumeUrl], {
    fetcher: (...args) => fetch(...args).then((res) => res.json()),
  });

  // AVALANCHE

  const avalanchePositionStatsUrl = getServerUrl(AVALANCHE, "/position_stats");
  const { data: avalanchePositionStats } = useSWR([avalanchePositionStatsUrl], {
    fetcher: (...args) => fetch(...args).then((res) => res.json()),
  });

  const avalancheTotalVolumeUrl = getServerUrl(AVALANCHE, "/total_volume");
  const { data: avalancheTotalVolume } = useSWR([avalancheTotalVolumeUrl], {
    fetcher: (...args) => fetch(...args).then((res) => res.json()),
  });

  // Total Volume

  const arbitrumTotalVolumeSum = getTotalVolumeSum(arbitrumTotalVolume);
  const avalancheTotalVolumeSum = getTotalVolumeSum(avalancheTotalVolume);

  let totalVolumeSum = bigNumberify(0);
  if (arbitrumTotalVolumeSum && avalancheTotalVolumeSum) {
    totalVolumeSum = totalVolumeSum.add(arbitrumTotalVolumeSum);
    totalVolumeSum = totalVolumeSum.add(avalancheTotalVolumeSum);
  }

  // Open Interest

  let openInterest = bigNumberify(0);
  if (
    arbitrumPositionStats &&
    arbitrumPositionStats.totalLongPositionSizes &&
    arbitrumPositionStats.totalShortPositionSizes
  ) {
    openInterest = openInterest.add(arbitrumPositionStats.totalLongPositionSizes);
    openInterest = openInterest.add(arbitrumPositionStats.totalShortPositionSizes);
  }

  if (
    avalanchePositionStats &&
    avalanchePositionStats.totalLongPositionSizes &&
    avalanchePositionStats.totalShortPositionSizes
  ) {
    openInterest = openInterest.add(avalanchePositionStats.totalLongPositionSizes);
    openInterest = openInterest.add(avalanchePositionStats.totalShortPositionSizes);
  }

  // user stat
  const arbitrumUserStats = useUserStat(ARBITRUM);
  const avalancheUserStats = useUserStat(AVALANCHE);
  let totalUsers = 0;

  if (arbitrumUserStats && arbitrumUserStats.uniqueCount) {
    totalUsers += arbitrumUserStats.uniqueCount;
  }

  if (avalancheUserStats && avalancheUserStats.uniqueCount) {
    totalUsers += avalancheUserStats.uniqueCount;
  }

  const JoinCapitalButton = () => {
    return (
      <HeaderLink
        className="default-btn"
        to="/capital"
        redirectPopupTimestamp={redirectPopupTimestamp}
        showRedirectModal={showRedirectModal}
      >
        <Trans>Join Capital</Trans>
      </HeaderLink>
    );
  };

  const JoinExchangeButton = () => {
    return (
      <HeaderLink
        className="default-btn"
        to="/exchange"
        redirectPopupTimestamp={redirectPopupTimestamp}
        showRedirectModal={showRedirectModal}
      >
        <Trans>Join Exchange</Trans>
      </HeaderLink>
    );
  };

  const GoDocsButton = () => {
    return (
      <ExternalLink
        className="default-btn"
        href="https://docs.quasarcapital.io/"
        redirectPopupTimestamp={redirectPopupTimestamp}
        showRedirectModal={showRedirectModal}
      >
        <Trans>Docs</Trans>
      </ExternalLink>
    );
  };

  const ReadMoreButton = () => {
    return (
      <ExternalLink
        className="default-btn"
        href="https://docs.quasarcapital.io/"
        redirectPopupTimestamp={redirectPopupTimestamp}
        showRedirectModal={showRedirectModal}
      >
        <Trans>Read more</Trans>
      </ExternalLink>
    );
  };

  return (
    <SEO title={getPageTitle("Home")}>
    <div className="Home">
      <div className="Home-top">
        {/* <div className="Home-top-image"></div> */}
        <div className="Home-title-section-container default-container">
        <div id="banner_bg_effect" class="banner_effect"></div>
          <div className="Home-title-section">
            <div className="Home-title">
              <Trans>
              Welcome to 
              </Trans>
              <br/>
              <img src={HeadImg} alt="Quasar Icon" />
              <Trans>
              uasar Capital
              </Trans>
            </div>
            <div className="Home-description">
              <Trans>
              Quasar Capital is a community-driven decentralized autonomous organization that governs the Protocol Owned Liquidity and its native token QUA, providing a sustainable and stable DeFi ecosystem.
              </Trans>
            </div>
            <div className="Home-buttons">
              <JoinCapitalButton />
              &nbsp; &nbsp; 
              <GoDocsButton />
            </div>
          </div>
          <div className="Home-title-section">
            <div className="Home-title1">
              <img src={LadyImg} alt="Lady" className="lady-icon" />
            </div>
          </div>
        </div>
        <div className="Home-latest-info-container default-container">
          <div className="Home-latest-info-block">
            <img src={QuaIcon} alt="Total Trading Volume Icon" width="50px" className="Home-latest-info__icon" />
            <div className="Home-latest-info-content">
              <div className="Home-latest-info__title">
                <Trans>QUA Price</Trans>
              </div>
              {/* <div className="Home-latest-info__value">${formatAmount(totalVolumeSum, USD_DECIMALS, 0, true)}</div> */}
              <div className="Home-latest-info__value">$0</div>
            </div>
          </div>
          <div className="Home-latest-info-block">
            <img src={LockIcon} alt="Open Interest Icon" width="50px" className="Home-latest-info__icon" />
            <div className="Home-latest-info-content">
              <div className="Home-latest-info__title">
                <Trans>Total Value Staked</Trans>
              </div>
              {/* <div className="Home-latest-info__value">${formatAmount(openInterest, USD_DECIMALS, 0, true)}</div> */}
              <div className="Home-latest-info__value">$0</div>
            </div>
          </div>
          <div className="Home-latest-info-block">
            <img src={BankIcon} alt="Total Users Icon" width="50px" className="Home-latest-info__icon" />
            <div className="Home-latest-info-content">
              <div className="Home-latest-info__title">
                <Trans>Treasury Balance</Trans>
              </div>
              {/* <div className="Home-latest-info__value">{numberWithCommas(totalUsers.toFixed(0))}</div> */}
              <div className="Home-latest-info__value">${0}</div>
            </div>
          </div>
        </div>
      </div>
      <div className="Home-benefits-section">
        <div className="Home-benefits-title">
          <p className="Home-benefits-title-text">
            How to participate in Capital
          </p>
        </div>
        <div className="Home-benefits default-container">
          <div className="Home-benefit">
            <div className="Home-benefit-icon">
              <img src={StakingIcon} alt="Reduce Liquidation Risks Icon" width="40px" className="Home-benefit-icon-symbol" />
              <div className="Home-benefit-title">
                <Trans>Staking</Trans>
              </div>
            </div>
            <div className="Home-benefit-description">
              <Trans>
              Stakers play an important role in the Quasar Capital. Stakers deposit their QUA into the protocol, which contributes to QUA’s long-term price stability. In exchange, stakers receive their pro rata share of rebases and governance rights.
              </Trans>
            </div>
          </div>
          <div className="Home-benefit">
            <div className="Home-benefit-icon">
              <img src={BondingIcon} alt="Save on Costs Icon" width="40px" className="Home-benefit-icon-symbol" />
              <div className="Home-benefit-title">
                <Trans>Bonding</Trans>
              </div>
            </div>
            <div className="Home-benefit-description">
              <Trans>
              Bonding allows you to trade various tokens for QUA at a discounted price. In exchange, bond sales provide additional liquidity and reserve assets to the Quasar treasury, contributing to the stability of the protocol. As a result, 99% of all liquidity is owned by Quasar.
              </Trans>
            </div>
          </div>
          {/* <div className="Home-benefit">
            <div className="Home-benefit-icon">
              <img src={simpleSwapIcon} alt="Simple Swaps Icon" className="Home-benefit-icon-symbol" />
              <div className="Home-benefit-title">
                <Trans>Simple Swaps</Trans>
              </div>
            </div>
            <div className="Home-benefit-description">
              <Trans>
                Open positions through a simple swap interface. Conveniently swap from any supported asset into the
                position of your choice.
              </Trans>
            </div>
          </div> */}
        </div>
      </div>
      <div className="Home-cta-section">
        <div className="Home-cta-container default-container">
          <div className="Home-cta-info">
            <div className="Home-cta-info__title">
              <Trans>Quasar Exchange</Trans>
            </div>
            <div className="Home-cta-info__description">
              <Trans>Quasar Exchange is a decentralized spot and perpetual exchange that supports low swap fees and zero price impact trades.</Trans>
            </div>
            <JoinExchangeButton />
            &nbsp; &nbsp; 
            <ExternalLink href="https://docs.quasarcapital.io/" className="default-btn read-more">
              <Trans>Read more</Trans>
            </ExternalLink>
          </div>
          <div className="Home-cta-options">
          <img src={ExchangeIcon} alt="Reduce Liquidation Risks Icon" width="90%" className="Home-cta-options-img" />
            {/* <div className="Home-cta-option Home-cta-option-arbitrum">
              <div className="Home-cta-option-icon">
                <img src={arbitrumIcon} width="96" alt="Arbitrum Icon" />
              </div>
              <div className="Home-cta-option-info">
                <div className="Home-cta-option-title">Quasar Capital</div>
                <div className="Home-cta-option-action">
                  <JoinCapitalButton />
                </div>
              </div>
            </div>
            <div className="Home-cta-option Home-cta-option-ava">
              <div className="Home-cta-option-icon">
                <img src={avaxIcon} width="96" alt="Avalanche Icon" />
              </div>
              <div className="Home-cta-option-info">
                <div className="Home-cta-option-title">Quasar Exchange</div>
                <div className="Home-cta-option-action">
                  <JoinExchangeButton />
                </div>
              </div>
            </div> */}
          </div>
        </div>
      </div>
      <div className="Home-token-card-section">
        <div className="Home-token-card-container default-container">
          {/* <div className="Home-token-card-info">
            <div className="Home-token-card-info__title">
              <Trans>Governance & DAO</Trans>
            </div>
            <div className="Home-token-card-info__text">
            Quasar DAO is a network of dedicated community members who execute on decisions & protocol mechanisms voted on through community governance.
            </div>
            <ExternalLink href="https://snapshot.org/" className="default-btn read-more">
              <Trans>Join Governance</Trans>
            </ExternalLink>
          </div> */}
          <TokenCard showRedirectModal={showRedirectModal} redirectPopupTimestamp={redirectPopupTimestamp} />
        </div>
      </div>

      {/* <div className="Home-video-section">
        <div className="Home-video-container default-container">
          <div className="Home-video-block">
            <img src={gmxBigIcon} alt="gmxbig" />
          </div>
        </div>
      </div> */}
      {/* <div className="Home-faqs-section">
        <div className="Home-faqs-container default-container">
          <div className="Home-faqs-introduction">
            <div className="Home-faqs-introduction__title">FAQs</div>
            <div className="Home-faqs-introduction__description">Most asked questions. If you wish to learn more, please head to our Documentation page.</div>
            <a href="https://gmxio.gitbook.io/gmx/" className="default-btn Home-faqs-documentation">Documentation</a>
          </div>
          <div className="Home-faqs-content-block">
            {
              faqContent.map((content, index) => (
                <div className="Home-faqs-content" key={index} onClick={() => toggleFAQContent(index)}>
                  <div className="Home-faqs-content-header">
                    <div className="Home-faqs-content-header__icon">
                      {
                        openedFAQIndex === index ? <FiMinus className="opened" /> : <FiPlus className="closed" />
                      }
                    </div>
                    <div className="Home-faqs-content-header__text">
                      { content.question }
                    </div>
                  </div>
                  <div className={ openedFAQIndex === index ? "Home-faqs-content-main opened" : "Home-faqs-content-main" }>
                    <div className="Home-faqs-content-main__text">
                      <div dangerouslySetInnerHTML={{__html: content.answer}} >
                      </div>
                    </div>
                  </div>
                </div>
              ))
            }
          </div>
        </div>
      </div> */}
      <Footer showRedirectModal={showRedirectModal} redirectPopupTimestamp={redirectPopupTimestamp} />
    </div>
    </SEO>
  );
}
