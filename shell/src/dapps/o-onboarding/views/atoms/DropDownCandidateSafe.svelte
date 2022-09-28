<script lang="ts">
import { SafeInfo } from "../../../../shared/api/data/types";

export let item: SafeInfo = undefined;
export let isActive = false;
export let isFirst = false;
export let isHover = false;

let itemClasses = "";
let displayName = "";
$: {
  const classes = [];

  if (item.safeProfile) {
    displayName = item.safeProfile.displayName;
  } else {
    displayName = item.safeAddress;
  }

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
  class="flex mb-4 mr-1 items-center justify-center  border rounded-lg shadow-sm customItem bg-white {itemClasses} active:border active:border-primary hover:border hover:border-primary">
  <div class="flex items-center w-full p-0 space-x-2 sm:space-x-6 item-body ">
    <div class="relative flex-grow p-3 text-left truncate">
      <div class="max-w-full -mt-1 leading-8 cursor-pointer truncateThis">
        {`${displayName}`}
      </div>
      <div class="text-xs text-left text-dark-lightest">
        {item.safeAddress}
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
