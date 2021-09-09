import { writable } from "svelte/store";

export const chatdata = writable([
  {
    outgoing: false,
    notification: true,
    notificationParams: {
      title: "Martin sent you 12,2 circles",
      text: "Message: Danke für den Fisch",
      notificationType: "transfer_in",
      time: "5 seconds ago",
      actions: [{ title: "view Transaction", icon: "sendmoney" }],
    },
  },
  {
    outgoing: false,
    notification: true,
    notificationParams: {
      title: "Martin sent you 12,2 circles",
      text: "Message: Danke für den Fisch",
      notificationType: "transfer_in",
      time: "5 seconds ago",
      actions: [{ title: "view Transaction", icon: "sendmoney" }],
    },
  },

  {
    outgoing: false,
    notification: true,
    notificationParams: {
      title: "You sent Martin 1 circle",
      text: "Message: Kauf dir n Schlotzer.",
      notificationType: "transfer_out",
      time: "15 seconds ago",
      actions: [{ title: "view Transaction", icon: "sendmoney" }],
    },
  },

  {
    outgoing: false,
    notification: true,
    notificationParams: {
      title: "Martin invited you",
      text: "Martin has invited you and unlocked your basic income for you.",
      notificationType: "invite",
      time: "4 days ago",
      actions: [{ title: "trust Martin", icon: "trust" }],
    },
  },

  {
    outgoing: false,
    notification: true,
    notificationParams: {
      title: "Martin untrusted you",
      text: "Martin has revoked the trust connection between him and you.",
      notificationType: "trust_removed",
      time: "4 days ago",
      actions: [],
    },
  },

  {
    outgoing: false,
    notification: true,
    notificationParams: {
      title: "Martin trusted you",
      text: "",
      notificationType: "trust_added",
      time: "4 days ago",
      actions: [{ title: "trust Martin", icon: "trust" }],
    },
  },

  {
    outgoing: false,
    notification: true,
    notificationParams: {
      title: "You untrusted Martin",
      text: "You revoked the trust connection between you and Martin.",
      notificationType: "trust_removed",
      time: "4 days ago",
      actions: [{ title: "trust Martin", icon: "trust" }],
    },
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
