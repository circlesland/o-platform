<script>
  import { Network } from "vis-network";
  import { DataSet } from "vis-data";
  import { onMount } from "svelte";

  import { formatValue } from "./utility.js";
  import { labelFor, createNodeContents } from "./visUtils.js";
  import { fillUsernames, fillTokens, tokenDB } from "./userdb.js";

  export let transfers = [];
  export let height = "400px";
  export let onWhiteBackground = false;
  let graph;
  let nodes = new DataSet();
  let edges = new DataSet();
  let firstNode = -1;
  let lastNode = -1;

  let addresses = [];
  const afterzoomlimit = {
    //here we are setting the zoom limit to move to
    scale: 1,
  };

  const interactionOptions = {
    dragNodes: true,
    dragView: true,

    hover: false,
    hoverConnectedEdges: false,
    keyboard: {
      enabled: false,
      speed: { x: 10, y: 10, zoom: 0.02 },
      bindToWindow: true,
    },
    multiselect: false,
    navigationButtons: false,
    selectable: false,
    selectConnectedEdges: false,
    zoomSpeed: 1,
    zoomView: false,
  };

  let network;

  onMount(() => {
    network = new Network(
      graph,
      {
        nodes: nodes,
        edges: edges,
      },
      {
        interaction: interactionOptions,
      }
    );

    network.on("afterDrawing", function() {
      // TODO dimensions of graph?
      let x = window.innerWidth * 0.4;
      if (firstNode !== -1) {
        nodes.update({ id: firstNode, x: -x, y: 0 });
      }
      if (lastNode !== -1) {
        nodes.update({ id: lastNode, x: x, y: 0 });
      }
      network.fit({
        nodes: addresses,
      });
    });
  });

  let retrieveUserAndTokenInfo = async function(steps) {
    let tokens = [];
    for (let step of steps) {
      addresses.push(step.from);
      addresses.push(step.to);
      tokens.push(step.token.toLowerCase());
    }
    await fillUsernames(addresses);
    await fillTokens(tokens);
  };

  let drawGraph = async function(steps) {
    await retrieveUserAndTokenInfo(steps);
    nodes.clear();
    edges.clear();
    let createNode = function(id) {
      nodes.update(createNodeContents(id));
    };
    for (let step of steps) {
      let tokenUser = tokenDB[step.token.toLowerCase()];
      let label = labelFor(tokenUser || step.token);
      createNode(step.from);
      createNode(step.to);

      edges.update({
        from: step.from,
        to: step.to,
        value: step.value,
        label: formatValue(step.value),
        arrows: "to",
        color: {
          color: "#F1E7DD",
          highlight: "#F1E7DD",
          hover: "#F1E7DD",
          inherit: "from",
          opacity: 1.0,
        },
        font: { align: "top", vadjust: 0, color: "#001c6e" },
        scaling: {
          min: 1,
          max: 3,
          label: {
            enabled: true,
            min: 14,
            max: 25,
            maxVisible: 30,
            drawThreshold: 1,
          },
        },
      });
    }

    if (steps.length > 0) {
      firstNode = steps[0].from;
      lastNode = steps[steps.length - 1].to;
    } else {
      firstNode = -1;
      lastNode = -1;
    }
  };

  $: {
    drawGraph(transfers);
  }
</script>

<main>
  <div
    bind:this="{graph}"
    style="width: 100%; height: {height};"
    class:bg-background="{!onWhiteBackground}"></div>
</main>
