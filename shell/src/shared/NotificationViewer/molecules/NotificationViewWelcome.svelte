<script lang="ts">
  import { _ } from "svelte-i18n";
</script>

<div class="flex flex-col items-center space-y-4">
  <div
    class="flex flex-col items-center self-center w-full m-auto text-center justify-self-center ">

    <div class="mt-4 text-3xl font-heading">{$_("shared.molecules.notificationViewer.molecules.notificationViewWelcome.welcomeToCirclesLand")}</div>
    <div class="mt-1 text-sm text-dark-lightest">{$_("shared.molecules.notificationViewer.molecules.notificationViewWelcome.duSchoenerMensch")}</div>

    <div class="mt-4 text-2xl font-heading">{$_("dapps.o-passport.processes.upsertIdentity.editorContent.info.title")}</div>
    <div class="mt-1 text-sm text-dark-lightest">{$_("dapps.o-passport.processes.upsertIdentity.editorContent.info.description")}</div>

  </div>
</div>
