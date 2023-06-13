import { useState } from "react";
import { Trans, t } from "@lingui/macro";
import { Contract } from "ethers";
import Modal from "components/Modal/Modal";
import { approveTokens } from "domain/tokens";
import { useCalculateUserBondDetails, useCalcBondDetails } from "lib/legacy"
import { trim } from "lib/trim";
import { prettifySeconds } from "lib/prettify-seconds";
import { callContract } from "lib/contracts";
import { formatAmountFree, parseValue } from "lib/numbers";

function MintModal(props) {
    const {
      isVisible,
      setIsVisible,
      chainId,
      maxAmount,
      value,
      setValue,
      address,
      bond,
      slippage,
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
  
    // const bond1 = useCalcBondDetails([bond], value);
    const bond1 = bond;
    const userdetails = useCalculateUserBondDetails(bond1);
    const userbond = userdetails[0];
  
    let amount = parseValue(value, bond1.lpDecimals);
  
    const needApproval = amount > userbond?.allowance * 1;
  
    const onClickPrimary = () => {
      if (needApproval) {
        approveTokens({
          setIsApproving,
          library,
          tokenAddress: bond.networkAddrs.reserveAddress,
          spender: bond.networkAddrs.bondAddress,
          chainId,
        });
        return;
      }
  
      setIsStaking(true);
      // const bondContract = bond.getContractForBond(chainId, library.getSigner());
      const bondContract = new Contract(bond.networkAddrs.bondAddress, bond.bondContractABI, library.getSigner());
      // const contract = new ethers.Contract(getContract(chainId, "STAKING_HELPER_ADDRESS"), StakingHelperContract.abi, library.getSigner());
  
      const acceptedSlippage = slippage / 100 || 0.005;
      const calculatePremium = bond.bondPrice;
      const maxPremium = Math.round(calculatePremium * (1 + acceptedSlippage));
  
      console.log(amount*1)
  
      callContract(chainId, bondContract, "deposit", [amount, maxPremium, address], {
        sentMsg: t`Mint submitted!`,
        failMsg: t`Mint failed.`,
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
        return t`Approving...`;
      }
      if (needApproval) {
        return t`Approve`;
      }
      if (isStaking) {
        return t`Minting...`;
      }
      return t`Mint`;
    };

    const onInputChange = (value) => {

    };
  
    return (
      <div className="StakeModal">
        <Modal isVisible={isVisible} setIsVisible={setIsVisible} label={bond1.displayName}>
          <div className="Exchange-swap-section">
            <div className="Exchange-swap-section-top">
              <div className="muted">
                <div className="Exchange-swap-usd">
                  <Trans>Mint</Trans>
                </div>
              </div>
              <div className="muted align-right clickable" onClick={() => setValue(formatAmountFree(userbond.balance, bond1.lpDecimals, 8))}>
                <Trans>Max: {formatAmountFree(userbond.balance, bond1.lpDecimals, 8)}</Trans>
              </div>
            </div>
            {/* <div className="Exchange-swap-section-bottom"> */}
            <div>
              <div className="Modal-token-input">
                <input
                  type="number"
                  placeholder="0.0"
                  className="Exchange-swap-input"
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                />
              </div>
              <div className="Modal-token-symbol">{bond1.displayName}</div>
            </div>
          </div>
          <div className="Exchange-swap-button-container">
            <button className="App-cta Exchange-swap-button" onClick={onClickPrimary} disabled={!isPrimaryEnabled()}>
              {getPrimaryText()}
            </button>
          </div>
          <div className="App-card-row">
            <div className="label">
              <Trans>Balance</Trans>
            </div>
            <div>
              {userbond.balance == undefined && "..."}
              {userbond.balance != undefined && (trim(userbond.balance / 10**bond1.lpDecimals, 8))} {userbond.displayName}
            </div>
          </div>
          {/* <div className="App-card-row">
            <div className="label">
              <Trans>You will get</Trans>
            </div>
            <div>
              {userbond.balance == undefined && "..."}
              {userbond.balance != undefined && (trim(bond1.bondQuote, 3))} QUA
            </div>
          </div> */}
          <div className="App-card-row">
            <div className="label">
              <Trans>Max You Can Buy</Trans>
            </div>
            <div>
              {userbond.balance == undefined && "..."}
              {userbond.balance != undefined && (trim(bond1.maxBondPrice, 3))} QUA
            </div>
          </div>
          <div className="App-card-row">
            <div className="label">
              <Trans>ROI</Trans>
            </div>
            <div>
              {userbond.balance == undefined && "..."}
              {userbond.balance != undefined && (trim(bond1.bondDiscount * 100, 2))}
            </div>
          </div>
          <div className="App-card-row">
            <div className="label">
              <Trans>Vesting Term</Trans>
            </div>
            <div>
              {userbond.balance == undefined && "..."}
              {userbond.balance != undefined && prettifySeconds(bond1.vestingTerm, "day")}
            </div>
          </div>
          <div className="App-card-row">
            <div className="label">
              <Trans>Minimum purchase</Trans>
            </div>
            <div>
              0.01 QUA
            </div>
          </div>
        </Modal>
      </div>
    );
}

export default MintModal;