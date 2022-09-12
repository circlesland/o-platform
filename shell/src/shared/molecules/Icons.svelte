<script lang="ts">
export let size: number = 6;
export let customClass: string = "";
import Icon from "@krowten/svelte-heroicons/Icon.svelte";

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
  listopen: `<svg
      class="navbuttonicon"
      style="transform: rotate(90deg);"
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
  more: `

<svg class='w-${size} h-${size} ${customClass}' viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M15.4167 16.1666C15.8309 16.1666 16.1667 15.8308 16.1667 15.4166C16.1667 15.0024 15.8309 14.6666 15.4167 14.6666C15.0025 14.6666 14.6667 15.0024 14.6667 15.4166C14.6667 15.8308 15.0025 16.1666 15.4167 16.1666Z" fill="currentColor"/>
<path d="M24.75 16.1666C25.1642 16.1666 25.5 15.8308 25.5 15.4166C25.5 15.0024 25.1642 14.6666 24.75 14.6666C24.3358 14.6666 24 15.0024 24 15.4166C24 15.8308 24.3358 16.1666 24.75 16.1666Z" fill="currentColor"/>
<path d="M6.08333 16.1666C6.49755 16.1666 6.83333 15.8308 6.83333 15.4166C6.83333 15.0024 6.49755 14.6666 6.08333 14.6666C5.66912 14.6666 5.33333 15.0024 5.33333 15.4166C5.33333 15.8308 5.66912 16.1666 6.08333 16.1666Z" fill="currentColor"/>
<path d="M15.4167 16.1666C15.8309 16.1666 16.1667 15.8308 16.1667 15.4166C16.1667 15.0024 15.8309 14.6666 15.4167 14.6666C15.0025 14.6666 14.6667 15.0024 14.6667 15.4166C14.6667 15.8308 15.0025 16.1666 15.4167 16.1666Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M24.75 16.1666C25.1642 16.1666 25.5 15.8308 25.5 15.4166C25.5 15.0024 25.1642 14.6666 24.75 14.6666C24.3358 14.6666 24 15.0024 24 15.4166C24 15.8308 24.3358 16.1666 24.75 16.1666Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M6.08333 16.1666C6.49755 16.1666 6.83333 15.8308 6.83333 15.4166C6.83333 15.0024 6.49755 14.6666 6.08333 14.6666C5.66912 14.6666 5.33333 15.0024 5.33333 15.4166C5.33333 15.8308 5.66912 16.1666 6.08333 16.1666Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</svg>

    `,
  morevertical: `

<svg class='w-${size} h-${size} ${customClass}' viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M16.5001 15.9167C16.5001 15.5025 16.1643 15.1667 15.7501 15.1667C15.3359 15.1667 15.0001 15.5025 15.0001 15.9167C15.0001 16.3309 15.3359 16.6667 15.7501 16.6667C16.1643 16.6667 16.5001 16.3309 16.5001 15.9167Z" fill="currentColor"/>
<path d="M16.5001 6.58333C16.5001 6.16912 16.1643 5.83333 15.7501 5.83333C15.3359 5.83333 15.0001 6.16912 15.0001 6.58333C15.0001 6.99755 15.3359 7.33333 15.7501 7.33333C16.1643 7.33333 16.5001 6.99755 16.5001 6.58333Z" fill="currentColor"/>
<path d="M16.5001 25.25C16.5001 24.8358 16.1643 24.5 15.7501 24.5C15.3359 24.5 15.0001 24.8358 15.0001 25.25C15.0001 25.6642 15.3359 26 15.7501 26C16.1643 26 16.5001 25.6642 16.5001 25.25Z" fill="currentColor"/>
<path d="M16.5001 15.9167C16.5001 15.5025 16.1643 15.1667 15.7501 15.1667C15.3359 15.1667 15.0001 15.5025 15.0001 15.9167C15.0001 16.3309 15.3359 16.6667 15.7501 16.6667C16.1643 16.6667 16.5001 16.3309 16.5001 15.9167Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M16.5001 6.58333C16.5001 6.16912 16.1643 5.83333 15.7501 5.83333C15.3359 5.83333 15.0001 6.16912 15.0001 6.58333C15.0001 6.99755 15.3359 7.33333 15.7501 7.33333C16.1643 7.33333 16.5001 6.99755 16.5001 6.58333Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M16.5001 25.25C16.5001 24.8358 16.1643 24.5 15.7501 24.5C15.3359 24.5 15.0001 24.8358 15.0001 25.25C15.0001 25.6642 15.3359 26 15.7501 26C16.1643 26 16.5001 25.6642 16.5001 25.25Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</svg>

    `,
  home: `
  <svg class="navbuttonicon ${customClass}" stroke-width="1.5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M12.4 17H11.6C11.2686 17 11 16.7314 11 16.4V14.6C11 14.2686 11.2686 14 11.6 14H12.4C12.7314 14 13 14.2686 13 14.6V16.4C13 16.7314 12.7314 17 12.4 17Z" fill="currentColor" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M3 9.5L12 4L21 9.5" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M19 13V19.4C19 19.7314 18.7314 20 18.4 20H5.6C5.26863 20 5 19.7314 5 19.4V13" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
