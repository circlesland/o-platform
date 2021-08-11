import { writable } from "svelte/store";

export const chatdata = writable([
  {
    outgoing: false,
    notification: true,
    name: "Martin Köppelmann",
    time: "5min ago",
    image:
      "https://circlesland-pictures.fra1.cdn.digitaloceanspaces.com/PP2WbUHmpaCg9Gk7/",
    text: "<h1 class='uppercase'>You got invited</h1><span>Jakobus has invited you and unlocked your basic income for you. <br/>Do you want to Trust Felix now?<br/><br/><button type='submit' class='relative btn btn-primary btn-block '>Trust Martin<div class='absolute right-2'><svg class='w-6' viewBox='0 0 23 22' fill='none' xmlns='http://www.w3.org/2000/svg'> <path d='M11.5 15L15.5 11M15.5 11L11.5 7M15.5 11H7.5M21.5 11C21.5 16.5228 17.0228 21 11.5 21C5.97715 21 1.5 16.5228 1.5 11C1.5 5.47715 5.97715 1 11.5 1C17.0228 1 21.5 5.47715 21.5 11Z' stroke='currentColor' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'></path></svg></div></button></span>",
  },

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
