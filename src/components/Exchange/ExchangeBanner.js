import React, { useCallback, useEffect } from "react";
import { useWeb3React } from "@web3-react/core";
import { Trans } from "@lingui/macro";
import ExternalLink from "components/ExternalLink/ExternalLink";

import { switchNetwork } from "lib/wallets";

import "./ExchangeBanner.css";
import { ARBITRUM, GOERLI } from "config/chains";

export default function ExchangeBanner(props) {
  const { hideBanner, page, chainId } = props;
  const { active, account} = useWeb3React();
  const onNetworkSelect = () => (
    switchNetwork(ARBITRUM, active)
  );

  return (
    <>
      {page == "exchange" && <div className="ExchangeBanner">
        <p className="ExchangeBanner-text">
          <Trans>
            We haven't launched <span className="ExchangeBanner-price">Quasar Exchange</span> yet. 
            {/* This page is running on  
            <ExternalLink
              href="https://app.gmx.io/#/trade"
              className="ExchangeBanner-link"
            >
              the GMX protocol
            </ExternalLink>
            . */}
          </Trans>
        </p>
      </div>}
      {page == "capital" && chainId == ARBITRUM && <div className="ExchangeBanner-capital">
        <p className="ExchangeBanner-text">
          
            {/* We haven't launched&nbsp;<span className="ExchangeBanner-price">Quasar Capital</span>&nbsp;on mainnet. Join&nbsp;<div className="ExchangeBanner-price-1" onClick={onNetworkSelect}>Beta version</div>&nbsp;on Goerli testnet. */}
            The launch of&nbsp;<span className="ExchangeBanner-price">Quasar Capital</span>&nbsp;on Arbitrum will take place on 15:00, June 29th UTC.
          
        </p>
      </div>}
      {page == "capital" && chainId == GOERLI && <div className="ExchangeBanner-capital">
        <p className="ExchangeBanner-text">
          
            We've closed Beta Version. Stay tuned for further announcements as we prepare for&nbsp;<span className="ExchangeBanner-price-1" onClick={onNetworkSelect}>the mainnet launch</span>&nbsp;
            {/* <ExternalLink
              href="https://docs.quasarcapital.io/quasar-capital/capital-beta-version"
              className="ExchangeBanner-link"
            >
              here
            </ExternalLink>
            &nbsp;for more details.<br/> */}
          
        </p>
      </div>}
    </>
  );
}
