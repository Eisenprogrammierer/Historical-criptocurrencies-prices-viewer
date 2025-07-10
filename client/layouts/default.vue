<template>
  <div class="app">
    <header>
      <h1>Bitcoin Price Tracker</h1>
    </header>
    <main>
      <NuxtPage />
    </main>
    <footer>
      <p>Data from CoinGecko API</p>
    </footer>
  </div>
</template>

<style>
.app {
  min-height: 100vh;
  display: grid;
  grid-template-rows: auto 1fr auto;
}
header, footer {
  padding: 1rem;
  text-align: center;
  background: #f5f5f5;
}
</style>
