<script setup lang="ts">
import { ref, shallowRef } from 'vue'
import { useScoreStore } from './stores/score.ts'
import Header from './components/Header.vue'
import TheModal from './components/TheModal.vue'

const scoreStore = useScoreStore()

type GameState = 'start' | 'play'
const gameState = ref<GameState>('start')

type PlayOption = {
  name: 'rock' | 'paper' | 'scissors'
  image: string
}

type GameResult = 'win' | 'lose' | 'draw'

const playOps: PlayOption[] = [
  {
    name: 'paper',
    image: './assets/icon-paper.svg',
  },
  {
    name: 'scissors',
    image: './assets/icon-scissors.svg',
  },
  {
    name: 'rock',
    image: './assets/icon-rock.svg',
  },
]

const playOptions = ref<PlayOption[]>(playOps)

const playerSelection = ref<PlayOption | null>(null)

const computerSelection = ref()

const gameResult = ref<GameResult | null>(null)

const modal = shallowRef(false)

const target = ref<HTMLElement | null>(null)

const canPick = ref(true)

function selectOption(value: PlayOption, e: Event) {
  if (!canPick.value) return
  playerSelection.value = value

  if (!document.startViewTransition) {
    gameState.value = 'play'
    pickComputerOption()
    setGameResult()
    return
  }

  document.startViewTransition(() => {
    gameState.value = 'play'
    pickComputerOption()
    setGameResult()
  })
}

function pickComputerOption() {
  computerSelection.value = playOptions.value[Math.floor(Math.random() * playOptions.value.length)]
}

function setWinner() {
  if (playerSelection.value?.name === computerSelection.value?.name) {
    gameResult.value = 'draw'
  } else if (
    (playerSelection.value?.name === 'rock' && computerSelection.value?.name === 'scissors') ||
    (playerSelection.value?.name === 'paper' && computerSelection.value?.name === 'rock') ||
    (playerSelection.value?.name === 'scissors' && computerSelection.value?.name === 'paper')
  ) {
    gameResult.value = 'win'
    scoreStore.increment()
  } else {
    gameResult.value = 'lose'
    scoreStore.decrement()
  }
}

function setGameResult() {
  setTimeout(() => {
    setWinner()
  }, 1000)
}

function resetGame() {
  // const previous = document.querySelector('[style*="view-transition-name"]') as HTMLElement | null
  // if (previous) previous.style.viewTransitionName = ''

  target.value = null
  playerSelection.value = null
  computerSelection.value = null
  gameState.value = 'start'
  gameResult.value = null
}
</script>

<template>
  <main>
    <Header></Header>
    <div class="game">
      <div
        class="options"
        v-show="gameState === 'start'"
        :class="{ visible: gameState === 'start' }"
      >
        <div class="wrapper">
          <img class="base" src="./assets/bg-triangle.svg" alt="" />
          <div class="buttons">
            <button
              v-for="(option, index) in playOptions"
              @click="(event) => selectOption(option, event)"
              :key="index"
              :class="`option ${option.name}-bg ${option.name}-position`"
              :aria-label="`${option.name}`"
              :style="{ viewTransitionName: option.name }"
            ></button>
          </div>
        </div>
      </div>

      <div class="picks" v-if="gameState === 'play'">
        <div class="pick player">
          <div class="slide-wrapper" :class="gameResult ? 'slide-left' : ''">
            <h2>You Picked</h2>
            <div
              :class="`option ${playerSelection?.name}-bg`"
              :style="{ viewTransitionName: playerSelection?.name }"
            >
              <div class="shadow-circles" v-if="gameResult === 'win'">
                <div class="circle circle__one"></div>
                <div class="circle circle__two"></div>
                <div class="circle circle__three"></div>
              </div>
            </div>
          </div>
        </div>
        <Transition name="fade">
          <div class="pick result" v-if="gameResult">
            <p v-if="gameResult === 'draw'">{{ gameResult }}</p>
            <p v-else>You {{ gameResult }}</p>
            <button class="play" @click="resetGame">Play Again</button>
          </div>
        </Transition>
        <div class="pick computer">
          <div class="slide-wrapper" :class="gameResult ? 'slide-right' : ''">
            <h2>The House Picked</h2>
            <div v-if="computerSelection && gameResult">
              <div :class="`option ${computerSelection?.name}-bg target`">
                <div class="shadow-circles" v-if="gameResult === 'lose'">
                  <div class="circle circle__one"></div>
                  <div class="circle circle__two"></div>
                  <div class="circle circle__three"></div>
                </div>
              </div>
            </div>
            <div v-else class="option option__empty"></div>
          </div>
        </div>
      </div>
    </div>
    <footer>
      <button @click="modal = true">Rules</button>
    </footer>
    <div v-if="modal">
      <TheModal @close="modal = false">
        <template #title>
          <h2>Rules</h2>
        </template>
        <img src="./assets/image-rules.svg" alt="" style="width: 100%" />
      </TheModal>
    </div>
  </main>
