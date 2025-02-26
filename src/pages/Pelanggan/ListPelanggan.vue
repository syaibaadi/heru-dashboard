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
        <!-- <button class="btn btn-primary" @click="showModal = true">Add Pelanggan</button> -->
      </div>
  
      <!-- Table -->
      <table class="table table-bordered">
        <thead>
          <tr>
            <th>Name</th>
            <th>Phone</th>
            <th>Address</th>
            <th>Email</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in paginatedData" :key="item.id">
            <!-- <td>{{ index + 1 + (currentPage - 1) * limit }}</td> -->
            <td>{{ item.nama }}</td>
            <td>{{ item.phone }}</td>
            <td>{{ item.address }}</td>
            <td>{{ item.email }}</td>
            <td>
                <!-- <button class="btn btn-info btn-sm me-2" @click="viewDetail(item.id)">Detail</button> -->
                <button class="btn btn-danger btn-sm" @click="deletePelanggan(item.id)">Hapus</button>
            </td>
          </tr>
          <tr v-if="paginatedData.length === 0">
            <td colspan="5" class="text-center">No data found</td>
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

      <!-- Delete Confirmation Modal -->
      <div v-if="showDeleteModal" class="modal" style="display: block; background: rgba(0, 0, 0, 0.5);">
        <div class="modal-dialog">
            <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">Konfirmasi Penghapusan</h5>
                <button type="button" class="btn-close" @click="closeDeleteModal"></button>
            </div>
            <div class="modal-body">
                <p>Apakah Anda yakin ingin menghapus kendaraan ini?</p>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" @click="closeDeleteModal">Batal</button>
                <button type="button" class="btn btn-danger" @click="confirmDeletePelanggan">Hapus</button>
            </div>
            </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        pelanggans: [], // Data dari API
        currentPage: 1, // Halaman saat ini
        limit: 5, // Jumlah data per halaman
        searchQuery: "", // Query pencarian
        showModal: false,
        showDeleteModal: false,
        deletePelangganId: null,
      };
    },
    mounted() {
      this.fetchPelanggan();
    },
    computed: {
      // Data yang difilter berdasarkan search query
      filteredData() {
        return this.pelanggans.filter((item) =>
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
      async fetchPelanggan() {
        try {
          // const apiUrl = import.meta.env.VITE_API_URL;
          // const response = await fetch(`http://103.179.56.241:8000/pelanggan`, {
          const response = await fetch(`http://103.179.56.241:8000/pelanggan`, {
            method: "GET",
          });
          const pelanggans = await response.json();
          this.pelanggans = pelanggans;
          console.log(pelanggans);
        } catch (error) {
          console.error("Failed to fetch pelanggans:", error);
        }
      },
      // Ubah halaman
      changePage(page) {
        if (page > 0 && page <= this.totalPages) {
          this.currentPage = page;
        }
      },
      viewDetail(id) {
        this.$router.push(`/kendaraan/${id}`);
      },
      deletePelanggan(id) {
        this.deletePelangganId = id;
        this.showDeleteModal = true;
      },
      closeDeleteModal() {
        this.showDeleteModal = false;
        this.deletePelangganId = null;
      },
      async confirmDeletePelanggan() {
        try {
            // const apiUrl = import.meta.env.VITE_API_URL;
            // const response = await fetch(`http://103.179.56.241:8000/pelanggan/${this.deletePelangganId}`, {
            const response = await fetch(`http://103.179.56.241:8000/pelanggan/${this.deletePelangganId}`, {
                method: "DELETE",
            });
            if (response.ok) {
                this.fetchPelanggan();
            } else {
                console.error("Failed to delete kendaraan");
            }
        } catch (error) {
            console.error("Failed to delete kendaraan:", error);
        } finally {
            this.closeDeleteModal();
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
  