<script lang="ts">
  const milestones = [
    {
      goal: "1",
      citizens: "Start",
      success: true,
      active: false,
      date: "12. mai",
    },
    {
      goal: "2",
      citizens: "1",
      success: true,
      active: false,
      date: "12. mai",
    },
    {
      goal: "3",
      citizens: "2",
      success: true,
      active: false,
      date: "12. mai",
    },
    {
      goal: "4",
      citizens: "3",
      success: true,
      active: false,
      date: "12. mai",
    },
    {
      goal: "5",
      citizens: "5",
      success: true,
      active: false,
      date: "12. mai",
    },
    {
      goal: "6",
      citizens: "8",
      success: true,
      active: false,
      date: "12. mai",
    },
    {
      goal: "7",
      citizens: "13",
      success: true,
      active: false,
      date: "12. mai",
    },
    {
      goal: "8",
      citizens: "21",
      success: true,
      active: false,
    },
    {
      goal: "9",
      citizens: "34",
      success: true,
      active: false,
      date: "12. mai",
    },
    {
      goal: "10",
      citizens: "55",
      success: true,
      active: false,
      date: "12. mai",
    },
    {
      goal: "11",
      citizens: "89",
      success: true,
      active: false,
      date: "12. mai",
    },
    {
      goal: "12",
      citizens: "144",
      success: true,
      active: false,
      date: "13. mai",
    },
    {
      goal: "13",
      citizens: "233",
      success: false,
      active: true,
      date: "14. mai",
    },
    {
      goal: "14",
      citizens: "377",
      success: false,
      active: false,
      date: "15. mai",
    },
    {
      goal: "15",
      citizens: "610",
      success: false,
      date: "16. mai",
    },
    {
      goal: "16",
      citizens: "987",
      success: false,
      active: false,
    },
    {
      goal: "17",
      citizens: "1597",
      success: false,
      active: false,
    },
    {
      goal: "18",
      citizens: "2584",
      success: false,
      active: false,
    },
    {
      goal: "19",
      citizens: "4181",
      success: false,
      active: false,
    },
    {
      goal: "20",
      citizens: "6765",
      success: false,
      active: false,
    },
    {
      goal: "21",
      citizens: "10.946",
      success: false,
      active: false,
    },
  ];

</script>

<div class="grid max-w-5xl grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mx-auto">
  {#each milestones as m}
    <div class="p-4 m-4 mb-8 bg-white rounded-lg">
      <div class="flex flex-row">
        {#if m.success}
          <div class="avatar ">
            <div class="rounded-full w-16 h-16 bg-primary">
              <div
                class="pt-4 mx-auto text-2xl font-bold text-white text-center"
              >
                {m.goal}
              </div>
            </div>
          </div>

          <div class="flex flex-col py-2 ml-4">
            <span class="text-lg font-semibold  text-primary">
              {m.citizens}
            </span>
            <p class="text-sm text-left text-primary">
              citizen {#if m.success}reached on {m.date}{/if}
            </p>
          </div>
        {:else if m.active}
          <div class="avatar ">
            <div class="rounded-full w-16 h-16 bg-secondary">
              <div
                class="pt-4 mx-auto text-2xl font-bold text-white text-center"
              >
                {m.goal}
              </div>
            </div>
          </div>

          <div class="flex flex-col py-2 ml-4">
            <p class="text-lg font-semibold  ">
              {m.citizens}
            </p>
            <p class="text-sm text-left ">citizen to reach milestone</p>
          </div>
        {:else}
          <div class="avatar ">
            <div class="rounded-full w-16 h-16 bg-gray-200 ">
              <div
                class="pt-4 mx-auto text-2xl font-bold text-gray-500  text-center"
              >
                {m.goal}
              </div>
            </div>
          </div>

          <div class="flex flex-col py-2 ml-4">
            <p class="text-lg font-semibold text-gray-500 ">
              {m.citizens}
            </p>
            <p class="text-sm text-left text-gray-500">
              citizen to reach milestone
            </p>
          </div>
        {/if}
      </div>
    </div>
  {/each}
</div>

<div class="pb-12 pt-6 m-auto mt-6 text-center">
  <a
    href="/#/milestones"
    aria-label=""
    class="text-xl font-semibold transition-colors duration-200 text-primary hover:"
  >
    Show all milestones
    <svg class="inline-block w-3 ml-2" fill="currentColor" viewBox="0 0 12 12">
      <path
        d="M9.707,5.293l-5-5A1,1,0,0,0,3.293,1.707L7.586,6,3.293,10.293a1,1,0,1,0,1.414,1.414l5-5A1,1,0,0,0,9.707,5.293Z"
      />
    </svg>
  </a>
</div>
