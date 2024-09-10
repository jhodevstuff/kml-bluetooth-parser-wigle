<template>
  <div class="menu-bar">
    <div class="info">
      <h1 class="info__title">KML Parser</h1>
      <h2 class="info__subtitle">WiGLE BT/BLE analyzer</h2>
    </div>
    <div class="menu">
      <div class="menu__item">
        <RouterLink class="menu__item--link" to="/">Home</RouterLink>
      </div>
      <div class="menu__item">
        <RouterLink class="menu__item--link" to="/analyze">Analyze</RouterLink>
      </div>
      <div class="menu__item">
        <RouterLink class="menu__item--link" to="/compare">Compare</RouterLink>
      </div>
    </div>
  </div>
</template>

<script setup>
import { RouterLink } from 'vue-router';
</script>

<style lang="scss">

.menu-bar {
  display: flex;
  gap: 28px;
  background-color: black;
  padding: 3px 12px;
}

.info {
  display: flex;
  flex-direction: column;

  &__title, &__subtitle {
    color: #fff;
  }

  &__title {
    font-size: 26px;
    font-weight: bold;
  }

  &__subtitle {
    font-size: 18px;
  }
}

.menu {
  display: flex;

  &__item {
    display: flex;
    align-items: center;

    &--link {
      color: #fff;
      padding: 6px 16px;
      font-size: 22px;
      border-top: 2px solid #fff;
      border-bottom: 2px solid #fff;
    }
  }
}

.router-link-active {
  background-color: #fff;
  color: #000;
}
</style>
