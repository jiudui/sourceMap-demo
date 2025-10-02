<template>
  <div class="play">
    <el-button type="primary" @click="onPlay">回放</el-button>
    <div class="doPlay"></div>
  </div>
</template>

<script lang="ts" setup>
import rrwebPlayer from 'rrweb-player'
import { useEventStore } from '../stores/eventStore'
import 'rrweb-player/dist/style.css'
const eventStores = useEventStore()

const onPlay = () => {
  const events = eventStores.getEvents()
  if (events.length === 0) {
    alert('请先录制')
    return
  }
  const player = new rrwebPlayer({
    target: document.querySelector('.doPlay') as HTMLElement,
    props: {
      events: events as any,
      showController: true,
    },
  })
}
</script>
