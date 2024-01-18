<script>
  export let title="Tool Card";
  export let description="Lorem ipsum dolor amet";
  export let href="/";
</script>

<a class="floating card" {href}>
  <section class="title-bar">
    <div class="title">
      <img src="sliders.svg" aria-hidden="true" alt="" />
      <h3>{title}</h3>
    </div>
    <svg class="askew" aria-hidden="true" viewBox="0 0 1 1" preserveAspectRatio="none">
      <polygon points="0,0 1,0 1,1 0,0" fill="#444" stroke="none" />
    </svg>
  </section>
  <p>{description}</p>
</a>

<style>
  img {
    filter: invert(1);
    height: 1rem;
    width: 1rem;
  }

  a, a:visited {
    text-decoration: none;
    user-select: none;
  }

  p {
    margin: 0 1rem 1rem;
    /* hyphens: auto; */
    color: black;
    min-height: 0.5rem;
  }

  h3 {
    letter-spacing: 0.05rem;
  }

  .card {
    align-self: center;
    width: 100%;

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
    /* height: fit-content; */
    color: white;
    background: #444;
    margin-bottom: 0.75rem;
  }

  .title {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: medium;
    font-family: 'Hind';
    font-weight: 500;
    /* height: 2rem; */
    text-transform: uppercase;
    padding: 0.25rem 0.5rem;
    margin-bottom: -0.1rem;
    /* background: #f006; */
  }

  .askew {
    width: 100%;
    height: 0.5rem;
    position: absolute;
    top: 100%;
  }
</style>