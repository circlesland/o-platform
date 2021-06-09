<script lang="ts">
  const icons = {
    filter: `<svg
      class="w-5 h-5 navbuttonicon"
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
      class="w-5 h-5 navbuttonicon"
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
    home: `<svg class="w-5 h-5 navbuttonicon" viewBox="0 0 20 22" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M1 7.99988L10 0.999878L19 7.99988V18.9999C19 19.5303 18.7893 20.039 18.4142 20.4141C18.0391 20.7892 17.5304 20.9999 17 20.9999H3C2.46957 20.9999 1.96086 20.7892 1.58579 20.4141C1.21071 20.039 1 19.5303 1 18.9999V7.99988Z" stroke="#003399" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`,
    dash: `<svg
          class="w-5 h-5 navbuttonicon"
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
  };

  export let icon: string = null;

</script>

{#if icon}
  {@html icons[icon]}
{/if}
