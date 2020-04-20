// tslint:disable: no-console

import { createTransform, PersistConfig } from "redux-persist";
import storage from "redux-persist/lib/storage";

import { _catchBackgroundException_ } from "../lib/react/errors";
import { ApplicationState, PersistentNetworkState } from "./applicationState";

const networkTransform = createTransform<PersistentNetworkState, string>(
    (inboundState: PersistentNetworkState, key: string | number | symbol): string => {
        try {
            return inboundState.serialize();
        } catch (error) {
            console.error(`Error serializing ${String(key)} in NetworkState (${JSON.stringify(inboundState)}): ${error}`);
            // Don't send storage because it may contain sensitive data.
            _catchBackgroundException_(error, "Error in persistConfig > serializing network storage");
            throw error;
        }
    },
    (outboundState: string, key: string | number | symbol): PersistentNetworkState => {
        try {
            return new PersistentNetworkState().deserialize(outboundState);
        } catch (error) {
            console.error(`Error deserializing ${String(key)} in NetworkState (${JSON.stringify(outboundState)}): ${error}`);
            // Don't send storage because it may contain sensitive data.
            _catchBackgroundException_(error, "Error in persistConfig > deserializing network storage");
            throw error;
        }
    },
    { whitelist: ["network"] as Array<keyof ApplicationState>, },
);

export const persistConfig: PersistConfig<ApplicationState> = {
    storage,
    key: "root",
    whitelist: ["account", "network"] as Array<keyof ApplicationState>,
    transforms: [networkTransform],
};
