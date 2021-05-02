<script>
import {Network} from 'vis-network';
import {DataSet} from 'vis-data';
import { onMount } from 'svelte';

import { fillUsernames, userDB } from './userdb.js';
import { toAddress, getAdjacencies } from './utility.js';
import { createNodeContents } from './visUtils.js';

let usernameToExplore = '';
let graph;

let nodes = new DataSet();
let edges = new DataSet();
let knownEdges = {};

onMount(() => {
    var network = new Network(graph, {nodes: nodes, edges: edges}, {});
    network.on('click', (params) => {
        if (!params.nodes || params.nodes.length == 0) return;
        exploreNode(params.nodes[0])
    });
});

let small = function(node) { node['size'] = 10; return node; }

let exploreNode = async function(username) {
    let adjacencies = await getAdjacencies(await toAddress(username));
    let addressesToQuery = {};
    for (let edge of adjacencies) {
        addressesToQuery[edge.user] = true;
        addressesToQuery[edge.trusts] = true;
    }
    await fillUsernames(Object.keys(addressesToQuery));
    for (let edge of adjacencies) {
        nodes.update(small(createNodeContents(edge.user)));
        nodes.update(small(createNodeContents(edge.trusts)));
        if (!knownEdges[edge.user + ',' + edge.trusts]) {
            knownEdges[edge.user + ',' + edge.trusts] = true;
            edges.update({
                from: edge.user,
                to: edge.trusts,
                label: edge.percentage == 50 ? '' : edge.percentage + '%',
                arrows: "to",
                font: {align: "top"}
            });
        }
    }
};

let resetGraph = function() {
    nodes.clear();
    edges.clear();
    knownEdges = {};
}

</script>

<main>
    <h1>Adjacency Graph</h1>
    <input bind:value={usernameToExplore} placeholder="username / address">
    <button on:click={exploreNode(usernameToExplore)}>explore</button>
    <button on:click={resetGraph}>reset</button>
    <div bind:this={graph} style="width: 100%; height: 600px;"></div>
</main>

<style>
</style>