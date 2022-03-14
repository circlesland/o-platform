<script lang="ts">
import SimpleHeader from "src/shared/atoms/SimpleHeader.svelte";
import OfferCard from "../atoms/OfferCard.svelte";
import { onMount } from "svelte";
import { PlatformEvent } from "@o-platform/o-events/dist/platformEvent";
import { Subscription } from "rxjs";

import { push } from "svelte-spa-router";
import { RuntimeDapp } from "@o-platform/o-interfaces/dist/runtimeDapp";
import { Routable } from "@o-platform/o-interfaces/dist/routable";

import {
  Offer,
  QueryTagsInput,
  Tag,
  TagsDocument,
} from "../../../shared/api/data/types";
import { me } from "../../../shared/stores/me";
import { ApiClient } from "../../../shared/apiConnection";

import { offers } from "../../../shared/stores/offers";

export let runtimeDapp: RuntimeDapp<any>;
export let routable: Routable;
</script>

<SimpleHeader runtimeDapp="{runtimeDapp}" routable="{routable}" />
