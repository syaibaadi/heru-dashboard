<template>
  <div>
    <!--Stats cards-->
    <div class="row">
      <div
        class="col-md-6 col-xl-3"
        v-for="stats in statsCards"
        :key="stats.title"
      >
        <stats-card>
          <div
            class="icon-big text-center"
            :class="`icon-${stats.type}`"
            slot="header"
          >
            <i :class="stats.icon"></i>
          </div>
          <div class="numbers" slot="content">
            <p>{{ stats.title }}</p>
            {{ stats.value }}
          </div>
        </stats-card>
      </div>
    </div>
  </div>
</template>
<script>
import { StatsCard, ChartCard } from "@/components/index";
import Chartist from "chartist";
export default {
  components: {
    StatsCard,
    ChartCard,
  },
  /**
   * Chart data used to render stats, charts. Should be replaced with server data
   */
  data() {
    return {
      statsCards: [
        {
          type: "warning",
          icon: "ti-map-alt",
          title: "Wisata",
          value: "5",
        },
        {
          type: "success",
          icon: "ti-wallet",
          title: "Transaction",
          value: "0",
        },
        {
          type: "danger",
          icon: "ti-user",
          title: "Pelanggan",
          value: "4",
        },
        {
          type: "info",
          icon: "ti-car",
          title: "Kendaraan",
          value: "2",
        },
      ],
    };
  },
};
</script>
<style></style>
