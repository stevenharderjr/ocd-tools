<script>
  export let number = 0;

  let W = 0, N = 0, D = 0;

  function toFraction(x, tolerance = 0.0001) {
    if (x == 0) return [0, 1];
    if (x < 0) x = -x;
    let numerator = 1, denominator = 1;

    function calc() {
        var R = numerator/denominator;
        if (Math.abs((R-x)/x) < tolerance) return;

        if (R < x) numerator++;
        else denominator++;
        calc();
    }

    calc();
    if (numerator > denominator) {
      N = numerator % denominator;
      W = (numerator - N) / denominator;
      D = denominator;
      return;
    }
    if (denominator > 1) {
      W = 0;
      N = numerator;
      D = denominator;
      return;
    }

    W = 0;
    D = 0;
    N = numerator;
  }

</script>

<div class="container">
  {#if W}<span class="whole-number">{W}</span>{/if}
  {#if N && D}<div class="fraction">
    <span class="numerator">{N}</span>
    <svg class="separator" viewBox="0 0 1 3">
      <path d="M0.5,0 L0.5,3" />
    </svg>
    <span class="denominator">{D}</span>
  </div>
  {/if}
</div>

<style>
  .whole-number {
    position: relative;
    top: 1px;
    font-size: 1.25rem;
  }
  .fraction {
    position: relative;
    top: -2px;
    display: flex;
    flex-direction: row;
    align-items: baseline;
  }
  .container {
    position: relative;
    display: flex;
    flex-direction: row;
    align-items: baseline;
  }
  .separator {
    position: relative;
    top: 7px;
    font-size: 1rem;
    height: 1rem;
    transform: rotate(30deg);
    margin: 0 -0.5px 0 -1px;
  }
  .numerator, .denominator {
    position: relative;
    font-size: x-small;
    font-weight: 500;
  }
  .numerator {
    top: -0.05rem;
  }
  .denominator {
    top: 0.4rem;
    right: 1px;
  }

  svg {
		height: 8px;
	}

	path {
		vector-effect: non-scaling-stroke;
		stroke-width: 1.25px;
		stroke: #000;
	}

</style>