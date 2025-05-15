<script setup lang="ts">
import { useScoreStore } from '../stores/score'

const scoreStore = useScoreStore()
</script>

<template>
  <header>
    <img alt="Rock Paper Scissors" class="logo" src="../assets/logo.svg" />
    <div class="score">
      <h3>score</h3>
      <p>{{ scoreStore.count }}</p>
    </div>
  </header>
</template>

<style scoped>
header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 80%;
  max-width: 700px;
  padding: 20px 1rem;
  border: 0.2rem solid hsl(217, 16%, 45%);
  border-radius: 1rem;
  margin: 5px auto 40px;
}

@media screen and (max-width: 450px) {
  header {
    margin: 0px auto 40px;
    margin-block-start: 2rem;
  }
}

header img {
  width: auto;
  height: 94px;
}

/* @media screen and (max-width: 450px) {
  header img {
    height: 50px;
  }
} */

.score {
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: white;
  border-radius: 0.5rem;
  padding: 20px 3rem;
}

@media screen and (max-width: 450px) {
  .score {
    padding: 10px 1rem;
  }
}
.score h3 {
  font-size: 15px;
  margin: 0;
  text-transform: uppercase;
  color: hsl(229, 64%, 46%);
  letter-spacing: var(--letter-spacing);
}
.score p {
  font-size: 45px;
  color: hsl(229, 25%, 31%);
  line-height: normal;
  font-weight: 700;
  margin: 0;
}
</style>
