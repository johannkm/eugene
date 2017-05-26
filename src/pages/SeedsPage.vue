<template>
  <div>
    <p>Balance:</p>
    <p class="title is-1 balance"><strong>${{$store.state.balance}}</strong></p>
    <vue-slider v-model="sliderValue" :min="1" :max="$store.state.balance"
      :lazy="true" width="auto" height="30" :dotSize="45" formatter="${value}"></vue-slider>
    <button class="button" @click="dropSeed('Dropped 1 week seed')">Plant seed for 1 week</button>
    <button class="button" @click="dropSeed('Dropped 1 month seed')">Plant seed for 1 month</button>

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
  methods:{
    dropSeed: function(message){
      $store.dispatch('postTransaction', {amount:-sliderValue, message:message});
      sliderValue=0
    }
  }

}

</script>
