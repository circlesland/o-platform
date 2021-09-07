<script lang="ts">
  import ItemCard from "../../../shared/atoms/ItemCard.svelte";
  import InfoCard from "../../../shared/atoms/InfoCard.svelte";
  import Icons from "../../../shared/molecules/Icons.svelte";
</script>

<section class="flex flex-col items-center justify-center p-6 space-y-4">
  <slot name="EditorSteps">
    <!-- <div>
      <NavSteps steps="{[0, 0, 0]}" />
    </div> -->
  </slot>
  <slot name="EditorTitle">
    <div class="w-full text-center">
      <h1 class="text-3xl uppercase font-heading">Invites</h1>
    </div>
  </slot>
  <slot name="EditorDescription">
    <div class="w-full text-center">
      <span class="text-dark-lightest">Hier wird was erklärt</span>
    </div>
  </slot>
  <div class="w-full">
    <slot name="EditorMainComponent">
      <div class="flex flex-col w-full space-y-4">
        <InfoCard
          params="{{ headerClass: 'bg-primary', headerText: 'invite 3 pending' }}">
          <div slot="infoCardContent" class="w-full p-2">
            <ItemCard
              params="{{ edgeless: true, inline: true, title: 'Jakob', subTitle: 'use button to send invite', truncateMain: true, noShadow: true }}">

              <div slot="itemCardEnd">
                <div class="self-end mr-2 text-lg sm:text-3xl">
                  <button
                    on:click="{e => {
                      console.log('ALKSDJASd');
                    }}"
                    class="self-end text-base btn btn-square btn-primary ">
                    <Icons icon="sendmoney" />
                  </button>
                </div>
              </div>
            </ItemCard>
          </div>
        </InfoCard>

        <InfoCard
          params="{{ headerText: 'invite 2 unlocked', headerClass: 'bg-success' }}">
          <div slot="infoCardContent" class="w-full p-2">
            <ItemCard
              params="{{ imageUrl: 'https://images.unsplash.com/photo-1630904519797-7e2992b13afe?ixid=MnwxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHw3NHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60', edgeless: true, inline: true, title: 'EMPOWERED ELA LOUIS', subTitle: '2 days ago', truncateMain: true, noShadow: true }}">

              <div slot="itemCardEnd">
                <div class="self-end mr-2 text-lg sm:text-3xl">
                  <button
                    on:click="{e => {
                      console.log('ALKSDJASd');
                    }}"
                    class="self-end text-base btn btn-square btn-primary ">
                    <Icons icon="sendmoney" />
                  </button>
                </div>
              </div>
            </ItemCard>
          </div>
        </InfoCard>

        <InfoCard
          params="{{ headerText: 'invite 1 unlocked', headerClass: 'bg-success' }}">
          <div slot="infoCardContent" class="w-full p-2">
            <ItemCard
              params="{{ imageUrl: 'https://images.unsplash.com/photo-1630644964646-6cc8ac5b47ea?ixid=MnwxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHw5NHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60', edgeless: true, inline: true, title: 'EMPOWERED Hans-Peter Jacobs', subTitle: '1 day ago', truncateMain: true, noShadow: true }}">

              <div slot="itemCardEnd"></div>
            </ItemCard>
          </div>
        </InfoCard>
      </div>

    </slot>
  </div>
  <!-- <slot name="EditorActionButtons">
    <div class="w-full">BUTTONS</div>
  </slot> -->
</section>
