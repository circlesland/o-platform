import { writable } from "svelte/store";

type Media<Query extends Record<string, string> = Record<string, string>> = {
  [K in keyof Query]?: boolean | string;
} & {
  classNames: string;
};

type MediaQueryLists = Record<string, MediaQueryList>;

function calculateMedia(mqls: MediaQueryLists) {
  let media: Media = { classNames: "" };
  let mediaClasses = [];
  for (let name in mqls) {
    media[name] = mqls[name].matches;
    if (media[name]) {
      mediaClasses.push(`media-${name}`);
    }
  }
  media.classNames = mediaClasses.join(" ");
  return media;
}

export default function <Query extends Record<string, string>>(
  mediaqueries: Query
) {
  return writable<Media<Query>>({ classNames: "" }, (set) => {
    if (typeof window === "undefined") return;
    let mqls: MediaQueryLists = {};
    let updateMedia = () => set(calculateMedia(mqls));
    for (let key in mediaqueries) {
      let foo = window.matchMedia(mediaqueries[key]);
      mqls[key] = foo;

      if (mqls[key].addEventListener) {
        mqls[key].addEventListener(`change`, updateMedia);
      } else {
        // Deprecated 'MediaQueryList' API, <Safari 14, IE, <Edge 16
        mqls[key].addListener(updateMedia);
      }
    }
    updateMedia();
    return () => {
      for (let key in mqls) {
        if (mqls[key].removeEventListener) {
          mqls[key].removeEventListener(`change`, updateMedia);
        } else {
          // Deprecated 'MediaQueryList' API, <Safari 14, IE, <Edge 16
          mqls[key].removeListener(updateMedia);
        }
      }
    };
  });
}
