<script lang="ts">
import { RuntimeDapp } from "@o-platform/o-interfaces/dist/runtimeDapp";
import { Routable } from "@o-platform/o-interfaces/dist/routable";
import SimpleHeader from "../../../shared/atoms/SimpleHeader.svelte";
import TrustToDoCard from "../atoms/TrustToDoCard.svelte";
import { contacts as contactStore } from "../../../shared/stores/contacts";
import EventList from "../../../shared/molecules/Lists/EventList.svelte";
import {
  Contact,
  ContactDirection,
  EventType,
} from "../../../shared/api/data/types";
import { newUsers } from "../../../shared/stores/newUsers";

export let runtimeDapp: RuntimeDapp<any>;
export let routable: Routable;

const listArguments = {};

console.log(newUsers);

$: {
  // let trust = findContactActions(param.circlesAddress)
  //   .then((result) => {
  //     console.log("RESULT", result);
  //   })
  //   .catch((err) => {
  //     console.log("ERRuO", err);
  //   });
}

async function findContactActions(circlesAddress: string) {
  const recipientProfile: Contact = await contactStore.findBySafeAddress(
    circlesAddress
  );
  if (!recipientProfile) {
    throw Error("Invalid Profile");
  }

  const trustMetadata = recipientProfile.metadata.find(
    (o) => o.name == EventType.CrcTrust
  );

  if (!trustMetadata) {
    // No trust relation
    return true;
  }

  const inTrustIndex = trustMetadata.directions.indexOf(ContactDirection.In);
  const trustsYou =
    inTrustIndex > -1
      ? parseInt(trustMetadata.values[inTrustIndex]) > 0
      : false;

  const outTrustIndex = trustMetadata.directions.indexOf(ContactDirection.Out);
  const youTrust =
    outTrustIndex > -1
      ? parseInt(trustMetadata.values[outTrustIndex]) > 0
      : false;

  if (youTrust) {
    return true;
  }
  return false;
}
</script>

<SimpleHeader runtimeDapp="{runtimeDapp}" routable="{routable}" />

<div class="px-4 mx-auto mb-20 -mt-3 md:w-2/3 xl:w-1/2">
  <EventList
    store="{newUsers}"
    views="{{ [EventType.NewUser]: TrustToDoCard }}" />
</div>