`,
  dash: `<svg
          class="navbuttonicon ${customClass}"
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
  cancel: `
        <svg class='w-${size} h-${size} ${customClass} ' stroke-width="1.5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M6.75827 17.2426L12.0009 12M17.2435 6.75736L12.0009 12M12.0009 12L6.75827 6.75736M12.0009 12L17.2435 17.2426" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/>
</svg>

        `,
  back: `<svg class='navbuttonicon' viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M10.2921 6H0.853882M0.853882 6L5.57298 10.6666M0.853882 6L5.57298 1.33325" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`,
  skip: `<svg class='navbuttonicon' viewBox="0 0 16 12" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M8.42696 10.6667L14.4944 6L8.42696 1.33333V10.6667Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M1.01123 10.6667L7.07865 6L1.01123 1.33333V10.6667Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`,
  logout: `
  <svg class='w-${size} h-${size} ${customClass}' stroke-width="1.5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M16 12H17.4C17.7314 12 18 12.2686 18 12.6V19.4C18 19.7314 17.7314 20 17.4 20H6.6C6.26863 20 6 19.7314 6 19.4V12.6C6 12.2686 6.26863 12 6.6 12H8M16 12V8C16 6.66667 15.2 4 12 4C8.8 4 8 6.66667 8 8V12M16 12H8" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
`,
  trust: `<svg class='w-${size} h-${size} ${customClass}' viewBox="0 0 23 21" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M20.5066 2.83363C19.9959 2.32263 19.3894 1.91727 18.722 1.64071C18.0545 1.36415 17.3391 1.2218 16.6166 1.2218C15.8941 1.2218 15.1787 1.36415 14.5113 1.64071C13.8438 1.91727 13.2374 2.32263 12.7266 2.83363L11.6666 3.89363L10.6066 2.83363C9.57493 1.80194 8.17566 1.22234 6.71662 1.22234C5.25759 1.22234 3.85832 1.80194 2.82662 2.83363C1.79493 3.86532 1.21533 5.26459 1.21533 6.72363C1.21533 8.18266 1.79493 9.58194 2.82662 10.6136L3.88662 11.6736L11.6666 19.4536L19.4466 11.6736L20.5066 10.6136C21.0176 10.1029 21.423 9.49644 21.6995 8.82898C21.9761 8.16152 22.1185 7.44611 22.1185 6.72363C22.1185 6.00114 21.9761 5.28573 21.6995 4.61827C21.423 3.95081 21.0176 3.34438 20.5066 2.83363V2.83363Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`,
  untrust: `<svg class='w-${size} h-${size} ${customClass}' viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M19.69 14C19.8911 13.3522 19.9955 12.6783 20 12V5L12 2L8.84 3.18M4.73 4.73L4 5V12C4 18 12 22 12 22C14.117 20.8829 16.0197 19.4001 17.62 17.62M1 1L23 23" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
`,
  sendmoney: `<svg class='w-${size} h-${size} ${customClass}' viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M21 1.22363L10 12.2236M21 1.22363L14 21.2236L10 12.2236M21 1.22363L1 8.22363L10 12.2236" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`,
  add: `<svg class='w-${size} h-${size} ${customClass}' viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M11 1.66663V20.3333M1.66669 11H20.3334" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`,
  network: `<svg class='w-${size} h-${size} ${customClass}' viewBox="0 0 26 30" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M8.45333 17.0133L17.56 22.32M17.5467 7.67996L8.45333 12.9866M25 5.66663C25 7.87577 23.2091 9.66663 21 9.66663C18.7909 9.66663 17 7.87577 17 5.66663C17 3.45749 18.7909 1.66663 21 1.66663C23.2091 1.66663 25 3.45749 25 5.66663ZM9 15C9 17.2091 7.20914 19 5 19C2.79086 19 1 17.2091 1 15C1 12.7908 2.79086 11 5 11C7.20914 11 9 12.7908 9 15ZM25 24.3333C25 26.5424 23.2091 28.3333 21 28.3333C18.7909 28.3333 17 26.5424 17 24.3333C17 22.1242 18.7909 20.3333 21 20.3333C23.2091 20.3333 25 22.1242 25 24.3333Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`,
  networkmedium: `<svg class='w-8 ${customClass}' viewBox="0 0 26 30" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M8.45333 17.0133L17.56 22.32M17.5467 7.67996L8.45333 12.9866M25 5.66663C25 7.87577 23.2091 9.66663 21 9.66663C18.7909 9.66663 17 7.87577 17 5.66663C17 3.45749 18.7909 1.66663 21 1.66663C23.2091 1.66663 25 3.45749 25 5.66663ZM9 15C9 17.2091 7.20914 19 5 19C2.79086 19 1 17.2091 1 15C1 12.7908 2.79086 11 5 11C7.20914 11 9 12.7908 9 15ZM25 24.3333C25 26.5424 23.2091 28.3333 21 28.3333C18.7909 28.3333 17 26.5424 17 24.3333C17 22.1242 18.7909 20.3333 21 20.3333C23.2091 20.3333 25 22.1242 25 24.3333Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`,
  assets: `<svg class='w-${size} h-${size} ${customClass}'  viewBox="0 0 20 23" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M19 4.40405C19 6.06091 14.9706 7.40405 10 7.40405C5.02944 7.40405 1 6.06091 1 4.40405M19 4.40405C19 2.7472 14.9706 1.40405 10 1.40405C5.02944 1.40405 1 2.7472 1 4.40405M19 4.40405V18.4041C19 20.0641 15 21.4041 10 21.4041C5 21.4041 1 20.0641 1 18.4041V4.40405M19 11.4041C19 13.0641 15 14.4041 10 14.4041C5 14.4041 1 13.0641 1 11.4041" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`,
  trusts: `<svg class='w-${size} h-${size} ${customClass}'  viewBox="0 0 24 21" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M17 19.4041V17.4041C17 16.3432 16.5786 15.3258 15.8284 14.5756C15.0783 13.8255 14.0609 13.4041 13 13.4041H5C3.93913 13.4041 2.92172 13.8255 2.17157 14.5756C1.42143 15.3258 1 16.3432 1 17.4041V19.4041M23 19.4041V17.4041C22.9993 16.5178 22.7044 15.6568 22.1614 14.9564C21.6184 14.2559 20.8581 13.7556 20 13.5341M16 1.53405C16.8604 1.75435 17.623 2.25475 18.1676 2.95636C18.7122 3.65797 19.0078 4.52088 19.0078 5.40905C19.0078 6.29722 18.7122 7.16013 18.1676 7.86174C17.623 8.56335 16.8604 9.06375 16 9.28405M13 5.40405C13 7.61319 11.2091 9.40405 9 9.40405C6.79086 9.40405 5 7.61319 5 5.40405C5 3.19491 6.79086 1.40405 9 1.40405C11.2091 1.40405 13 3.19491 13 5.40405Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`,

  transactions: `<svg class='w-${size} h-${size} ${customClass}'  viewBox="0 0 20 25" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M15 1.40405L19 5.40405M19 5.40405L15 9.40405M19 5.40405H5C3.93913 5.40405 2.92172 5.82548 2.17157 6.57563C1.42143 7.32577 1 8.34319 1 9.40405V11.4041M5 23.4041L1 19.4041M1 19.4041L5 15.4041M1 19.4041H15C16.0609 19.4041 17.0783 18.9826 17.8284 18.2325C18.5786 17.4823 19 16.4649 19 15.4041V13.4041" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`,
  profile: `<svg class='w-${size} h-${size} ${customClass}' viewBox="0 0 24 26" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M22.6667 25V22.3333C22.6667 20.9188 22.1048 19.5623 21.1046 18.5621C20.1044 17.5619 18.7478 17 17.3333 17H6.66668C5.25219 17 3.89563 17.5619 2.89544 18.5621C1.89525 19.5623 1.33334 20.9188 1.33334 22.3333V25" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M12 11.6667C14.9455 11.6667 17.3333 9.27885 17.3333 6.33333C17.3333 3.38781 14.9455 1 12 1C9.05449 1 6.66668 3.38781 6.66668 6.33333C6.66668 9.27885 9.05449 11.6667 12 11.6667Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`,
  accounts: `<svg class='w-${size} h-${size} ${customClass}' viewBox="0 0 32 26" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M22.6667 25V22.3333C22.6667 20.9188 22.1048 19.5623 21.1046 18.5621C20.1044 17.5619 18.7478 17 17.3333 17H6.66668C5.25219 17 3.89563 17.5619 2.89544 18.5621C1.89525 19.5623 1.33334 20.9188 1.33334 22.3333V25M30.6667 25V22.3333C30.6658 21.1516 30.2725 20.0037 29.5485 19.0698C28.8245 18.1358 27.8108 17.4688 26.6667 17.1733M21.3333 1.17333C22.4806 1.46707 23.4974 2.13427 24.2235 3.06975C24.9497 4.00523 25.3438 5.15577 25.3438 6.34C25.3438 7.52423 24.9497 8.67477 24.2235 9.61025C23.4974 10.5457 22.4806 11.2129 21.3333 11.5067M17.3333 6.33333C17.3333 9.27885 14.9455 11.6667 12 11.6667C9.05449 11.6667 6.66668 9.27885 6.66668 6.33333C6.66668 3.38781 9.05449 1 12 1C14.9455 1 17.3333 3.38781 17.3333 6.33333Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`,
  keys: `<svg class='w-${size} h-${size} ${customClass}' viewBox="0 0 29 28" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M26 1.66669L23.3333 4.33335M23.3333 4.33335L27.3333 8.33335L22.6667 13L18.6667 9.00002M23.3333 4.33335L18.6667 9.00002M13.1867 14.48C13.8751 15.1593 14.4224 15.9681 14.797 16.8597C15.1716 17.7514 15.3661 18.7084 15.3694 19.6755C15.3726 20.6427 15.1845 21.6009 14.8159 22.4951C14.4473 23.3892 13.9054 24.2017 13.2215 24.8855C12.5376 25.5694 11.7252 26.1113 10.8311 26.4799C9.93691 26.8485 8.97867 27.0366 8.01151 27.0334C7.04435 27.0301 6.08739 26.8356 5.19572 26.461C4.30405 26.0864 3.49529 25.5391 2.816 24.8507C1.48017 23.4676 0.741015 21.6152 0.757724 19.6924C0.774432 17.7696 1.54567 15.9303 2.90533 14.5707C4.26499 13.211 6.10428 12.4398 8.02706 12.4231C9.94983 12.4064 11.8023 13.1455 13.1853 14.4814L13.1867 14.48ZM13.1867 14.48L18.6667 9.00002" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`,
  settings: `<svg class='w-${size} h-${size} ${customClass}' viewBox="0 0 32 26" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M5.33334 25V15.6667M5.33334 10.3333V1M16 25V13M16 7.66667V1M26.6667 25V18.3333M26.6667 13V1M1.33334 15.6667H9.33334M12 7.66667H20M22.6667 18.3333H30.6667" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`,
  submitsmall: `<svg class='w-6 ${customClass}' viewBox="0 0 23 22" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M11.5 15L15.5 11M15.5 11L11.5 7M15.5 11H7.5M21.5 11C21.5 16.5228 17.0228 21 11.5 21C5.97715 21 1.5 16.5228 1.5 11C1.5 5.47715 5.97715 1 11.5 1C17.0228 1 21.5 5.47715 21.5 11Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
`,
  submitmedium: `<svg class='w-8 ${customClass}' viewBox="0 0 23 22" fill="none" xmlns="http://www.w3.org/2000/svg">
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
  chat: `<svg class='w-${size} h-${size} ${customClass}' viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M25 12.3334C25.0046 14.0932 24.5934 15.8292 23.8 17.4C22.8592 19.2824 21.413 20.8656 19.6233 21.9724C17.8335 23.0792 15.771 23.6659 13.6667 23.6667C11.9068 23.6713 10.1708 23.2601 8.6 22.4667L1 25L3.53333 17.4C2.73991 15.8292 2.32875 14.0932 2.33333 12.3334C2.33415 10.229 2.92082 8.16651 4.02763 6.37677C5.13444 4.58704 6.71767 3.14079 8.6 2.20004C10.1708 1.40661 11.9068 0.99545 13.6667 1.00004H14.3333C17.1125 1.15336 19.7374 2.32639 21.7055 4.29452C23.6737 6.26265 24.8467 8.88757 25 11.6667V12.3334Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`,
  forum: `<svg class='w-${size} h-${size} ${customClass}' viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M25 17C25 17.7072 24.719 18.3855 24.219 18.8856C23.7189 19.3857 23.0406 19.6667 22.3333 19.6667H6.33333L1 25V3.66667C1 2.95942 1.28095 2.28115 1.78105 1.78105C2.28115 1.28095 2.95942 1 3.66667 1H22.3333C23.0406 1 23.7189 1.28095 24.219 1.78105C24.719 2.28115 25 2.95942 25 3.66667V17Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`,
  blog: `<svg class='w-${size} h-${size} ${customClass}' viewBox="0 0 26 25" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M13 23.6667H25M19 1.66668C19.5304 1.13625 20.2499 0.838257 21 0.838257C21.3714 0.838257 21.7392 0.911416 22.0824 1.05356C22.4256 1.1957 22.7374 1.40404 23 1.66668C23.2626 1.92933 23.471 2.24113 23.6131 2.58429C23.7553 2.92745 23.8284 3.29525 23.8284 3.66668C23.8284 4.03812 23.7553 4.40592 23.6131 4.74908C23.471 5.09224 23.2626 5.40404 23 5.66668L6.33333 22.3333L1 23.6667L2.33333 18.3334L19 1.66668Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`,
  whitepaper: `<svg class='w-${size} h-${size} ${customClass}' viewBox="0 0 24 30" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M14.6666 1.66669H3.99998C3.29274 1.66669 2.61446 1.94764 2.11436 2.44774C1.61426 2.94783 1.33331 3.62611 1.33331 4.33335V25.6667C1.33331 26.3739 1.61426 27.0522 2.11436 27.5523C2.61446 28.0524 3.29274 28.3334 3.99998 28.3334H20C20.7072 28.3334 21.3855 28.0524 21.8856 27.5523C22.3857 27.0522 22.6666 26.3739 22.6666 25.6667V9.66669M14.6666 1.66669L22.6666 9.66669M14.6666 1.66669V9.66669H22.6666M17.3333 16.3334H6.66665M17.3333 21.6667H6.66665M9.33331 11H6.66665" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`,
  actionButton: `
<svg class='w-${size} h-${size} ${customClass}' viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
<rect class='w-${size} h-${size} ${customClass}' rx="28" transform="matrix(1 0 0 -1 0 56)" fill="white"/>
<path d="M41.4798 3.4588C37.7397 1.40428 33.5794 0.231827 29.3169 0.0310205C25.0544 -0.169786 20.8024 0.606364 16.8857 2.30018C12.969 3.99399 9.4913 6.56065 6.71822 9.80408C3.94513 13.0475 1.95006 16.8819 0.885423 21.0143C-0.179216 25.1467 -0.285254 29.4677 0.575408 33.6474C1.43607 37.827 3.24066 41.7546 5.85131 45.1302C8.46197 48.5057 11.8096 51.2399 15.6385 53.1238C19.4674 55.0077 23.6762 55.9915 27.9435 56C30.6118 55.9973 33.2664 55.6171 35.8283 54.8707C41.1443 53.3243 45.8824 50.236 49.4432 45.9965C53.0039 41.7569 55.2274 36.5566 55.8324 31.0532C56.4374 25.5498 55.3966 19.9906 52.8418 15.0788C50.2871 10.1669 46.333 6.12311 41.4798 3.4588ZM50.4128 40.3009C47.5693 45.4981 43.0112 49.5482 37.5157 51.7607C32.0202 53.9731 25.9275 54.211 20.2762 52.4338C14.6249 50.6566 9.7649 46.9743 6.52477 42.0147C3.28464 37.055 1.86494 31.1251 2.5077 25.2358C3.15046 19.3465 5.81589 13.8624 10.0496 9.71848C14.2833 5.57456 19.8232 3.02735 25.7248 2.51108C31.6264 1.99481 37.5243 3.54145 42.4132 6.88733C47.3021 10.2332 50.8792 15.1712 52.5347 20.8594C53.4837 24.0794 53.7848 27.4556 53.4205 30.7927C53.0563 34.1298 52.0341 37.3615 50.4128 40.3009Z" fill="url(#paint0_linear)"/>
<path d="M28 13.7083V42.2917M13.7083 28H42.2916" stroke="#0A2262" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
<defs>
<linearGradient id="paint0_linear" x1="28.0042" y1="0.00501099" x2="28.0042" y2="56" gradientUnits="userSpaceOnUse">
<stop stop-color="#20D9A2"/>
<stop offset="0.265625" stop-color="#2BE0DC"/>
<stop offset="0.510417" stop-color="#2CB1EB"/>
<stop offset="0.760417" stop-color="#1472BB"/>
<stop offset="1" stop-color="#003399"/>
</linearGradient>
</defs>
</svg>`,
  circles: `<svg class='w-${size} h-${size} ${customClass}' viewBox="0 0 355 355" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M177.085 0C79.2909 0 0 79.2558 0 177.007C0 274.758 79.2909 354.014 177.085 354.014C274.88 354.014 354.171 274.758 354.171 177.007C354.171 79.2558 274.88 0 177.085 0ZM177.085 346.41C83.4713 346.41 7.60699 270.545 7.60699 177.007C7.60699 83.4686 83.4713 7.60362 177.085 7.60362C270.699 7.60362 346.564 83.4686 346.564 177.007C346.564 270.545 270.699 346.41 177.085 346.41Z" fill="url(#paint0_linear_603_25483)"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M175.987 301C212.787 301 245.872 285.095 268.744 259.783C276.188 253.124 280.873 243.445 280.873 232.671C280.873 212.588 264.594 196.307 244.513 196.307C231.63 196.307 220.311 203.009 213.853 213.116C204.212 223.085 190.697 229.283 175.735 229.283C146.45 229.283 122.71 205.54 122.71 176.253C122.71 146.965 146.45 123.222 175.735 123.222C190.46 123.222 203.784 129.226 213.392 138.919C219.935 148.535 230.967 154.85 243.474 154.85C263.555 154.85 279.834 138.569 279.834 118.486C279.834 108.786 276.036 99.9722 269.846 93.4522C246.941 67.4238 213.382 51 175.987 51C106.959 51 51 106.964 51 176C51 245.036 106.959 301 175.987 301Z" fill="url(#paint1_linear_603_25483)"/>
<circle r="26" transform="matrix(1 0 0 -1 176 176)" fill="#2F5FBD"/>
<defs>
<linearGradient id="paint0_linear_603_25483" x1="165.68" y1="-1.97816e-07" x2="156.784" y2="330.564" gradientUnits="userSpaceOnUse">
<stop stop-color="#0BE09D"/>
<stop offset="0.223958" stop-color="#1DD2BC"/>
<stop offset="0.5" stop-color="#129AF6"/>
<stop offset="0.75" stop-color="#176FD6"/>
<stop offset="1" stop-color="#5F48BA"/>
</linearGradient>
<linearGradient id="paint1_linear_603_25483" x1="158.534" y1="51" x2="151.699" y2="284.409" gradientUnits="userSpaceOnUse">
<stop stop-color="#0BE09D"/>
<stop offset="0.223958" stop-color="#1DD2BC"/>
<stop offset="0.5" stop-color="#129AF6"/>
<stop offset="0.75" stop-color="#176FD6"/>
<stop offset="1" stop-color="#5F48BA"/>
</linearGradient>
</defs>
</svg>`,
  circlesWhite: `
<svg width="355" height="355" class="${customClass}" viewBox="0 0 355 355" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M177.085 0C79.2909 0 0 79.2558 0 177.007C0 274.758 79.2909 354.014 177.085 354.014C274.88 354.014 354.171 274.758 354.171 177.007C354.171 79.2558 274.88 0 177.085 0ZM177.085 346.41C83.4713 346.41 7.60699 270.545 7.60699 177.007C7.60699 83.4686 83.4713 7.60362 177.085 7.60362C270.699 7.60362 346.564 83.4686 346.564 177.007C346.564 270.545 270.699 346.41 177.085 346.41Z" fill="#FEFCF9"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M177 301C246.036 301 302 245.036 302 176C302 106.964 246.036 51 177 51C107.964 51 52 106.964 52 176C52 245.036 107.964 301 177 301ZM176.5 235C209.361 235 236 208.809 236 176.5C236 144.191 209.361 118 176.5 118C143.639 118 117 144.191 117 176.5C117 208.809 143.639 235 176.5 235Z" fill="#FEFCF9"/>
<circle r="26" transform="matrix(1 0 0 -1 176 177)" fill="#FEFCF9"/>
</svg>
`,
  circlessimple: `
<svg
        class="inline w-${size} h-${size} ${customClass}"
        viewBox="0 0 229 255"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M118.5 237C150.437 237 179.424 224.366 200.734 203.822C209.904 197.627 215.933 187.136 215.933 175.236C215.933 156.198 200.499 140.764 181.461 140.764C170.572 140.764 160.863 145.812 154.545 153.695L154.457 153.627C145.313 163.112 132.476 169.012 118.261 169.012C90.4957 169.012 67.9879 146.504 67.9879 118.739C67.9879 90.9745 90.4957 68.4667 118.261 68.4667C132.339 68.4667 145.067 74.254 154.193 83.5795L154.29 83.5037C160.581 90.2293 169.535 94.4328 179.471 94.4328C198.51 94.4328 213.944 78.9988 213.944 59.9601C213.944 48.1884 208.043 37.7949 199.039 31.5755C177.899 11.9794 149.599 0 118.5 0C53.0543 0 0 53.0543 0 118.5C0 183.946 53.0543 237 118.5 237Z"
          fill="currentColor"
        />
        <ellipse
          cx="118.979"
          cy="118.739"
          rx="26.5727"
          ry="26.3333"
          fill="currentColor"
        />
      </svg>
`,
  crc: `
<svg
        class="inline w-${size} h-${size} ${customClass}"
        viewBox="0 0 229 255"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M118.5 237C150.437 237 179.424 224.366 200.734 203.822C209.904 197.627 215.933 187.136 215.933 175.236C215.933 156.198 200.499 140.764 181.461 140.764C170.572 140.764 160.863 145.812 154.545 153.695L154.457 153.627C145.313 163.112 132.476 169.012 118.261 169.012C90.4957 169.012 67.9879 146.504 67.9879 118.739C67.9879 90.9745 90.4957 68.4667 118.261 68.4667C132.339 68.4667 145.067 74.254 154.193 83.5795L154.29 83.5037C160.581 90.2293 169.535 94.4328 179.471 94.4328C198.51 94.4328 213.944 78.9988 213.944 59.9601C213.944 48.1884 208.043 37.7949 199.039 31.5755C177.899 11.9794 149.599 0 118.5 0C53.0543 0 0 53.0543 0 118.5C0 183.946 53.0543 237 118.5 237Z"
          fill="currentColor"
        />
        <ellipse
          cx="118.979"
          cy="118.739"
          rx="26.5727"
          ry="26.3333"
          fill="currentColor"
        />
      </svg>
`,
  xdai: `<svg class='inline w-${size} h-${size} ${customClass}' viewBox="0 0 1000 1000" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M474 15.0111C490.089 5.7222 509.911 5.7222 526 15.0111L907.013 234.989C923.102 244.278 933.013 261.444 933.013 280.022V719.978C933.013 738.556 923.102 755.722 907.013 765.011L526 984.989C509.911 994.278 490.089 994.278 474 984.989L92.9873 765.011C76.8984 755.722 66.9873 738.556 66.9873 719.978V280.022C66.9873 261.444 76.8984 244.278 92.9873 234.989L474 15.0111Z" fill="#FCB040"/>
<path d="M474 15.0111C490.089 5.7222 509.911 5.7222 526 15.0111L907.013 234.989C923.102 244.278 933.013 261.444 933.013 280.022V719.978C933.013 738.556 923.102 755.722 907.013 765.011L526 984.989C509.911 994.278 490.089 994.278 474 984.989L92.9873 765.011C76.8984 755.722 66.9873 738.556 66.9873 719.978V280.022C66.9873 261.444 76.8984 244.278 92.9873 234.989L474 15.0111Z" fill="url(#paint0_linear)"/>
<path d="M266.665 267.749L401.147 267.755L757.647 729.777L630.926 729.777L266.665 267.749Z" fill="white"/>
<path d="M403.164 733.744L266.665 733.743L598.164 266.243L733.164 266.243L403.164 733.744Z" fill="white"/>
<defs>
<linearGradient id="paint0_linear" x1="500" y1="0" x2="500" y2="1000" gradientUnits="userSpaceOnUse">
<stop stop-color="#FCD13E"/>
<stop offset="1" stop-color="white" stop-opacity="0"/>
</linearGradient>
</defs>
</svg>`,
  rightarrow: `<svg class='w-8 h-8 ${customClass}' viewBox="0 0 22 21" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M1.66669 10.5H20.3334M20.3334 10.5L11 1.1665M20.3334 10.5L11 19.8332" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
`,
  dashfriends: `
<svg width="58" height="48" class="${customClass}" viewBox="0 0 58 48" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M41.457 46.5V41.5C41.457 38.8478 40.4035 36.3043 38.5281 34.4289C36.6527 32.5536 34.1092 31.5 31.457 31.5H11.457C8.80487 31.5 6.26133 32.5536 4.38596 34.4289C2.5106 36.3043 1.45703 38.8478 1.45703 41.5V46.5M56.457 46.5V41.5C56.4554 39.2843 55.7179 37.1319 54.3604 35.3808C53.003 33.6296 51.1024 32.3789 48.957 31.825M38.957 1.825C41.1081 2.37575 43.0146 3.62675 44.3761 5.38078C45.7376 7.1348 46.4766 9.29207 46.4766 11.5125C46.4766 13.7329 45.7376 15.8902 44.3761 17.6442C43.0146 19.3982 41.1081 20.6492 38.957 21.2M31.457 11.5C31.457 17.0228 26.9799 21.5 21.457 21.5C15.9342 21.5 11.457 17.0228 11.457 11.5C11.457 5.97715 15.9342 1.5 21.457 1.5C26.9799 1.5 31.457 5.97715 31.457 11.5Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
`,
  dashpassport: `
<svg width="52" height="52" class="${customClass}" viewBox="0 0 52 52" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M51 26C51 39.8071 39.8071 51 26 51M51 26C51 12.1929 39.8071 1 26 1M51 26H1M26 51C12.1929 51 1 39.8071 1 26M26 51C32.2532 44.1541 35.8069 35.2699 36 26C35.8069 16.7301 32.2532 7.84588 26 1M26 51C19.7468 44.1541 16.1931 35.2699 16 26C16.1931 16.7301 19.7468 7.84588 26 1M1 26C1 12.1929 12.1929 1 26 1" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</svg>

`,
  dashbanking: `
<svg width="58" height="48" class="${customClass}" viewBox="0 0 58 48" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M56.5 4.00001V19M56.5 19H41.5M56.5 19L44.9 8.1C42.2131 5.41179 38.8891 3.44802 35.238 2.39194C31.5869 1.33586 27.7278 1.22188 24.0207 2.06065C20.3137 2.89942 16.8795 4.66359 14.0387 7.18855C11.1978 9.71351 9.04292 12.917 7.775 16.5M1.5 44V29M1.5 29H16.5M1.5 29L13.1 39.9C15.7869 42.5882 19.1109 44.552 22.762 45.6081C26.4131 46.6641 30.2722 46.7781 33.9793 45.9394C37.6863 45.1006 41.1205 43.3364 43.9613 40.8114C46.8022 38.2865 48.9571 35.083 50.225 31.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</svg>

`,
  dashmarket: `
<svg width="58" height="48" class="${customClass}" viewBox="0 0 58 55" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M1.56152 1.5H11.5615L18.2615 34.975C18.4901 36.126 19.1163 37.1599 20.0304 37.8957C20.9445 38.6316 22.0883 39.0225 23.2615 39H47.5615C48.7348 39.0225 49.8786 38.6316 50.7927 37.8957C51.7068 37.1599 52.3329 36.126 52.5615 34.975L56.5615 14H14.0615M24.0615 51.5C24.0615 52.8807 22.9422 54 21.5615 54C20.1808 54 19.0615 52.8807 19.0615 51.5C19.0615 50.1193 20.1808 49 21.5615 49C22.9422 49 24.0615 50.1193 24.0615 51.5ZM51.5615 51.5C51.5615 52.8807 50.4422 54 49.0615 54C47.6808 54 46.5615 52.8807 46.5615 51.5C46.5615 50.1193 47.6808 49 49.0615 49C50.4422 49 51.5615 50.1193 51.5615 51.5Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
`,
  dashchat: `
<svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M46.5615 22.7501C46.5701 26.0497 45.7992 29.3048 44.3115 32.2501C42.5476 35.7794 39.8359 38.748 36.4801 40.8233C33.1244 42.8985 29.2571 43.9985 25.3115 44.0001C22.0119 44.0087 18.7568 43.2377 15.8115 41.7501L1.56152 46.5001L6.31152 32.2501C4.82385 29.3048 4.05292 26.0497 4.06152 22.7501C4.06305 18.8045 5.16305 14.9372 7.23832 11.5814C9.31359 8.22569 12.2822 5.51399 15.8115 3.75007C18.7568 2.2624 22.0119 1.49147 25.3115 1.50007H26.5615C31.7724 1.78755 36.6941 3.98697 40.3844 7.67722C44.0746 11.3675 46.274 16.2892 46.5615 21.5001V22.7501Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
`,
  dashcoop: `
<svg width="48" height="48" class="${customClass}" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M15 9.66667C17.2092 9.66667 19 7.87581 19 5.66667C19 3.45753 17.2092 1.66667 15 1.66667C12.7909 1.66667 11 3.45753 11 5.66667C11 7.87581 12.7909 9.66667 15 9.66667ZM15 9.66667V28.3333M15 28.3333C11.4638 28.3333 8.07242 26.9286 5.57193 24.4281C3.07144 21.9276 1.66669 18.5362 1.66669 15H5.66669M15 28.3333C18.5362 28.3333 21.9276 26.9286 24.4281 24.4281C26.9286 21.9276 28.3334 18.5362 28.3334 15H24.3334" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
`,
  buttonrightarrow: `
<svg class='w-4 h-4 ${customClass}' viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M1 8.00012H15M15 8.00012L7.99998 1M15 8.00012L7.99998 15" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`,
  buttonleftarrow: `
<svg class='w-4 h-4 ${customClass}' viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M15 8H1M1 8L8 14.9999M1 8L8 0.999878" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
`,
  star: `
<svg class='w-${size} h-${size} ${customClass}' viewBox="0 0 22 21" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M11 1L14.09 7.26L21 8.27L16 13.14L17.18 20.02L11 16.77L4.82 20.02L6 13.14L1 8.27L7.91 7.26L11 1Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
`,
  eye: `
<svg class='w-${size} h-${size} ${customClass}' viewBox="0 0 24 18" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M1 9C1 9 5 1 12 1C19 1 23 9 23 9C23 9 19 17 12 17C5 17 1 9 1 9Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M12 11.9999C13.6568 11.9999 15 10.6567 15 8.99988C15 7.34302 13.6568 5.99988 12 5.99988C10.3431 5.99988 8.99999 7.34302 8.99999 8.99988C8.99999 10.6567 10.3431 11.9999 12 11.9999Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
`,
  cart: `
<svg class='w-${size} h-${size} ${customClass}'  viewBox="0 0 24 23" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M1 1H5L7.68 14.39C7.77144 14.8504 8.02191 15.264 8.38755 15.5583C8.75318 15.8526 9.2107 16.009 9.68 16H19.4C19.8693 16.009 20.3268 15.8526 20.6925 15.5583C21.0581 15.264 21.3086 14.8504 21.4 14.39L23 6H6M10 21C10 21.5523 9.55229 22 9 22C8.44772 22 8 21.5523 8 21C8 20.4477 8.44772 20 9 20C9.55229 20 10 20.4477 10 21ZM21 21C21 21.5523 20.5523 22 20 22C19.4477 22 19 21.5523 19 21C19 20.4477 19.4477 20 20 20C20.5523 20 21 20.4477 21 21Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`,
  scrolldown: `
<svg class='w-${size} h-${size} ${customClass}' viewBox="0 0 16 18" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M1.33325 10.3333L7.99992 17L14.6666 10.3333M1.33325 1L7.99992 7.66667L14.6666 1" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
`,
  smallx: `
<svg class='w-${size} h-${size} ${customClass}' viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M17 1L1 17M1 1L17 17" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
`,
  playbutton: `
<svg class='w-14 h-14' viewBox="0 0 65 65" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M32.5 63.75C49.7589 63.75 63.75 49.7589 63.75 32.5C63.75 15.2411 49.7589 1.25 32.5 1.25C15.2411 1.25 1.25 15.2411 1.25 32.5C1.25 49.7589 15.2411 63.75 32.5 63.75Z" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M26.25 20L45 32.5L26.25 45V20Z" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
`,
  simplearrowright: `
<svg width="8" height="14" viewBox="0 0 8 14" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M1 13L7 7L1 1" stroke="#8597C6" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`,
  simplearrowleft: `
<svg width="8" height="14" viewBox="0 0 8 14" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M7 13L1 7L7 1" stroke="#8597C6" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`,
  notificationbubble: `
<svg class='w-${size} h-${size} ${customClass}' viewBox="0 0 26 27" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M0.812498 12.8223C0.807659 14.6871 1.24131 16.5268 2.07812 18.1913C3.07032 20.186 4.72563 21.8939 6.61324 23.0667C8.88237 24.4766 10.2804 24.9116 12.0625 25.1875C13.8446 25.4634 15.5195 25.6562 18.1562 25.6562C21.2522 25.6562 24.7187 24.25 24.7187 24.25C24.7187 24.25 22.8232 24.045 22.4336 22.0062C22.1513 20.5294 23.4531 18.1913 23.4531 18.1913C24.2899 16.5268 24.7235 14.6871 24.7187 12.8223C24.7179 10.5924 24.0991 8.40673 22.9318 6.51018C21.7644 4.61362 20.0946 3.08106 18.1093 2.08416C16.4526 1.24338 14.6217 0.807678 12.7656 0.81254H12.0625C9.13137 0.975013 6.3629 2.21805 4.28714 4.30364C2.21138 6.38924 0.974205 9.17083 0.812498 12.1158V12.8223Z" fill="currentColor" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`,
  close: `
<svg class='navlogo ${customClass}' viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
<rect width="56" height="56" rx="28" fill="white"/>
<path d="M41.4798 52.5412C37.7397 54.5957 33.5794 55.7682 29.3169 55.969C25.0544 56.1698 20.8024 55.3936 16.8857 53.6998C12.969 52.006 9.4913 49.4393 6.71822 46.1959C3.94513 42.9525 1.95006 39.1181 0.885423 34.9857C-0.179216 30.8533 -0.285254 26.5323 0.575408 22.3526C1.43607 18.173 3.24066 14.2454 5.85131 10.8698C8.46197 7.49428 11.8096 4.76012 15.6385 2.87622C19.4674 0.992317 23.6762 0.00852585 27.9435 3.8147e-06C30.6118 0.00273514 33.2664 0.382946 35.8283 1.12932C41.1443 2.6757 45.8824 5.76398 49.4432 10.0035C53.0039 14.2431 55.2274 19.4434 55.8324 24.9468C56.4374 30.4502 55.3966 36.0094 52.8418 40.9212C50.2871 45.8331 46.333 49.8769 41.4798 52.5412ZM50.4128 15.6991C47.5693 10.5019 43.0112 6.4518 37.5157 4.23933C32.0202 2.02686 25.9275 1.78896 20.2762 3.56617C14.6249 5.34339 9.7649 9.0257 6.52477 13.9853C3.28464 18.945 1.86494 24.8749 2.5077 30.7642C3.15046 36.6535 5.81589 42.1376 10.0496 46.2815C14.2833 50.4254 19.8232 52.9727 25.7248 53.4889C31.6264 54.0052 37.5243 52.4585 42.4132 49.1127C47.3021 45.7668 50.8792 40.8288 52.5347 35.1406C53.4837 31.9206 53.7848 28.5444 53.4205 25.2073C53.0563 21.8702 52.0341 18.6385 50.4128 15.6991Z" fill="#8597C6"/>
<path d="M40.25 40.25L15.75 15.75M15.75 40.25L40.25 15.75" stroke="#8597C6" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
`,
  friends: `
<svg class='w-${size} h-${size} ${customClass}' viewBox="0 0 58 48" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M41.457 46.5V41.5C41.457 38.8478 40.4035 36.3043 38.5281 34.4289C36.6527 32.5536 34.1092 31.5 31.457 31.5H11.457C8.80487 31.5 6.26133 32.5536 4.38596 34.4289C2.5106 36.3043 1.45703 38.8478 1.45703 41.5V46.5M56.457 46.5V41.5C56.4554 39.2843 55.7179 37.1319 54.3604 35.3808C53.003 33.6296 51.1024 32.3789 48.957 31.825M38.957 1.825C41.1081 2.37575 43.0146 3.62675 44.3761 5.38078C45.7376 7.1348 46.4766 9.29207 46.4766 11.5125C46.4766 13.7329 45.7376 15.8902 44.3761 17.6442C43.0146 19.3982 41.1081 20.6492 38.957 21.2M31.457 11.5C31.457 17.0228 26.9799 21.5 21.457 21.5C15.9342 21.5 11.457 17.0228 11.457 11.5C11.457 5.97715 15.9342 1.5 21.457 1.5C26.9799 1.5 31.457 5.97715 31.457 11.5Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
`,
  copy: `
<svg class='w-${size} h-${size} ${customClass}'  viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M4 14H3C2.46957 14 1.96086 13.7893 1.58579 13.4142C1.21071 13.0391 1 12.5304 1 12V3C1 2.46957 1.21071 1.96086 1.58579 1.58579C1.96086 1.21071 2.46957 1 3 1H12C12.5304 1 13.0391 1.21071 13.4142 1.58579C13.7893 1.96086 14 2.46957 14 3V4M10 8H19C20.1046 8 21 8.89543 21 10V19C21 20.1046 20.1046 21 19 21H10C8.89543 21 8 20.1046 8 19V10C8 8.89543 8.89543 8 10 8Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
`,
  homer: `
<svg fill="currentColor" xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 50 50" class='w-${size} h-${size} ${customClass}'><path d="M 25 3 C 20.390625 3 17.3125 5.78125 15.511719 8.4375 C 13.847656 10.890625 13.21875 13.121094 13.121094 13.488281 C 12.808594 13.769531 12 14.566406 12 16 L 12 16.609375 C 10.222656 17.523438 9 19.375 9 21.5 C 9 23.046875 9.648438 24.445313 10.6875 25.449219 C 10.261719 26.027344 10 26.734375 10 27.5 L 10 28.5 L 10.203125 28.5 C 10.277344 28.730469 10.375 28.945313 10.488281 29.15625 C 10.398438 29.253906 10.320313 29.332031 10.222656 29.46875 C 9.871094 29.9375 9.441406 30.652344 9.0625 31.644531 C 9.078125 31.609375 8.945313 31.855469 8.757813 32.125 C 8.566406 32.402344 8.3125 32.742188 8.0625 33.128906 C 7.558594 33.90625 7 34.847656 7 36 C 7 36.148438 7.035156 36.296875 7.097656 36.433594 C 7.097656 36.433594 7.609375 37.445313 8.835938 38.3125 C 9.394531 38.714844 10.125 39.097656 11.027344 39.402344 C 11.046875 39.539063 11.054688 39.667969 11.085938 39.8125 C 11.289063 40.753906 11.972656 41.851563 13.175781 42.578125 C 13.363281 42.9375 13.785156 43.84375 14.777344 44.597656 C 15.117188 44.859375 15.527344 45.089844 16 45.296875 L 16 46 C 15.996094 46.359375 16.183594 46.695313 16.496094 46.878906 C 16.808594 47.058594 17.191406 47.058594 17.503906 46.878906 C 17.816406 46.695313 18.003906 46.359375 18 46 L 18 45.847656 C 18.597656 45.941406 19.257813 46 20 46 C 23.785156 46 25.96875 44.253906 26.988281 42.503906 C 27.957031 40.84375 27.988281 39.277344 27.988281 39.109375 C 27.992188 39.089844 28.15625 37.832031 27.671875 36.25 C 27.183594 34.652344 26.015625 32.65625 23.515625 31.144531 C 19.925781 28.96875 14.710938 29 14.710938 29 L 13.5 29 C 12.671875 29 12 28.328125 12 27.5 C 12 26.671875 12.671875 26 13.5 26 L 18.035156 26 C 19.195313 27.800781 21.210938 29 23.5 29 C 27.078125 29 30 26.078125 30 22.5 C 30 18.921875 27.078125 16 23.5 16 C 21.640625 16 19.960938 16.792969 18.773438 18.058594 C 17.761719 16.804688 16.222656 16 14.5 16 C 14.332031 16 14.164063 16.011719 14 16.027344 L 14 16 C 14 15.46875 14.65625 14.75 14.65625 14.75 C 14.808594 14.621094 14.917969 14.445313 14.96875 14.25 C 14.96875 14.25 15.578125 11.902344 17.167969 9.5625 C 18.753906 7.222656 21.175781 5.003906 24.996094 5 C 24.996094 5 28.34375 5.03125 31.632813 6.335938 C 33.277344 6.984375 34.878906 7.945313 36.050781 9.320313 C 37.222656 10.699219 38 12.484375 38 15 C 38 16.605469 37.992188 18.238281 37.515625 20.144531 C 37.351563 20.042969 37.164063 19.996094 36.96875 20 C 36.628906 20.011719 36.316406 20.195313 36.140625 20.484375 L 33.140625 25.484375 C 32.945313 25.792969 32.929688 26.183594 33.101563 26.503906 C 33.277344 26.828125 33.613281 27.027344 33.976563 27.03125 C 34.34375 27.03125 34.679688 26.832031 34.859375 26.515625 L 36 24.609375 L 36 27 C 36 27.449219 36.300781 27.84375 36.734375 27.960938 C 37.167969 28.082031 37.625 27.898438 37.859375 27.515625 L 39 25.609375 L 39 28 C 38.996094 28.359375 39.183594 28.695313 39.496094 28.878906 C 39.808594 29.058594 40.191406 29.058594 40.503906 28.878906 C 40.816406 28.695313 41.003906 28.359375 41 28 L 41 22 C 41 21.589844 40.75 21.222656 40.371094 21.074219 C 39.992188 20.921875 39.558594 21.015625 39.277344 21.3125 C 39.996094 18.851563 40 16.773438 40 15 C 40 12.054688 39.027344 9.734375 37.574219 8.023438 C 36.121094 6.316406 34.222656 5.207031 32.367188 4.476563 C 28.65625 3.007813 25.003906 3 25.003906 3 C 25.003906 3 25 3 25 3 Z M 14.5 18 C 15.835938 18 16.988281 18.746094 17.578125 19.835938 C 17.210938 20.648438 17 21.550781 17 22.5 C 17 23.015625 17.070313 23.515625 17.183594 24 L 13.5 24 C 13.082031 24 12.683594 24.085938 12.3125 24.222656 C 11.515625 23.585938 11 22.609375 11 21.5 C 11 19.554688 12.554688 18 14.5 18 Z M 23.5 18 C 25.996094 18 28 20.003906 28 22.5 C 28 24.996094 25.996094 27 23.5 27 C 21.003906 27 19 24.996094 19 22.5 C 19 20.003906 21.003906 18 23.5 18 Z M 14 21 C 13.449219 21 13 21.449219 13 22 C 13 22.550781 13.449219 23 14 23 C 14.550781 23 15 22.550781 15 22 C 15 21.449219 14.550781 21 14 21 Z M 25 22 C 24.449219 22 24 22.449219 24 23 C 24 23.550781 24.449219 24 25 24 C 25.550781 24 26 23.550781 26 23 C 26 22.449219 25.550781 22 25 22 Z M 35.894531 29 C 34.90625 29 34.148438 29.34375 33.683594 29.726563 C 33.214844 30.109375 32.984375 30.59375 32.984375 30.59375 C 32.757813 31.097656 32.984375 31.6875 33.488281 31.914063 C 33.992188 32.140625 34.585938 31.914063 34.8125 31.40625 C 34.8125 31.40625 34.800781 31.390625 34.949219 31.273438 C 35.09375 31.15625 35.335938 31 35.894531 31 C 36.46875 31 36.605469 31.109375 36.734375 31.28125 C 36.863281 31.449219 37 31.855469 37 32.53125 C 37 32.488281 36.859375 32.988281 36.464844 33.347656 C 36.070313 33.710938 35.507813 34 34.75 34 C 34.476563 34 34.214844 34.109375 34.023438 34.308594 C 33.835938 34.503906 33.738281 34.769531 33.75 35.042969 C 33.75 35.042969 34.03125 42.546875 35.035156 46.261719 C 35.121094 46.617188 35.390625 46.894531 35.742188 46.992188 C 36.09375 47.085938 36.46875 46.984375 36.722656 46.726563 C 36.976563 46.464844 37.070313 46.085938 36.964844 45.738281 C 36.207031 42.933594 35.871094 37.058594 35.804688 35.796875 C 36.597656 35.601563 37.3125 35.285156 37.8125 34.824219 C 38.535156 34.164063 39 33.429688 39 32.53125 C 39 31.625 38.859375 30.765625 38.328125 30.066406 C 37.792969 29.367188 36.875 29 35.894531 29 Z M 11.890625 30.589844 C 12.367188 30.847656 12.914063 31 13.5 31 L 14.6875 31 C 14.6875 31 19.679688 31.15625 22.484375 32.855469 C 24.5625 34.117188 25.390625 35.621094 25.761719 36.832031 C 26.128906 38.042969 26.011719 38.863281 26.011719 38.863281 L 26 38.933594 L 26 39 C 26 39 25.992188 40.246094 25.261719 41.496094 C 24.53125 42.746094 23.214844 44 20 44 C 17.777344 44 16.636719 43.503906 15.988281 43.011719 C 15.339844 42.515625 15.15625 42.035156 14.878906 41.527344 L 14.714844 41.21875 L 14.390625 41.078125 C 13.699219 40.785156 13.367188 40.359375 13.183594 39.882813 C 13.746094 39.953125 14.34375 40 15 40 C 17.839844 40 19.664063 39.746094 20.816406 39.472656 C 21.390625 39.335938 21.800781 39.195313 22.078125 39.078125 C 22.355469 38.960938 22.570313 38.820313 22.570313 38.820313 C 22.882813 38.625 23.058594 38.273438 23.035156 37.90625 C 23.007813 37.539063 22.785156 37.214844 22.449219 37.0625 C 22.113281 36.910156 21.722656 36.957031 21.429688 37.179688 C 21.429688 37.179688 21.464844 37.164063 21.296875 37.234375 C 21.132813 37.304688 20.835938 37.414063 20.355469 37.527344 C 19.398438 37.753906 17.722656 38 15 38 C 12.398438 38 10.878906 37.316406 9.992188 36.6875 C 9.265625 36.167969 9.171875 35.902344 9.097656 35.765625 C 9.164063 35.347656 9.363281 34.796875 9.738281 34.222656 C 9.953125 33.890625 10.1875 33.570313 10.394531 33.273438 C 10.601563 32.976563 10.789063 32.738281 10.9375 32.355469 C 11.246094 31.535156 11.585938 30.988281 11.828125 30.65625 C 11.875 30.601563 11.855469 30.632813 11.890625 30.589844 Z"/></svg>`,
  bart: `
<svg fill="currentColor" xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 50 50"  class='w-${size} h-${size} ${customClass}'><path d="M 18.53125 3 C 18.140625 2.988281 17.78125 3.203125 17.605469 3.554688 L 16.726563 5.3125 L 15.707031 4.292969 C 15.441406 4.027344 15.046875 3.933594 14.6875 4.050781 C 14.332031 4.167969 14.070313 4.476563 14.011719 4.847656 L 12.058594 17.558594 C 11.703125 17.890625 11 18.648438 11 20 L 11 20.824219 C 9.769531 22.007813 9 23.667969 9 25.5 C 9 27.5625 9.976563 29.402344 11.484375 30.59375 C 11.277344 31.464844 10.992188 32.371094 10.707031 33.21875 C 10.359375 34.261719 10.011719 35.097656 10.011719 36 C 10.011719 36.96875 10.601563 37.71875 11.296875 38.292969 C 11.992188 38.867188 12.875 39.332031 13.847656 39.722656 C 15.152344 40.25 16.613281 40.628906 18.015625 40.828125 C 18 40.90625 17.996094 40.984375 18 41.0625 C 18 41.0625 18.035156 41.753906 18.414063 42.46875 C 18.792969 43.179688 19.703125 43.988281 20.984375 43.996094 C 21 44.027344 21.011719 44.0625 21.011719 44.066406 L 21 45.996094 C 20.992188 46.355469 21.179688 46.691406 21.492188 46.875 C 21.800781 47.058594 22.1875 47.058594 22.5 46.878906 C 22.8125 46.699219 23.003906 46.367188 23 46.003906 L 23.011719 44.003906 C 23.011719 43.980469 23.011719 43.953125 23.007813 43.925781 C 23.007813 43.925781 22.988281 43.484375 22.734375 43.023438 C 22.484375 42.5625 21.824219 42 21 42 C 20.417969 42 20.332031 41.816406 20.179688 41.53125 C 20.054688 41.292969 20.019531 41.078125 20.011719 41 C 23.128906 41 25.191406 40.746094 26.503906 40.480469 C 27.039063 40.371094 27.433594 40.257813 27.75 40.15625 L 28.304688 40.707031 C 28.554688 40.96875 28.929688 41.074219 29.277344 40.980469 C 29.628906 40.890625 29.902344 40.617188 29.992188 40.265625 C 30.085938 39.917969 29.980469 39.542969 29.71875 39.292969 L 28.765625 38.34375 C 28.742188 38.316406 28.71875 38.292969 28.695313 38.269531 L 27.71875 37.292969 C 27.53125 37.097656 27.269531 36.988281 27 36.988281 C 26.640625 36.992188 26.308594 37.1875 26.128906 37.5 C 25.953125 37.816406 25.960938 38.203125 26.148438 38.511719 C 26.128906 38.515625 26.128906 38.515625 26.109375 38.519531 C 24.953125 38.753906 23.019531 39 20.011719 39 C 18.472656 39 16.289063 38.550781 14.59375 37.871094 C 13.75 37.527344 13.023438 37.125 12.570313 36.75 C 12.117188 36.375 12.011719 36.09375 12.011719 36 C 12.011719 35.839844 12.257813 34.894531 12.605469 33.855469 C 12.835938 33.171875 13.089844 32.402344 13.308594 31.609375 C 13.75 31.769531 14.210938 31.882813 14.6875 31.941406 C 15.109375 32.554688 15.703125 33 16.5 33 L 18 33 C 18.359375 33.003906 18.695313 32.816406 18.878906 32.503906 C 19.058594 32.191406 19.058594 31.808594 18.878906 31.496094 C 18.695313 31.183594 18.359375 30.996094 18 31 L 16.5 31 C 16.21875 31 16 30.78125 16 30.5 C 16 30.21875 16.21875 30 16.5 30 L 20.5 30 C 20.597656 30 20.695313 29.988281 20.789063 29.960938 C 21.976563 31.210938 23.648438 32 25.5 32 C 29.078125 32 32 29.078125 32 25.5 C 32 21.921875 29.078125 19 25.5 19 C 23.492188 19 21.691406 19.921875 20.496094 21.363281 C 19.300781 19.925781 17.507813 19 15.5 19 C 14.683594 19 13.90625 19.160156 13.183594 19.4375 C 13.378906 19.070313 13.65625 18.75 13.65625 18.75 C 13.835938 18.597656 13.953125 18.386719 13.988281 18.152344 L 15.6875 7.101563 L 16.292969 7.707031 C 16.519531 7.933594 16.84375 8.039063 17.160156 7.988281 C 17.476563 7.9375 17.75 7.734375 17.894531 7.445313 L 18.578125 6.078125 L 19.140625 7.015625 C 19.3125 7.292969 19.605469 7.476563 19.933594 7.496094 C 20.257813 7.519531 20.578125 7.378906 20.78125 7.125 L 21.882813 5.75 L 22.640625 7.015625 C 22.8125 7.292969 23.105469 7.476563 23.433594 7.496094 C 23.757813 7.519531 24.078125 7.378906 24.28125 7.125 L 25.382813 5.75 L 26.140625 7.015625 C 26.300781 7.277344 26.570313 7.453125 26.878906 7.492188 C 27.183594 7.53125 27.488281 7.425781 27.707031 7.207031 L 28.5625 6.351563 L 29.050781 7.816406 C 29.152344 8.125 29.402344 8.367188 29.714844 8.460938 C 30.03125 8.550781 30.371094 8.484375 30.625 8.28125 L 31.796875 7.34375 L 32.015625 8.664063 C 32.066406 8.988281 32.28125 9.269531 32.582031 9.40625 C 32.878906 9.546875 33.230469 9.527344 33.515625 9.359375 L 34.753906 8.613281 L 35.015625 10.164063 C 35.070313 10.507813 35.304688 10.796875 35.628906 10.929688 C 35.953125 11.058594 36.320313 11.011719 36.597656 10.800781 L 37.328125 10.25 L 37.519531 11.195313 C 37.578125 11.488281 37.761719 11.738281 38.023438 11.878906 C 38.285156 12.019531 38.59375 12.039063 38.871094 11.925781 L 39.4375 11.703125 C 35.710938 23.339844 34.472656 30.035156 34.152344 32 C 34.082031 32.003906 33.917969 32.003906 33.917969 32.003906 C 33.550781 32.023438 33.226563 32.238281 33.070313 32.566406 C 32.910156 32.894531 32.941406 33.285156 33.152344 33.582031 C 33.367188 33.878906 33.722656 34.039063 34.082031 33.996094 C 34.082031 33.996094 34.691406 33.964844 35.21875 34.117188 C 35.484375 34.195313 35.695313 34.3125 35.8125 34.433594 C 35.925781 34.550781 36 34.660156 36 35 C 36 35.941406 35.800781 36.160156 35.625 36.285156 C 35.453125 36.414063 35.058594 36.5 34.5 36.5 C 34.296875 36.5 33.523438 36.148438 33.523438 36.148438 C 33.21875 35.949219 32.828125 35.929688 32.507813 36.097656 C 32.183594 36.269531 31.976563 36.601563 31.972656 36.964844 C 31.964844 37.332031 32.160156 37.671875 32.476563 37.851563 C 32.476563 37.851563 32.65625 37.972656 32.921875 38.109375 C 32.664063 39.039063 32.136719 41.273438 32.058594 44.410156 C 31.972656 44.457031 31.925781 44.492188 31.746094 44.554688 C 31.15625 44.757813 30.015625 45 28 45 C 27.640625 44.996094 27.304688 45.183594 27.121094 45.496094 C 26.941406 45.808594 26.941406 46.191406 27.121094 46.503906 C 27.304688 46.816406 27.640625 47.003906 28 47 C 30.171875 47 31.527344 46.742188 32.394531 46.445313 C 32.828125 46.296875 33.140625 46.136719 33.359375 45.988281 C 33.578125 45.84375 33.777344 45.628906 33.777344 45.628906 C 33.921875 45.453125 34 45.230469 34 45 C 34 40.949219 34.773438 38.78125 34.886719 38.488281 C 35.496094 38.464844 36.183594 38.359375 36.8125 37.902344 C 37.574219 37.339844 38 36.308594 38 35 C 38 34.214844 37.699219 33.511719 37.25 33.046875 C 36.90625 32.683594 36.503906 32.480469 36.113281 32.328125 C 36.386719 30.515625 37.609375 23.441406 41.949219 10.3125 C 42.070313 9.945313 41.96875 9.539063 41.683594 9.273438 C 41.402344 9.007813 40.988281 8.929688 40.628906 9.070313 L 39.246094 9.625 L 38.980469 8.304688 C 38.914063 7.96875 38.679688 7.6875 38.359375 7.566406 C 38.035156 7.441406 37.675781 7.492188 37.402344 7.699219 L 36.714844 8.210938 L 36.484375 6.835938 C 36.433594 6.511719 36.21875 6.230469 35.917969 6.09375 C 35.621094 5.953125 35.269531 5.972656 34.984375 6.140625 L 33.746094 6.886719 L 33.484375 5.335938 C 33.429688 4.984375 33.1875 4.691406 32.859375 4.566406 C 32.527344 4.4375 32.152344 4.496094 31.875 4.71875 L 30.496094 5.820313 L 29.949219 4.183594 C 29.839844 3.855469 29.566406 3.605469 29.230469 3.527344 C 28.894531 3.445313 28.539063 3.546875 28.292969 3.792969 L 27.199219 4.886719 L 26.359375 3.484375 C 26.1875 3.207031 25.894531 3.023438 25.566406 3.003906 C 25.242188 2.980469 24.921875 3.121094 24.71875 3.375 L 23.617188 4.75 L 22.859375 3.484375 C 22.6875 3.207031 22.394531 3.023438 22.066406 3.003906 C 21.742188 2.980469 21.421875 3.121094 21.21875 3.375 L 20.117188 4.75 L 19.359375 3.484375 C 19.183594 3.195313 18.871094 3.011719 18.53125 3 Z M 15.5 21 C 17.179688 21 18.628906 21.921875 19.402344 23.277344 C 19.148438 23.972656 19 24.71875 19 25.5 C 19 26.386719 19.179688 27.230469 19.5 28 L 16.5 28 C 15.386719 28 14.445313 28.75 14.125 29.765625 C 13.816406 29.667969 13.527344 29.539063 13.253906 29.382813 C 13.164063 29.3125 13.066406 29.257813 12.957031 29.21875 C 11.773438 28.410156 11 27.050781 11 25.5 C 11 23.003906 13.003906 21 15.5 21 Z M 25.5 21 C 27.996094 21 30 23.003906 30 25.5 C 30 27.996094 27.996094 30 25.5 30 C 23.003906 30 21 27.996094 21 25.5 C 21 23.003906 23.003906 21 25.5 21 Z M 16 25 C 15.449219 25 15 25.449219 15 26 C 15 26.550781 15.449219 27 16 27 C 16.550781 27 17 26.550781 17 26 C 17 25.449219 16.550781 25 16 25 Z M 26 26 C 25.449219 26 25 26.449219 25 27 C 25 27.550781 25.449219 28 26 28 C 26.550781 28 27 27.550781 27 27 C 27 26.449219 26.550781 26 26 26 Z"/></svg>`,
  google: `
<svg viewBox="0 0 24 24" class='w-${size} h-${size} ${customClass}' xmlns="http://www.w3.org/2000/svg">
  <g transform="matrix(1, 0, 0, 1, 27.009001, -39.238998)">
    <path fill="#4285F4" d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.284 53.749 C -8.574 55.229 -9.424 56.479 -10.684 57.329 L -10.684 60.329 L -6.824 60.329 C -4.564 58.239 -3.264 55.159 -3.264 51.509 Z"/>
    <path fill="#34A853" d="M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.824 60.329 L -10.684 57.329 C -11.764 58.049 -13.134 58.489 -14.754 58.489 C -17.884 58.489 -20.534 56.379 -21.484 53.529 L -25.464 53.529 L -25.464 56.619 C -23.494 60.539 -19.444 63.239 -14.754 63.239 Z"/>
    <path fill="#FBBC05" d="M -21.484 53.529 C -21.734 52.809 -21.864 52.039 -21.864 51.239 C -21.864 50.439 -21.724 49.669 -21.484 48.949 L -21.484 45.859 L -25.464 45.859 C -26.284 47.479 -26.754 49.299 -26.754 51.239 C -26.754 53.179 -26.284 54.999 -25.464 56.619 L -21.484 53.529 Z"/>
    <path fill="#EA4335" d="M -14.754 43.989 C -12.984 43.989 -11.404 44.599 -10.154 45.789 L -6.734 42.369 C -8.804 40.429 -11.514 39.239 -14.754 39.239 C -19.444 39.239 -23.494 41.939 -25.464 45.859 L -21.484 48.949 C -20.534 46.099 -17.884 43.989 -14.754 43.989 Z"/>
  </g>
</svg>`,
  apple: `<svg class='w-${size} h-${size} ${customClass} -ml-2' viewBox="0 0 256 315" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" preserveAspectRatio="xMidYMid">
    <g>
        <path d="M213.803394,167.030943 C214.2452,214.609646 255.542482,230.442639 256,230.644727 C255.650812,231.761357 249.401383,253.208293 234.24263,275.361446 C221.138555,294.513969 207.538253,313.596333 186.113759,313.991545 C165.062051,314.379442 158.292752,301.507828 134.22469,301.507828 C110.163898,301.507828 102.642899,313.596301 82.7151126,314.379442 C62.0350407,315.16201 46.2873831,293.668525 33.0744079,274.586162 C6.07529317,235.552544 -14.5576169,164.286328 13.147166,116.18047 C26.9103111,92.2909053 51.5060917,77.1630356 78.2026125,76.7751096 C98.5099145,76.3877456 117.677594,90.4371851 130.091705,90.4371851 C142.497945,90.4371851 165.790755,73.5415029 190.277627,76.0228474 C200.528668,76.4495055 229.303509,80.1636878 247.780625,107.209389 C246.291825,108.132333 213.44635,127.253405 213.803394,167.030988 M174.239142,50.1987033 C185.218331,36.9088319 192.607958,18.4081019 190.591988,0 C174.766312,0.636050225 155.629514,10.5457909 144.278109,23.8283506 C134.10507,35.5906758 125.195775,54.4170275 127.599657,72.4607932 C145.239231,73.8255433 163.259413,63.4970262 174.239142,50.1987249" fill="#000000"></path>
    </g>
</svg>`,
  github: `
<svg class='w-${size} h-${size} ${customClass}' viewBox="0 0 1024 1024" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" clip-rule="evenodd" d="M8 0C3.58 0 0 3.58 0 8C0 11.54 2.29 14.53 5.47 15.59C5.87 15.66 6.02 15.42 6.02 15.21C6.02 15.02 6.01 14.39 6.01 13.72C4 14.09 3.48 13.23 3.32 12.78C3.23 12.55 2.84 11.84 2.5 11.65C2.22 11.5 1.82 11.13 2.49 11.12C3.12 11.11 3.57 11.7 3.72 11.94C4.44 13.15 5.59 12.81 6.05 12.6C6.12 12.08 6.33 11.73 6.56 11.53C4.78 11.33 2.92 10.64 2.92 7.58C2.92 6.71 3.23 5.99 3.74 5.43C3.66 5.23 3.38 4.41 3.82 3.31C3.82 3.31 4.49 3.1 6.02 4.13C6.66 3.95 7.34 3.86 8.02 3.86C8.7 3.86 9.38 3.95 10.02 4.13C11.55 3.09 12.22 3.31 12.22 3.31C12.66 4.41 12.38 5.23 12.3 5.43C12.81 5.99 13.12 6.7 13.12 7.58C13.12 10.65 11.25 11.33 9.47 11.53C9.76 11.78 10.01 12.26 10.01 13.01C10.01 14.08 10 14.94 10 15.21C10 15.42 10.15 15.67 10.55 15.59C13.71 14.53 16 11.53 16 8C16 3.58 12.42 0 8 0Z" transform="scale(64)" fill="#1B1F23"/>
</svg>`,
  useradd: `

<svg class='w-${size} h-${size} ${customClass}' viewBox="0 0 32 26" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M21.3333 25V22.3333C21.3333 20.9188 20.7714 19.5623 19.7712 18.5621C18.7711 17.5619 17.4145 17 16 17H6.66668C5.25219 17 3.89563 17.5619 2.89544 18.5621C1.89525 19.5623 1.33334 20.9188 1.33334 22.3333V25M26.6667 7.66667V15.6667M30.6667 11.6667H22.6667M16.6667 6.33333C16.6667 9.27885 14.2789 11.6667 11.3333 11.6667C8.38782 11.6667 6.00001 9.27885 6.00001 6.33333C6.00001 3.38781 8.38782 1 11.3333 1C14.2789 1 16.6667 3.38781 16.6667 6.33333Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
`,
  trash: `
<svg class='w-${size} h-${size} ${customClass}' viewBox="0 0 26 30" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M1 6.99996H3.66667M3.66667 6.99996H25M3.66667 6.99996V25.6666C3.66667 26.3739 3.94762 27.0521 4.44772 27.5522C4.94781 28.0523 5.62609 28.3333 6.33333 28.3333H19.6667C20.3739 28.3333 21.0522 28.0523 21.5523 27.5522C22.0524 27.0521 22.3333 26.3739 22.3333 25.6666V6.99996H3.66667ZM7.66667 6.99996V4.33329C7.66667 3.62605 7.94762 2.94777 8.44772 2.44767C8.94781 1.94758 9.62609 1.66663 10.3333 1.66663H15.6667C16.3739 1.66663 17.0522 1.94758 17.5523 2.44767C18.0524 2.94777 18.3333 3.62605 18.3333 4.33329V6.99996M10.3333 13.6666V21.6666M15.6667 13.6666V21.6666" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
`,
  document: `
<svg class='w-${size} h-${size} ${customClass}' viewBox="0 0 24 30" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M14.6666 1.66669H3.99998C3.29274 1.66669 2.61446 1.94764 2.11436 2.44774C1.61426 2.94783 1.33331 3.62611 1.33331 4.33335V25.6667C1.33331 26.3739 1.61426 27.0522 2.11436 27.5523C2.61446 28.0524 3.29274 28.3334 3.99998 28.3334H20C20.7072 28.3334 21.3855 28.0524 21.8856 27.5523C22.3857 27.0522 22.6666 26.3739 22.6666 25.6667V9.66669M14.6666 1.66669L22.6666 9.66669M14.6666 1.66669V9.66669H22.6666M17.3333 16.3334H6.66665M17.3333 21.6667H6.66665M9.33331 11H6.66665" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
`,
  check: `

<svg class='w-${size} h-${size} ${customClass}' viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M26.6667 8L12 22.6667L5.33334 16" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
`,
  closex: `
<svg class='w-${size} h-${size} ${customClass}' viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M17 1L1 17M1 1L17 17" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
`,
  timeCircle: `
<svg class='w-${size} h-${size} ${customClass}' viewBox="0 0 355 355" fill="none" xmlns="http://www.w3.org/2000/svg">

<path fill-rule="evenodd" clip-rule="evenodd" d="M216.741 116.845C221.01 121.46 226.554 124.951 233.02 126.689C251.643 131.694 270.866 120.272 275.956 101.177C279.802 86.7523 274.483 72.0756 263.624 63.601C244.686 46.1461 221.372 34.3029 196.172 29.3894C169.386 24.1667 141.62 26.9972 116.24 37.5376C90.8607 48.078 68.9578 65.8755 53.1877 88.7718C37.4176 111.668 28.4578 138.68 27.3949 166.531C26.3319 194.382 33.2114 221.876 47.1992 245.68C61.1869 269.483 81.682 288.573 106.199 300.635C130.716 312.696 158.202 317.211 185.323 313.632C212.445 310.052 238.037 298.533 258.996 280.469L258.917 280.375C265.867 275.681 271.25 268.48 273.608 259.636C278.709 240.5 267.715 220.92 249.053 215.904C236.104 212.424 222.866 216.868 214.269 226.308L214.199 226.222C203.61 235.348 190.681 241.168 176.978 242.977C163.276 244.785 149.39 242.504 137.003 236.41C124.617 230.317 114.262 220.672 107.195 208.646C100.128 196.62 96.6527 182.729 97.1897 168.658C97.7268 154.588 102.253 140.941 110.221 129.373C118.188 117.805 129.254 108.814 142.076 103.489C154.898 98.1634 168.926 96.7334 182.459 99.3719C195.281 101.872 207.137 107.923 216.741 116.845Z" fill="white"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M216.741 116.845C221.01 121.46 226.554 124.951 233.02 126.689C251.643 131.694 270.866 120.272 275.956 101.177C279.802 86.7523 274.483 72.0756 263.624 63.601C244.686 46.1461 221.372 34.3029 196.172 29.3894C169.386 24.1667 141.62 26.9972 116.24 37.5376C90.8607 48.078 68.9578 65.8755 53.1877 88.7718C37.4176 111.668 28.4578 138.68 27.3949 166.531C26.3319 194.382 33.2114 221.876 47.1992 245.68C61.1869 269.483 81.682 288.573 106.199 300.635C130.716 312.696 158.202 317.211 185.323 313.632C212.445 310.052 238.037 298.533 258.996 280.469L258.917 280.375C265.867 275.681 271.25 268.48 273.608 259.636C278.709 240.5 267.715 220.92 249.053 215.904C236.104 212.424 222.866 216.868 214.269 226.308L214.199 226.222C203.61 235.348 190.681 241.168 176.978 242.977C163.276 244.785 149.39 242.504 137.003 236.41C124.617 230.317 114.262 220.672 107.195 208.646C100.128 196.62 96.6527 182.729 97.1897 168.658C97.7268 154.588 102.253 140.941 110.221 129.373C118.188 117.805 129.254 108.814 142.076 103.489C154.898 98.1634 168.926 96.7334 182.459 99.3719C195.281 101.872 207.137 107.923 216.741 116.845Z" fill="currentColor"/>
<circle cx="167.669" cy="172.67" r="32.5" transform="rotate(165.334 167.669 172.67)" fill="currentColor"/>
</svg>
`,
  timeCircleWhite: `
<svg class='w-${size} h-${size} ${customClass}' viewBox="0 0 355 355" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M177.085 0C79.2909 0 0 79.2558 0 177.007C0 274.758 79.2909 354.014 177.085 354.014C274.88 354.014 354.171 274.758 354.171 177.007C354.171 79.2558 274.88 0 177.085 0ZM177.085 346.41C83.4713 346.41 7.60699 270.545 7.60699 177.007C7.60699 83.4686 83.4713 7.60362 177.085 7.60362C270.699 7.60362 346.564 83.4686 346.564 177.007C346.564 270.545 270.699 346.41 177.085 346.41Z" fill="#FEFCF9"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M175.987 301C212.787 301 245.872 285.095 268.744 259.783C276.188 253.124 280.873 243.445 280.873 232.671C280.873 212.588 264.594 196.307 244.513 196.307C231.63 196.307 220.311 203.009 213.853 213.116C204.212 223.085 190.697 229.283 175.735 229.283C146.45 229.283 122.71 205.54 122.71 176.253C122.71 146.965 146.45 123.222 175.735 123.222C190.46 123.222 203.784 129.226 213.392 138.919C219.935 148.535 230.967 154.85 243.474 154.85C263.555 154.85 279.834 138.569 279.834 118.486C279.834 108.786 276.036 99.9722 269.846 93.4522C246.941 67.4238 213.382 51 175.987 51C106.959 51 51 106.964 51 176C51 245.036 106.959 301 175.987 301Z" fill="#FEFCF9"/>
<circle r="26" transform="matrix(1 0 0 -1 176 176)" fill="#FEFCF9"/>
</svg>`,
  humanCircle: `
<svg class='w-${size} h-${size} ${customClass}' viewBox="0 0 355 355" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M177.085 0C79.2909 0 0 79.2558 0 177.007C0 274.758 79.2909 354.014 177.085 354.014C274.88 354.014 354.171 274.758 354.171 177.007C354.171 79.2558 274.88 0 177.085 0ZM177.085 346.41C83.4713 346.41 7.60699 270.545 7.60699 177.007C7.60699 83.4686 83.4713 7.60362 177.085 7.60362C270.699 7.60362 346.564 83.4686 346.564 177.007C346.564 270.545 270.699 346.41 177.085 346.41Z" fill="url(#paint0_linear_1442_6243)"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M299.668 175.591C299.544 205.232 288.992 232.391 271.501 253.609L271.48 253.591C265.02 263.285 253.97 269.652 241.448 269.599C221.632 269.517 205.635 253.387 205.718 233.573C205.763 222.886 210.476 213.31 217.919 206.768C224.682 197.982 228.723 186.988 228.773 175.045C228.894 146.095 205.522 122.528 176.569 122.407C147.616 122.286 124.047 145.656 123.926 174.606C123.88 185.75 127.315 196.097 133.209 204.616C139.077 211.033 142.642 219.588 142.603 228.968C142.52 248.782 126.389 264.778 106.573 264.695C96.2805 264.652 87.0184 260.28 80.5046 253.311L80.4734 253.336C80.3273 253.158 80.1817 252.979 80.0366 252.8C78.8715 251.505 77.7996 250.125 76.8311 248.669C61.4613 227.976 52.4132 202.316 52.5294 174.557C52.8151 106.318 108.371 51.2316 176.616 51.5173C244.862 51.8029 299.954 107.353 299.668 175.591ZM180.777 240.256C179.097 234.974 168.955 234.845 167.104 240.07C164.685 246.9 161.686 253.83 158.157 259.13C152.512 267.609 142.162 276.945 135.58 282.463C132.796 284.797 133.2 289.224 136.497 290.751C145.559 294.948 161.734 301.509 174.293 301.509C186.795 301.509 201.203 295.007 209.203 290.808C212.265 289.201 212.546 285.046 209.941 282.772C203.969 277.56 194.55 268.683 189.449 260.482C185.989 254.919 183.086 247.515 180.777 240.256Z" fill="url(#paint1_linear_1442_6243)"/>
<circle r="25.7027" transform="matrix(-0.00418594 0.999991 0.999991 0.00418594 176.099 175.087)" fill="#2F5FBD"/>
<defs>
<linearGradient id="paint0_linear_1442_6243" x1="165.68" y1="-1.97816e-07" x2="156.784" y2="330.564" gradientUnits="userSpaceOnUse">
<stop stop-color="#0BE09D"/>
<stop offset="0.223958" stop-color="#1DD2BC"/>
<stop offset="0.5" stop-color="#129AF6"/>
<stop offset="0.75" stop-color="#176FD6"/>
<stop offset="1" stop-color="#5F48BA"/>
</linearGradient>
<linearGradient id="paint1_linear_1442_6243" x1="185.925" y1="51.5562" x2="186.487" y2="301.556" gradientUnits="userSpaceOnUse">
<stop stop-color="#0BE09D"/>
<stop offset="0.151042" stop-color="#1DD2BC"/>
<stop offset="0.4375" stop-color="#129AF6"/>
<stop offset="0.6875" stop-color="#176FD6"/>
<stop offset="0.885417" stop-color="#4A48BA"/>
</linearGradient>
</defs>
</svg>`,
  humanCircleWhite: `<svg class='w-${size} h-${size} ${customClass}' viewBox="0 0 355 355" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M177.085 0C79.2909 0 0 79.2558 0 177.007C0 274.758 79.2909 354.014 177.085 354.014C274.88 354.014 354.171 274.758 354.171 177.007C354.171 79.2558 274.88 0 177.085 0ZM177.085 346.41C83.4713 346.41 7.60699 270.545 7.60699 177.007C7.60699 83.4686 83.4713 7.60362 177.085 7.60362C270.699 7.60362 346.564 83.4686 346.564 177.007C346.564 270.545 270.699 346.41 177.085 346.41Z" fill="#FEFCF9"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M299.668 175.591C299.544 205.232 288.992 232.391 271.501 253.609L271.48 253.591C265.02 263.285 253.97 269.652 241.448 269.6C221.632 269.517 205.635 253.387 205.718 233.573C205.763 222.886 210.476 213.31 217.919 206.768C224.682 197.982 228.723 186.988 228.773 175.045C228.894 146.095 205.522 122.529 176.569 122.407C147.616 122.286 124.047 145.656 123.926 174.606C123.88 185.751 127.315 196.097 133.209 204.616C139.077 211.033 142.642 219.588 142.603 228.969C142.52 248.783 126.389 264.778 106.573 264.695C96.2805 264.652 87.0184 260.28 80.5046 253.311L80.4734 253.337C80.3273 253.158 80.1817 252.98 80.0366 252.801C78.8715 251.505 77.7996 250.125 76.8311 248.67C61.4613 227.976 52.4132 202.316 52.5294 174.557C52.8151 106.318 108.371 51.2318 176.616 51.5175C244.862 51.8032 299.954 107.353 299.668 175.591ZM180.777 240.256C179.097 234.974 168.955 234.845 167.104 240.07C164.685 246.901 161.686 253.83 158.157 259.13C152.512 267.609 142.162 276.945 135.58 282.463C132.796 284.797 133.2 289.225 136.497 290.752C145.559 294.949 161.734 301.509 174.293 301.509C186.795 301.509 201.203 295.007 209.203 290.808C212.265 289.201 212.546 285.046 209.941 282.773C203.969 277.56 194.55 268.683 189.449 260.482C185.989 254.919 183.086 247.515 180.777 240.256Z" fill="#FEFCF9"/>
<circle r="25.7027" transform="matrix(-0.00418594 0.999991 0.999991 0.00418594 176.099 175.087)" fill="#FEFCF9"/>
</svg>`,
  euro: `
<svg xmlns="http://www.w3.org/2000/svg" class='w-${size} h-${size} ${customClass}' ><path style="fill:currentColor" d="M0,198L55,198C54,204 54,210 54,216C54,222 54,228 55,234H16L0,270H61C86,362 171.5,432 270,432C324.5,432 375.5,410.5 414,375.5L414,323.5C381,367.5 328.5,396 270,396C190,396 121.5,343 98.5,270H342L358,234H91C90,228 90,222 90,216C90,211 90,204 91,198H374L390,162H98.5C121,90 189,36 270,36C333,36 381,64.5 414,108L430,72.5C390,28 333,0 270,0C171,0 85.5,71 61,162H16Z"/></svg>`,
  qrcode: `
<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" class='w-${size} h-${size} ${customClass}' x="0px" y="0px" viewBox="0 0 1000 1000" xml:space="preserve">
<g><path d="M173.3,282.2h108.9V173.3H173.3V282.2z M336.7,663.3h108.9V554.4H336.7V663.3z M255.5,745.5v-82.2H118.9v217.8h217.8V745.5H255.5z M10,554.4v108.9h108.9V554.4H10z M336.7,990h108.9V881.1H336.7V990z M10,990h108.9V881.1H10V990z M10,445.6h435.6V10H10V445.6z M92.2,92.2h272.2v272.2H92.2V92.2z M663.3,118.9V10H554.4v108.9v108.9h217.8v108.9h108.9V118.9H663.3z M554.4,445.6h217.8V336.7H554.4V445.6z M990,10H881.1v108.9H990V10z M554.4,990H990V554.4H554.4V990z M636.6,636.6h272.2v272.2H636.6V636.6z M990,445.6V336.7H881.1v108.9H990z M717.8,826.7h108.9V717.8H717.8V826.7z" fill="currentColor"/></g>
</svg>`,
  circlesinfinity: `
<svg class='w-${size} h-${size} ${customClass}' viewBox="0 0 84 55" fill="none" xmlns="http://www.w3.org/2000/svg">
<g opacity="0.85">
<path fill-rule="evenodd" clip-rule="evenodd" d="M26.9714 18.0454C27.7795 18.4656 28.7061 18.6704 29.673 18.5919C32.4639 18.3653 34.5333 15.8633 34.2951 13.0036C34.115 10.8413 32.6673 9.09369 30.7654 8.46782C27.3238 7.00957 23.559 6.53165 19.8751 7.09236C15.9576 7.68865 12.3 9.43391 9.34573 12.1165C6.3915 14.7991 4.26761 18.3038 3.23162 22.2056C2.19563 26.1074 2.29204 30.2386 3.50916 34.0984C4.72628 37.9581 7.01182 41.3805 10.0886 43.9506C13.1654 46.5207 16.9013 48.1281 20.8433 48.5777C24.7852 49.0274 28.7639 48.3001 32.2967 46.484C35.8296 44.6679 38.765 41.841 40.7468 38.3462L40.7314 38.337C41.4521 37.3554 41.8357 36.1075 41.7254 34.783C41.4868 31.9171 39.0259 29.778 36.229 30.0052C34.2884 30.1628 32.6959 31.4181 31.9824 33.1293L31.9686 33.1211C30.9673 34.8867 29.4844 36.3149 27.6995 37.2324C25.9146 38.15 23.9045 38.5174 21.913 38.2902C19.9214 38.063 18.034 37.251 16.4795 35.9525C14.925 34.6541 13.7703 32.925 13.1554 30.975C12.5405 29.025 12.4918 26.9378 13.0152 24.9665C13.5386 22.9952 14.6116 21.2246 16.1042 19.8693C17.5967 18.514 19.4446 17.6323 21.4238 17.331C23.3013 17.0453 25.2204 17.2935 26.9714 18.0454Z" fill="white"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M26.9714 18.0454C27.7795 18.4656 28.7061 18.6704 29.673 18.5919C32.4639 18.3653 34.5333 15.8633 34.2951 13.0036C34.115 10.8413 32.6673 9.09369 30.7654 8.46782C27.3238 7.00957 23.559 6.53165 19.8751 7.09236C15.9576 7.68865 12.3 9.43391 9.34573 12.1165C6.3915 14.7991 4.26761 18.3038 3.23162 22.2056C2.19563 26.1074 2.29204 30.2386 3.50916 34.0984C4.72628 37.9581 7.01182 41.3805 10.0886 43.9506C13.1654 46.5207 16.9013 48.1281 20.8433 48.5777C24.7852 49.0274 28.7639 48.3001 32.2967 46.484C35.8296 44.6679 38.765 41.841 40.7468 38.3462L40.7314 38.337C41.4521 37.3554 41.8357 36.1075 41.7254 34.783C41.4868 31.9171 39.0259 29.778 36.229 30.0052C34.2884 30.1628 32.6959 31.4181 31.9824 33.1293L31.9686 33.1211C30.9673 34.8867 29.4844 36.3149 27.6995 37.2324C25.9146 38.15 23.9045 38.5174 21.913 38.2902C19.9214 38.063 18.034 37.251 16.4795 35.9525C14.925 34.6541 13.7703 32.925 13.1554 30.975C12.5405 29.025 12.4918 26.9378 13.0152 24.9665C13.5386 22.9952 14.6116 21.2246 16.1042 19.8693C17.5967 18.514 19.4446 17.6323 21.4238 17.331C23.3013 17.0453 25.2204 17.2935 26.9714 18.0454Z" fill="white"/>
<ellipse cx="22.8615" cy="27.9772" rx="4.35085" ry="4.35085" transform="rotate(-30.3791 22.8615 27.9772)" fill="currentColor"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M45.6364 23.7812C45.3102 24.6167 44.7563 25.3747 43.9887 25.9544C41.7744 27.6265 38.6201 27.1818 36.9433 24.9613C35.6758 23.2829 35.6153 21.0701 36.6177 19.3677C38.222 16.0512 40.7012 13.2296 43.7937 11.2111C47.0821 9.06477 50.9225 7.91861 54.8493 7.9116C58.776 7.90459 62.6205 9.03703 65.9165 11.1716C69.2124 13.3062 71.8183 16.3512 73.418 19.9373C75.0178 23.5235 75.5427 27.4967 74.9291 31.3753C74.3155 35.2539 72.5898 38.8711 69.9612 41.7883C67.3327 44.7056 63.9142 46.7975 60.1203 47.8105C56.3264 48.8235 52.3201 48.7139 48.5872 47.4952L48.5927 47.4785C47.4227 47.244 46.3299 46.5957 45.5533 45.5673C43.8729 43.342 44.3095 40.1796 46.5285 38.5039C48.0681 37.3413 50.0612 37.1999 51.6986 37.9655L51.7035 37.9505C53.5894 38.5662 55.6135 38.6216 57.5302 38.1098C59.4469 37.598 61.174 36.5412 62.502 35.0673C63.83 33.5934 64.7019 31.766 65.0119 29.8064C65.3219 27.8469 65.0567 25.8395 64.2485 24.0277C63.4403 22.2159 62.1237 20.6775 60.4586 19.5991C58.7934 18.5207 56.8511 17.9486 54.8672 17.9521C52.8833 17.9556 50.943 18.5347 49.2817 19.6191C47.7065 20.6472 46.4462 22.0878 45.6364 23.7812Z" fill="white"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M45.6363 23.7813C45.3102 24.6168 44.7563 25.3747 43.9887 25.9544C41.7744 27.6265 38.6201 27.1818 36.9433 24.9613C35.6758 23.2828 35.6153 21.0701 36.6177 19.3676C38.222 16.0511 40.7013 13.2296 43.7938 11.2111C47.0821 9.06476 50.9225 7.91861 54.8493 7.9116C58.776 7.90459 62.6205 9.03703 65.9165 11.1716C69.2124 13.3062 71.8183 16.3511 73.418 19.9373C75.0178 23.5235 75.5427 27.4967 74.9291 31.3753C74.3155 35.2539 72.5898 38.8711 69.9612 41.7883C67.3327 44.7056 63.9142 46.7975 60.1203 47.8105C56.3264 48.8235 52.3201 48.7139 48.5872 47.4952L48.5927 47.4785C47.4227 47.244 46.3299 46.5957 45.5533 45.5673C43.8729 43.342 44.3095 40.1796 46.5285 38.5039C48.0681 37.3413 50.0612 37.1999 51.6986 37.9655L51.7035 37.9505C53.5894 38.5662 55.6135 38.6216 57.5302 38.1098C59.447 37.598 61.174 36.5411 62.502 35.0673C63.83 33.5934 64.7019 31.7659 65.0119 29.8064C65.3219 27.8469 65.0567 25.8395 64.2485 24.0277C63.4403 22.2159 62.1237 20.6775 60.4586 19.5991C58.7934 18.5207 56.8511 17.9486 54.8672 17.9521C52.8833 17.9556 50.943 18.5347 49.2817 19.6191C47.7065 20.6472 46.4462 22.0878 45.6363 23.7813Z" fill="white"/>
<ellipse cx="55.0059" cy="28.3103" rx="4.59375" ry="4.59375" transform="rotate(-30.3791 55.0059 28.3103)" fill="currentColor"/>
</g>
</svg>
`,
  whatsapp: `
<svg xmlns="http://www.w3.org/2000/svg" class='w-${size} h-${size} ${customClass}' viewBox="0 0 175.216 175.552"><defs><linearGradient id="b" x1="85.915" x2="86.535" y1="32.567" y2="137.092" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#57d163"/><stop offset="1" stop-color="#23b33a"/></linearGradient><filter id="a" width="1.115" height="1.114" x="-.057" y="-.057" color-interpolation-filters="sRGB"><feGaussianBlur stdDeviation="3.531"/></filter></defs><path fill="#b3b3b3" d="m54.532 138.45 2.235 1.324c9.387 5.571 20.15 8.518 31.126 8.523h.023c33.707 0 61.139-27.426 61.153-61.135.006-16.335-6.349-31.696-17.895-43.251A60.75 60.75 0 0 0 87.94 25.983c-33.733 0-61.166 27.423-61.178 61.13a60.98 60.98 0 0 0 9.349 32.535l1.455 2.312-6.179 22.558zm-40.811 23.544L24.16 123.88c-6.438-11.154-9.825-23.808-9.821-36.772.017-40.556 33.021-73.55 73.578-73.55 19.681.01 38.154 7.669 52.047 21.572s21.537 32.383 21.53 52.037c-.018 40.553-33.027 73.553-73.578 73.553h-.032c-12.313-.005-24.412-3.094-35.159-8.954zm0 0" filter="url(#a)"/><path fill="#fff" d="m12.966 161.238 10.439-38.114a73.42 73.42 0 0 1-9.821-36.772c.017-40.556 33.021-73.55 73.578-73.55 19.681.01 38.154 7.669 52.047 21.572s21.537 32.383 21.53 52.037c-.018 40.553-33.027 73.553-73.578 73.553h-.032c-12.313-.005-24.412-3.094-35.159-8.954z"/><path fill="url(#linearGradient1780)" d="M87.184 25.227c-33.733 0-61.166 27.423-61.178 61.13a60.98 60.98 0 0 0 9.349 32.535l1.455 2.312-6.179 22.559 23.146-6.069 2.235 1.324c9.387 5.571 20.15 8.518 31.126 8.524h.023c33.707 0 61.14-27.426 61.153-61.135a60.75 60.75 0 0 0-17.895-43.251 60.75 60.75 0 0 0-43.235-17.929z"/><path fill="url(#b)" d="M87.184 25.227c-33.733 0-61.166 27.423-61.178 61.13a60.98 60.98 0 0 0 9.349 32.535l1.455 2.313-6.179 22.558 23.146-6.069 2.235 1.324c9.387 5.571 20.15 8.517 31.126 8.523h.023c33.707 0 61.14-27.426 61.153-61.135a60.75 60.75 0 0 0-17.895-43.251 60.75 60.75 0 0 0-43.235-17.928z"/><path fill="#fff" fill-rule="evenodd" d="M68.772 55.603c-1.378-3.061-2.828-3.123-4.137-3.176l-3.524-.043c-1.226 0-3.218.46-4.902 2.3s-6.435 6.287-6.435 15.332 6.588 17.785 7.506 19.013 12.718 20.381 31.405 27.75c15.529 6.124 18.689 4.906 22.061 4.6s10.877-4.447 12.408-8.74 1.532-7.971 1.073-8.74-1.685-1.226-3.525-2.146-10.877-5.367-12.562-5.981-2.91-.919-4.137.921-4.746 5.979-5.819 7.206-2.144 1.381-3.984.462-7.76-2.861-14.784-9.124c-5.465-4.873-9.154-10.891-10.228-12.73s-.114-2.835.808-3.751c.825-.824 1.838-2.147 2.759-3.22s1.224-1.84 1.836-3.065.307-2.301-.153-3.22-4.032-10.011-5.666-13.647"/></svg>`,
  telegram: `
<svg id="Livello_1" class='w-${size} h-${size} ${customClass}' data-name="Livello 1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 240 240"><defs><linearGradient id="linear-gradient" x1="120" y1="240" x2="120" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#1d93d2"/><stop offset="1" stop-color="#38b0e3"/></linearGradient></defs><title>Telegram_logo</title><circle cx="120" cy="120" r="120" fill="url(#linear-gradient)"/><path d="M81.229,128.772l14.237,39.406s1.78,3.687,3.686,3.687,30.255-29.492,30.255-29.492l31.525-60.89L81.737,118.6Z" fill="#c8daea"/><path d="M100.106,138.878l-2.733,29.046s-1.144,8.9,7.754,0,17.415-15.763,17.415-15.763" fill="#a9c6d8"/><path d="M81.486,130.178,52.2,120.636s-3.5-1.42-2.373-4.64c.232-.664.7-1.229,2.1-2.2,6.489-4.523,120.106-45.36,120.106-45.36s3.208-1.081,5.1-.362a2.766,2.766,0,0,1,1.885,2.055,9.357,9.357,0,0,1,.254,2.585c-.009.752-.1,1.449-.169,2.542-.692,11.165-21.4,94.493-21.4,94.493s-1.239,4.876-5.678,5.043A8.13,8.13,0,0,1,146.1,172.5c-8.711-7.493-38.819-27.727-45.472-32.177a1.27,1.27,0,0,1-.546-.9c-.093-.469.417-1.05.417-1.05s52.426-46.6,53.821-51.492c.108-.379-.3-.566-.848-.4-3.482,1.281-63.844,39.4-70.506,43.607A3.21,3.21,0,0,1,81.486,130.178Z" fill="#fff"/></svg>`,
  under16: `

<svg xmlns="http://www.w3.org/2000/svg" class='w-${size} h-${size} ${customClass}' shape-rendering="geometricPrecision" text-rendering="geometricPrecision" image-rendering="optimizeQuality" fill-rule="evenodd" clip-rule="evenodd" viewBox="0 0 512 512"><path d="M412.36 51.79h23.85c4.86 0 8.83 3.98 8.83 8.84V93h32.38c4.86 0 8.83 3.98 8.83 8.84v23.85c0 4.86-3.97 8.84-8.83 8.84h-32.38v32.37c0 4.87-3.97 8.84-8.83 8.84h-23.85c-4.86 0-8.84-3.97-8.84-8.84v-32.37h-32.38c-4.86 0-8.84-3.98-8.84-8.84v-23.85c0-4.86 3.98-8.84 8.84-8.84h32.38V60.63c0-4.86 3.98-8.84 8.84-8.84zM235.42 329.41h-87.58c-5 0-7.12-2.23-7.12-7.48v-25.18c0-5.26 2.12-7.49 7.12-7.49h22.2v-69.5H151.8c-5 0-7.12-2.23-7.12-7.49V187.1c0-5.26 2.12-7.49 7.12-7.49h57.47c5.01 0 7.13 2.23 7.13 7.49v102.16h19.02c5.01 0 7.14 2.23 7.14 7.49v25.18c0 5.25-2.13 7.48-7.14 7.48zm77.98 3.13c-12.16 0-22.1-1.01-29.82-3.02-11.71-3.03-23.06-8.98-27.15-21.75-1.65-5.12-2.48-10.88-2.48-17.27v-69.69c0-12.62 3.48-22.89 10.4-30.79 6.94-7.91 19.72-11.86 38.34-11.86h45.58c5 0 7.13 2.25 7.13 7.49v24.55c0 5.24-2.14 7.49-7.13 7.49h-37.05c-4.87 0-8.21.8-9.91 2.39-1.71 1.58-2.58 6.43-2.58 11.54v4.58c3.17-.97 6.85-1.73 11-2.29 4.15-.54 8.88-.83 14.16-.83 17.83 0 30.06 3.16 36.66 9.46 6.6 6.31 9.91 15.66 9.91 27.99v19.97c0 6.38-.83 12.15-2.48 17.27-4.01 12.52-14.95 18.63-26.45 21.75-7.39 2.01-16.78 3.02-28.13 3.02zm-16.05-59.09v13.72c0 2.2.81 4.08 2.38 5.52 1.57 1.44 6.6 2.19 12.28 2.19 5.95 0 11.09-.75 12.66-2.19 1.57-1.44 2.38-3.29 2.38-5.52v-13.72c0-2.08-.81-3.86-2.38-5.31-1.57-1.44-6.71-2.18-12.66-2.18-5.68 0-10.71.74-12.28 2.18-1.57 1.45-2.38 3.26-2.38 5.31z"/><path fill="#EB0100" fill-rule="nonzero" d="M173.37 65.08 380 422.99c8.18-6.08 15.88-12.74 23.07-19.92 37.62-37.63 60.91-89.63 60.91-147.07 0-16.73-1.98-32.99-5.71-48.57 14.97-8.37 26.3-23.98 39.12-36.88C506.85 197.28 512 226.04 512 256c0 70.68-28.66 134.69-74.99 181.01C390.69 483.34 326.68 512 256 512c-70.68 0-134.69-28.66-181.02-74.99C28.66 390.69 0 326.68 0 256c0-70.68 28.66-134.69 74.98-181.02C121.31 28.66 185.32 0 256 0c43.4 0 84.28 10.82 120.1 29.88-16.68 10.8-27.45 21.04-36 35.85-25.71-11.38-54.17-17.71-84.1-17.71-29.36 0-57.31 6.09-82.63 17.06zm165.25 381.84L131.99 89.01a208.41 208.41 0 0 0-23.06 19.92C71.31 146.56 48.02 198.56 48.02 256s23.29 109.44 60.91 147.07c37.63 37.62 89.63 60.91 147.07 60.91 29.36 0 57.29-6.09 82.62-17.06z"/></svg>
`,
  under18: `

<svg xmlns="http://www.w3.org/2000/svg" class='w-${size} h-${size} ${customClass}' shape-rendering="geometricPrecision" text-rendering="geometricPrecision" image-rendering="optimizeQuality" fill-rule="evenodd" clip-rule="evenodd" viewBox="0 0 512 512"><g fill-rule="nonzero"><path d="M230.71 338.25H137.6c-2.66 0-4.59-.63-5.79-1.88-1.19-1.26-1.79-3.28-1.79-6.08v-26.77c0-2.8.6-4.83 1.79-6.08 1.2-1.26 3.13-1.88 5.79-1.88h23.6v-73.88h-19.38c-2.67 0-4.6-.62-5.8-1.87-1.19-1.26-1.79-3.29-1.79-6.09v-26.76c0-2.81.6-4.83 1.79-6.09 1.2-1.25 3.13-1.87 5.8-1.87h61.08c2.67 0 4.6.62 5.8 1.87 1.19 1.26 1.78 3.28 1.78 6.09v108.6h20.23c2.66 0 4.59.62 5.78 1.88 1.2 1.25 1.8 3.28 1.8 6.08v26.77c0 2.8-.6 4.82-1.8 6.08-1.19 1.25-3.12 1.88-5.78 1.88zM412.36 51.79h23.85c4.86 0 8.83 3.98 8.83 8.84V93h32.38c4.86 0 8.83 3.98 8.83 8.84v23.85c0 4.86-3.97 8.84-8.83 8.84h-32.38v32.37c0 4.87-3.97 8.84-8.83 8.84h-23.85c-4.86 0-8.84-3.97-8.84-8.84v-32.37h-32.38c-4.86 0-8.84-3.98-8.84-8.84v-23.85c0-4.86 3.98-8.84 8.84-8.84h32.38V60.63c0-4.86 3.98-8.84 8.84-8.84zm-31.22 229.83v21.46c0 5.74-1.02 10.99-3.05 15.7-2.03 4.72-5.52 8.78-10.43 12.16-4.91 3.4-11.55 6.02-19.9 7.86-8.35 1.84-18.85 2.76-31.49 2.76-12.64 0-23.18-.92-31.59-2.76-8.43-1.84-15.1-4.46-20.01-7.86-4.92-3.38-8.4-7.44-10.43-12.16-2.03-4.71-3.05-9.95-3.05-15.7v-21.46c0-10.32 2.14-18.29 6.42-23.89 4.28-5.59 9.59-9.06 15.9-10.39-4.63-2.07-7.86-5.16-9.68-9.29-1.83-4.13-2.75-10.44-2.75-16.04v-12.83c0-5.46.92-10.33 2.75-14.59 1.81-4.28 4.85-7.94 9.04-10.96 4.22-3.01 9.92-5.35 17.07-6.96 7.16-1.62 16.01-2.44 26.54-2.44 10.53 0 19.35.82 26.44 2.44 7.08 1.61 12.71 3.95 16.85 6.96 4.13 3.02 7.09 6.68 8.84 10.96 1.75 4.26 2.63 9.15 2.63 14.59v12.83c0 5.58-.9 11.91-2.73 16.04-1.83 4.13-5.06 7.22-9.69 9.29 6.32 1.33 11.62 4.8 15.9 10.39 4.29 5.6 6.42 13.58 6.42 23.89zm-79.52-49.54c0 2.29.73 4.31 2.21 5.86 1.47 1.55 6.54 2.32 12.44 2.32 6.04 0 11.12-.79 12.44-2.32 1.31-1.53 2-3.5 2-5.86v-12.62c0-2.22-.68-4.09-2-5.64-1.34-1.55-6.4-2.33-12.44-2.33-5.9 0-10.97.78-12.44 2.33-1.48 1.55-2.21 3.46-2.21 5.64v12.62zm-5.27 62.59c0 2.31 1.21 4.33 3.58 5.86 2.38 1.54 8.76 2.33 16.34 2.33s13.92-.79 16.23-2.33c2.3-1.53 3.47-3.5 3.47-5.86V281.5c0-2.21-1.16-4.09-3.47-5.64-2.32-1.54-8.65-2.32-16.23-2.32s-13.96.78-16.34 2.32c-2.39 1.55-3.58 3.46-3.58 5.64v13.17z"/><path fill="#EB0100" d="M173.37 65.08 380 422.99c8.18-6.08 15.88-12.74 23.07-19.92 37.62-37.63 60.91-89.63 60.91-147.07 0-16.73-1.98-32.99-5.71-48.57 14.97-8.37 26.3-23.98 39.12-36.88C506.85 197.28 512 226.04 512 256c0 70.68-28.66 134.69-74.99 181.01C390.69 483.34 326.68 512 256 512c-70.68 0-134.69-28.66-181.02-74.99C28.66 390.69 0 326.68 0 256c0-70.68 28.66-134.69 74.98-181.02C121.31 28.66 185.32 0 256 0c43.4 0 84.28 10.82 120.1 29.88-16.68 10.8-27.45 21.04-36 35.85-25.71-11.38-54.17-17.71-84.1-17.71-29.36 0-57.31 6.09-82.63 17.06zm165.25 381.84L131.99 89.01a208.41 208.41 0 0 0-23.06 19.92C71.31 146.56 48.02 198.56 48.02 256s23.29 109.44 60.91 147.07c37.63 37.62 89.63 60.91 147.07 60.91 29.36 0 57.29-6.09 82.62-17.06z"/></g></svg>`,
};

export let icon: string = null;
</script>

{#if icon}
  {#if !icons[icon]}
    <Icon name="{icon}" class="w-{size} h-{size} heroicon smallicon inline" />
  {:else}
    {@html icons[icon]}
  {/if}
{/if}
