<template>

  <div class="gradient" style="margin-bottom:0.6em">
    <br>
    <a href="/#/">
      <span class="tag is-medium">
        <strong >Back</strong><br><br>
      </span>
    </a>
    <div class="tile is-ancestor">
      <div class="tile is-parent">
        <article class="tile is-child">
        	<!-- <h6 class="subtitle is-6" style="color:#fff; margin-top: 1em">Current Balance</h6>
        	<h4 class="title is-4" style="color:#fff"><b>${{ balance }}.00</b></h4> -->
        </article>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'balance',
  props: ['balance']
}
</script>

<style scoped>
.gradient{
	background-color: #42275a;
  background-image: linear-gradient(#42275a, #734b6d);
  background: linear-gradient(#42275a, #734b6d);
}
</style>