</template>

<style scoped>
footer {
  height: 75px;
  width: 100%;
  display: flex;
  justify-content: end;
  align-items: flex-start;
  margin-block-end: 1.25rem;
  margin-top: auto;
}

footer button {
  background-color: transparent;
  color: white;
  padding: 10px 36px;
  border: 2px solid var(--gray-color);
  border-radius: 10px;
  font-size: 14px;
  text-transform: uppercase;
  font-weight: 600;
  margin-right: 30px;
  letter-spacing: 0.15rem;
  cursor: pointer;
}

@media screen and (max-width: 450px) {
  footer {
    align-items: flex-end;
    justify-content: center;
  }
  footer button {
    margin: 0;
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s 0.8s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.crossfade-enter-active {
  transition: opacity 0.5s ease;
}

.crossfade-enter-from,
.crossfade-leave-to {
  opacity: 0;
}

main {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
}

.game {
  display: flex;
  align-items: center;
  justify-content: center;
}

.options {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: auto;
  max-width: 61rem;
  width: 85%;
  min-height: 25rem;
}

.options {
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.4s ease;
}

.options.visible {
  opacity: 1;
  pointer-events: auto;
}

.wrapper {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.buttons .option {
  cursor: pointer;
}

.option {
  border-radius: 50%;
  aspect-ratio: 1;
  background: no-repeat center / 45% white;
  background-position: 50% 58%;
  width: 200px;
}

@media screen and (max-width: 450px) {
  .options {
    transform: translateY(70px);
    align-items: flex-start;
    min-height: unset;
    height: 100%;
  }
  .option {
    width: 140px;
  }
}

.options img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  position: relative;
}

@media screen and (max-width: 450px) {
  .options img {
    width: 75%;
  }
}

.option__empty {
  background: rgba(0, 0, 0, 0.1) !important;
}

@media screen and (max-width: 450px) {
  .option__empty {
    width: 50%;
  }
  .slide-wrapper {
    display: flex !important;
    align-items: center;
    justify-content: center;
    gap: 1rem;
    flex-direction: column-reverse;
  }
}

.paper-bg {
  background-image: url('./assets/icon-paper.svg');
  border: 23px solid hsl(230, 89%, 62%);
  box-shadow:
    0 0.5em hsl(230deg 64.1% 45.88%),
    inset 0 0.5em #cad5d6;
}
.paper-position {
  position: absolute;
  top: 0;
  left: 0;
  transform: translateY(-50%) translateX(-50%);
}

.scissors-bg {
  background-image: url('./assets/icon-scissors.svg');
  border: 23px solid hsl(39, 89%, 49%);
  box-shadow:
    0 0.5em hsl(24.47deg 61.79% 48.24%),
    inset 0 0.5em #cad5d6;
}

.scissors-position {
  position: absolute;
  top: 0;
  right: 0;
  transform: translateY(-50%) translateX(50%);
}

.rock-position {
  position: absolute;
  bottom: 0;
  left: 0;
  transform: translateY(50%) translateX(15%);
}
.rock-bg {
  background-image: url('./assets/icon-rock.svg');
  border: 23px solid hsl(349, 71%, 52%);
  box-shadow:
    0 0.5em hsl(352.62deg 63.54% 37.65%),
    inset 0 0.5em #cad5d6;
}

@media screen and (max-width: 450px) {
  .rock-position {
    transform: translateY(50%) translateX(45%);
  }
  .scissors-position {
    transform: translateY(-50%) translateX(20%);
  }
  .paper-position {
    transform: translateY(-50%) translateX(-20%);
  }
}

.picks {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 5rem;
  width: 100%;
}

@media screen and (max-width: 450px) {
  .picks {
    display: grid;
    align-items: baseline;
    justify-content: space-between;
    grid-template-columns: 1fr 1fr;
    row-gap: 0rem;
    column-gap: 0.3rem;
    width: 100%;
  }
  .pick.player {
    order: 1;
  }
  .pick.computer {
    order: 2;
  }
  .pick.result {
    order: 3;
    grid-column: 1 / -1;
    margin-top: -30px;
  }

  .pick h2 {
    font-size: 0.6rem !important;
  }
}

.pick {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.pick.player,
.pick.computer {
  z-index: -1;
}

.pick h2 {
  font-size: 2rem;
  color: white;
  text-transform: uppercase;
  font-weight: 600;
  letter-spacing: var(--letter-spacing);
  margin-bottom: 70px;
  text-align: center;
}
.pick p {
  font-size: 40px;
  color: white;
  text-transform: uppercase;
  font-weight: 700;
  letter-spacing: var(--letter-spacing);
  margin-bottom: 20px;
}
.pick .option {
  width: 290px;
  height: 290px;
}

.shadow-circles {
  position: relative;
  z-index: -2;
  border-radius: 50%;
  aspect-ratio: 1;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

@keyframes circle-stagger {
  from {
    opacity: 0;
    transform: scale(0.7);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.circle {
  position: absolute;
  border-radius: 50%;
  aspect-ratio: 1;
  opacity: 0;
  animation: circle-stagger 0.5s forwards;
}
.circle__one {
  background-color: rgba(255, 255, 255, 0.01);
  width: 325%;
  animation-delay: 1.1s;
}

.circle__two {
  background-color: rgba(255, 255, 255, 0.02);
  width: 250%;
  animation-delay: 0.9s;
}
.circle__three {
  background-color: rgba(255, 255, 255, 0.03);
  width: 190%;
  animation-delay: 0.7s;
}

@media screen and (max-width: 450px) {
  .pick .option {
    width: 140px;
    height: auto;
  }
}

.pick button {
  background-color: hsl(0, 0%, 100%);
  color: hsl(0, 0%, 0%);
  padding: 1rem;
  border-radius: 10px;
  font-size: 1.5rem;
  text-transform: uppercase;
  font-weight: 600;
}

.play {
  font-size: 18px !important;
  padding: 20px 60px !important;
  color: var(--gray-color) !important;
  cursor: pointer;
  letter-spacing: var(--letter-spacing);
  font-weight: 700 !important;
}

.slide-wrapper {
  display: inline-block;
}

.slide-left {
  animation: slide-left 0.8s ease forwards;
}

.slide-right {
  animation: slide-right 0.8s ease forwards;
}

@media screen and (max-width: 450px) {
  .slide-left {
    animation: m-slide-left 0.8s ease forwards;
  }

  .slide-right {
    animation: m-slide-right 0.8s ease forwards;
  }
}

@keyframes slide-left {
  from {
    transform: translateX(100px);
  }
  to {
    transform: translateX(-50px);
  }
}

@keyframes slide-right {
  from {
    transform: translateX(-100px);
  }
  to {
    transform: translateX(50px);
  }
}

@keyframes m-slide-left {
  from {
    transform: translateX(0px);
  }
  to {
    transform: translateX(-20px);
  }
}

@keyframes m-slide-right {
  from {
    transform: translateX(0px);
  }
  to {
    transform: translateX(20px);
  }
}
</style>
