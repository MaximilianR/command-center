/* Generated by ts-generator ver. 0.0.8 */
/* tslint:disable */

import BN from "bn.js";
import Contract, { contractOptions } from "web3/eth/contract";
import { EventLog, Callback, EventEmitter } from "web3/types";
import { TransactionObject, BlockType } from "web3/eth/types";
import { ContractEvent } from "./types";

interface EventOptions {
  filter?: object;
  fromBlock?: BlockType;
  topics?: string[];
}

export class DarknodePaymentStore extends Contract {
  constructor(
    jsonInterface: any[],
    address?: string,
    options?: contractOptions
  );
  clone(): DarknodePaymentStore;
  address: string;
  methods: {
    ETHEREUM(): TransactionObject<string>;

    VERSION(): TransactionObject<string>;

    claimOwnership(): TransactionObject<void>;

    darknodeBalances(arg0: string, arg1: string): TransactionObject<BN>;

    isOwner(): TransactionObject<boolean>;

    lockedBalances(arg0: string): TransactionObject<BN>;

    owner(): TransactionObject<string>;

    renounceOwnership(): TransactionObject<void>;

    transferOwnership(newOwner: string): TransactionObject<void>;

    totalBalance(_token: string): TransactionObject<BN>;

    availableBalance(_token: string): TransactionObject<BN>;

    incrementDarknodeBalance(
      _darknode: string,
      _token: string,
      _amount: number | string
    ): TransactionObject<void>;

    transfer(
      _darknode: string,
      _token: string,
      _amount: number | string,
      _recipient: string
    ): TransactionObject<void>;
  };
  events: {
    OwnershipTransferred: ContractEvent<{
      previousOwner: string;
      newOwner: string;
      0: string;
      1: string;
    }>;
    allEvents: (
      options?: EventOptions,
      cb?: Callback<EventLog>
    ) => EventEmitter;
  };
}
