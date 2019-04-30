// Not currently used

import Web3 from "web3";

import { BigNumber } from "bignumber.js";

import { DarknodeRegistryWeb3 } from "./contracts/bindings/darknodeRegistry";
import { contracts } from "./contracts/contracts";

export const getDarknodeCount = async (web3: Web3): Promise<BigNumber> => {
    const darknodeRegistry: DarknodeRegistryWeb3 = new (web3.eth.Contract)(
        contracts.DarknodeRegistry.ABI,
        contracts.DarknodeRegistry.address
    );
    const darknodeCount = await darknodeRegistry.methods.numDarknodes().call();
    return new BigNumber(darknodeCount.toString());
};
