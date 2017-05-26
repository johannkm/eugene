<template>
  <div>

    <p>Balance:</p>
    <p class="title is-1 balance"><strong>${{$store.state.balance}}</strong></p>
    <vue-slider v-model="sliderValue" :min="1" :max="$store.state.balance"
      :lazy="true" width="auto" height="30" :dotSize="45" formatter="${value}"></vue-slider>
      <br>
    <span :class="{ 'is-primary' : seeds.length<2 }" class="tag is-large" @click="dropSeed('1 week')">
      <a><strong style="color:white">Plant seed for 1 week: ${{Math.ceil(sliderValue*1.3)}}</strong></a>
    </span>
    <br><br>
    <span :class="{ 'is-primary' : seeds.length<2 }" class="tag is-large" @click="dropSeed('1 month')">
      <a><strong style="color:white">Plant seed for 1 month: ${{Math.ceil(sliderValue*2)}}</strong></a>
    </span>

    <br><br><br><br>

    <transition-group name="list" tag="p">
    <nav :key="i" class="level is-mobile" v-for="seed,i in seeds">
      <div class="level-item has-text-centered">
        <div>
          <img src="../assets/seed.png" width="50">
        </div>
      </div>
      <div class="level-item has-text-centered">
        <div>
          <p class="title is-5">${{seed.amount}}</p>
        </div>
      </div>
      <div class="level-item has-text-centered">
        <div>
          <p class="title is-5">{{seed.type == '1 week' ? '7 days left' : '30 days left'}}</p>
        </div>
      </div>

    </nav>
  </transition-group>

  <br><br>

  <a href="/#/child">
    <span class="tag is-large">
      <strong>Back</strong>
    </span>
  </a>

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
			sliderValue: 1,
      seeds: []
		}
	},
  methods:{
    dropSeed: function(message){
      if(this.seeds.length < 2){
        this.$store.dispatch('postTransaction', {amount:-this.sliderValue, message:'Dropped a '+ message + ' seed'});
        this.seeds.unshift({
          amount: this.sliderValue,
          type: message
        })
        this.sliderValue=1
      }

    }
  }

}

</script>

<style scoped>

.list-item {
  display: inline-block;
}
.list-enter-active, .list-leave-active {
  transition: all 0.5s;
}
.list-enter, .list-leave-to /* .list-leave-active for <2.1.8 */ {
  opacity: 0;
  transform: translateY(-30px);
}

.level {
  background-color: #CCCCCC;
  padding: 10px 0px;
  border-radius: 10px;
}

</style>
