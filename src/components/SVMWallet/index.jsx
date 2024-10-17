import React, { useMemo } from "react";
import {
  useWalletOptions,
  useWalletItemActions,
  useUserWallets,
  useDynamicContext,
  useSwitchWallet,
} from "@dynamic-labs/sdk-react-core";
import { keyBy } from "lodash";
function SVMWallet() {
  const { walletOptions, selectWalletOption } = useWalletOptions();
  const wallets = useUserWallets();
  const { openWallet } = useWalletItemActions();
  const { handleLogOut, handleUnlinkWallet, primaryWallet } =
    useDynamicContext();
  const switchWallet = useSwitchWallet();
  //   const wallets = useUserWallets();
  const walletsobj = useMemo(() => {
    return keyBy(wallets, (item) => item.key);
  }, [wallets]);
  return (
    <div>
      {walletOptions
        ?.filter(
          (item) =>
            item.name == "Solflare" ||
            item.name == "Slope" ||
            item.name == "Phantom" ||
            item.name == "Backpack" ||
            item.name == "Magic Eden (Solana)"
        )
        ?.map((item, i) => (
          <div key={i} className="flex mb-2 items-center gap-x-2">
            <p
              className="cursor-pointer"
              onClick={() => {
                if (walletsobj[item.key]) {
                  switchWallet(walletsobj[item.key]?.id);
                } else {
                  openWallet(item.key);
                }
              }}
            >
              {item.name}
            </p>
            {walletsobj[item.key] && (
              <>
                <p className="text-green-700 text-xs">Connected</p>
                <p
                  onClick={() => {
                    wallets.length == 1
                      ? handleLogOut()
                      : handleUnlinkWallet(walletsobj[item.key]?.id);
                  }}
                  className="text-red-700 cursor-pointer text-xs"
                >
                  Disconnect
                </p>
              </>
            )}
          </div>
        ))}
    </div>
  );
}

export default SVMWallet;
