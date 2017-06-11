import Vue from 'vue';
import index from './index.vue';

export class SocketClient {
  constructor(selector) {
    const vue = this.vue = new Vue({
      el: selector,
      render: createElement => {
        return createElement(index);
      }
    });
  }
}
