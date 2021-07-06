const CirclesAPI = 'https://api.circles.garden/api/';
const PathfinderAPI = 'https://pathfinder.circles.land';
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
    const findCirclesGardenProfiles = new Promise(async (resolve) => {
        try {
            resolve(await Banking.findCirclesGardenProfiles(allKnownAddresses));
            return;
        } catch (e) {
            console.error(`Couldn't load the following profiles from api.circles.garden:`, resolve);
        }
        return resolve([]);
    });
    const profiles = await Promise.all([
        findCirclesGardenProfiles,
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
    return (await (await fetch(GraphAPI, {
        method: 'POST',
        body: JSON.stringify({
            query: `{token(id: "${token}") { owner { id } } }`
        })
    })).json()).data.token.owner.id;
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
