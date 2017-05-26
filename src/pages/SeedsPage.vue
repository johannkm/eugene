<template>
  <div>
    <p>Balance:</p>
    <p class="title is-1 balance"><strong>${{$store.state.balance}}</strong></p>
    <vue-slider v-model="sliderValue" :min="1" :max="$store.state.balance"
      :lazy="true" width="auto" height="30" :dotSize="45" formatter="${value}"></vue-slider>
    <button class="button" @click="$store.dispatch('postTransaction', {amount:-sliderValue, message:'Planted a 1 week seed'});sliderValue=0">Plant seed for 1 week</button>
    <button class="button" @click="$store.dispatch('postTransaction', {amount:-sliderValue, message:'Planted a 1 month seed'});sliderValue=0">Plant seed for 1 month</button>

  </div>
</template>

<script>

import vueSlider from 'vue-slider-component';

export default{
  name: 'seed-page',
  components: {
		vueSlider
	},
  data: function() {
		return {
			sliderValue: 0,
		}
	},

}

</script>
