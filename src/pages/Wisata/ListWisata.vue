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
        <button class="btn btn-primary" @click="showModal = true">Add Wisata</button>
      </div>
  
      <!-- Table -->
      <table class="table table-bordered">
        <thead>
          <tr>
            <th>Name</th>
            <th>Description</th>
            <th>Destinasi</th>
            <th>Benefit</th>
            <th>Price</th>  
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in paginatedData" :key="item.id">
            <!-- <td>{{ index + 1 + (currentPage - 1) * limit }}</td> -->
            <td>{{ item.nama }}</td>
            <td>{{ item.description }}</td>
            <td>{{ item.destination }}</td>
            <td>{{ item.benefit }}</td>
            <td>{{ item.price }}</td>
            <td>
              <button class="btn btn-danger btn-sm" @click="deleteWisata(item.id)">Hapus</button>
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
              <h5 class="modal-title">Add Wisata</h5>
              <button type="button" class="btn-close" @click="closeModal"></button>
            </div>
            <div class="modal-body">
              <form @submit.prevent="addWisata">
                <div class="mb-3">
                  <label for="nama" class="form-label">Name</label>
                  <input type="text" id="nama" v-model="form.nama" class="form-control" required />
                </div>
                <div class="mb-3">
                  <label for="description" class="form-label">Description</label>
                  <input type="text" id="description" v-model="form.description" class="form-control" required />
                </div>
                <div class="mb-3">
                  <label for="benefit" class="form-label">Benefit</label>
                  <input type="text" id="benefit" v-model="form.benefit" class="form-control" required />
                </div>
                <div class="mb-3">
                  <label for="destination" class="form-label">Destination</label>
                  <input type="text" id="destination" v-model="form.destination" class="form-control" required />
                </div>
                <div class="mb-3">
                  <label for="price" class="form-label">Price</label>
                  <input type="number" id="price" v-model="form.price" class="form-control" required />
                </div>
                <div class="mb-3">
                  <label for="image" class="form-label">Image</label>
                  <input type="file" id="image" @change="handleImageUpload" class="form-control" />
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
              <p>Apakah Anda yakin ingin menghapus Wisata ini?</p>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" @click="closeDeleteModal">Batal</button>
              <button type="button" class="btn btn-danger" @click="confirmDeleteWisata">Hapus</button>
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
        wisatas: [], // Data dari API
        currentPage: 1, // Halaman saat ini
        limit: 5, // Jumlah data per halaman
        searchQuery: "", // Query pencarian
        showModal: false,
        showDeleteModal: false,
        deleteWisataId: null,
        form: {
          nama: "",
          description: "",
          benefit: "",
          destination: "",
          price: 0,
          image: ""
        },
      };
    },
    mounted() {
      this.fetchWisata();
    },
    computed: {
      // Data yang difilter berdasarkan search query
      filteredData() {
        return this.wisatas.filter((item) =>
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
      handleImageUpload(event) {
        const file = event.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onloadend = () => {
            this.form.imageBase64 = reader.result.split(',')[1]; // Ambil bagian base64
          };
          reader.readAsDataURL(file);
        }
      },
      // Ambil data dari API
      async fetchWisata() {
        try {
          // const apiUrl = import.meta.env.VITE_API_URL;
          const response = await fetch(`http://103.179.56.241:8000/wisata`, {
            method: "GET",
          });
          const wisatas = await response.json();
          this.wisatas = wisatas;
          console.log(wisatas);
        } catch (error) {
          console.error("Failed to fetch wisatas:", error);
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
          description: "",
          benefit: "",
          destination: "",
          price: 0,
          imageBase64: "", // Reset image base64
        };
      },
      async addWisata() {
        try {
          const wisataData = {
            nama: this.form.nama,
            description: this.form.description,
            benefit: this.form.benefit,
            destination: this.form.destination,
            price: this.form.price,
            image: this.form.imageBase64, // Gambar dalam format base64
          };
          // const apiUrl = import.meta.env.VITE_API_URL;
          const response = await fetch(`http://103.179.56.241:8000/wisata`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(wisataData),
          });
          if (response.ok) {
            this.fetchWisata();
            this.closeModal();
          } else {
            console.error("Failed to add wisata");
          }
        } catch (error) {
          console.error("Failed to add wisata:", error);
        }
      },
      viewDetail(id) {
        this.$router.push(`/wisata/${id}`);
      },
      deleteWisata(id) {
        this.deleteWisataId = id;
        this.showDeleteModal = true;
      },
      closeDeleteModal() {
        this.showDeleteModal = false;
        this.deleteWisataId = null;
      },
      async confirmDeleteWisata() {
        try {
          // const apiUrl = import.meta.env.VITE_API_URL;
          const response = await fetch(`http://103.179.56.241:8000/wisata/${this.deleteWisataId}`, {
            method: "DELETE",
          });
          if (response.ok) {
            this.fetchWisata();
          } else {
            console.error("Failed to delete Wisata");
          }
        } catch (error) {
          console.error("Failed to delete Wisata:", error);
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
  