<style>

</style>
<template>
  <div>
    <div :class="mdlLayout">
      <div :class="mdlGrid">
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue';
import VueMdl from 'vue-mdl';
import SocketIoClient from 'socket.io-client';

Vue.use(VueMdl);

export default {
  computed: {
  },
  data: () => {
    return {
      echoList: [],
    };
  },
  created() {
    const socket = this.socket = new SocketIoClient('/socket-client');
    socket.on('echo', data => {
      const delta = new Date().getTime - data.time;
      this.echoList.push({
        size: data.data.length,
        delta,
      });
    });
  },
  methods: {
    sendPing(size = 1) {
      let text = '';
      while (size--) {
        text += '1';
      }
      const data = {
        time: new Date().getTime(),
        text: text,
      }
      this.socket.emit(ping, data);
    }
  },
};
</script>
