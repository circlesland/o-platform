<script lang="ts">
import QrCode from "../../../shared/molecules/QrCode/QrCode.svelte";
import Icon from "@krowten/svelte-heroicons/Icon.svelte";
import Icons from "../../../shared/molecules/Icons.svelte";
import CopyToClipboard from "../../../shared/atoms/CopyClipboard.svelte";

export let inviteUrl: string = "https://circles.land/invites/Thorsten";
</script>

<section class="flex flex-col items-center justify-center p-6 space-y-4">
  <div class="w-full text-center">
    <h1 class="text-3xl uppercase font-heading undefined">Share an invite to circlesland</h1>
  </div>
  <div class="w-full text-center">
    <span class="text-dark-lightest">Show this QR Code or choose a way to share an invite link below</span>
  </div>
  <div class="w-full">
    <center>
      <QrCode value="{inviteUrl}" size="{300}" />
    </center>
  </div>
  <hr />
  <div class="flex flex-row justify-around w-full space-x-4">
    <div class="w-12 h-12 text-center align-top list-none cursor-pointer copylink inline-table">
      <span class="inline table-cell w-12 h-12 align-middle rounded-full bg-light-light">
        <CopyToClipboard text="{inviteUrl}" let:copy>
          <div on:click="{copy}">
            <Icon name="link" class="inline w-6 h-6 heroicon smallicon" />
          </div>
        </CopyToClipboard>
      </span>
    </div>
    <div class="w-12 h-12 text-center align-top list-none cursor-pointer copylink inline-table">
      <span class="inline table-cell w-12 h-12 align-middle rounded-full bg-light-light">
        <a
          href="mailto:?subject=Invitation%20to%20Circlesland&body=Hey, i'd like to invite you to circlesland. Check it out: {inviteUrl}"
          target="_blank">
          <Icon name="mail" class="inline w-6 h-6 heroicon smallicon" />
        </a>
      </span>
    </div>
    <div class="-mt-1 text-center align-top list-none cursor-pointer whatsapp inline-table">
      <a
        href="whatsapp://send?text=Hey, i'd like to invite you to circlesland. Check it out: {inviteUrl}"
        target="_blank">
        <Icons icon="whatsapp" customClass="inline" size="{14}" />
      </a>
    </div>
    <div class="text-center align-top list-none cursor-pointer telegram inline-table">
      <a
        href="https://telegram.me/share/url?url={inviteUrl}&text=Hey, i'd like to invite you to circlesland. Check it out!"
        target="_blank">
        <Icons icon="telegram" customClass="inline" size="{11}" />
      </a>
    </div>
  </div>
</section>
