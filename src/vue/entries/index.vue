<style>
</style>
<template>
  <div>
    <p>socket.io-p2p status</p>
    <ul>
      <li v-for="status in p2pStatusList">{{status}}</li>
    </ul>
    <mdl-button v-on:click.native="repeatPingP2p()">send ping p2p</mdl-button>
    <div class="mdl-layout">
      <div class="mdl-grid">
        <p>count: {{p2pCount}}, AVG: {{fix(p2pTotalDelta / p2pCount)}}</p>
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
            <tr v-for="item in p2pEchoList">
              <td>{{fix(item.time)}}</td>
              <td>{{fix(item.now)}}</td>
              <td>{{fix(item.delta)}}</td>
              <td>{{item.size}}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <mdl-button v-on:click.native="repeatPing()">send ping</mdl-button>
    <div class="mdl-layout">
      <div class="mdl-grid">
        <p>count: {{count}}, AVG: {{fix(totalDelta / count)}}</p>
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
              <td>{{fix(item.time)}}</td>
              <td>{{fix(item.now)}}</td>
              <td>{{fix(item.delta)}}</td>
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
import SocketP2p from 'socket.io-p2p';

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
      p2pEchoList: [],
      p2pTotalDelta: 0,
      p2pCount: 0,
      p2pStatusList: [],
    };
  },
  created() {
    const socket = this.socket = new SocketIoClient();
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
    const p2p = this.p2p = new SocketP2p(socket, {}, () => {
      this.addP2pStatusList('ready');
    });
    p2p.on('ping', data => {
      p2p.emit('echo', data);
      console.log('receive ping, send echo');
    });
    p2p.on('echo', data => {
      console.log('receive echo.')
      const time = data.time;
      const now = getNanoSeconds();
      data.now = now;
      data.size = data.text.length;
      data.delta = now - time;
      this.p2pEchoList.unshift(data);

      this.p2pTotalDelta += data.delta;
      this.p2pCount ++;
    });

    p2p.on('upgrade', data => {
      this.addP2pStatusList('upgrade');
    });
    p2p.on('peer-error', data => {
      this.addP2pStatusList('peer-error');
    });
  },
  methods: {
    addP2pStatusList(status) {
      this.p2pStatusList.push(status);
    },
    repeatPing(repeat = 2000) {
      for (let i = 1; i < repeat; i += 100) {
        setTimeout(() => {
          this.sendPing();
        }, i + 500);
      }
    },
    repeatPingP2p(repeat = 2000) {
      for (let i = 1; i < repeat; i += 100) {
        setTimeout(() => {
          this.sendPingP2p();
        }, i + 500);
      }
    },
    sendPing(size = 1024) {
      let text = '';
      while (size--) {
        text += '1';
      }
      const data = {
        time: getNanoSeconds(),
        text: text,
      }
      this.socket.emit('ping', data);
      console.log('send');
    },
    sendPingP2p(size = 1024) {
      let text = '';
      while (size--) {
        text += '1';
      }
      const data = {
        time: getNanoSeconds(),
        text: text,
      }
      this.p2p.emit('ping', data);
      console.log('send ping');
    },
    fix(value, fix = 3) {
      return Number(value).toFixed(fix);
    },
  },
};
</script>
