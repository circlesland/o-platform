<script lang="ts">
import { push } from "svelte-spa-router";

export let inviteCode: string;

if (inviteCode) {
  localStorage.setItem("circlesInvite", inviteCode);
}

push("/");
</script>
