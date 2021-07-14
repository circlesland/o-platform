import { userDB } from "./userdb.js";
import { AvataarGenerator } from "src/shared/avataarGenerator";

export let labelFor = function (id) {
  let user = userDB[id.toLowerCase()];
  if (user && user.username) return user.username;
  else return id.substr(0, 8);
};

export let createNodeContents = function (id) {
  let user = userDB[id.toLowerCase()];
  let node = { id: id, label: labelFor(id) };
  node["shape"] = "circularImage";
  node["image"] =
    user && user.avatarUrl ? user.avatarUrl : AvataarGenerator.generate(id);

  node["color"] = {
    border: "#0ad99c",
    background: "#ffffff",
  };
  node["font"] = {
    color: "#0E2769",
  };

  return node;
};
