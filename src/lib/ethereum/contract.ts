import { RenNetworkDetails } from "@renproject/contracts";
import Web3 from "web3";

import { DarknodePayment } from "./contracts/bindings/DarknodePayment";
import { DarknodeRegistryLogicV1 } from "./contracts/bindings/DarknodeRegistryLogic";

export const getDarknodeRegistry = (
  web3: Web3,
  renNetwork: RenNetworkDetails
): DarknodeRegistryLogicV1 =>
  new web3.eth.Contract(
    renNetwork.addresses.ren.DarknodeRegistry.abi,
    renNetwork.addresses.ren.DarknodeRegistry.address
  );

export const getDarknodePayment = (
  web3: Web3,
  renNetwork: RenNetworkDetails
): DarknodePayment =>
  new web3.eth.Contract(
    renNetwork.addresses.ren.DarknodePayment.abi,
    renNetwork.addresses.ren.DarknodePayment.address
  );

export const getRenToken = (web3: Web3, renNetwork: RenNetworkDetails) =>
  new web3.eth.Contract(
    renNetwork.addresses.erc.ERC20.abi,
    renNetwork.addresses.tokens.REN.address
  );
