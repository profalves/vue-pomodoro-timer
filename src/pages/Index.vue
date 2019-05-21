<template>
  <q-page class="flex flex-center bg-red-5 text-white">
    <div class="container">
      <q-knob
        v-model="totalTime"
        :min="0"
        :max="displayed"
        :size="this.$q.platform.is.mobile ? '310px' : '400px'"
        line-width="1px"
        track-color="red-5"
        readonly
      >
        <h1>{{display}}</h1>
      </q-knob>
      <div class="controls text-center">
        <q-btn
          class="play"
          flat big round
          size="30px"
          v-if="!timer && totalTime !== 0"
          @click="startTimer"
          icon="play_arrow" />

        <q-btn
          class="pause"
          flat big round
          size="30px"
          v-if="timer"
          @click="stopTimer"
          icon="pause" />

        <q-btn
          class="stop"
          flat big round
          size="30px"
          v-if="resetButton"
          @click="resetTimer"
          icon="stop" />

         <q-btn
          class="edit"
          flat big round
          size="30px"
          v-if="!timer && !resetButton"
          @click="editTimer"
          icon="edit" />

        <q-btn
          class="edit"
          flat big round
          size="30px"
          v-if="!timer && !resetButton"
          @click="openTimers"
          icon="alarm" />

      </div>

      <div class="select" v-show="selectTimer && !resetButton">
        <q-select
          v-if="timerList.length > 0 || breakList > 0"
          v-model="timeSet"
          float-label="Escolha um temporizador"
          :options="timerList"
          @input="setTimer"
        />
      </div>

      <div class="input">
        <q-input
          outlined flat
          color="white"
          type="number"
          v-model="timeSet"
          v-if="edit"
          float-label="Tempo"
          placeholder="Em minutos"
          @keyup.enter="setTimer"
          :after="[
            {
              icon: 'send',
              handler: () => {
                this.setTimer()
              }
            }
          ]"
        />

      </div>

    </div>
  </q-page>
</template>

<script>
import { async } from 'q';
export default {
  name: 'Timer',
  data() {
    return {
      timer: null,
      totalTime: Number(localStorage.getItem('currentTimer')) || 25 * 60,
      timeSet: '',
      resetButton: false,
      edit: false,
      displayed: Number(localStorage.getItem('currentTimer')) || 25 * 60,
      pause: false,
      selectTimer: false,

    };
  },
  methods: {
    startTimer() {
      this.timer = setInterval(() => this.totalTime--, 1000);
      this.resetButton = true;
    },
    stopTimer() {
      clearInterval(this.timer);
      this.timer = null;
      this.resetButton = true;
    },
    resetTimer() {
      this.totalTime = this.displayed;
      clearInterval(this.timer);
      this.timer = null;
      this.resetButton = false;
    },
    editTimer() {
      this.edit = !this.edit;
      this.selectTimer = false
    },
    openTimers() {
      this.selectTimer = !this.selectTimer
      this.edit = false
    },
    padTime(time) {
      return (time < 10 ? "0" : "") + time;
    },
    setTimer: async function() {
      if (this.selectTimer) this.timeSet = await this.timeSet / 60
      if (this.timeSet == 0) return
      if (this.timeSet > 60) {
        this.$q.notify({
          message: `Este temporizador não aceita uma
          quantidade de minutos que seja superior a uma hora`,
          type: 'warning'
        })
        return
      }
      await localStorage.setItem('currentTimer', this.timeSet * 60)
      this.totalTime = await this.timeSet * 60
      this.displayed = await this.totalTime
      this.edit = false
      this.selectTimer = false
    }
  },
  computed: {
    minutes: function() {
      const minutes = Math.floor(this.totalTime / 60);
      return this.padTime(minutes);
    },
    seconds: function() {
      const seconds = this.totalTime - this.minutes * 60;
      return this.padTime(seconds);
    },
    display() {
      return `${this.minutes}:${this.seconds}`
    },
    timerList() {
      if(!localStorage.getItem('timerList')) return [{
        label: 'vá no menu e adicione novos temporizadores',
        value: 25 * 60
      }]
      return JSON.parse(localStorage.getItem('timerList')).map(
        time => ({
          label: `${time / 60}: 00`,
          value: time
        })
      ).reverse() || []
    },
    breakList() {
      if(!localStorage.getItem('timerList')) return [{
        label: 'vá no menu e adicione novos temporizadores',
        value: 25 * 60
      }]
      return JSON.parse(localStorage.getItem('breakList')).map(
        time => ({
          label: `${time / 60}: 00`,
          value: time
        })
      ).reverse() || []
    }
  },
  watch: {
    totalTime(value) {
      if(value === 0 && !this.pause) {
        let notify = new Notification('Vibration Sample', {
          body: 'Buzz! Buzz!',
          icon: 'https://picsum.photos/200',
          vibrate: [200, 100, 200, 100, 200, 100, 200],
          tag: 'vibration-sample'
        });
        this.$q.notify({
          message: `Vamos fazer uma pausa?`,
          timeout: 0, // in milliseconds; 0 means no timeout
          color: 'black',
          position: 'top-right', // 'top', 'left', 'bottom-left' etc.
          closeBtn: true,
          actions: [
            {
              label: 'Fazer uma pausa',
              icon: 'timer',
              handler: async () => {
                this.totalTime = await Number(localStorage.getItem('currentBreak')) || 5 * 60
                this.displayed = this.totalTime
                this.pause = true
              }
            }
          ]
        })
        clearInterval(this.timer)
        this.timer = null
      }
      if(value === 0 && this.pause) {
        this.$q.notify({
          message: `Vamos voltar ao foco!`,
          timeout: 0, // in milliseconds; 0 means no timeout
          color: 'black',
          position: 'top-right', // 'top', 'left', 'bottom-left' etc.
          closeBtn: true,
          actions: [
            {
              label: 'Voltar ao foco',
              icon: 'timer',
              handler: async () => {
                this.totalTime = await localStorage.getItem('currentTimer') || 25 * 60
                this.displayed = this.totalTime
                this.pause = false
              }
            }
          ]
        })
        clearInterval(this.timer)
        this.timer = null
      }
    }
  },
  mounted() {
    setInterval(async () => {
      if(!this.resetButton && this.timer === null) {
        this.totalTime = await Number(localStorage.getItem('currentTimer')) || 25 * 60
        this.displayed = this.totalTime
      }
    }, 1000)
  },
  created() {
    if (window.Notification && Notification.permission !== "granted") {
    //(Notification.permission === 'denied' || Notification.permission === "default") {
      Notification.requestPermission(function (permission) {
        if (permission === "granted") {
          return new Notification("Permissão para receber notificações concedida",{
            icon: 'https://picsum.photos/200'
          });
        }
      });
    }
  }

};
</script>

<style>

</style>
