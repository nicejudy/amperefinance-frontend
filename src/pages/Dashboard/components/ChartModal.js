import Modal from "components/Modal/Modal";
import { useChainId } from "lib/chains";
import { ICONLINKS } from "config/tokens";

function ChartModal(props) {
    const {
      isVisible,
      setIsVisible,
    } = props;

    const { chainId } = useChainId();

    const { charturl } = ICONLINKS[chainId]["QUA"];

    if ( !charturl ) {
        return <></>;
    }
  
    return (
      <div className="ChartModal">
        <Modal isVisible={isVisible} setIsVisible={setIsVisible} label="QUA Chart">
          <div id="dexscreener-embed">
            <iframe src={charturl}></iframe>
          </div>
        </Modal>
      </div>
    );
}

export default ChartModal;