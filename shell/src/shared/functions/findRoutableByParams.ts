import {DappManifest} from "@o-platform/o-interfaces/dist/dappManifest";
import {Routable} from "@o-platform/o-interfaces/dist/routable";
import {arraysEqual} from "./arraysEqual";

export type FindRouteResult = {
    found: boolean,
    routable: Routable,
    params:  { [x: string]: string }
};

/**
 * Tries to find a nextRoutable in the dappManifest that matches with the names and count of the supplied params.
 * @param dappManifest
 * @param params
 */
export function findRoutableByParams(dappManifest:DappManifest<any>, params: { [x: string]: string }) : FindRouteResult {
    const newPageParams = {};
    let matchingRoute: Routable;

    let routePartsFromParams = [];
    if (params["1"]) routePartsFromParams.push(params["1"]);
    if (params["2"]) routePartsFromParams.push(params["2"]);
    if (params["3"]) routePartsFromParams.push(params["3"]);
    if (params["4"]) routePartsFromParams.push(params["4"]);
    if (params["5"]) routePartsFromParams.push(params["5"]);
    if (params["6"]) routePartsFromParams.push(params["6"]);

    let possibleRoutes = dappManifest.routables.filter(
        (o) => o.routeParts.length == routePartsFromParams.length
    );

    // console.log("Possible routes (same length):", possibleRoutes);

    for (let route of possibleRoutes) {
        const exactParts = route.routeParts
            .filter((part) => part.startsWith("="))
            .map((o) => o.replace("=", ""));

        if (exactParts.length <= routePartsFromParams.length) {
            // Could be a matching route
            const overlapFromParams = routePartsFromParams.slice(0, exactParts.length);

            if (arraysEqual(exactParts, overlapFromParams)) {
                matchingRoute = route;
                // console.log("Matching route:", route);

                const remainingParamsSpec = route.routeParts
                    .slice(exactParts.length)
                    .map((o) => o.replace(":", "")
                                        .replace("?", ""));

                const remainingParams = routePartsFromParams.slice(
                    exactParts.length
                );

                for (let i = 0; i < remainingParamsSpec.length; i++) {
                    newPageParams[remainingParamsSpec[i]] = remainingParams[i];
                }

                break;
            }
        }
    }

    return {
        found: !!matchingRoute,
        routable: matchingRoute,
        params: newPageParams,
    };
}