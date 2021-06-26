const CirclesAPI = 'https://api.circles.garden/api/';
const PathfinderAPI = "__PATHFINDER_ENDPOINT__";
const GraphAPI = 'https://graph.circles.garden/subgraphs/name/CirclesUBI/circles-subgraph';
import {Banking} from "../../dapps/o-banking/banking"

export let toAddress = async function(input) {
    if (!input || input.match(/0x[0-9a-fA-F]{40}/)) {
        return input;
    } else {
        let responses = (await (await fetch(CirclesAPI + '/users?username[]=' + input)).json()).data;
        if (!responses || responses.length == 0) {
            return '';
        } else {
            return responses[0].safeAddress;
        }
    }
};

export let formatValue = function(value) {
    if (typeof value != typeof '')
        value = '' + value;
    while (value.length <= 18)
        value = '0' + value;
    return value.substr(0, value.length - 18) + '.' + value.substr(value.length - 18, 2);
};

export let userInfo = async function(addresses) {
    const profiles = await Promise.all([
        await Banking.findCirclesGardenProfiles(addresses),
        await Banking.findCirclesLandProfiles(addresses)
    ]);
    const garden = profiles[0];
    const land = profiles[1];
    const dedup = {};
    garden.forEach(o => dedup[o.safeAddress] = o);
    land.forEach(o => dedup[o.safeAddress] = o);
    return Object.values(dedup).map(o => {
        if (!o.safeAddress && o.circlesAddress)
            o.safeAddress = o.circlesAddress;
        if (!o.username && o.displayName)
            o.username = o.displayName;
        return o;
    });
};

export let tokenOwner = async function(token) {
    const owner = (await (await fetch(GraphAPI, {
        method: 'POST',
        body: JSON.stringify({
            query: `{token(id: "${token}") { owner { id } } }`
        })
    })).json());
    const tokenResult = owner.data.token;
    if (!tokenResult) {
        return "";
    }
    const ownerAddress = tokenResult.owner.id;
    return ownerAddress;
};

export let computeFlow = async function(from, to, maxValue) {
    return await (await fetch(
        PathfinderAPI + '/flow',
        {method: 'POST', body: JSON.stringify({"from": from, "to": to, "value": maxValue})}
    )).json();
};

export let getAdjacencies = async function(address) {
    return await (await fetch(PathfinderAPI + '/adjacencies/' + address, {mode: 'cors'})).json();
};
