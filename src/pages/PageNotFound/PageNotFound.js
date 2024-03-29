import SEO from "components/Common/SEO";
import Footer from "components/Footer/Footer";
import { NavLink } from "react-router-dom";
import { getPageTitle } from "lib/legacy";
import "./PageNotFound.css";
import { Trans } from "@lingui/macro";
import { getHomeUrl, getTradePageUrl } from "lib/legacy";

function PageNotFound() {
  const homeUrl = getHomeUrl();
  const tradePageUrl = getTradePageUrl();

  return (
    <SEO title={getPageTitle("Page not found")}>
      <div className="page-layout">
        <div className="page-not-found-container">
          <div className="page-not-found">
            <h2>
              <Trans>Page not found</Trans>
            </h2>
            <p className="go-back">
              <Trans>
                <span>Return to </span>
                <NavLink to={"/capital"}>Capital</NavLink> <span>or </span> <NavLink to={"/exchange"}>Exchange</NavLink>
              </Trans>
            </p>
          </div>
        </div>
        <Footer />
      </div>
    </SEO>
  );
}

export default PageNotFound;
