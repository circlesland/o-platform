<script>
  export let item = undefined;
</script>

<div class="flex flex-row p-2">
  <div class="mr-2 text-left">
    <img src="/logos/{item.value}.svg" alt="xdai" class="w-6 h-6" />
  </div>

  <div class="text-left flex-grow truncate relative">
    {item.label}
  </div>
</div>
