<template>
  <div id="app">
    <div id="nav">
      <ul>
        <li>
          <router-link to="/html2canvas">html2canvas</router-link>
        </li>
        <li>
          <router-link to="/jsPdf">jsPdf</router-link>
        </li>
        <li>
          <router-link to="/download">html2canvas + jsPDF</router-link>
        </li>
        <li>
          <router-link to="/columns">Columns</router-link>
        </li>
        <li>
          <router-link to="/columns2">Columns2</router-link>
        </li>
      </ul>
    </div>
    <router-view />
  </div>
</template>

<style>
</style>
