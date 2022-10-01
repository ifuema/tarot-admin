<template>
  <div id="app">
    <router-view />
  </div>
</template>

<style>
html,
body,
#app {
  height: 100%;
  margin: 0;
  padding: 0;
}
* {
  font-family: Roboto, Noto, Helvetica, Arial, sans-serif;
}
::-webkit-scrollbar {
  width: 8px;
}
::-webkit-scrollbar-thumb {
  width: 5px;
  background-color: #cccccc;
}
</style>
