<script lang="ts">
import { Network } from "vis-network";
import { DataSet } from "vis-data";
import { onMount } from "svelte";

import { labelFor, createNodeContents } from "./visUtils.js";
import { fillUsernames, fillTokens, tokenDB } from "./userdb.js";
import { displayCirclesAmount } from "src/shared/functions/displayCirclesAmount";
import { me } from "../stores/me";
import {TransitivePathStep} from "../../dapps/o-banking/processes/transferCircles";

export let transfers:TransitivePathStep[] = [];
export let height = "400px";
export let onWhiteBackground = false;
let graph;
let nodes = new DataSet();
let edges = new DataSet();
let firstNode = "";
let lastNode = "";

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

  network.on("afterDrawing", function () {
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

let retrieveUserAndTokenInfo = async function (steps:TransitivePathStep[]) {
  let tokens = [];
  for (let step of steps) {
    addresses.push(step.from);
    addresses.push(step.to);
    tokens.push({token: step.token, tokenOwner: step.tokenOwner});
  }
  await fillUsernames(addresses);
  await fillTokens(tokens);
};

let drawGraph = async function (steps:TransitivePathStep[]) {
  await retrieveUserAndTokenInfo(steps);
  nodes.clear();
  edges.clear();
  let createNode = function (id) {
    nodes.update(createNodeContents(id));
  };
  for (let step of steps) {
    let tokenUser = tokenDB[step.token.toLowerCase()];
    let label = labelFor(tokenUser || step.token);
    createNode(step.from);
    createNode(step.to);

    edges.update(<any>{
      from: step.from,
      to: step.to,
      value: step.value,
      label: `${displayCirclesAmount(
        step.value,
        null,
        true,
        ($me && $me.displayTimeCircles !== undefined ? $me.displayTimeCircles : true) || ($me && $me.displayTimeCircles !== undefined ? $me.displayTimeCircles : true) === undefined
      )} ${
        ($me && $me.displayTimeCircles !== undefined ? $me.displayTimeCircles : true) || ($me && $me.displayTimeCircles !== undefined ? $me.displayTimeCircles : true) === undefined
          ? "Time "
          : ""
      }Circles`,
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
    firstNode = "";
    lastNode = "";
  }
};

$: {
  drawGraph(transfers);
}
</script>

<main class="w-full">
  <div
    bind:this="{graph}"
    style="width: 100%; height: {height};"
    class:bg-background="{!onWhiteBackground}">
  </div>
</main>
