<template>
  <q-layout view="lHh Lpr lFf">
    <q-layout-header>
      <q-toolbar
        color="red-5"
      >
        <q-btn
          flat
          dense
          round
          inverted
          @click="leftDrawerOpen = !leftDrawerOpen"
          aria-label="Menu"
        >
          <q-icon name="menu" />
        </q-btn>

        <q-toolbar-title>
          {{title}}
        </q-toolbar-title>
      </q-toolbar>
    </q-layout-header>

    <q-layout-drawer
      ref="menu"
      v-model="leftDrawerOpen"
    >
      <q-list
        no-border
        link
        inset-delimiter
      >
        <q-list-header>Menu</q-list-header>
        <!-- <q-item @click.native="openURL('http://quasar-framework.org')">
          <q-item-side icon="school" />
          <q-item-main label="Docs" sublabel="quasar-framework.org" />
        </q-item> -->
        <q-item>
          <q-item-main>
            <q-collapsible icon="timelapse" label="Tempos" group="timers">
              <center
                class="q-mb-lg row gutter-sm"
                v-show="timerList.length > 0"
                v-for="(timer, index) in timerList"
                :key="timer"
              >
                <div class="col">
                  <q-btn :label="`${timer / 60}:00`" class="full-width" @click="setTimer(timer)" />
                </div>
                <div class="col-auto">
                  <q-btn color="red" flat round icon="clear" @click="deleteTimer(index)" />
                </div>
              </center>
              <q-input
                color="black"
                type="number"
                v-model="newTimer"
                float-label="Novo temporizador"
                @keyup.enter="addTimer"
                :after="[
                  {
                    icon: 'send',
                    handler () {
                      this.addTimer()
                    }
                  }
                ]"
              />

            </q-collapsible>
          </q-item-main>
        </q-item>
        <q-item>
          <q-item-main>
            <q-collapsible icon="free_breakfast" label="Intervalos" group="timers">
              <div>
                <q-chip color="primary" small class="q-ma-sm">
                  <q-icon name="timelapse" />
                  Custom
                </q-chip>
              </div>

              <center
                class="q-mb-lg row gutter-sm"
                v-show="breakList.length > 0"
                v-for="(pause, index) in breakList"
                :key="pause"
              >
                <div class="col">
                  <q-btn :label="`${pause / 60}:00`" class="full-width" @click="setBreak(pause)" />
                </div>
                <div class="col-auto">
                  <q-btn color="red" flat round icon="clear" @click="deleteBreak(index)" />
                </div>
              </center>
              <q-input
                color="black"
                type="number"
                v-model="newBreak"
                float-label="Novo temporizador"
                @keyup.enter="addBreak"
                :after="[
                  {
                    icon: 'send',
                    handler () {
                      this.addBreak()
                    }
                  }
                ]"
              />

            </q-collapsible>
          </q-item-main>
        </q-item>
      </q-list>
    </q-layout-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { timeout } from 'q';
//import { openURL } from 'quasar'

export default {
  name: 'MyLayout',
  data () {
    return {
      title: 'Pomodoro Timer',
      leftDrawerOpen: false,
      newTimer: '',
      newBreak: '',
      timerList: JSON.parse(localStorage.getItem('timerList')) || [],
      breakList: JSON.parse(localStorage.getItem('breakList')) || []
    }
  },
  methods: {
    // openURL,
    async addTimer () {
      let search = await this.timerList.find((timer) => timer === this.newTimer * 60)
      if(search === (this.newTimer * 60)) {
        this.$q.notify({
          message: `Este temporizador já existe!`,
          type: 'warning'
        })
        return
      }
      if(this.newTimer > 60) {
        this.$q.notify({
          message: `Este temporizador não aceita uma
          quantidade de minutos que seja superior a uma hora`,
          type: 'warning'
        })
        return
      }
      await this.timerList.push(this.newTimer * 60)
      this.timerList = await this.timerList.sort((a, b) => a - b).reverse()
      await localStorage.setItem('timerList', JSON.stringify(this.timerList))
      this.newTimer = ''
    },
    async addBreak () {
      let search = await this.breakList.find((pause) => pause === this.newBreak * 60)
      if(search === (this.newBreak * 60)) {
        this.$q.notify({
          message: `Este temporizador já existe!`,
          type: 'warning'
        })
        return
      }
      if(this.newBreak > 60) {
        this.$q.notify({
          message: `Este temporizador não aceita uma
          quantidade de minutos que seja superior a uma hora`,
          type: 'warning'
        })
        return
      }
      await this.breakList.push(this.newBreak * 60)
      this.breakList = await this.breakList.sort((a, b) => a - b).reverse()
      await localStorage.setItem('breakList', JSON.stringify(this.breakList))
      this.newBreak = ''
    },
    async deleteTimer(index){
      await this.timerList.splice(index, 1)
      if (this.timerList.length === 0) localStorage.removeItem('timerList')
      localStorage.setItem('timerList', JSON.stringify(this.timerList))
    },
    async deleteBreak(index){
      await this.breakList.splice(index, 1)
      if (this.breakList.length === 0) localStorage.removeItem('breakList')
      localStorage.setItem('breakList', JSON.stringify(this.breakList))
    },
    setTimer(timer) {
      localStorage.setItem('currentTimer', timer)
    },
    setBreak(pause) {
      localStorage.setItem('currentBreak', pause)
    }
  },
}
</script>

<style>
</style>
