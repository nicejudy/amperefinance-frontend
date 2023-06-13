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
    switchNetwork(GOERLI, active)
  );

  return (
    <>
      {page == "exchange" && <div className="ExchangeBanner">
        <p className="ExchangeBanner-text">
          <Trans>
            We haven't launched <span className="ExchangeBanner-price">Quasar Exchange</span> yet. This page is running on  
            <ExternalLink
              href="https://app.gmx.io/#/trade"
              className="ExchangeBanner-link"
            >
              the GMX protocol
            </ExternalLink>
            .
          </Trans>
        </p>
      </div>}
      {page == "capital" && chainId == ARBITRUM && <div className="ExchangeBanner-capital">
        <div className="ExchangeBanner-text">
          <div className="ExchangeBanner-flex">
            We haven't launched&nbsp;<span className="ExchangeBanner-price">Quasar Capital</span>&nbsp;on mainnet. Join&nbsp;<div className="ExchangeBanner-price-1" onClick={onNetworkSelect}>Beta version</div>&nbsp;on Goerli testnet.
          </div>
        </div>
      </div>}
      {page == "capital" && chainId == GOERLI && <div className="ExchangeBanner-capital">
        <p className="ExchangeBanner-text">
          <>
            Welcome to <span className="ExchangeBanner-price">Quasar Capital</span> Beta Version. Visit&nbsp;
            <ExternalLink
              href="https://testnetbridge.com"
              className="ExchangeBanner-link"
            >
              here
            </ExternalLink>
            &nbsp;to get GoerliETH.<br/>
          </>
        </p>
      </div>}
    </>
  );
}
