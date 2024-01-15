<script>
  export let title="Tool Card";
  export let description="Lorem ipsum dolor amet";
  export let href="/";
</script>

<a class="floating card" {href}>
  <div class="title-bar">
    <h2>{title}</h2>
    <svg class="askew" aria-hidden="true" viewBox="0 0 1 1" preserveAspectRatio="none">
      <polygon points="0,0 1,0 1,1 0,0" fill="#444" stroke="none" />
    </svg>
  </div>
  <p>{description}</p>
</a>

<style>
  a, a:visited {
    text-decoration: none;
    user-select: none;
  }

  p {
    margin: 0.5rem 0.75rem;
    hyphens: auto;
    color: black;
    min-height: 0.5rem;
  }

  .card {
    align-self: center;
    /* width: 100%; */
    min-width: 20rem;

    width: fit-content;
    height: fit-content;
    background: #fff;
    border-radius:8px;
    overflow: hidden;
  }

  .title-bar {
    position: relative;
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 1.75rem;
    color: white;
    background: #444;
  }

  .title-bar h2 {
    font-size: medium;
    position: absolute;
    top: 0.1rem;
    left: 0.5rem;
    font-family: 'Hind';
    font-weight: 500;
    height: 2rem;
    text-transform: uppercase;
  }

  .askew {
    width: 100%;
    height: 0.5rem;
    position: relative;
    top: 100%;
  }
</style>