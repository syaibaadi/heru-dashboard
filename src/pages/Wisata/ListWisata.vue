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
            <th>Minimal Person</th>
            <th>Maksimal Person</th>
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
            <td>{{ item.min_person }}</td>
            <td>{{ item.max_person }}</td>
            <td>
              <button class="btn btn-warning btn-sm" @click="editWisata(item.id)">Edit</button>
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
                  <label for="min_person" class="form-label">Minimal Person</label>
                  <input type="number" id="min_person" v-model="form.min_person" class="form-control" required />
                </div>
                <div class="mb-3">
                  <label for="max_person" class="form-label">Maksimal Person</label>
                  <input type="number" id="max_person" v-model="form.max_person" class="form-control" required />
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

      <!-- Edit Wisata Modal -->
      <div v-if="showEditModal" class="modal" style="display: block; background: rgba(0, 0, 0, 0.5);">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">Edit Wisata</h5>
              <button type="button" class="btn-close" @click="closeEditModal"></button>
            </div>
            <div class="modal-body">
              <form @submit.prevent="updateWisata">
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
                  <label for="min_person" class="form-label">Minimal Person</label>
                  <input type="number" id="min_person" v-model="form.min_person" class="form-control" required />
                </div>
                <div class="mb-3">
                  <label for="max_person" class="form-label">Maksimal Person</label>
                  <input type="number" id="max_person" v-model="form.max_person" class="form-control" required />
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
        showEditModal: false,
        showDeleteModal: false,
        deleteWisataId: null,
        form: {
          nama: "",
          description: "",
          benefit: "",
          destination: "",
          price: 0,
          min_person: 0,
          max_person: 0,
          image: "",
          imageBase64: "", // Image dalam base64
        },
      };
    },
    mounted() {
      this.fetchWisata();
      this.fetchKendaraan();
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
      async fetchKendaraan() {
        try {
          const response = await fetch(`http://103.179.56.241:8000/kendaraan`);
          const kendaraan = await response.json();
          this.kendaraanList = kendaraan;
        } catch (error) {
          console.error("Failed to fetch kendaraan:", error);
        }
      },
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
          // const response = await fetch(`http://103.179.56.241:8000/wisata`, {
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
            min_person: this.form.min_person,
            max_person: this.form.max_person,
            image: this.form.imageBase64, // Gambar dalam format base64
          };
          // const apiUrl = import.meta.env.VITE_API_URL;
          // const response = await fetch(`http://103.179.56.241:8000/wisata`, {
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
      async editWisata(id) {
        try {
          // const response = await fetch(`http://103.179.56.241:8000/wisata/${id}`);
          const response = await fetch(`http://103.179.56.241:8000/wisata/${id}`);
          const data = await response.json();
          this.form = {
            id: data.id,
            nama: data.nama,
            description: data.description,
            benefit: data.benefit,
            destination: data.destination,
            price: data.price,
            min_person: data.min_person,
            max_person: data.max_person,
            imageBase64: data.image, // Gambar mungkin sudah base64 di API
          };
          this.showEditModal = true;
        } catch (error) {
          console.error("Failed to fetch wisata for edit:", error);
        }
      },
      // Fungsi untuk mengupdate wisata
      async updateWisata() {
        try {
          const wisataData = {
            nama: this.form.nama,
            description: this.form.description,
            benefit: this.form.benefit,
            destination: this.form.destination,
            price: this.form.price,
            min_person: this.form.min_person,
            max_person:this.form.max_person,
            image: this.form.imageBase64, // Gambar dalam format base64
          };
          // const response = await fetch(`http://103.179.56.241:8000/wisata/${this.form.id}`, {
          const response = await fetch(`http://103.179.56.241:8000/wisata/${this.form.id}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(wisataData),
          });
          if (response.ok) {
            this.fetchWisata();  // Refresh data setelah update
            this.closeEditModal();  // Tutup modal edit
          } else {
            console.error("Failed to update wisata");
          }
        } catch (error) {
          console.error("Failed to update wisata:", error);
        }
      },
      // Fungsi untuk menutup modal edit
      closeEditModal() {
        this.showEditModal = false;
        this.form = {
          nama: "",
          description: "",
          benefit: "",
          destination: "",
          price: 0,
          imageBase64: "",
        };
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
          // Hapus data dari server
          const response = await fetch(`http://103.179.56.241:8000/wisata/${this.deleteWisataId}`, {
            method: "DELETE",
          });
          
          if (response.ok) {
            // Hapus data lokal
            this.wisatas = this.wisatas.filter(wisata => wisata.id !== this.deleteWisataId);
            this.closeDeleteModal();  // Tutup modal
          } else {
            console.error("Failed to delete Wisata");
          }
        } catch (error) {
          console.error("Failed to delete Wisata:", error);
        } finally {
          this.closeDeleteModal();
        }
      }
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
  .modal-dialog {
    max-width: 800px; /* Setel lebar maksimum untuk modal */
  }

  .modal-content {
    max-height: 90vh; /* Setel tinggi maksimum modal agar tidak melebihi layar */
    display: flex;
    flex-direction: column;
  }

  .modal-body {
    overflow-y: auto; /* Membuat konten modal dapat di-scroll secara vertikal */
    max-height: 70vh; /* Sesuaikan agar bagian body modal bisa di-scroll */
  }
  /* Styling untuk dropdown kendaraan */
  select.form-select {
    background-color: #f8f9fa; /* Warna latar belakang terang */
    border: 1px solid #ced4da; /* Warna border */
    padding: 10px; /* Padding yang lebih besar untuk tampilan lebih luas */
    font-size: 1rem; /* Ukuran font lebih besar untuk keterbacaan */
    border-radius: 5px; /* Sudut dropdown yang lebih halus */
    transition: border-color 0.3s ease, background-color 0.3s ease;
  }

  select.form-select:focus {
    border-color: #0056b3; /* Warna border saat fokus */
    background-color: #e9ecef; /* Warna latar belakang saat fokus */
    outline: none; /* Menghapus outline default */
  }

  select.form-select:hover {
    background-color: #e2e6ea; /* Warna latar belakang ketika hover */
    border-color: #0056b3; /* Ubah warna border saat hover */
  }


</style>
  