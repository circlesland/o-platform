<script lang="ts">
  import { Network } from "vis-network";
  import { DataSet } from "vis-data";
  import { onMount } from "svelte";

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

  onMount(() => {
    var network = new Network(graph, { nodes: nodes, edges: edges }, {});
    network.on("click", (params) => {
      if (!params.nodes || params.nodes.length == 0) return;
      exploreNode(params.nodes[0]);
    });
    if (address && address !== "0x00" && address.trim() !== "") {
      exploreNode(address);
    }
  });

  $: {
    if (
      address &&
      address !== "0x00" &&
      address.trim() !== "" &&
      !initialized
    ) {
      exploreNode(address);
    }
  }

  let small = function(node) {
    node["size"] = 25;
    return node;
  };

  async function exploreNode(username) {
    initialized = true;
    let adjacencies = await getAdjacencies(
      username.startsWith("0x") ? await toAddress(username) : username
    );
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
            color: "#F1E7DD",
            highlight: "#F1E7DD",
            hover: "#F1E7DD",
            inherit: "from",
            opacity: 1.0,
          },
          font: { align: "top" },
        });
      }
    }
  }

  let resetGraph = function() {
    nodes.clear();
    edges.clear();
    knownEdges = {};
  };
</script>

<!-- TODO: Find a better fix for the graph-height. Problem is that this value must be known upon initialization. Also resize scenarios must be handled. -->
<div bind:this={graph} class="w-auto mx-6 {maxHeight}" />
