<script lang="ts">
  import TopNav from "src/shared/atoms/TopNav.svelte";

</script>

<TopNav />

<div
  class="flex flex-col items-stretch w-full text-white h-60 justify-items-stretch bg-primarydark"
>
  <div class="self-center block text-center">
    <div class="avatar">
      <div class="mb-4 rounded-full w-36 h-36">
        <!--<img
          src={avatarUrl}
          alt={profile
            ? profile.lastName
              ? `${profile.firstName} ${profile.lastName}`
              : profile.firstName
            : "avatar"}
        />-->
      </div>
    </div>
    <div class="">
      <h2>Marketplace</h2>
    </div>
  </div>
</div>
