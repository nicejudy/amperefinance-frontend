import { useState } from "react";
import { ethers } from "ethers";
import { Trans, t } from "@lingui/macro";
import Modal from "components/Modal/Modal";
import { getContract } from "config/contracts";
import { approveTokens } from "domain/tokens";
import { callContract } from "lib/contracts";
import StakingHelperContract from "abis/StakingHelperContract.json";
import { formatAmount, formatAmountFree, parseValue } from "lib/numbers";
import { allowedNodeEnvironmentFlags } from "process";


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

    const needApproval = value * 10**9 >= allowance;
  
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
        // gasP: 150000,
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
              <div className="muted align-right clickable" onClick={() => setValue(formatAmountFree(maxAmount, 9, 8))}>
                <Trans>Max: {formatAmount(maxAmount, 9, 8, true)}</Trans>
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

export default StakeModal;