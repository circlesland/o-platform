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

<section class="flex mb-2 items-centerjustify-center  text-circlesdarkblue">
  <div
    class="flex items-center p-3 pt-4 w-full bg-white shadow  space-x-2 sm:space-x-6 rounded-sm"
  >
    <div class="mr-2 text-center">
      <div class="avatar">
        <div class="rounded-full w-12 h-12 sm:w-12 sm:h-12 m-auto">
          <img
            src={item.avatarUrl ? item.avatarUrl : "/images/common/circles.png"}
            alt="username"
          />
        </div>
      </div>
    </div>

    <div class="text-left flex-grow truncate relative">
      <div class="max-w-full -mt-1 truncateThis cursor-pointer">
        <h2 class="text-2xl sm:text-3xl">
          {item.label}
        </h2>
      </div>
      <div class="text-left text-sm text-dark">
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
    height: 100px;
    line-height: 40px;
    padding: 0 16px;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  }

  .customItem:active {
    background: #b9daff;
  }

  .customItem.active {
    background: #007aff;
    color: #fff;
  }

  .customItem.first {
    border-radius: 4px 4px 0 0;
  }

  .customItem.hover:not(.active) {
    background: #e7f2ff;
  }

  .customItem_title {
    overflow: hidden;
    display: flex;
    flex-direction: column;
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
