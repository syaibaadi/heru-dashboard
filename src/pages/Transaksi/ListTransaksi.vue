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
            <th>Alamat</th>
            <th>Harga</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in paginatedData" :key="item.id">
            <td>{{ item.nama }}</td>
            <td>{{ item.alamat }}</td>
            <td>{{ item.total_price }}</td>
          </tr>
          <tr v-if="paginatedData.length === 0">
            <td colspan="3" class="text-center">No data found</td>
          </tr>
        </tbody>
      </table>
  
      <!-- Pagination -->
      <div class="d-flex justify-content-between align-items-center">
        <!-- Limit Selector -->
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
  
        <!-- Pagination Controls -->
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
        transaksis: [], // Data dari API
        currentPage: 1, // Halaman saat ini
        limit: 5, // Jumlah data per halaman
        searchQuery: "", // Query pencarian
      };
    },
    mounted() {
      this.fetchTransaksi();
    },
    computed: {
      // Data yang difilter berdasarkan search query
      filteredData() {
        return this.transaksis.filter((item) =>
          item.nama.toLowerCase().includes(this.searchQuery.toLowerCase())
        );
      },
      // Total halaman berdasarkan data yang difilter
      totalPages() {
        return Math.ceil(this.filteredData.length / this.limit);
      },
      // Data yang ditampilkan di tabel berdasarkan pagination
      paginatedData() {
        const start = (this.currentPage - 1) * this.limit;
        const end = start + this.limit;
        return this.filteredData.slice(start, end);
      },
    },
    methods: {
      // Ambil data dari API
      async fetchTransaksi() {
        try {
          // const apiUrl = import.meta.env.VITE_API_URL;
          const response = await fetch(`http://103.179.56.241:8000/transaksi`, {
            method: "GET",
          });
          const transaksis = await response.json();
          this.transaksis = transaksis;
          console.log(transaksis);
        } catch (error) {
          console.error("Failed to fetch transaksis:", error);
        }
      },
      // Ubah halaman
      changePage(page) {
        if (page > 0 && page <= this.totalPages) {
          this.currentPage = page;
        }
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
  