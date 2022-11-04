<script lang="ts">
export let item = undefined;
export let isFirst = false;
export let isHover = false;
export let getOptionLabel:(item:any) => string;

let itemClasses = "";

$: {
  const classes = [];

  // if (isActive) {
  //   classes.push("active border-primary");
  // } else {
  //   classes.push("border-light");
  // }
  classes.push("border-light");
  if (isFirst) {
    classes.push("first");
  }
  if (isHover) {
    classes.push("hover");
  }
  itemClasses = classes.join(" ");
}
</script>

<section class="flex mb-4 mr-1 items-center justify-center  border rounded-lg shadow-sm customItem  {itemClasses}">
  <div class="flex items-center w-full p-0 space-x-2 sm:space-x-6 item-body ">
    <div class="relative flex-grow p-3 text-left truncate">
      <div class="max-w-full -mt-1 leading-8 cursor-pointer truncateThis">
        {@html getOptionLabel(item)}
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

/* .customItem.active {
  @apply border;
  @apply border-primary;
}

.customItem.hover:not(.active) {
  @apply border;
  @apply border-primary;
} */

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
