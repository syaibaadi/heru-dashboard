<template>
  <div>
    <!-- Stats cards -->
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

export default {
  components: {
    StatsCard,
    ChartCard,
  },
  data() {
    return {
      statsCards: [
        {
          type: "warning",
          icon: "ti-map-alt",
          title: "Wisata",
          value: "0", // Default value, will be updated after API call
        },
        {
          type: "success",
          icon: "ti-wallet",
          title: "Transaction",
          value: "0", // Default value, will be updated after API call
        },
        {
          type: "danger",
          icon: "ti-user",
          title: "Pelanggan",
          value: "0", // Default value, will be updated after API call
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
  mounted() {
    this.fetchData(); // Call fetchData on component mount
  },
  methods: {
    async fetchData() {
      try {
        // Fetch data for Wisata
        const wisataResponse = await fetch(`http://103.179.56.241:8000/wisata`, {
          method: "GET",
        });
        const wisataData = await wisataResponse.json(); // Parse the JSON response
        this.statsCards[0].value = wisataData.length; // Set the number of items in the 'wisata' array

        // Fetch data for Transaction
        const transaksiResponse = await fetch(`http://103.179.56.241:8000/transaksi`, {
          method: "GET",
        });
        const transaksiData = await transaksiResponse.json(); // Parse the JSON response
        this.statsCards[1].value = transaksiData.length; // Set the number of items in the 'transaksi' array

        // Fetch data for Pelanggan
        const pelangganResponse = await fetch(`http://103.179.56.241:8000/pelanggan`, {
          method: "GET",
        });
        const pelangganData = await pelangganResponse.json(); // Parse the JSON response
        this.statsCards[2].value = pelangganData.length; // Set the number of items in the 'pelanggan' array
      } catch (error) {
        console.error("Error fetching data:", error);
        // Optionally handle errors and update the UI accordingly
      }
    },
  },
};
</script>

<style></style>
