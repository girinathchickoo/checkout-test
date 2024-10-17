import React, { useState } from "react";
import EVMWallet from "../EVMWallet";
import { useAccount } from "wagmi";
import config from "../../utils/wagmiconfig.js";
import AccountDetails from "../AccountsDetails";
import SVMWallet from "../SVMWallet";
import PayButton from "../PayButton";
function WidgetContainer() {
  const { address, isConnected } = useAccount({ config });
  const [page, setPage] = useState("");
  function handlePage(val: string) {
    setPage(val);
  }
  return (
    <div className="w-full h-screen flex items-center justify-center">
      <div className="border shadow-lg w-[400px] h-[400px] overflow-y-auto px-4 py-2 rounded-md">
        {page === "main" ? (
          <>
            <AccountDetails handlePage={handlePage} />
            <PayButton handlePage={handlePage} />
          </>
        ) : (
          <div>
            <button onClick={() => setPage("main")}>{`< Back`}</button>
            <p className="mb-2 mt-2">EVM</p>
            <EVMWallet handlePage={handlePage} />
            <p className="mb-2">SVM</p>
            <SVMWallet />
          </div>
        )}
      </div>
    </div>
  );
}

export default WidgetContainer;
