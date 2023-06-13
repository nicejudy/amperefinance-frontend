import { useState } from "react";
import { ethers } from "ethers";
import { Trans, t } from "@lingui/macro";
import Modal from "components/Modal/Modal";
import { getContract } from "config/contracts";
import { approveTokens } from "domain/tokens";
import { callContract } from "lib/contracts";
import StakingContract from "abis/StakingContract.json";
import { formatAmount, formatAmountFree, parseValue } from "lib/numbers";


function UnStakeModal(props) {
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
  const needApproval = amount?.gt(allowance);

  const onClickPrimary = () => {
    if (needApproval) {
      approveTokens({
        setIsApproving,
        library,
        tokenAddress: getContract(chainId, "MEMO_ADDRESS"),
        spender: getContract(chainId, "STAKING_ADDRESS"),
        chainId,
      });
      return;
    }

    setIsStaking(true);
    const contract = new ethers.Contract(getContract(chainId, "STAKING_ADDRESS"), StakingContract.abi, library.getSigner());

    callContract(chainId, contract, "unstake", [amount, true], {
      sentMsg: t`Unstake submitted!`,
      failMsg: t`Unstake failed.`,
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
      return t`Approving SQUA...`;
    }
    if (needApproval) {
      return t`Approve SQUA`;
    }
    if (isStaking) {
      return t`Unstaking...`;
    }
    return t`Unstake`;
  };

  return (
    <div className="StakeModal">
      <Modal isVisible={isVisible} setIsVisible={setIsVisible} label="Unstake SQUA">
        <div className="Exchange-swap-section">
          <div className="Exchange-swap-section-top">
            <div className="muted">
              <div className="Exchange-swap-usd">
                <Trans>Unstake</Trans>
              </div>
            </div>
            <div className="muted align-right clickable" onClick={() => setValue(formatAmountFree(maxAmount, 9, 4))}>
              <Trans>Max: {formatAmount(maxAmount, 9, 4, true)}</Trans>
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
            <div className="PositionEditor-token-symbol">SQUA</div>
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

export default UnStakeModal;