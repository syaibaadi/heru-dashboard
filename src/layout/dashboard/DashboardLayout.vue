<template>
  <div class="wrapper">
    <side-bar>
      <template slot="links">
        <sidebar-link to="/dashboard" name="Dashboard" icon="ti-panel" />
        <sidebar-link to="/pelanggan" name="Pelanggan" icon="ti-user" />
        <sidebar-link to="/admin" name="Admin" icon="ti-user" />
        <sidebar-link to="/wisata" name="Wisata" icon="ti-map-alt" />
        <sidebar-link to="/kendaraan" name="Kendaraan" icon="ti-car" />
        <sidebar-link to="/transaksi" name="Transaksi" icon="ti-wallet" />
      </template>
      <mobile-menu>
        
        <li class="nav-item">
          <a class="nav-link">
            <i class="ti-settings"></i>
            <p>Settings</p>
          </a>
        </li>
        <li class="divider"></li>
      </mobile-menu>
    </side-bar>
    <div class="main-panel">
      <top-navbar></top-navbar>

      <dashboard-content @click.native="toggleSidebar"> </dashboard-content>

      <content-footer></content-footer>
    </div>
  </div>
</template>
<style lang="scss"></style>
<script>
import TopNavbar from "./TopNavbar.vue";
import ContentFooter from "./ContentFooter.vue";
import DashboardContent from "./Content.vue";
import MobileMenu from "./MobileMenu";
export default {
  components: {
    TopNavbar,
    ContentFooter,
    DashboardContent,
    MobileMenu,
  },
  methods: {
    toggleSidebar() {
      if (this.$sidebar.showSidebar) {
        this.$sidebar.displaySidebar(false);
      }
    },
  },
};
</script>
