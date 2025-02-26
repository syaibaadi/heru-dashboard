<template>
  <div>
    <!-- Search Input -->
    <div class="d-flex justify-content-between mb-3">
      <input
        type="text"
        class="form-control w-50"
        placeholder="Search..."
        v-model="searchQuery"
      />
    </div>

    <!-- Table -->
    <table class="table table-bordered">
      <thead>
        <tr>
          <th>Name</th>
          <th>Phone</th>
          <th>Total User</th>
          <th>Wisata Name</th>
          <th>Book Date</th>
          <th>Price</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in paginatedData" :key="item.id">
          <td>{{ item.nama }}</td>
          <td>{{ item.telfon }}</td>
          <td>{{ item.total_user }}</td>
          <td>{{ item.wisataName }}</td>
          <td>{{ formatDate(item.book_date) }} at 07:00</td>
          <td>Rp. {{ formatCurrency(item.total_price | currency) }}</td>
          <td>{{ item.status }}</td>
        </tr>
        <tr v-if="paginatedData.length === 0">
          <td colspan="7" class="text-center">No data found</td>
        </tr>
      </tbody>
    </table>

    <!-- Pagination -->
    <div class="d-flex justify-content-between align-items-center">
      <div class="d-flex align-items-center">
        <label for="limit" class="me-2 mb-0">Show:</label>
        <select
          id="limit"
          class="form-select w-auto"
          v-model="limit"
          @change="changePage(1)"
        >
          <option v-for="opt in [5, 10, 20]" :key="opt" :value="opt">
            {{ opt }}
          </option>
        </select>
      </div>

      <nav>
        <ul class="pagination mb-0">
          <li
            class="page-item"
            :class="{ disabled: currentPage === 1 }"
            @click="changePage(currentPage - 1)"
          >
            <a class="page-link">Previous</a>
          </li>
          <li
            class="page-item"
            v-for="page in totalPages"
            :key="page"
            :class="{ active: currentPage === page }"
            @click="changePage(page)"
          >
            <a class="page-link">{{ page }}</a>
          </li>
          <li
            class="page-item"
            :class="{ disabled: currentPage === totalPages }"
            @click="changePage(currentPage + 1)"
          >
            <a class="page-link">Next</a>
          </li>
        </ul>
      </nav>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      transaksis: [], // Data transaksi dari API
      wisatas: {}, // Cache wisata berdasarkan ID
      currentPage: 1, // Halaman saat ini
      limit: 5, // Jumlah data per halaman
      searchQuery: "", // Query pencarian
    };
  },
  mounted() {
    this.fetchTransaksi();
  },
  computed: {
    filteredData() {
      const filtered = this.transaksis.filter((item) =>
        item.nama.toLowerCase().includes(this.searchQuery.toLowerCase())
      );

      return filtered.sort((a, b) => {
        const dateA = new Date(a.book_date);
        const dateB = new Date(b.book_date);
        return dateB - dateA; // Urutkan dari terbaru (descending)
      });
    },
    totalPages() {
      return Math.ceil(this.filteredData.length / this.limit);
    },
    paginatedData() {
      const start = (this.currentPage - 1) * this.limit;
      const end = start + this.limit;
      return this.filteredData.slice(start, end);
    },
  },
  methods: {
    formatCurrency(amount) {
      return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0, // Tidak ada desimal jika tidak perlu
        maximumFractionDigits: 0, // Menampilkan angka tanpa desimal
      }).format(amount);
    },
    // Ambil data transaksi dari API
    async fetchTransaksi() {
      try {
        const response = await fetch(`http://103.179.56.241:8000/transaksi`, {
          method: "GET",
        });
        const transaksis = await response.json();
        this.transaksis = await Promise.all(
          transaksis.map(async (transaksi) => {
            // Fetch wisata untuk setiap transaksi berdasarkan wisata_id
            const wisata = await this.fetchWisata(transaksi.wisata_id);
            return {
              ...transaksi,
              wisataName: wisata ? wisata.nama : "Unknown",
            };
          })
        );
      } catch (error) {
        console.error("Failed to fetch transaksis:", error);
      }
    },
    // Ambil data wisata berdasarkan wisata_id
    async fetchWisata(wisataId) {
      if (this.wisatas[wisataId]) {
        return this.wisatas[wisataId];
      }
      try {
        const response = await fetch(`http://103.179.56.241:8000/wisata/${wisataId}`);
        const wisata = await response.json();
        this.$set(this.wisatas, wisataId, wisata); // Cache wisata berdasarkan ID
        return wisata;
      } catch (error) {
        console.error("Failed to fetch wisata:", error);
        return null;
      }
    },
    // Ubah halaman
    changePage(page) {
      if (page > 0 && page <= this.totalPages) {
        this.currentPage = page;
      }
    },
    // Format tanggal dengan jam, menit, dan detik
    formatDate(date) {
      const options = {
        year: "numeric",
        month: "long",
        day: "numeric",
      };
      return new Date(date).toLocaleString(undefined, options);
    },
  },
};
</script>

<style scoped>
.table {
  margin-bottom: 1rem;
}
.pagination {
  margin-top: 1rem;
}
</style>
