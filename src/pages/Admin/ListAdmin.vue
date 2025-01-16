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
        <button class="btn btn-primary" @click="showModal = true">Add Admin</button>
      </div>
  
      <!-- Table -->
      <table class="table table-bordered">
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Email</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in paginatedData" :key="item.id">
            <td>{{ index + 1 + (currentPage - 1) * limit }}</td>
            <td>{{ item.nama }}</td>
            <td>{{ item.email }}</td>
            <td>
              <button class="btn btn-info btn-sm me-2" @click="viewDetail(item.id)">Detail</button>
              <button class="btn btn-danger btn-sm" @click="deleteAdmin(item.id)">Hapus</button>
            </td>
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

      <!-- Add Kendaraan Modal -->
      <div v-if="showModal" class="modal" style="display: block; background: rgba(0, 0, 0, 0.5);">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">Add Admin</h5>
              <button type="button" class="btn-close" @click="closeModal"></button>
            </div>
            <div class="modal-body">
              <form @submit.prevent="addAdmin">
                <div class="mb-3">
                  <label for="nama" class="form-label">Name</label>
                  <input type="text" id="nama" v-model="form.nama" class="form-control" required />
                </div>
                <div class="mb-3">
                  <label for="email" class="form-label">Email</label>
                  <input type="email" id="email" v-model="form.email" class="form-control" required />
                </div>
                <div class="mb-3">
                  <label for="passowrd" class="form-label">Password</label>
                  <input type="password" id="passowrd" v-model="form.password" class="form-control" required />
                </div>
                <button type="submit" class="btn btn-primary">Submit</button>
              </form>
            </div>
          </div>
        </div>
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
              <button type="button" class="btn btn-danger" @click="confirmDeleteAdmin">Hapus</button>
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
        admins: [], // Data dari API
        currentPage: 1, // Halaman saat ini
        limit: 5, // Jumlah data per halaman
        searchQuery: "", // Query pencarian
        showModal: false,
        showDeleteModal: false,
        deleteAdminId: null,
        form: {
          nama: "",
          email: "",
          password: "",
        },
      };
    },
    mounted() {
      this.fetchAdmin();
    },
    computed: {
      // Data yang difilter berdasarkan search query
      filteredData() {
        return this.admins.filter((item) =>
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
      async fetchAdmin() {
        try {
          // const apiUrl = import.meta.env.VITE_API_URL;
          const response = await fetch(`http://103.250.11.13:8000/admin`, {
            method: "GET",
          });
          const admins = await response.json();
          this.admins = admins;
          console.log(admins);
        } catch (error) {
          console.error("Failed to fetch admins:", error);
        }
      },
      // Ubah halaman
      changePage(page) {
        if (page > 0 && page <= this.totalPages) {
          this.currentPage = page;
        }
      },
      closeModal() {
        this.showModal = false;
        this.form = {
          nama: "",
          type: "",
          capacity: 0,
          number: "",
        };
      },
      async addAdmin() {
        try {
          // const apiUrl = import.meta.env.VITE_API_URL;
          const response = await fetch(`http://103.250.11.13:8000/admin`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(this.form),
          });
          if (response.ok) {
            this.fetchAdmin();
            this.closeModal();
          } else {
            console.error("Failed to add Admin");
          }
        } catch (error) {
          console.error("Failed to add Admin:", error);
        }
      },
      viewDetail(id) {
        this.$router.push(`/admin/${id}`);
      },
      deleteAdmin(id) {
        this.deleteAdminId = id;
        this.showDeleteModal = true;
      },
      closeDeleteModal() {
        this.showDeleteModal = false;
        this.deleteAdminId = null;
      },
      async confirmDeleteAdmin() {
        try {
          // const apiUrl = import.meta.env.VITE_API_URL;
          const response = await fetch(`http://103.250.11.13:8000/admin/${this.deleteAdminId}`, {
            method: "DELETE",
          });
          if (response.ok) {
            this.fetchKendaraan();
          } else {
            console.error("Failed to delete Admin");
          }
        } catch (error) {
          console.error("Failed to delete Admin:", error);
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
  