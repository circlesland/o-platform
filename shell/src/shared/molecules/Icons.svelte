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
        stroke="#003399"
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
        stroke="#003399"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>`,
    home: `<svg class="navbuttonicon" viewBox="0 0 20 22" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M1 7.99988L10 0.999878L19 7.99988V18.9999C19 19.5303 18.7893 20.039 18.4142 20.4141C18.0391 20.7892 17.5304 20.9999 17 20.9999H3C2.46957 20.9999 1.96086 20.7892 1.58579 20.4141C1.21071 20.039 1 19.5303 1 18.9999V7.99988Z" stroke="#003399" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`,
    dash: `<svg
          class="navbuttonicon"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M8 1H1V8H8V1Z"
            stroke="#003399"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M19 1H12V8H19V1Z"
            stroke="#003399"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M19 12H12V19H19V12Z"
            stroke="#003399"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M8 12H1V19H8V12Z"
            stroke="#003399"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>`,
    back: `<svg class='navbuttonicon' viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M10.2921 6H0.853882M0.853882 6L5.57298 10.6666M0.853882 6L5.57298 1.33325" stroke="#003399" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`,
    skip: `<svg class='navbuttonicon' viewBox="0 0 16 12" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M8.42696 10.6667L14.4944 6L8.42696 1.33333V10.6667Z" stroke="#003399" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M1.01123 10.6667L7.07865 6L1.01123 1.33333V10.6667Z" stroke="#003399" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`,
    logout: `<svg class='w-5 h-5 m-auto' viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M9 25H3.66667C2.95942 25 2.28115 24.719 1.78105 24.219C1.28095 23.7189 1 23.0406 1 22.3333V3.66667C1 2.95942 1.28095 2.28115 1.78105 1.78105C2.28115 1.28095 2.95942 1 3.66667 1H9M18.3333 19.6667L25 13M25 13L18.3333 6.33333M25 13H9" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`,
    trust: `<svg class='w-5 h-5 m-auto' viewBox="0 0 23 21" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M20.5066 2.83363C19.9959 2.32263 19.3894 1.91727 18.722 1.64071C18.0545 1.36415 17.3391 1.2218 16.6166 1.2218C15.8941 1.2218 15.1787 1.36415 14.5113 1.64071C13.8438 1.91727 13.2374 2.32263 12.7266 2.83363L11.6666 3.89363L10.6066 2.83363C9.57493 1.80194 8.17566 1.22234 6.71662 1.22234C5.25759 1.22234 3.85832 1.80194 2.82662 2.83363C1.79493 3.86532 1.21533 5.26459 1.21533 6.72363C1.21533 8.18266 1.79493 9.58194 2.82662 10.6136L3.88662 11.6736L11.6666 19.4536L19.4466 11.6736L20.5066 10.6136C21.0176 10.1029 21.423 9.49644 21.6995 8.82898C21.9761 8.16152 22.1185 7.44611 22.1185 6.72363C22.1185 6.00114 21.9761 5.28573 21.6995 4.61827C21.423 3.95081 21.0176 3.34438 20.5066 2.83363V2.83363Z" stroke="#003399" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`,
    sendmoney: `<svg class='w-5 h-5 m-auto' viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M21 1.22363L10 12.2236M21 1.22363L14 21.2236L10 12.2236M21 1.22363L1 8.22363L10 12.2236" stroke="#003399" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`,
    createoffer: `<svg class='w-5 h-5 m-auto' viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M11 1.66663V20.3333M1.66669 11H20.3334" stroke="#081B4B" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`,
  };

  export let icon: string = null;

</script>

{#if icon}
  {@html icons[icon]}
{/if}
