import React, { useCallback } from "react";
import { Link } from "react-router-dom";
import { Trans } from "@lingui/macro";

import { isHomeSite } from "lib/legacy";

import { useWeb3React } from "@web3-react/core";

import APRLabel from "../APRLabel/APRLabel";
import { HeaderLink } from "../Header/HeaderLink";
import { ARBITRUM, AVALANCHE } from "config/chains";
import { switchNetwork } from "lib/wallets";
import { useChainId } from "lib/chains";
import ExternalLink from "components/ExternalLink/ExternalLink";
import { getIcon } from "config/icons";

import QuaIcon from "img/smalltoken.png";
import SQuaIcon from "img/SQUA-small.png";

const glpIcon = getIcon("common", "glp");
const gmxIcon = getIcon("common", "gmx");

export default function TokenCard({ showRedirectModal, redirectPopupTimestamp }) {
  const isHome = isHomeSite();
  const { chainId } = useChainId();
  const { active } = useWeb3React();

  const changeNetwork = useCallback(
    (network) => {
      if (network === chainId) {
        return;
      }
      if (!active) {
        setTimeout(() => {
          return switchNetwork(network, active);
        }, 500);
      } else {
        return switchNetwork(network, active);
      }
    },
    [chainId, active]
  );

  const BuyLink = ({ className, to, children, network }) => {
    if (isHome && showRedirectModal) {
      return (
        <HeaderLink
          to={to}
          className={className}
          redirectPopupTimestamp={redirectPopupTimestamp}
          showRedirectModal={showRedirectModal}
        >
          {children}
        </HeaderLink>
      );
    }

    return (
      <Link to={to} className={className} onClick={() => changeNetwork(network)}>
        {children}
      </Link>
    );
  };

  const JoinCapitalButton = () => {
    return (
      <HeaderLink
        className="default-btn"
        to="/capital"
        redirectPopupTimestamp={redirectPopupTimestamp}
        showRedirectModal={showRedirectModal}
      >
        <Trans>Go to Stake</Trans>
      </HeaderLink>
    );
  };

  return (
    <div className="Home-token-card-options">
      <div className="Home-token-card-option">
        <div className="Home-token-card-option-icon">
          <img src={QuaIcon} width="40" alt="GMX Icons" /> QUA
        </div>
        <div className="Home-token-card-option-info">
          <div className="Home-token-card-option-title">
            <Trans>QUA is not a stable coin. QUA is backed by $1 worth of assets in the treasury, not pegged to it. Because the treasury backs every QUA at least $1, the protocol would buy back and burn QUA when it trades below $1.</Trans>
          </div>
          {/* <div className="Home-token-card-option-apr">
            <Trans>Arbitrum APR:</Trans> <APRLabel chainId={ARBITRUM} label="gmxAprTotal" />,{" "}
            <Trans>Avalanche APR:</Trans> <APRLabel chainId={AVALANCHE} label="gmxAprTotal" key="AVALANCHE" />
          </div> */}
          <div className="Home-token-card-option-action">
            <div className="buy">
              <ExternalLink href="https://www.sushi.com/swap" className="default-btn read-more">
                <Trans>Buy on Sushi</Trans>
              </ExternalLink>
            </div>
            <ExternalLink href="https://docs.quasarcapital.io/" className="default-btn read-more">
              <Trans>Read more</Trans>
            </ExternalLink>
          </div>
        </div>
      </div>
      <div className="Home-token-card-option">
        <div className="Home-token-card-option-icon">
          <img src={SQuaIcon} width="40" alt="SQUA Icons" /> SQUA
        </div>
        <div className="Home-token-card-option-info">
          <div className="Home-token-card-option-title">
            <Trans>SQUA (Staked QUA) is a derivative token of QUA that is earned by staking QUA in the Quasar Capital. Staking QUA to earn SQUA, this essentially locks QUA up for a period of time making it non-sellable or transferable.</Trans>
          </div>
          {/* <div className="Home-token-card-option-apr">
            <Trans>Arbitrum APR:</Trans> <APRLabel chainId={ARBITRUM} label="gmxAprTotal" />,{" "}
            <Trans>Avalanche APR:</Trans> <APRLabel chainId={AVALANCHE} label="gmxAprTotal" key="AVALANCHE" />
          </div> */}
          <div className="Home-token-card-option-action">
            <div className="buy">
              <JoinCapitalButton />
            </div>
            <ExternalLink href="https://docs.quasarcapital.io/" className="default-btn read-more">
              <Trans>Read more</Trans>
            </ExternalLink>
          </div>
        </div>
      </div>
    </div>
  );
}
