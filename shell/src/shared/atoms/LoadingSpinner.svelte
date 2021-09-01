<div class="relative">
  <div class="pt-6 spinner"></div>
  <img
    src="/logos/circles-no-ring.png"
    alt="loading..."
    class="absolute top-0 w-20 h-20 " />
</div>

<style>
  @keyframes rotate {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }

  /* css version 
    We're doing it this way, because rotating an image via css is extremely heavy on the cpu...
  */
  .spinner {
    animation: rotate 1s linear infinite;
    background: cyan;
    border-radius: 50%;
    @apply w-20;
    @apply h-20;
    position: relative;
  }

  .spinner::before,
  .spinner::after {
    content: "";
    position: absolute;
  }

  .spinner::before {
    border-radius: 50%;
    background: linear-gradient(
          0deg,
          hsla(0, 0%, 100%, 1) 50%,
          hsla(0, 0%, 100%, 0.9) 100%
        )
        0% 0%,
      linear-gradient(
          90deg,
          hsla(0, 0%, 100%, 0.9) 0%,
          hsla(0, 0%, 100%, 0.6) 100%
        )
        100% 0%,
      linear-gradient(
          180deg,
          hsla(0, 0%, 100%, 0.6) 0%,
          hsla(0, 0%, 100%, 0.3) 100%
        )
        100% 100%,
      linear-gradient(
          360deg,
          hsla(0, 0%, 100%, 0.3) 0%,
          hsla(0, 0%, 100%, 0) 100%
        )
        0% 100%;
    background-repeat: no-repeat;
    background-size: 50% 50%;
    top: -1px;
    bottom: -1px;
    left: -1px;
    right: -1px;
  }

  .spinner::after {
    background: white;
    border-radius: 50%;
    top: 3%;
    bottom: 3%;
    left: 3%;
    right: 3%;
  }
</style>
