import { useState } from "react";
import { Trans, t } from "@lingui/macro";
import { Contract } from "ethers";
import Modal from "components/Modal/Modal";
import { trim } from "lib/trim";
import { helperToast } from "lib/helperToast";
import { useCalculateUserBondDetails } from "lib/legacy"
import { prettifySeconds } from "lib/prettify-seconds";
import { prettyVestingPeriod } from "lib/pretty-vesting-period";
import { callContract } from "lib/contracts";

function RedeemModal(props) {
    const {
      isVisible,
      setIsVisible,
      chainId,
      address,
      bond,
      currentBlockTime,
      library,
      setPendingTxns,
    } = props;
    const [isClaiming, setIsClaiming] = useState(false);
  
    const userdetails = useCalculateUserBondDetails(bond);
    const userbond = userdetails[0];
  
    const onClickPrimary = () => {
      if (userbond.interestDue === 0 || userbond.pendingPayout === 0) {
        const failMsg = (
          <div>
            <Trans>
              You have nothing to claim.
            </Trans>
          </div>
        );
        helperToast.error(failMsg, { autoClose: false });
        return;
      }
      setIsClaiming(true);
      const bondContract = new Contract(bond.networkAddrs.bondAddress, bond.bondContractABI, library.getSigner());
  
      callContract(chainId, bondContract, "redeem", [address, false], {
        sentMsg: t`Redeem submitted!`,
        failMsg: t`Redeem failed.`,
        setPendingTxns,
      })
        .then(async (res) => {
          setIsVisible(false);
        })
        .finally(() => {
          setIsClaiming(false);
        });
    };
  
    const onClickSecondary = () => {
      if (userbond.interestDue === 0 || userbond.pendingPayout === 0) {
        const failMsg = (
          <div>
            <Trans>
              You have nothing to claim.
            </Trans>
          </div>
        );
        helperToast.error(failMsg, { autoClose: false });
        return;
      }
      setIsClaiming(true);
      const bondContract = new Contract(bond.networkAddrs.bondAddress, bond.bondContractABI, library.getSigner());
  
      callContract(chainId, bondContract, "redeem", [address, true], {
        sentMsg: t`Redeem submitted!`,
        failMsg: t`Redeem failed.`,
        setPendingTxns,
      })
        .then(async (res) => {
          setIsVisible(false);
        })
        .finally(() => {
          setIsClaiming(false);
        });
    };
  
    const isPrimaryEnabled = () => {
      if (isClaiming) {
        return false;
      }
      return true;
    };
  
    const getPrimaryText = () => {
      if (isClaiming) {
        return t`Claiming...`;
      }
      return t`Claim`;
    };
  
    const getSecondaryText = () => {
      if (isClaiming) {
        return t`Claiming...`;
      }
      return t`Claim and Stake`;
    };
  
    return (
      <div className="StakeModal">
        <Modal isVisible={isVisible} setIsVisible={setIsVisible} label={bond.displayName}>
          <div className="Exchange-swap-button-container">
            <button className="App-cta Exchange-swap-button" onClick={onClickPrimary} disabled={!isPrimaryEnabled()}>
              {getPrimaryText()}
            </button>
          </div>
          <div className="Exchange-swap-button-container">
            <button className="App-cta Exchange-swap-button" onClick={onClickSecondary} disabled={!isPrimaryEnabled()}>
              {getSecondaryText()}
            </button>
          </div>
          <div className="App-card-row">
            <div className="label">
              <Trans>Pending Rewards</Trans>
            </div>
            <div>
              {userbond.balance == undefined && "..."}
              {userbond.balance != undefined && (trim(userbond.interestDue, 4))} QUA
            </div>
          </div>
          <div className="App-card-row">
            <div className="label">
              <Trans>Claimable Rewards</Trans>
            </div>
            <div>
              {userbond.balance == undefined && "..."}
              {userbond.balance != undefined && (trim(userbond.pendingPayout, 4))} QUA
            </div>
          </div>
          <div className="App-card-row">
            <div className="label">
              <Trans>Time until fully vested</Trans>
            </div>
            <div>
              {userbond.balance == undefined && "..."}
              {userbond.balance != undefined && prettyVestingPeriod(currentBlockTime, userbond.bondMaturationBlock)}
            </div>
          </div>
          <div className="App-card-row">
            <div className="label">
              <Trans>ROI</Trans>
            </div>
            <div>
              {userbond.balance == undefined && "..."}
              {userbond.balance != undefined && (trim(bond.bondDiscount * 100, 4))} %
            </div>
          </div>
          <div className="App-card-row">
            <div className="label">
              <Trans>Vesting Term</Trans>
            </div>
            <div>
              {userbond.balance == undefined && "..."}
              {userbond.balance != undefined && prettifySeconds(bond.vestingTerm, "day")}
            </div>
          </div>
        </Modal>
      </div>
    );
}

export default RedeemModal;