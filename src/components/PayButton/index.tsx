import { useSignTypedData, useVerifyTypedData, useAccount } from "wagmi";
import { useState } from "react";
import controllers from "../../controllers";
import config from "../../utils/wagmiconfig";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { signTypedData } from "@wagmi/core";
import { ethers } from "ethers";
export default function PayButton({
  handlePage,
}: {
  handlePage: (val: string) => void;
}) {
  const init = useMutation({
    mutationKey: ["init"],
    mutationFn: async (data: {
      chainId: string;
      assetAddress: string;
      amount: string;
      receiverAddress: string;
      walletAddresses: {};
      integrator: string;
    }) => {
      let req = await controllers.init(data);
      let res = await req.json();
      return res;
    },
    onError: (err) => {
      console.log(err, "mutation err");
    },
  });
  const { address, connector } = useAccount();
  const { data, error, signTypedDataAsync } = useSignTypedData({
    config,
  });
  console.log(data, init, "sign123");
  // @ts-ignore
  const result = useVerifyTypedData({
    domain: init.data?.data?.txnEvm?.domain,
    types: init.data?.data?.txnEvm?.types,
    message: {
      ...init?.data?.data?.txnEvm?.values,
    },
    primaryType: "Permit",
    address,
    signature: data,
  });
  console.log(result.data, result.error, "verify");

  const { primaryWallet } = useDynamicContext();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const submit = useMutation({
    mutationKey: ["submit"],
    mutationFn: async (data: { checkoutId: string; signedTxn: string }) => {
      let req = await controllers.submit(data);
      let res = await req.json();
      return res.data;
    },
  });
  // const status = useQuery({
  //   queryKey: ["init"],
  //   queryFn: async () => {
  //     let req = await controllers.getStatus();
  //     let res = await req.json();
  //     return res.data;
  //   },
  //   enabled: submit.isSuccess,
  //   refetchInterval: 5000,
  // });
  async function startTransaction() {
    let initPaylaod = {
      chainId: "sol",

      assetAddress: "So11111111111111111111111111111111111111112",
      amount: "7000000",
      receiverAddress: primaryWallet?.address || "",
      walletAddresses: {
        evm: [address],
      },
      integrator: "demo-integrator",
    };
    try {
      setIsSubmitting(true);
      let mutateInit = await init.mutateAsync(initPaylaod);
      if (mutateInit.status !== "error") {
        let payload = {
          account: address,
          connector,
          domain: mutateInit.data.txnEvm.domain,
          types: mutateInit.data.txnEvm.types,
          message: {
            ...mutateInit.data.txnEvm.values,
          },
          primaryType: "Permit",
        };
        console.log(payload, "signing payload");
        //@ts-ignore
        // let signData = await signTypedData(config, payload);
        // console.log(signData, "signdata");
        const wagmiProvider = await connector.getProvider();
        //@ts-ignore
        const provider = new ethers.providers.Web3Provider(wagmiProvider);
        await provider.send("eth_requestAccounts", []);
        const signer = provider.getSigner();
        const signature = await signer._signTypedData(
          mutateInit.data.txnEvm.domain,
          mutateInit.data.txnEvm.types,
          mutateInit.data.txnEvm.values
        );
        if (signature) {
          let submitPayload = {
            checkoutId: mutateInit.data.checkoutId,
            signedTxn: signature,
          };

          let mutateSubmit = await submit.mutateAsync(submitPayload);
          if (mutateSubmit.status !== "error") {
          } else {
            setErrorMessage(mutateSubmit?.error || "");
            setIsSubmitting(false);
          }
        }
        setIsSubmitting(false);
      } else {
        setErrorMessage(mutateInit?.error || "");
        setIsSubmitting(false);
      }
    } catch (err: any) {
      console.log(err);
      setErrorMessage(err.details || err.message);
      setIsSubmitting(false);
    }
  }
  function getButtonText() {
    return !address
      ? "Connect EVM Wallet"
      : !primaryWallet
      ? "Connect Solana Wallet"
      : "Pay";
  }
  return (
    <>
      <p>{errorMessage || error?.message}</p>
      <button
        disabled={isSubmitting}
        onClick={() => {
          if (!address || !primaryWallet) {
            handlePage("");
          } else {
            startTransaction();
          }
        }}
        className="border  px-2 py-2 rounded-md shadow-md"
      >
        {getButtonText()}
      </button>
    </>
  );
}
