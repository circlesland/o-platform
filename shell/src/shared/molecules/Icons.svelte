<script lang="ts">
  const icons = {
    filter: `<svg
      class="navbuttonicon"
      viewBox="0 0 24 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M4 19V12M4 8V1M12 19V10M12 6V1M20 19V14M20 10V1M1 12H7M9 6H15M17 14H23"
        stroke="currentColor"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>`,
    list: `<svg
      class="navbuttonicon"
      viewBox="0 0 20 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M1 7H19M1 1H19M1 13H19"
        stroke="currentColor"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>`,
    home: `<svg class="navbuttonicon" viewBox="0 0 20 22" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M1 7.99988L10 0.999878L19 7.99988V18.9999C19 19.5303 18.7893 20.039 18.4142 20.4141C18.0391 20.7892 17.5304 20.9999 17 20.9999H3C2.46957 20.9999 1.96086 20.7892 1.58579 20.4141C1.21071 20.039 1 19.5303 1 18.9999V7.99988Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`,
    dash: `<svg
          class="navbuttonicon"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M8 1H1V8H8V1Z"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M19 1H12V8H19V1Z"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M19 12H12V19H19V12Z"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M8 12H1V19H8V12Z"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>`,
    back: `<svg class='navbuttonicon' viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M10.2921 6H0.853882M0.853882 6L5.57298 10.6666M0.853882 6L5.57298 1.33325" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`,
    skip: `<svg class='navbuttonicon' viewBox="0 0 16 12" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M8.42696 10.6667L14.4944 6L8.42696 1.33333V10.6667Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M1.01123 10.6667L7.07865 6L1.01123 1.33333V10.6667Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`,
    logout: `<svg class='w-5 h-5 m-auto' viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M9 25H3.66667C2.95942 25 2.28115 24.719 1.78105 24.219C1.28095 23.7189 1 23.0406 1 22.3333V3.66667C1 2.95942 1.28095 2.28115 1.78105 1.78105C2.28115 1.28095 2.95942 1 3.66667 1H9M18.3333 19.6667L25 13M25 13L18.3333 6.33333M25 13H9" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`,
    trust: `<svg class='w-5 h-5 m-auto' viewBox="0 0 23 21" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M20.5066 2.83363C19.9959 2.32263 19.3894 1.91727 18.722 1.64071C18.0545 1.36415 17.3391 1.2218 16.6166 1.2218C15.8941 1.2218 15.1787 1.36415 14.5113 1.64071C13.8438 1.91727 13.2374 2.32263 12.7266 2.83363L11.6666 3.89363L10.6066 2.83363C9.57493 1.80194 8.17566 1.22234 6.71662 1.22234C5.25759 1.22234 3.85832 1.80194 2.82662 2.83363C1.79493 3.86532 1.21533 5.26459 1.21533 6.72363C1.21533 8.18266 1.79493 9.58194 2.82662 10.6136L3.88662 11.6736L11.6666 19.4536L19.4466 11.6736L20.5066 10.6136C21.0176 10.1029 21.423 9.49644 21.6995 8.82898C21.9761 8.16152 22.1185 7.44611 22.1185 6.72363C22.1185 6.00114 21.9761 5.28573 21.6995 4.61827C21.423 3.95081 21.0176 3.34438 20.5066 2.83363V2.83363Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`,
    sendmoney: `<svg class='w-5 h-5 m-auto' viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M21 1.22363L10 12.2236M21 1.22363L14 21.2236L10 12.2236M21 1.22363L1 8.22363L10 12.2236" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`,
    createoffer: `<svg class='w-5 h-5 m-auto' viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M11 1.66663V20.3333M1.66669 11H20.3334" stroke="#081B4B" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`,
    network: `<svg class='w-6 h-6 m-auto' viewBox="0 0 26 30" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M8.45333 17.0133L17.56 22.32M17.5467 7.67996L8.45333 12.9866M25 5.66663C25 7.87577 23.2091 9.66663 21 9.66663C18.7909 9.66663 17 7.87577 17 5.66663C17 3.45749 18.7909 1.66663 21 1.66663C23.2091 1.66663 25 3.45749 25 5.66663ZM9 15C9 17.2091 7.20914 19 5 19C2.79086 19 1 17.2091 1 15C1 12.7908 2.79086 11 5 11C7.20914 11 9 12.7908 9 15ZM25 24.3333C25 26.5424 23.2091 28.3333 21 28.3333C18.7909 28.3333 17 26.5424 17 24.3333C17 22.1242 18.7909 20.3333 21 20.3333C23.2091 20.3333 25 22.1242 25 24.3333Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`,
    assets: `<svg class='w-6 h-6 m-auto'  viewBox="0 0 20 23" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M19 4.40405C19 6.06091 14.9706 7.40405 10 7.40405C5.02944 7.40405 1 6.06091 1 4.40405M19 4.40405C19 2.7472 14.9706 1.40405 10 1.40405C5.02944 1.40405 1 2.7472 1 4.40405M19 4.40405V18.4041C19 20.0641 15 21.4041 10 21.4041C5 21.4041 1 20.0641 1 18.4041V4.40405M19 11.4041C19 13.0641 15 14.4041 10 14.4041C5 14.4041 1 13.0641 1 11.4041" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`,
    trusts: `<svg class='w-6 h-6 m-auto'  viewBox="0 0 24 21" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M17 19.4041V17.4041C17 16.3432 16.5786 15.3258 15.8284 14.5756C15.0783 13.8255 14.0609 13.4041 13 13.4041H5C3.93913 13.4041 2.92172 13.8255 2.17157 14.5756C1.42143 15.3258 1 16.3432 1 17.4041V19.4041M23 19.4041V17.4041C22.9993 16.5178 22.7044 15.6568 22.1614 14.9564C21.6184 14.2559 20.8581 13.7556 20 13.5341M16 1.53405C16.8604 1.75435 17.623 2.25475 18.1676 2.95636C18.7122 3.65797 19.0078 4.52088 19.0078 5.40905C19.0078 6.29722 18.7122 7.16013 18.1676 7.86174C17.623 8.56335 16.8604 9.06375 16 9.28405M13 5.40405C13 7.61319 11.2091 9.40405 9 9.40405C6.79086 9.40405 5 7.61319 5 5.40405C5 3.19491 6.79086 1.40405 9 1.40405C11.2091 1.40405 13 3.19491 13 5.40405Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`,
    transactions: `<svg class='w-6 h-6 m-auto'  viewBox="0 0 20 25" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M15 1.40405L19 5.40405M19 5.40405L15 9.40405M19 5.40405H5C3.93913 5.40405 2.92172 5.82548 2.17157 6.57563C1.42143 7.32577 1 8.34319 1 9.40405V11.4041M5 23.4041L1 19.4041M1 19.4041L5 15.4041M1 19.4041H15C16.0609 19.4041 17.0783 18.9826 17.8284 18.2325C18.5786 17.4823 19 16.4649 19 15.4041V13.4041" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`,
    profile: `<svg width="24" height="26" viewBox="0 0 24 26" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M22.6667 25V22.3333C22.6667 20.9188 22.1048 19.5623 21.1046 18.5621C20.1044 17.5619 18.7478 17 17.3333 17H6.66668C5.25219 17 3.89563 17.5619 2.89544 18.5621C1.89525 19.5623 1.33334 20.9188 1.33334 22.3333V25" stroke="#081B4B" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M12 11.6667C14.9455 11.6667 17.3333 9.27885 17.3333 6.33333C17.3333 3.38781 14.9455 1 12 1C9.05449 1 6.66668 3.38781 6.66668 6.33333C6.66668 9.27885 9.05449 11.6667 12 11.6667Z" stroke="#081B4B" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`,
  };

  export let icon: string = null;

</script>

{#if icon}
  {@html icons[icon]}
{/if}
