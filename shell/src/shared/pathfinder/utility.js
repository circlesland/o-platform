const CirclesAPI = 'https://api.circles.garden/api/';
const PathfinderAPI = "__PATHFINDER_ENDPOINT__";

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


export let computeFlow = async function(from, to, maxValue) {
    return await (await fetch(PathfinderAPI + `/flow/${from}/${to}/${maxValue}`)).json();
};

export let getAdjacencies = async function(address) {
    return await (await fetch(`__PATHFINDER_ENDPOINT__/adjacencies/${address}`, {mode: 'cors'})).json();
};
