<script>
  export let title="Tool Card";
  export let description="Lorem ipsum dolor amet";
  export let href="/";
</script>

<a class="floating card" {href}>
  <section class="title-bar">
    <div class="title">
      <img src="sliders.svg" aria-hidden="true" alt="" />
      <h4>{title}</h4>
    </div>
    <svg class="askew" aria-hidden="true" viewBox="0 0 1 1" preserveAspectRatio="none">
      <polygon points="0,0 1,0 1,1 0,0" fill="#444" stroke="none" />
    </svg>
  </section>
  <p>{description}</p>
</a>

<style>
  img {
    filter: invert(0.9);
    height: 1rem;
    width: 1rem;
  }

  a, a:visited {
    text-decoration: none;
    user-select: none;
  }

  p {
    margin: 0.5rem 0.75rem;
    /* hyphens: auto; */
    color: black;
    min-height: 0.5rem;
  }

  .card {
    align-self: center;
    width: 100%;
    max-width: 20rem;

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

  }

  .title {
    display: flex;
    align-items: flex-start;
    gap: 0.5rem;
    font-size: medium;
    position: absolute;
    top: 0.4rem;
    left: 0.6rem;
    font-family: 'Hind';
    font-weight: 500;
    height: 2rem;
    text-transform: uppercase;
    line-height: 1rem;
  }

  .askew {
    width: 100%;
    height: 0.5rem;
    position: relative;
    top: 100%;
  }
</style>