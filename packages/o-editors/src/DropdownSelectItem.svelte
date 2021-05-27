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
  class="flex mb-2 items-centerjustify-center text-circlesdarkblue customItem {itemClasses}"
>
  <div
    class="flex items-center w-full p-3 pt-4 space-x-2 bg-white border rounded-sm shadow-md sm:space-x-6 item-body"
  >
    <div class="mr-2 text-center">
      <div class="avatar">
        <div class="w-12 h-12 m-auto rounded-full sm:w-12 sm:h-12">
          <img
            src={item.avatarUrl ? item.avatarUrl : "/images/common/circles.png"}
            alt="user-icon"
          />
        </div>
      </div>
    </div>

    <div class="relative flex-grow text-left truncate">
      <div class="max-w-full -mt-1 cursor-pointer truncateThis">
        <h2 class="text-2xl sm:text-3xl">
          {item.label}
        </h2>
      </div>
      <div class="text-sm text-left text-dark">
        {item.value}
      </div>
    </div>
  </div>
</section>

<style>
  .customItem {
    display: flex;
    align-items: center;
    cursor: default;
    padding: 0 4px;
    overflow: hidden;
  }

  .customItem:active {
    background: #0ad99c;
  }

  .customItem.active {
    background: #0ad99c;
  }

  .customItem.hover:not(.active) {
    background: #0ad99c;
  }
  .customItem.hover:not(.active) .item-body {
    background: #ccc;
  }

  .customItem.hover:not(.active) .item-body .truncateThis:before {
    background: linear-gradient(
      to right,
      rgba(255, 255, 255, 0.001) 80%,
      #ccc 100%
    );

    /* background: #ffcc33; */
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
