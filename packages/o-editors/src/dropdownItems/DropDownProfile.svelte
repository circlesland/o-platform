<script>
  export let item = undefined;
  export let isActive = false;
  export let isFirst = false;
  export let isHover = false;

  let itemClasses = "";

  $: {
    const classes = [];

    if (isActive) {
      classes.push("active");
    }
    if (isFirst) {
      classes.push("first");
    }
    if (isHover) {
      classes.push("hover");
    }
    itemClasses = classes.join(" ");
  }

</script>

<section
  class="flex mb-2 mr-1 items-center justify-center text-circlesdarkblue border rounded-sm border-lightgrey shadow-sm customItem  {itemClasses}"
>
  <div
    class="flex items-center w-full px-3 pt-1 space-x-2 sm:space-x-6 item-body "
  >
    <div class="mr-2 text-center">
      <div class="avatar">
        <div class="w-10 h-10 m-auto rounded-full sm:w-12 sm:h-12">
          <img
            src={item.avatarUrl ? item.avatarUrl : "/images/market/city.png"}
            alt="user-icon"
          />
        </div>
      </div>
    </div>

    <div class="relative flex-grow text-left truncate">
      <div class="max-w-full -mt-1 cursor-pointer truncateThis">
        <h2 class="text-2xl sm:text-3xl">
          {`${item.firstName} ${item.lastName ? item.lastName : ""}`}
        </h2>
      </div>
    </div>
  </div>
</section>

<style>
  .customItem {
    display: flex;
    align-items: center;
    cursor: default;
    padding: 0;
    overflow: hidden;
    @apply bg-white;
  }

  .customItem.active {
    @apply border;
    @apply border-primary;
  }

  .customItem.hover:not(.active) {
    @apply border;
    @apply border-primary;
  }

  .customItem_title {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .customItem_name {
    display: inline-block;
    font-weight: 700;
    margin-right: 10px;
  }

  .customItem_tagline {
    display: inline-block;
  }

</style>
