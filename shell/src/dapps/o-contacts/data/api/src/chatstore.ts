import { writable } from "svelte/store";

export const chatdata = writable([
  {
    outgoing: false,
    name: "Martin Köppelmann",
    time: "5min ago",
    image:
      "https://circlesland-pictures.fra1.cdn.digitaloceanspaces.com/PP2WbUHmpaCg9Gk7/",
    text: "alksj fna skfn aksjdn flkasbflkasbflkasnfkjan",
  },
  {
    outgoing: true,
    name: "Jakob Lund",
    time: "10mins ago",
    image:
      "https://circlesland-pictures.fra1.cdn.digitaloceanspaces.com/jmnPVI+hYsO421vA/",
    text: "alksj fna skfn aksjdn flkasbflkasbflkasnfkjan skjfnas kfnaskjfnk, asnfasfasfasfd alkjsdnf l",
  },
  {
    outgoing: true,
    name: "Jakob Lund",
    time: "15mins ago",
    image:
      "https://circlesland-pictures.fra1.cdn.digitaloceanspaces.com/jmnPVI+hYsO421vA/",
    text: "alksj fna skfn aksjdn flkasbflkasbflkasnfkjan skjfnas kfnaskjfnk,asnfasfasfasfd alkjsdnf l asdkjna lskfnjaslfnkaslökfnaslkfnlkasnfölaksflkasmflkasflknasklfnaslkfnaslkfnlkasfnlka nsdkfnaslkfnakfnlaknsf",
  },
  {
    outgoing: false,
    name: "Martin Köppelmann",
    time: "30mins ago",
    image:
      "https://circlesland-pictures.fra1.cdn.digitaloceanspaces.com/PP2WbUHmpaCg9Gk7/",
    text: "alksj fna skfn aksjdn flkasbflkasbflkasnfkjan",
  },
]);
