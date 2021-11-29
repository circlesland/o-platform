<script>
export let item = undefined;
export const itemType = "profile";
export let isActive = false;
export let isFirst = false;
export let isHover = false;
console.log("item: ", item);
let itemClasses = "";

$: {
  let classes = [];

  if (isActive) {
    classes.push("active border-primary");
  } else {
    classes.push("border-light-lightest");
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
  class="flex mb-4 mr-1 items-center justify-center  border rounded-sm shadow-sm customItem  {itemClasses}">
  <div
    class="flex items-center w-full px-3 pt-1 space-x-2 sm:space-x-6 item-body ">
    <div class="text-center">
      <div class="inline-flex">
        <div class="w-10 h-10 m-auto rounded-full">
          <img
            class="rounded-full"
            src="{item.avatarUrl ? item.avatarUrl : '/images/market/city.png'}"
            alt="user-icon" />
        </div>
      </div>
    </div>

    <div class="relative flex-grow text-left truncate">
      <div class="max-w-full -mt-1 leading-8 cursor-pointer "
           class:text-dark-lightest={!item.id || item.id < 1}>
        {`${item.firstName} ${item.lastName ? item.lastName : ""}`}
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
