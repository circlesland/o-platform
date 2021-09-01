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

  /* svg version pro: has transparent background. con: needs to be re-built on change */
  .loading-spinner {
    animation: rotate 1s linear infinite;
    background: url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB2aWV3Qm94PSIwLDAgMjAwLDIwMCI+PGRlZnM+PGNsaXBQYXRoIGlkPSJyaW5nIj48cGF0aCBkPSJNMjAwLDEwMEExMDAsMTAwLDAsMSwxLDE5Ny44MSw3OS4yMUwxODguMDMsODEuMjlBOTAsOTAsMCwxLDAsMTkwLDEwMHoiLz48L2NsaXBQYXRoPjxmaWx0ZXIgaWQ9ImJsdXIiIHg9IjAiIHk9IjAiPjxmZUdhdXNzaWFuQmx1ciBpbj0iU291cmNlR3JhcGhpYyIgc3RkRGV2aWF0aW9uPSIzIiAvPjwvZmlsdGVyPjxwYXRoIGlkPSJwIiBkPSJNMjUwLDEwMEExNTAsMTUwLDAsMCwxLDI0Ni43MiwxMzEuMTlMMTAwLDEwMEEwLDAsMCwwLDAsMTAwLDEwMHoiIGZpbGw9ImN5YW4iLz48L2RlZnM+PGcgY2xpcC1wYXRoPSJ1cmwoI3JpbmcpIj48ZyBmaWx0ZXI9InVybCgjYmx1cikiIHRyYW5zZm9ybT0icm90YXRlKC02IDEwMCAxMDApIj48dXNlIHhsaW5rOmhyZWY9IiNwIiBmaWxsLW9wYWNpdHk9IjAiIHRyYW5zZm9ybT0icm90YXRlKDAgMTAwIDEwMCkiLz48dXNlIHhsaW5rOmhyZWY9IiNwIiBmaWxsLW9wYWNpdHk9Ii4wMyIgdHJhbnNmb3JtPSJyb3RhdGUoMTIgMTAwIDEwMCkiLz48dXNlIHhsaW5rOmhyZWY9IiNwIiBmaWxsLW9wYWNpdHk9Ii4wNyIgdHJhbnNmb3JtPSJyb3RhdGUoMjQgMTAwIDEwMCkiLz48dXNlIHhsaW5rOmhyZWY9IiNwIiBmaWxsLW9wYWNpdHk9Ii4xIiB0cmFuc2Zvcm09InJvdGF0ZSgzNiAxMDAgMTAwKSIvPjx1c2UgeGxpbms6aHJlZj0iI3AiIGZpbGwtb3BhY2l0eT0iLjE0IiB0cmFuc2Zvcm09InJvdGF0ZSg0OCAxMDAgMTAwKSIvPjx1c2UgeGxpbms6aHJlZj0iI3AiIGZpbGwtb3BhY2l0eT0iLjE3IiB0cmFuc2Zvcm09InJvdGF0ZSg2MCAxMDAgMTAwKSIvPjx1c2UgeGxpbms6aHJlZj0iI3AiIGZpbGwtb3BhY2l0eT0iLjIiIHRyYW5zZm9ybT0icm90YXRlKDcyIDEwMCAxMDApIi8+PHVzZSB4bGluazpocmVmPSIjcCIgZmlsbC1vcGFjaXR5PSIuMjQiIHRyYW5zZm9ybT0icm90YXRlKDg0IDEwMCAxMDApIi8+PHVzZSB4bGluazpocmVmPSIjcCIgZmlsbC1vcGFjaXR5PSIuMjgiIHRyYW5zZm9ybT0icm90YXRlKDk2IDEwMCAxMDApIi8+PHVzZSB4bGluazpocmVmPSIjcCIgZmlsbC1vcGFjaXR5PSIuMzEiIHRyYW5zZm9ybT0icm90YXRlKDEwOCAxMDAgMTAwKSIvPjx1c2UgeGxpbms6aHJlZj0iI3AiIGZpbGwtb3BhY2l0eT0iLjM0IiB0cmFuc2Zvcm09InJvdGF0ZSgxMjAgMTAwIDEwMCkiLz48dXNlIHhsaW5rOmhyZWY9IiNwIiBmaWxsLW9wYWNpdHk9Ii4zOCIgdHJhbnNmb3JtPSJyb3RhdGUoMTMyIDEwMCAxMDApIi8+PHVzZSB4bGluazpocmVmPSIjcCIgZmlsbC1vcGFjaXR5PSIuNDEiIHRyYW5zZm9ybT0icm90YXRlKDE0NCAxMDAgMTAwKSIvPjx1c2UgeGxpbms6aHJlZj0iI3AiIGZpbGwtb3BhY2l0eT0iLjQ1IiB0cmFuc2Zvcm09InJvdGF0ZSgxNTYgMTAwIDEwMCkiLz48dXNlIHhsaW5rOmhyZWY9IiNwIiBmaWxsLW9wYWNpdHk9Ii40OCIgdHJhbnNmb3JtPSJyb3RhdGUoMTY4IDEwMCAxMDApIi8+PHVzZSB4bGluazpocmVmPSIjcCIgZmlsbC1vcGFjaXR5PSIuNTIiIHRyYW5zZm9ybT0icm90YXRlKDE4MCAxMDAgMTAwKSIvPjx1c2UgeGxpbms6aHJlZj0iI3AiIGZpbGwtb3BhY2l0eT0iLjU1IiB0cmFuc2Zvcm09InJvdGF0ZSgxOTIgMTAwIDEwMCkiLz48dXNlIHhsaW5rOmhyZWY9IiNwIiBmaWxsLW9wYWNpdHk9Ii41OSIgdHJhbnNmb3JtPSJyb3RhdGUoMjA0IDEwMCAxMDApIi8+PHVzZSB4bGluazpocmVmPSIjcCIgZmlsbC1vcGFjaXR5PSIuNjIiIHRyYW5zZm9ybT0icm90YXRlKDIxNiAxMDAgMTAwKSIvPjx1c2UgeGxpbms6aHJlZj0iI3AiIGZpbGwtb3BhY2l0eT0iLjY2IiB0cmFuc2Zvcm09InJvdGF0ZSgyMjggMTAwIDEwMCkiLz48dXNlIHhsaW5rOmhyZWY9IiNwIiBmaWxsLW9wYWNpdHk9Ii42OSIgdHJhbnNmb3JtPSJyb3RhdGUoMjQwIDEwMCAxMDApIi8+PHVzZSB4bGluazpocmVmPSIjcCIgZmlsbC1vcGFjaXR5PSIuNyIgdHJhbnNmb3JtPSJyb3RhdGUoMjUyIDEwMCAxMDApIi8+PHVzZSB4bGluazpocmVmPSIjcCIgZmlsbC1vcGFjaXR5PSIuNzIiIHRyYW5zZm9ybT0icm90YXRlKDI2NCAxMDAgMTAwKSIvPjx1c2UgeGxpbms6aHJlZj0iI3AiIGZpbGwtb3BhY2l0eT0iLjc2IiB0cmFuc2Zvcm09InJvdGF0ZSgyNzYgMTAwIDEwMCkiLz48dXNlIHhsaW5rOmhyZWY9IiNwIiBmaWxsLW9wYWNpdHk9Ii43OSIgdHJhbnNmb3JtPSJyb3RhdGUoMjg4IDEwMCAxMDApIi8+PHVzZSB4bGluazpocmVmPSIjcCIgZmlsbC1vcGFjaXR5PSIuODMiIHRyYW5zZm9ybT0icm90YXRlKDMwMCAxMDAgMTAwKSIvPjx1c2UgeGxpbms6aHJlZj0iI3AiIGZpbGwtb3BhY2l0eT0iLjg2IiB0cmFuc2Zvcm09InJvdGF0ZSgzMTIgMTAwIDEwMCkiLz48dXNlIHhsaW5rOmhyZWY9IiNwIiBmaWxsLW9wYWNpdHk9Ii45MyIgdHJhbnNmb3JtPSJyb3RhdGUoMzI0IDEwMCAxMDApIi8+PHVzZSB4bGluazpocmVmPSIjcCIgZmlsbC1vcGFjaXR5PSIuOTciIHRyYW5zZm9ybT0icm90YXRlKDMzNiAxMDAgMTAwKSIvPjx1c2UgeGxpbms6aHJlZj0iI3AiIGZpbGwtb3BhY2l0eT0iMSIgdHJhbnNmb3JtPSJyb3RhdGUoMzQ4IDEwMCAxMDApIi8+PC9nPjwvZz48L3N2Zz4=")
      no-repeat;
    @apply w-20;
    @apply h-20;
  }
  /* css version */
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

  /* 
  SVG For SVG Version:
  https://stackoverflow.com/questions/22531861/ring-shaped-process-spinner-with-fading-gradient-effect-around-the-ring
  <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0,0 200,200">
    <defs>

        <!-- Ring shape centred on 100, 100 with inner radius 90px, outer
             radius 100px and a 12 degree gap at 348. -->
        <clipPath id="ring">
            <path d="M 200, 100
                     A 100, 100, 0, 1, 1, 197.81, 79.21
                     L 188.03, 81.29
                     A 90, 90, 0, 1, 0, 190, 100 z"/>
        </clipPath>

        <!-- Very simple Gaussian blur, used to visually merge sectors. -->
        <filter id="blur" x="0" y="0">
            <feGaussianBlur in="SourceGraphic" stdDeviation="3" />
        </filter>

        <!-- A 12 degree sector extending to 150px. -->
        <path id="p" d="M 250, 100
                        A 150, 150, 0, 0, 1, 246.72, 131.19
                        L 100, 100
                        A 0, 0, 0, 0, 0, 100, 100 z" fill="cyan"/>
    </defs>

    <!-- Clip the blurred sectors to the ring shape. -->
    <g clip-path="url(#ring)">

        <!-- Blur the sectors together to make a smooth shape and rotate
             them anti-clockwise by 6 degrees to hide the seam where the
             fully opaque sector blurs with the fully transparent one. -->
        <g filter="url(#blur)" transform="rotate(-6 100 100)">

            <!-- Each successive sector increases in opacity and is rotated
                 by a further 12 degrees. -->
            <use xlink:href="#p" fill-opacity="0"    transform="rotate(  0 100 100)"/>
            <use xlink:href="#p" fill-opacity="0.03" transform="rotate( 12 100 100)"/>
            <use xlink:href="#p" fill-opacity="0.07" transform="rotate( 24 100 100)"/>
            <use xlink:href="#p" fill-opacity="0.1"  transform="rotate( 36 100 100)"/>
            <use xlink:href="#p" fill-opacity="0.14" transform="rotate( 48 100 100)"/>
            <use xlink:href="#p" fill-opacity="0.17" transform="rotate( 60 100 100)"/>
            <use xlink:href="#p" fill-opacity="0.2"  transform="rotate( 72 100 100)"/>
            <use xlink:href="#p" fill-opacity="0.24" transform="rotate( 84 100 100)"/>
            <use xlink:href="#p" fill-opacity="0.28" transform="rotate( 96 100 100)"/>
            <use xlink:href="#p" fill-opacity="0.31" transform="rotate(108 100 100)"/>
            <use xlink:href="#p" fill-opacity="0.34" transform="rotate(120 100 100)"/>
            <use xlink:href="#p" fill-opacity="0.38" transform="rotate(132 100 100)"/>
            <use xlink:href="#p" fill-opacity="0.41" transform="rotate(144 100 100)"/>
            <use xlink:href="#p" fill-opacity="0.45" transform="rotate(156 100 100)"/>
            <use xlink:href="#p" fill-opacity="0.48" transform="rotate(168 100 100)"/>
            <use xlink:href="#p" fill-opacity="0.52" transform="rotate(180 100 100)"/>
            <use xlink:href="#p" fill-opacity="0.55" transform="rotate(192 100 100)"/>
            <use xlink:href="#p" fill-opacity="0.59" transform="rotate(204 100 100)"/>
            <use xlink:href="#p" fill-opacity="0.62" transform="rotate(216 100 100)"/>
            <use xlink:href="#p" fill-opacity="0.66" transform="rotate(228 100 100)"/>
            <use xlink:href="#p" fill-opacity="0.69" transform="rotate(240 100 100)"/>
            <use xlink:href="#p" fill-opacity="0.7"  transform="rotate(252 100 100)"/>
            <use xlink:href="#p" fill-opacity="0.72" transform="rotate(264 100 100)"/>
            <use xlink:href="#p" fill-opacity="0.76" transform="rotate(276 100 100)"/>
            <use xlink:href="#p" fill-opacity="0.79" transform="rotate(288 100 100)"/>
            <use xlink:href="#p" fill-opacity="0.83" transform="rotate(300 100 100)"/>
            <use xlink:href="#p" fill-opacity="0.86" transform="rotate(312 100 100)"/>
            <use xlink:href="#p" fill-opacity="0.93" transform="rotate(324 100 100)"/>
            <use xlink:href="#p" fill-opacity="0.97" transform="rotate(336 100 100)"/>
            <use xlink:href="#p" fill-opacity="1"    transform="rotate(348 100 100)"/>
        </g>
    </g>
</svg> */
</style>
