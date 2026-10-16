<script setup lang="ts">
import Collapsible from './components/Collapsible.vue';
import PrettyInput from './components/PrettyInput.vue';
import Scrollbar from './components/Scrollbar.vue';
import StatItem from './stats/components/StatItem.vue';
import StatSection from './stats/components/StatSection.vue';
import {
  ambrosiaSection,
  ascensionSection,
  cubeStats,
  enchantmentSection,
  genericSection,
  hepteractRow1,
  hepteractRow2,
  hepteractRow3,
  pseudoCoinSection,
  redAmbrosiaSection,
  runeAoAGStats,
  runeIAStats,
  runeSIStats,
  shopAmbGenSection,
  shopHepteractSection,
  shopLuckSection,
  shopRedLuckSection,
  shopSingularitySection,
  singularitySection,
  talismanPowerStat
} from './stats/data.ts';
import './styles/fonts/fonts.css';
import './styles/global.css';
import './styles/images.css';
</script>

<template>
  <article id="stats">
    <header>
      <h2>Stats</h2>
      <button id="import">Import Save</button>
      <button id="stats-filter">
        ☰
      </button>
    </header>
    <div id="stats-wrapper" class="wrapper">
      <section>
        <StatSection v-bind="genericSection" />
        <StatSection v-bind="pseudoCoinSection" />
        <Collapsible title="Runes & Talismans">
          <StatItem v-for="props in runeSIStats" v-bind="props" />
          <hr>
          <StatItem v-for="props in runeIAStats" v-bind="props" />
          <hr>
          <StatItem v-for="props in runeAoAGStats" v-bind="props" />
          <hr>
          <StatItem v-bind="talismanPowerStat" />
        </Collapsible>
        <StatSection v-bind="shopHepteractSection" />
        <StatSection v-bind="shopLuckSection" />
        <StatSection v-bind="shopRedLuckSection" />
        <StatSection v-bind="shopAmbGenSection" />
        <StatSection v-bind="shopSingularitySection" />
        <StatSection v-bind="ascensionSection" />
        <Collapsible title="Owned Cubes">
          <div class="stat-cards">
            <StatItem v-for="props in cubeStats" v-bind="props" />
          </div>
          <hr>
          <div title="Total Cube Amount Exponent">
            <h4>Total Cube Amount Exponent</h4>
            <PrettyInput id="cubes-total" min="0" />
          </div>
        </Collapsible>
        <Collapsible id="hepteracts" title="Hepteracts">
          <div class="stat-cards">
            <StatItem v-for="props in hepteractRow1" v-bind="props" />
          </div>
          <div class="stat-cards">
            <StatItem v-for="props in hepteractRow2" v-bind="props" />
          </div>
          <div class="stat-cards">
            <StatItem v-for="props in hepteractRow3" v-bind="props" />
          </div>
        </Collapsible>
        <StatSection v-bind="singularitySection" />
        <StatSection v-bind="ambrosiaSection" />
        <StatSection v-bind="redAmbrosiaSection" />
        <StatSection v-bind="enchantmentSection" />
      </section>
    </div>
    <Scrollbar axis="vertical" viewport-id="stats-wrapper" />
  </article>
</template>
