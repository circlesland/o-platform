<script lang="ts">
  import TopNav from "src/shared/atoms/TopNav.svelte";
</script>

<TopNav />

<div
  class="h-60 flex flex-col w-full items-stretch justify-items-stretch  bg-gradient-to-r from-gradient1 to-gradient2 text-white"
>
  <div class="self-center text-center block">
    <div class="avatar">
      <div class="w-36 h-36 rounded-full mb-4">
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
      <h2>
        Marketplace
      </h2>
    </div>
  </div>
</div>
