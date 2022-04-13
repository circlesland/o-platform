<script lang="ts">
  import {_} from "svelte-i18n";
  import Label from "../../../shared/atoms/Label.svelte";


  export const citizens = [
    {
      name: "Martin Köppelmann",
      position: "1",
      country: "Germany",
      image:
        "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&amp;cs=tinysrgb&amp;dpr=3&amp;h=750&amp;w=750",
      dream: "poajsdhf öaksdfadf",
    }];
</script>

<div class="p-4 m-4 uppercase "><Label key="dapps.o-homepage.components.citizenCards.mostRecentCitizen" /></div>
<div class="pt-6 pb-12 m-auto mt-6 text-center">
  <a
    href="/#/citizens"
    aria-label="
    "
    class="text-xl font-semibold transition-colors duration-200 text-primary hover:">
    <Label key="dapps.o-homepage.components.citizenCards.showMoreCitizen" />
    <svg class="inline-block w-3 ml-2" fill="currentColor" viewBox="0 0 12 12">
      <path
        d="M9.707,5.293l-5-5A1,1,0,0,0,3.293,1.707L7.586,6,3.293,10.293a1,1,0,1,0,1.414,1.414l5-5A1,1,0,0,0,9.707,5.293Z"></path>
    </svg>
  </a>
</div>
{#each citizens as c}
  <div class="p-4 m-4 bg-white rounded-lg">
    <div class="flex flex-row">
      <div class="inline-flex">
        <div class="w-16 h-16 rounded-full ">
          <img class="rounded-full" src="{c.image}" alt=" " />
        </div>
      </div>

      <div class="flex flex-col py-2 ml-4">
        <p class="text-lg font-semibold ">{c.name}</p>
        <p class="text-sm text-left text-primary">
          <Label key="dapps.o-homepage.components.citizenCards.citizen")} /> {c.position} <Label key="dapps.o-homepage.components.citizenCards.from")} /> {c.country}
        </p>
      </div>
    </div>
    <div class="pt-2 text-sm text-gray-500 ">
      <Label key="dapps.o-homepage.components.citizenCards.passion1")} /> {c.dream} <Label key="dapps.o-homepage.components.citizenCards.passion2")} />
    </div>
  </div>
{/each}
<div class="pt-6 pb-12 m-auto mt-6 text-center">
  <a
    href="/#/citizens"
    aria-label="
    "
    class="flex items-center w-full py-12 mx-auto mt-6 text-xl font-semibold text-center transition-colors duration-200 text-primary hover:">
    <Label key="dapps.o-homepage.components.citizenCards.showMoreCitizen" />
    <svg class="inline-block w-3 ml-2" fill="currentColor" viewBox="0 0 12 12">
      <path
        d="M9.707,5.293l-5-5A1,1,0,0,0,3.293,1.707L7.586,6,3.293,10.293a1,1,0,1,0,1.414,1.414l5-5A1,1,0,0,0,9.707,5.293Z"></path>
    </svg>
  </a>
</div>
