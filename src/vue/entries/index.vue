<style>
</style>
<template>
  <div>
    <mdl-button v-on:click.native="sendPing()">send ping</mdl-button>
    <div class="mdl-layout">
      <div class="mdl-grid">
        <p>count: {{count}}, AVG: {{totalDelta / count}}</p>
      </div>
      <div class="mdl-grid">
        <table class="mdl-data-table">
          <thead>
            <tr>
              <th>time(ms)</th>
              <th>now(ms)</th>
              <th>delta(ms)</th>
              <th>size</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in echoList">
              <td>{{item.time}}</td>
              <td>{{item.now}}</td>
              <td>{{item.delta}}</td>
              <td>{{item.size}}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue';
import VueMdl from 'vue-mdl';
import SocketIoClient from 'socket.io-client';

Vue.use(VueMdl);

const getNanoSeconds = () => {
  return window.performance.now();
};

export default {
  computed: {
  },
  data: () => {
    return {
      echoList: [],
      totalDelta: 0,
      count: 0,
    };
  },
  created() {
    const socket = this.socket = new SocketIoClient('/ns');
    socket.on('echo', data => {
      const time = data.time;
      const now = getNanoSeconds();
      data.now = now;
      data.size = data.text.length;
      data.delta = now - time;
      this.echoList.unshift(data);

      this.totalDelta += data.delta;
      this.count ++;
    });
    socket.on('hello', () => {
      for (let i = 1; i < 2000; i += 100) {
        setTimeout(() => {
          this.sendPing();
        }, i + 500);
      }
    });
  },
  methods: {
    sendPing(size = 1024) {
      let text = '';
      while (size--) {
        text += '1';
      }
      const data = {
        time: getNanoSeconds(),
        text: text,
      }
      this.socket.emit('ppp', data);
      console.log('send');
    }
  },
};
</script>
