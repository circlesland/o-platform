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
<path d="M11 1.66663V20.3333M1.66669 11H20.3334" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
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
    profile: `<svg class='w-6 h-6 m-auto' viewBox="0 0 24 26" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M22.6667 25V22.3333C22.6667 20.9188 22.1048 19.5623 21.1046 18.5621C20.1044 17.5619 18.7478 17 17.3333 17H6.66668C5.25219 17 3.89563 17.5619 2.89544 18.5621C1.89525 19.5623 1.33334 20.9188 1.33334 22.3333V25" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M12 11.6667C14.9455 11.6667 17.3333 9.27885 17.3333 6.33333C17.3333 3.38781 14.9455 1 12 1C9.05449 1 6.66668 3.38781 6.66668 6.33333C6.66668 9.27885 9.05449 11.6667 12 11.6667Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`,
    accounts: `<svg class='w-6 h-6 m-auto' viewBox="0 0 32 26" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M22.6667 25V22.3333C22.6667 20.9188 22.1048 19.5623 21.1046 18.5621C20.1044 17.5619 18.7478 17 17.3333 17H6.66668C5.25219 17 3.89563 17.5619 2.89544 18.5621C1.89525 19.5623 1.33334 20.9188 1.33334 22.3333V25M30.6667 25V22.3333C30.6658 21.1516 30.2725 20.0037 29.5485 19.0698C28.8245 18.1358 27.8108 17.4688 26.6667 17.1733M21.3333 1.17333C22.4806 1.46707 23.4974 2.13427 24.2235 3.06975C24.9497 4.00523 25.3438 5.15577 25.3438 6.34C25.3438 7.52423 24.9497 8.67477 24.2235 9.61025C23.4974 10.5457 22.4806 11.2129 21.3333 11.5067M17.3333 6.33333C17.3333 9.27885 14.9455 11.6667 12 11.6667C9.05449 11.6667 6.66668 9.27885 6.66668 6.33333C6.66668 3.38781 9.05449 1 12 1C14.9455 1 17.3333 3.38781 17.3333 6.33333Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`,
    keys: `<svg class='w-6 h-6 m-auto' viewBox="0 0 29 28" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M26 1.66669L23.3333 4.33335M23.3333 4.33335L27.3333 8.33335L22.6667 13L18.6667 9.00002M23.3333 4.33335L18.6667 9.00002M13.1867 14.48C13.8751 15.1593 14.4224 15.9681 14.797 16.8597C15.1716 17.7514 15.3661 18.7084 15.3694 19.6755C15.3726 20.6427 15.1845 21.6009 14.8159 22.4951C14.4473 23.3892 13.9054 24.2017 13.2215 24.8855C12.5376 25.5694 11.7252 26.1113 10.8311 26.4799C9.93691 26.8485 8.97867 27.0366 8.01151 27.0334C7.04435 27.0301 6.08739 26.8356 5.19572 26.461C4.30405 26.0864 3.49529 25.5391 2.816 24.8507C1.48017 23.4676 0.741015 21.6152 0.757724 19.6924C0.774432 17.7696 1.54567 15.9303 2.90533 14.5707C4.26499 13.211 6.10428 12.4398 8.02706 12.4231C9.94983 12.4064 11.8023 13.1455 13.1853 14.4814L13.1867 14.48ZM13.1867 14.48L18.6667 9.00002" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`,
    settings: `<svg class='w-6 h-6 m-auto' viewBox="0 0 32 26" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M5.33334 25V15.6667M5.33334 10.3333V1M16 25V13M16 7.66667V1M26.6667 25V18.3333M26.6667 13V1M1.33334 15.6667H9.33334M12 7.66667H20M22.6667 18.3333H30.6667" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`,
    submitsmall: `<svg width="23" height="22" viewBox="0 0 23 22" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M11.5 15L15.5 11M15.5 11L11.5 7M15.5 11H7.5M21.5 11C21.5 16.5228 17.0228 21 11.5 21C5.97715 21 1.5 16.5228 1.5 11C1.5 5.47715 5.97715 1 11.5 1C17.0228 1 21.5 5.47715 21.5 11Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
`,
    dropdownclear: `<svg
  width="100%"
  height="100%"
  viewBox="-2 -2 50 50"
  focusable="false"
  role="presentation">
  <path fill="currentColor" d="M34.923,37.251L24,26.328L13.077,37.251L9.436,33.61l10.923-10.923L9.436,11.765l3.641-3.641L24,19.047L34.923,8.124l3.641,3.641L27.641,22.688L38.564,33.61L34.923,37.251z"/></svg>
`,
    chat: `<svg class='w-6 h-6 m-auto' viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M25 12.3334C25.0046 14.0932 24.5934 15.8292 23.8 17.4C22.8592 19.2824 21.413 20.8656 19.6233 21.9724C17.8335 23.0792 15.771 23.6659 13.6667 23.6667C11.9068 23.6713 10.1708 23.2601 8.6 22.4667L1 25L3.53333 17.4C2.73991 15.8292 2.32875 14.0932 2.33333 12.3334C2.33415 10.229 2.92082 8.16651 4.02763 6.37677C5.13444 4.58704 6.71767 3.14079 8.6 2.20004C10.1708 1.40661 11.9068 0.99545 13.6667 1.00004H14.3333C17.1125 1.15336 19.7374 2.32639 21.7055 4.29452C23.6737 6.26265 24.8467 8.88757 25 11.6667V12.3334Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`,
    forum: `<svg class='w-6 h-6 m-auto' viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M25 17C25 17.7072 24.719 18.3855 24.219 18.8856C23.7189 19.3857 23.0406 19.6667 22.3333 19.6667H6.33333L1 25V3.66667C1 2.95942 1.28095 2.28115 1.78105 1.78105C2.28115 1.28095 2.95942 1 3.66667 1H22.3333C23.0406 1 23.7189 1.28095 24.219 1.78105C24.719 2.28115 25 2.95942 25 3.66667V17Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`,
    blog: `<svg class='w-6 h-6 m-auto' viewBox="0 0 26 25" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M13 23.6667H25M19 1.66668C19.5304 1.13625 20.2499 0.838257 21 0.838257C21.3714 0.838257 21.7392 0.911416 22.0824 1.05356C22.4256 1.1957 22.7374 1.40404 23 1.66668C23.2626 1.92933 23.471 2.24113 23.6131 2.58429C23.7553 2.92745 23.8284 3.29525 23.8284 3.66668C23.8284 4.03812 23.7553 4.40592 23.6131 4.74908C23.471 5.09224 23.2626 5.40404 23 5.66668L6.33333 22.3333L1 23.6667L2.33333 18.3334L19 1.66668Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`,
    whitepaper: `<svg class='w-6 h-6 m-auto' viewBox="0 0 24 30" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M14.6666 1.66669H3.99998C3.29274 1.66669 2.61446 1.94764 2.11436 2.44774C1.61426 2.94783 1.33331 3.62611 1.33331 4.33335V25.6667C1.33331 26.3739 1.61426 27.0522 2.11436 27.5523C2.61446 28.0524 3.29274 28.3334 3.99998 28.3334H20C20.7072 28.3334 21.3855 28.0524 21.8856 27.5523C22.3857 27.0522 22.6666 26.3739 22.6666 25.6667V9.66669M14.6666 1.66669L22.6666 9.66669M14.6666 1.66669V9.66669H22.6666M17.3333 16.3334H6.66665M17.3333 21.6667H6.66665M9.33331 11H6.66665" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`,
  };

  export let icon: string = null;

</script>

{#if icon}
  {@html icons[icon]}
{/if}
