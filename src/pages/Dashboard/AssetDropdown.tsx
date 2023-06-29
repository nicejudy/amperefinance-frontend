import { Menu } from "@headlessui/react";
import { FiChevronDown } from "react-icons/fi";
import "./AssetDropdown.css";
import coingeckoIcon from "img/ic_coingecko_16.svg";
import metamaskIcon from "img/ic_metamask_16.svg";
import nansenPortfolioIcon from "img/nansen_portfolio.svg";
import { useWeb3React } from "@web3-react/core";

import { t, Trans } from "@lingui/macro";
import ExternalLink from "components/ExternalLink/ExternalLink";
import { ICONLINKS, PLATFORM_TOKENS } from "config/tokens";
import { addTokenToMetamask } from "lib/wallets";
import { useChainId } from "lib/chains";
import { Token } from "domain/tokens";
import { ARBITRUM, AVALANCHE, GOERLI } from "config/chains";
import { getIcon } from "config/icons";
import sushiswapLogo from "img/sushiswap-logo.png";
import uniswapLogo from "img/Uniswap-Logo.png"
import chartLogo from "img/chart.png";

const avalancheIcon = getIcon(AVALANCHE, "network");
const arbitrumIcon = getIcon(ARBITRUM, "network");
const goerliIcon = getIcon(GOERLI, "network");

type Props = {
  assetSymbol: string;
  assetInfo?: Token;
  setVisible: (any) => any;
};

function AssetDropdown({ assetSymbol, assetInfo, setVisible }: Props) {
  const { active } = useWeb3React();
  const { chainId } = useChainId();
  let { coingecko, arbitrum, avalanche, goerli, reserves, buyurl, addurl, charturl, uniswap } = ICONLINKS[chainId][assetSymbol == "USDC.e"? "USDC" : assetSymbol] || {};
  const unavailableTokenSymbols =
    {
      42161: ["ETH"],
      43114: ["AVAX"],
    }[chainId] || [];

  return (
    <Menu>
      <Menu.Button as="div" className="dropdown-arrow center-both">
        <FiChevronDown size={20} />
      </Menu.Button>
      <Menu.Items as="div" className="asset-menu-items">
        <Menu.Item>
          <>
            {reserves && assetSymbol === "GLP" && (
              <ExternalLink href={reserves} className="asset-item">
                <img className="asset-item-icon" src={nansenPortfolioIcon} alt="Proof of Reserves" />
                <p>
                  <Trans>Proof of Reserves</Trans>
                </p>
              </ExternalLink>
            )}
          </>
        </Menu.Item>
        {/* <Menu.Item>
          <>
            {coingecko && (
              <ExternalLink href={coingecko} className="asset-item">
                <img className="asset-item-icon" src={coingeckoIcon} alt="Open in Coingecko" />
                <p>
                  <Trans>Open in Coingecko</Trans>
                </p>
              </ExternalLink>
            )}
          </>
        </Menu.Item> */}
        <Menu.Item>
          <>
            {arbitrum && (
              <ExternalLink href={arbitrum} className="asset-item">
                <img className="asset-item-icon" src={arbitrumIcon} alt="Open in explorer" />
                <p>
                  <Trans>Open in Explorer</Trans>
                </p>
              </ExternalLink>
            )}
            {avalanche && (
              <ExternalLink href={avalanche} className="asset-item">
                <img className="asset-item-icon" src={avalancheIcon} alt="Open in explorer" />
                <p>
                  <Trans>Open in Explorer</Trans>
                </p>
              </ExternalLink>
            )}
            {goerli && (
              <ExternalLink href={goerli} className="asset-item">
                <img className="asset-item-icon" src={goerliIcon} alt="Open in explorer" />
                <p>
                  <Trans>Open in Explorer</Trans>
                </p>
              </ExternalLink>
            )}
          </>
        </Menu.Item>
        <Menu.Item>
          <>
            {active && unavailableTokenSymbols.indexOf(assetSymbol) < 0 && (
              <div
                onClick={() => {
                  let token = assetInfo
                    ? { ...assetInfo, image: assetInfo.imageUrl }
                    : PLATFORM_TOKENS[chainId][assetSymbol == "USDC.e"? "USDC" : assetSymbol];
                  addTokenToMetamask(token);
                }}
                className="asset-item"
              >
                <img className="asset-item-icon" src={metamaskIcon} alt={t`Add to Metamask`} />
                <p>
                  <Trans>Add to Metamask</Trans>
                </p>
              </div>
            )}
          </>
        </Menu.Item>
        <Menu.Item>
          <>
            {uniswap && (
              <ExternalLink href={uniswap} className="asset-item">
                <img className="asset-item-icon" src={uniswapLogo} alt="Open in explorer" />
                <p>
                  <Trans>Buy on Uniswap</Trans>
                </p>
              </ExternalLink>
            )}
          </>
        </Menu.Item>
        <Menu.Item>
          <>
            {buyurl && (
              <ExternalLink href={buyurl} className="asset-item">
                <img className="asset-item-icon" src={sushiswapLogo} alt="Open in explorer" />
                <p>
                  <Trans>Buy on Sushi</Trans>
                </p>
              </ExternalLink>
            )}
          </>
        </Menu.Item>
        <Menu.Item>
          <>
            {addurl && (
              <ExternalLink href={addurl} className="asset-item">
                <img className="asset-item-icon" src={sushiswapLogo} alt="Open in explorer" />
                <p>
                  <Trans>Add on Sushi</Trans>
                </p>
              </ExternalLink>
            )}
          </>
        </Menu.Item>
        <Menu.Item>
          <>
            {charturl && (
              <div onClick={() => setVisible(true)} className="asset-item">
                <img className="asset-item-icon" src={chartLogo} alt="Open in explorer" />
                <p>
                  <Trans>View Chart</Trans>
                </p>
              </div>
            )}
          </>
        </Menu.Item>
      </Menu.Items>
    </Menu>
  );
}

export default AssetDropdown;
