<script lang="ts">
  import {RuntimeDapp} from "@o-platform/o-interfaces/dist/runtimeDapp";
  import {Routable} from "@o-platform/o-interfaces/dist/routable";
  import {Subscription} from "rxjs";
  import SimpleHeader from "src/shared/atoms/SimpleHeader.svelte";
  import ChatListCard from "../atoms/ChatListCard.svelte";
  import {contacts} from "../../../shared/stores/contacts";

  import { _ } from "svelte-i18n";

  export let runtimeDapp: RuntimeDapp<any>;
  export let routable: Routable;

  let error: string | undefined = undefined;
  let shellEventSubscription: Subscription;
</script>
<template lang="pug">
  
SimpleHeader(runtimeDapp="{runtimeDapp}" routable="{routable}")

div.px-4.mx-auto.-mt-3.mb-20(class='md:w-2/3 xl:w-1/2')
  +if('!contacts && !error')
    section.flex.items-center.justify-center.mb-2
      div.flex.items-center.w-full.p-4.space-x-2.bg-white.shadow
        div.flex.flex-col.items-start
          div {$_("dapps.o-contacts.pages.chat.loadingConversations")}
    +elseif('error')
      section.flex.items-center.justify-center.mb-2
        div.flex.items-center.w-full.p-4.space-x-2.bg-white.shadow
          div.flex.flex-col.items-start
            div
              b {$_("dapps.o-contacts.pages.chat.error")}
              | {error}
    +else
      +if('contacts')
        +each(`$contacts as contact(contact.contactAddress + contact.lastContactAt)`)
          ChatListCard(param="{contact}")

</template>
