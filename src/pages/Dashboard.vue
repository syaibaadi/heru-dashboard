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
          icon: "ti-server",
          title: "Wisata",
          value: "5",
        },
        {
          type: "success",
          icon: "ti-wallet",
          title: "Transaction",
          value: "3",
        },
        {
          type: "danger",
          icon: "ti-pulse",
          title: "Pelanggan",
          value: "10",
        },
        {
          type: "info",
          icon: "ti-twitter-alt",
          title: "Admin",
          value: "5",
        },
      ],
    };
  },
};
</script>
<style></style>
