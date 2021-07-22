<script lang="ts">
  import ProcessNavigation from "./ProcessNavigation.svelte";
  import { Continue } from "@o-platform/o-process/dist/events/continue";
  import { NotificationViewerContext } from "./notificationViewerContext";
  import Icons from "src/shared/molecules/Icons.svelte";
  export let context: NotificationViewerContext;

  const strings = {
    PROFILE_OUTGOING_TRUST_REVOKED: "Trust revoked",
    PROFILE_OUTGOING_TRUST: "Trusted",
    PROFILE_INCOMING_UBI: "Received new income",
  };
  function submit() {
    const answer = new Continue();
    answer.data = context.data;
    context.process.sendAnswer(answer);
  }

  function onkeydown(e: KeyboardEvent) {
    if (e.key == "Enter") {
      submit();
    }
  }
</script>

<div>
  {#if context.data[context.field]}
    <div class="flex flex-col space-y-4">
      {#if context.data[context.field].type}
        <h1 class="text-3xl text-center uppercase font-heading">
          {strings[context.data[context.field].type]}
        </h1>
      {/if}
      <div class="self-center mt-4 text-center avatar justify-self-center">
        <div class="mb-4 rounded-full ring ring-white w-36 h-36">
          <img
            src="https://circlesland-pictures.fra1.cdn.digitaloceanspaces.com/jmnPVI+hYsO421vA/"
            alt="avatar"
          />
        </div>
      </div>
      <div class="self-center flex-grow text-center justify-self-start">
        <div class="text-xl">
          <strong>Dieter Thomas Kuhn</strong>
        </div>
        <div class="text-sm text-dark-lightest">Rome, Italy</div>
      </div>
      <div>
        <div class="text-left text-2xs text-dark-lightest">Passion</div>
        <div class="text-lg">
          Growing today the global universal basic income economy of tomorrow
        </div>
      </div>
      <div>
        <div class="text-left text-2xs text-dark-lightest">
          6 Mutual Friends
        </div>
        <div class="flex flex-row space-x-2">
          <div class="self-center mt-4 text-center avatar justify-self-center">
            <div class="w-10 h-10 mb-4 rounded-full ring ring-white">
              <img
                src="https://circlesland-pictures.fra1.cdn.digitaloceanspaces.com/jmnPVI+hYsO421vA/"
                alt="avatar"
              />
            </div>
          </div>
          <div class="self-center mt-4 text-center avatar justify-self-center">
            <div class="w-10 h-10 mb-4 rounded-full ring ring-white">
              <img
                src="https://images.unsplash.com/photo-1626387691044-2becaea05cc0?ixid=MnwxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwxMHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60"
                alt="avatar"
              />
            </div>
          </div>
          <div class="self-center mt-4 text-center avatar justify-self-center">
            <div class="w-10 h-10 mb-4 rounded-full ring ring-white">
              <img
                src="https://images.unsplash.com/photo-1586227740560-8cf2732c1531?ixid=MnwxMjA3fDF8MHxlZGl0b3JpYWwtZmVlZHwzN3x8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60"
                alt="avatar"
              />
            </div>
          </div>
          <div class="self-center mt-4 text-center avatar justify-self-center">
            <div class="w-10 h-10 mb-4 rounded-full ring ring-white">
              <img
                src="https://images.unsplash.com/photo-1626688226927-33257a21236f?ixid=MnwxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwzMXx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60"
                alt="avatar"
              />
            </div>
          </div>
          <div class="self-center mt-4 text-center avatar justify-self-center">
            <div class="w-10 h-10 mb-4 rounded-full ring ring-white">
              <img
                src="https://images.unsplash.com/photo-1626899889787-192a770ba7e7?ixid=MnwxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHw0N3x8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60"
                alt="avatar"
              />
            </div>
          </div>
          <div class="self-center mt-4 text-center avatar justify-self-center">
            <div class="w-10 h-10 mb-4 rounded-full ring ring-white">
              <img
                src="https://images.unsplash.com/photo-1621994781204-42a295781499?ixid=MnwxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHw0MXx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60"
                alt="avatar"
              />
            </div>
          </div>
        </div>
        <div class="flex flex-row justify-between p-2 text-dark">
          <div
            class="flex flex-col items-center content-center self-start px-6 py-4 space-y-1 rounded-lg cursor-pointer bg-light-lighter"
          >
            <div>
              <Icons icon="trust" />
            </div>
            <div class="text-2xs">trust</div>
          </div>
          <div
            class="flex flex-col items-center content-center self-start px-6 py-4 space-y-1 rounded-lg cursor-pointer bg-light-lighter"
          >
            <div>
              <Icons icon="chat" />
            </div>
            <div class="text-2xs">chat</div>
          </div>
          <div
            class="flex flex-col items-center content-center self-start px-6 py-4 space-y-1 rounded-lg cursor-pointer bg-light-lighter"
          >
            <div>
              <Icons icon="sendmoney" />
            </div>
            <div class="text-2xs">Send money</div>
          </div>
        </div>
      </div>
      <pre>
      {JSON.stringify(context.data[context.field], null, 2)}
    </pre>
    </div>
  {/if}

  <ProcessNavigation on:buttonClick={submit} {context} />
</div>
