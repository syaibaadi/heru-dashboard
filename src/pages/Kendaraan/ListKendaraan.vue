<template>
  <div>
    <!-- Search Input and Add Button -->
    <div class="d-flex justify-content-between mb-3">
      <input
        type="text"
        class="form-control w-50"
        placeholder="Search..."
        v-model="searchQuery"
      />
      <button class="btn btn-primary" @click="showModal = true">Add Kendaraan</button>
    </div>

    <!-- Table -->
    <table class="table table-bordered">
      <thead>
        <tr>
          <th>Name</th>
          <th>Type</th>
          <th>Capacity</th>
          <th>Police Number</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in paginatedData" :key="item.id">
          <td>{{ item.nama }}</td>
          <td>{{ item.type }}</td>
          <td>{{ item.capacity }}</td>
          <td>{{ item.number }}</td>
          <td>
            <button class="btn btn-danger btn-sm" @click="deleteKendaraan(item.id)">Hapus Kendaraan</button>
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

    <!-- Add Kendaraan Modal -->
    <div v-if="showModal" class="modal" style="display: block; background: rgba(0, 0, 0, 0.5);">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Add Kendaraan</h5>
            <button type="button" class="btn-close" @click="closeModal"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="addKendaraan">
              <div class="mb-3">
                <label for="nama" class="form-label">Name</label>
                <input type="text" id="nama" v-model="form.nama" class="form-control" required />
              </div>
              <div class="mb-3">
                <label for="type" class="form-label">Type</label>
                <input type="text" id="type" v-model="form.type" class="form-control" required />
              </div>
              <div class="mb-3">
                <label for="capacity" class="form-label">Capacity</label>
                <input type="number" id="capacity" v-model="form.capacity" class="form-control" required />
              </div>
              <div class="mb-3">
                <label for="number" class="form-label">Police Number</label>
                <input type="text" id="number" v-model="form.number" class="form-control" required />
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
            <button type="button" class="btn btn-danger" @click="confirmDeleteKendaraan">Hapus</button>
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
      kendaraans: [],
      currentPage: 1,
      limit: 5,
      searchQuery: "",
      showModal: false,
      showDeleteModal: false,
      deleteKendaraanId: null,
      form: {
        nama: "",
        type: "",
        capacity: 0,
        number: "",
      },
    };
  },
  mounted() {
    this.fetchKendaraan();
  },
  computed: {
    filteredData() {
      return this.kendaraans.filter((item) =>
        item.nama.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
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
    async fetchKendaraan() {
      try {
        // const apiUrl = import.meta.env.VITE_API_URL;
        const response = await fetch(`http://103.179.56.241:8000/kendaraan`, {
          method: "GET",
        });
        const kendaraans = await response.json();
        this.kendaraans = kendaraans;
      } catch (error) {
        console.error("Failed to fetch kendaraans:", error);
      }
    },
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
    async addKendaraan() {
      try {
        // const apiUrl = import.meta.env.VITE_API_URL;
        const response = await fetch(`http://103.179.56.241:8000/kendaraan`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(this.form),
        });
        if (response.ok) {
          this.fetchKendaraan();
          this.closeModal();
        } else {
          console.error("Failed to add kendaraan");
        }
      } catch (error) {
        console.error("Failed to add kendaraan:", error);
      }
    },
    viewDetail(id) {
      this.$router.push(`/kendaraan/${id}`);
    },
    deleteKendaraan(id) {
      this.deleteKendaraanId = id;
      this.showDeleteModal = true;
    },
    closeDeleteModal() {
      this.showDeleteModal = false;
      this.deleteKendaraanId = null;
    },
    async confirmDeleteKendaraan() {
      try {
        // const apiUrl = import.meta.env.VITE_API_URL;
        const response = await fetch(`http://103.179.56.241:8000/kendaraan/${this.deleteKendaraanId}`, {
          method: "DELETE",
        });
        if (response.ok) {
          this.fetchKendaraan();
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
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.modal-dialog {
  background: white;
  border-radius: 5px;
  overflow: hidden;
  max-width: 500px;
  width: 100%;
}
</style>
