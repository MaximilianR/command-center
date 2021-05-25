import BigNumber from "bignumber.js";
import { updatePrice } from "../../../controllers/common/tokenBalanceUtils";
import { Token, TokenPrices } from "../../ethereum/tokens";
import { TokenAmount } from "../../graphQL/queries/queries";
import { darknodeIDBase58ToRenVmID } from "../darknodeID";
import { queryBlockStateResponseMock } from "./currentMock";

export type QueryBlockStateResponse = typeof queryBlockStateResponseMock;

type Numeric = number | string;

type FeeEpoch = {
    amount: Numeric;
    epoch: Numeric;
    numNodes: Numeric;
};

type FeeData = {
    nodes: Array<any>;
    epochs: Array<FeeEpoch>;
    unassigned: Numeric;
};

export const getFeesForAsset = (
    symbol: string,
    response: QueryBlockStateResponse,
) => {
    const data = response.result.state.v[symbol];
    if (!data) {
        return null;
    }
    return data.fees as FeeData;
};

// export const getTokenFeeForEpoch = (
//   symbol: string,
//   epoch: "current" | "previous",
//   response: QueryBlockStateResponse,
// ) => {
//     const data = getFeesForAsset(symbol, response);
//     if (data === null) {
//         return new BigNumber(0);
//     }
//     const { epochs } = data;
//     if (epoch === "current") {
//         if (epochs.length) {
//             return new BigNumber(epochs[epochs.length - 1].amount);
//         }
//         return new BigNumber(0);
//     }
//     if (epoch === "previous") {
//         if (epochs.length > 1) {
//             return new BigNumber(epochs[epochs.length - 2].amount);
//         }
//         return new BigNumber(0);
//     }
//     return new BigNumber(0);
// };

export const getTokenRewardsForEpoch = (
    symbol: string,
    epoch: "current" | "previous",
    response: QueryBlockStateResponse,
    perNode = false,
) => {
    const data = getFeesForAsset(symbol, response);
    if (data === null) {
        return new BigNumber(0);
    }
    const { epochs } = data;
    if (epoch === "current") {
        if (epochs.length) {
            const { amount, numNodes } = epochs[epochs.length - 1];
            return new BigNumber(amount).div(perNode ? numNodes : 1);
        }
        return new BigNumber(0);
    }
    if (epoch === "previous") {
        if (epochs.length > 1) {
            const { amount, numNodes } = epochs[epochs.length - 2];
            return new BigNumber(amount).div(perNode ? numNodes : 1);
        }
        return new BigNumber(0);
    }
    return new BigNumber(0);
};

export const toTokenAmount = (
    amount: any,
    symbol: string,
    decimals: number,
) => {
    const data: TokenAmount = {
        amount: amount,
        amountInEth: new BigNumber(0),
        amountInUsd: new BigNumber(0),
        asset: { decimals },
        symbol,
    };
    return data;
};

export const getTokenFeeAmounts = (
    amount: any,
    symbol: string,
    decimals: number,
    tokenPrices: TokenPrices | null,
) => {
    const data: TokenAmount = {
        amount: amount,
        amountInEth: new BigNumber(0),
        amountInUsd: new BigNumber(0),
        asset: { decimals },
        symbol,
    };
    if (tokenPrices) {
        return updatePrice(data, symbol as Token, tokenPrices);
    }
    return data;
};

export const toNativeTokenSymbol = (symbol: string) => {
    return symbol.replace(/^ren/, "").replace(/^test/, "").replace(/^dev/, "");
};

export const getNodeEnteredAt = (
    renVmNodeId: string,
    response: QueryBlockStateResponse,
) => {
    const nodeSystemData = response.result.state.v.System.nodes.find(
        (node) => node.id === renVmNodeId,
    );
    if (!nodeSystemData) {
        return null;
    }
    return Number(nodeSystemData.enteredAt);
};

export const getLastEpochClaimed = (
    renVmNodeId: string,
    symbol: string,
    response: QueryBlockStateResponse,
) => {
    const data = getFeesForAsset(symbol, response);
    if (!data) {
        return null;
    }
    const nodeData = data.nodes.find(
        (nodeItem) => nodeItem.node === renVmNodeId,
    );
    if (!nodeData) {
        return null;
    }
    return Number(nodeData.lastEpochClaimed) || null;
};
