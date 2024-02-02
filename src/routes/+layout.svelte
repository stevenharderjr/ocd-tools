<script lang="ts">
  // import Header from '$lib/Header.svelte';
  import Toast from '$lib/Toast.svelte';
  import { toasts, blur } from '../stores'
  import './styles.css';

</script>

<div class="container">
  <slot />

  <div class="header-shadow" />
  <!-- <Header /> -->

  {#if $blur}
    <div class="blur" />
  {/if}
  <footer class="footer">
    <p>Copyright © Steven Harder 2023</p>
  </footer>
  {#if toasts}
    <Toast toasts={$toasts} />
  {/if}
</div>

<style>
  .blur {
    backdrop-filter: blur(4px);
    position: absolute;
    z-index: 5;
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
    z-index: 8;
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    height: 4px;
    width: 100vw;
    background-image: linear-gradient(#0006, #0000);
    padding: none;
    margin: none;
    border: none;

  }

  .footer {
    z-index: 6;
    position: absolute;
    padding-bottom: 1px;
    bottom: 0;
    left: 0;
    right: 0;
    font-size: 0.25rem;
    text-align: center;
  }
</style>