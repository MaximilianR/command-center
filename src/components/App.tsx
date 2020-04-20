import * as React from "react";

import { connect, ConnectedReturnType } from "react-redux"; // Custom typings
import { Route, RouteComponentProps, Switch, useLocation, withRouter } from "react-router-dom";
import { bindActionCreators } from "redux";

import { DEFAULT_REN_NETWORK } from "../lib/react/environmentVariables";
import { _catchBackgroundException_ } from "../lib/react/errors";
import { promptLogin } from "../store/account/accountActions";
import { ApplicationState } from "../store/applicationState";
import { PopupContainer } from "../store/popupStore";
import { AppDispatch } from "../store/rootReducer";
import { Web3Container } from "../store/web3Store";
import { AllDarknodes } from "./allDarknodesPage/AllDarknodes";
import { NotFound } from "./common/404";
import { BackgroundTasks } from "./common/BackgroundTasks";
import { _catch_ } from "./common/ErrorBoundary";
import { Header } from "./common/Header";
import { LoggingIn } from "./common/LoggingIn";
import { PopupController } from "./common/popups/PopupController";
import { Sidebar } from "./common/sidebar/Sidebar";
import { Darknode, getDarknodeParam } from "./darknodePage/Darknode";
import { Overview } from "./networkDarknodesPage/Overview";
import { NetworkStats } from "./networkStatsPage/NetworkStats";
import { ReduxToContainers } from "./ReduxToContainers";
import { RenVM } from "./renvmPage/RenVM";

// Component that attaches scroll to top hanler on router change
// renders nothing, just attaches side effects
export const ScrollToTopWithRouter = withRouter(() => {
    // this assumes that current router state is accessed via hook
    // but it does not matter, pathname and search (or that ever) may come from props, context, etc.
    const location = useLocation();

    // just run the effect on pathname and/or search change
    React.useEffect(() => {
        try {
            // trying to use new API - https://developer.mozilla.org/en-US/docs/Web/API/Window/scrollTo
            window.scroll({
                top: 0,
                left: 0,
                behavior: "smooth",
            });
        } catch (error) {
            // just a fallback for older browsers
            window.scrollTo(0, 0);
        }
    }, [location]);

    // renders nothing, since nothing is needed
    return null;
});

/**
 * App is the main visual component responsible for displaying different routes
 * and running background app loops
 */
const AppClass = ({ match: { params }, actions }: Props) => {
    const { web3, address, loggedInBefore, renNetwork, setWeb3, setRenNetwork: setNetwork } = Web3Container.useContainer();
    const { setPopup, clearPopup } = PopupContainer.useContainer();

    React.useEffect(() => {
        if (loggedInBefore) {
            actions.promptLogin(setPopup, clearPopup, { manual: false, redirect: false, showPopup: false, immediatePopup: false })
                .catch((error) => _catchBackgroundException_(error, "Error in App > promptLogin"));
        }
    }, []);

    const withAccount = React.useCallback(<T extends React.ComponentClass | React.StatelessComponent>(component: T):
        React.ComponentClass | React.StatelessComponent =>
        address ? component : LoggingIn,
        [address],
    );

    React.useEffect(() => {
        setWeb3(web3);
        setNetwork(renNetwork);
    }, [web3]);

    const darknodeID = getDarknodeParam(params);
    const showNetworkBanner = renNetwork.name !== DEFAULT_REN_NETWORK;

    return <div className="app">
        <ReduxToContainers />
        <BackgroundTasks key={`${address || undefined} ${renNetwork.name}`} />
        <ScrollToTopWithRouter />
        {/*
            * We set the key to be the address so that any sub-component state is reset after changing accounts
            * (e.g. if in
            * the middle of a transaction, etc.)
            */}
        <div className={[address ? "with-account" : "without-account", showNetworkBanner ? `with-banner with-banner--${renNetwork.chain}` : ""].join(" ")}>
            {showNetworkBanner ?
                <div className="network--banner">Using <span className="banner--bold">{renNetwork.label}</span> RenVM network, <span className="banner--bold">{renNetwork.chainLabel}</span> Ethereum network</div> :
                <></>
            }
            <PopupController>
                {_catch_(<Sidebar selectedDarknode={darknodeID} />)}
                <div className="app--body">
                    {_catch_(<Switch>
                        {/* tslint:disable-next-line: react-this-binding-issue jsx-no-lambda */}
                        <Route path="/" exact component={NetworkStats} />
                        <Route path="/darknode-stats" exact component={Overview} />
                        <Route path="/all" exact component={withAccount(AllDarknodes)} />
                        <Route path="/darknode/:darknodeID" exact component={Darknode} />

                        {/* Old hyperdrive URLs */}
                        <Route path="/hyperdrive" exact component={RenVM} />
                        <Route path="/hyperdrive/:blockNumber" exact component={RenVM} />

                        <Route path="/renvm" exact component={RenVM} />

                        {/* RenVM TX */}
                        <Route path="/tx/:txHash" exact component={RenVM} />
                        <Route path="/renvm/tx/:txHash" exact component={RenVM} />

                        {/* RenVM Block */}
                        <Route path="/block/:blockNumber" exact component={RenVM} />
                        <Route path="/renvm/:blockNumber" exact component={RenVM} />
                        <Route path="/renvm/block/:blockNumber" exact component={RenVM} />

                        {/* 404 */}
                        <Route component={NotFound} />
                    </Switch>, { popup: true })}
                </div>
                {/* {_catch_(<Footer />)} */}
            </PopupController>
            {_catch_(<Header />)}
        </div>
    </div>;
};

const mapStateToProps = (state: ApplicationState) => ({
    store: {
    },
});

const mapDispatchToProps = (dispatch: AppDispatch) => ({
    actions: bindActionCreators({
        promptLogin,
    }, dispatch),
});

interface Props extends
    ReturnType<typeof mapStateToProps>,
    ConnectedReturnType<typeof mapDispatchToProps>,
    RouteComponentProps {
}

export const App = connect(mapStateToProps, mapDispatchToProps)(withRouter(AppClass));
