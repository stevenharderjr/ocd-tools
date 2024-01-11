<script>
  // import Header from '$lib/Header.svelte';
  import Toast from '$lib/Toast.svelte';
  import { toasts, blur } from '../stores'
  import './styles.css';
</script>

<div class="container">
    <slot />

  <div class="header-shadow"></div>
  <!-- <Header /> -->

  <footer class="footer">
    <p>Copyright © Steven Harder 2023</p>
  </footer>
  {#if $blur}
    <div class="blur" />
  {/if}
  {#if toasts}
    <Toast toasts={$toasts} />
  {/if}
</div>

<style>
  .blur {
    backdrop-filter: blur(4px);
    position: absolute;
    z-index: 3;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
  }

  .container {
    position: relative;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    height: 100%;
    width: 100%;
    flex-direction: column;
    align-items: space-between;
    overflow: hidden;
  }
  .header-shadow {
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    height: 0.5rem;
    background-image: linear-gradient(#0006, #0000);
  }

  .footer {
    position: absolute;
    padding-top: 2px;
    padding-bottom: env(safe-area-inset-bottom, 2px);
    bottom: 0;
    left: 0;
    right: 0;
    background-image: linear-gradient(#fff0, #ffff);
    font-size: x-small;
    text-align: center;
  }

  .footer > p {
    z-index: 4;
  }
</style>