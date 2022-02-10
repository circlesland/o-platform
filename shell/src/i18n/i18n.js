import { addMessages, init } from "svelte-i18n";

import en from "./lang/en.json";

addMessages("en", en);

init({
    initialLocale = "en",
});