<script>
  export let item = undefined;
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
            alt="user-icon"
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
