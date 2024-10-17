import React, { useMemo } from "react";
import {
  useConnectors,
  useConnect,
  useConnections,
  useDisconnect,
} from "wagmi";
import config from "../../utils/wagmiconfig";
import { keyBy } from "lodash";
function EVMWallet({ handlePage }: any) {
  const connectors = useConnectors({ config });
  const { disconnectAsync } = useDisconnect({ config });
  const { connectAsync, data, isSuccess } = useConnect({ config });
  const connections = useConnections({ config });
  const connectObj = useMemo(() => {
    return keyBy(
      connections,
      (item: { connector: { uid: string } }) => item.connector.uid
    );
  }, [connections]);
  async function handleDisconnect(connectors: any) {
    try {
      await disconnectAsync({ connector: connectors });
    } catch (er) {
      console.log(er);
    }
  }
  async function handleConnect(connectors: any) {
    try {
      await connectAsync({ connector: connectors });
      handlePage("main");
    } catch (er) {
      console.log(er);
    }
  }
  return (
    <div>
      <div>
        {connectors.map((connector) => (
          <div key={connector.id} className="flex mb-2 items-center gap-x-2">
            <button
              onClick={() => {
                handleConnect(connector);
              }}
            >
              {connector.name}
            </button>
            <p className="text-xs text-green-600 ">
              {!connectObj[connector.uid] ? "connect" : ""}
            </p>
            {connectObj[connector.uid] ? (
              <p
                onClick={() => handleDisconnect(connector)}
                className="text-xs cursor-pointer text-red-600 "
              >
                Disconnect
              </p>
            ) : (
              <></>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default EVMWallet;
