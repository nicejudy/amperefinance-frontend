import React from "react";
import { Trans } from "@lingui/macro";
import ExternalLink from "components/ExternalLink/ExternalLink";

import "./ExchangeBanner.css";

export default function ExchangeBanner(props) {
  const { hideBanner, page } = props;

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
            </ExternalLink>{" "}
            .
          </Trans>
        </p>
      </div>}
      {page == "capital" && <div className="ExchangeBanner-capital">
        <p className="ExchangeBanner-text">
          <Trans>
            We haven't launched <span className="ExchangeBanner-price">Quasar Capital</span> yet. Do nothing on this page.
          </Trans>
        </p>
      </div>}
    </>
  );
}
