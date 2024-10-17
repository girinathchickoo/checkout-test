import React from "react";
import { useAccount, useChainId } from "wagmi";
import config from "../../utils/wagmiconfig";
import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
interface MyComponentProps {
  handlePage: (item: string) => void;
}
const AccountDetails: React.FC<MyComponentProps> = ({ handlePage }) => {
  const { address, isConnected } = useAccount({ config });
  const { primaryWallet } = useDynamicContext();
  const chain = useChainId({ config });
  return (
    <div className="w-full font-bold underline">
      <p>EVM</p>
      <p>
        Address:...{address?.substring(address.length - 5, address.length)}
      </p>{" "}
      <p>ChainId:{chain}</p>
      <p className="mt-3">SVM</p>
      <p>
        Address:...
        {primaryWallet?.address?.substring(
          primaryWallet?.address?.length - 5,
          primaryWallet?.address?.length
        )}
      </p>{" "}
      <button className="mt-2" onClick={() => handlePage("")}>
        Go to wallet list
      </button>
    </div>
  );
};

export default AccountDetails;
