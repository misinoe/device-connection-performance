import Vue from 'vue';
import VueMdl from 'vue-mdl';
import index from './index.vue';

Vue.use(VueMdl);

export class GamePadClient {
  constructor(selector) {
    const vue = this.vue = new Vue({
      el: selector,
      render: createElement => {
        return createElement(index);
      }
    });
  }
}
