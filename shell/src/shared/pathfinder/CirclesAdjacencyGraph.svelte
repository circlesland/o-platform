<script lang="ts">
import { Network } from "vis-network";
import { DataSet } from "vis-data";
import { onMount } from "svelte";
import { push } from "svelte-spa-router";
import { fillUsernames } from "./userdb.js";
import { toAddress, getAdjacencies } from "./utility.js";
import { createNodeContents } from "./visUtils.js";

export let address: string;
export let maxHeight: string = "h-screen";

// let usernameToExplore = '';
let graph;

let nodes = new DataSet();
let edges = new DataSet();
let knownEdges = {};

let initialized = false;

const options = {
  edges: {
    smooth: {
      enabled: false,
    },
  },
  physics: {
    enabled: true,

    forceAtlas2Based: {
      gravitationalConstant: -26,
      centralGravity: 0.005,
      springLength: 130,
      springConstant: 0.08,
      avoidOverlap: 1,
    },
    maxVelocity: 66,
    solver: "forceAtlas2Based",
    timestep: 0.35,
    stabilization: {
      iterations: 150,
    },
  },
};

function loadDetailPage(path) {
  push(`#/friends/${path}`);
}

onMount(() => {
  var network = new Network(graph, { nodes: nodes, edges: edges }, options);
  network.on("doubleClick", (params) => {
    if (!params.nodes || params.nodes.length == 0) return;
    exploreNode(params.nodes[0]);
  });
  network.on("click", (params) => {
    if (!params.nodes || params.nodes.length == 0) return;
    exploreNode(params.nodes[0]);
    // console.log("DES ISSE: ", params.nodes[0]);
    // const tooltip = document.getElementById("tooltip");
    // if (tooltip) {
    //   tooltip.remove();
    // }
    // // loadDetailPage(params.nodes[0]);
    // console.log("this", params);
    // console.log("pointer", params.pointer.canvas);
    // const child = document.createElement("span");
    // child.setAttribute("id", "tooltip");
    // child.textContent = "child";
    // child.style.cssText = `position:absolute;top:${params.pointer.DOM.y}px;left:${params.pointer.DOM.x}px;width:200px;height:80px;border-radius:8px;background:#fff;border:1px  solid #ddd;-moz-box-shadow: 0px 0px 8px  #fff;display:block;`;

    // graph.appendChild(child);
  });
  if (address && address !== "0x00" && address.trim() !== "") {
    exploreNode(address);
  }
});

$: {
  if (address && address !== "0x00" && address.trim() !== "" && !initialized) {
    exploreNode(address);
  }
}

let small = function (node) {
  node["size"] = 25;
  return node;
};

async function exploreNode(username) {
  initialized = true;
  let adjacencies = await getAdjacencies(
    username.startsWith("0x") ? await toAddress(username) : username
  );
  console.log("ADJACENCIES: ", adjacencies);
  let addressesToQuery = {};
  for (let edge of adjacencies.adjacencies) {
    addressesToQuery[edge.user] = true;
    addressesToQuery[edge.trusts] = true;
  }
  await fillUsernames(Object.keys(addressesToQuery));
  for (let edge of adjacencies.adjacencies) {
    nodes.update(small(createNodeContents(edge.user)));
    nodes.update(small(createNodeContents(edge.trusts)));
    if (!knownEdges[edge.user + "," + edge.trusts]) {
      knownEdges[edge.user + "," + edge.trusts] = true;
      edges.update({
        from: edge.user,
        to: edge.trusts,
        // label: edge.percentage == 50 ? "" : edge.percentage + "%",
        arrows: "to",
        color: {
          color: "#8597C6",
          highlight: "#8597C6",
          hover: "#8597C6",
          inherit: "from",
          opacity: 1.0,
        },
        font: { align: "top" },
      });
    }
  }
  console.log("NODES: ", nodes);
  console.log("Edges: ", edges);
}

let resetGraph = function () {
  nodes.clear();
  edges.clear();
  knownEdges = {};
};
</script>

<!-- TODO: Find a better fix for the graph-height. Problem is that this value must be known upon initialization. Also resize scenarios must be handled. -->
<div bind:this="{graph}" class="w-auto mx-6 {maxHeight}"></div>
