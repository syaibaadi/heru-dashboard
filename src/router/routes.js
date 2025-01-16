import DashboardLayout from "@/layout/dashboard/DashboardLayout.vue";
// GeneralViews
import NotFound from "@/pages/NotFoundPage.vue";

// Admin pages
import Dashboard from "@/pages/Dashboard.vue";
import UserProfile from "@/pages/UserProfile.vue";
import Notifications from "@/pages/Notifications.vue";
import Icons from "@/pages/Icons.vue";
import Maps from "@/pages/Maps.vue";
import Typography from "@/pages/Typography.vue";
import TableList from "@/pages/TableList.vue";
import ListAdmin from "@/pages/Admin/ListAdmin.vue";
import ListWisata from "@/pages/Wisata/ListWisata.vue"
import ListPelanggan from "../pages/Pelanggan/ListPelanggan.vue";
import ListTransaksi from "../pages/Transaksi/ListTransaksi.vue";
import ListKendaraan from "../pages/Kendaraan/ListKendaraan.vue";
import LoginView from "../pages/Login/LoginView.vue";

const routes = [
  {
    path: "/login",
    name: "login",
    component: LoginView,
  },
  {
    path: "/",
    component: DashboardLayout,
    redirect: "/dashboard",
    meta: { requiresAuth: true },
    children: [
      {
        path: "dashboard",
        name: "dashboard",
        component: Dashboard,
      },
      {
        path: "admin",
        name: "admin",
        component: ListAdmin,
      },
      {
        path: "wisata",
        name: "wisata",
        component: ListWisata,
      },
      {
        path: "kendaraan",
        name: "kendaraan",
        component: ListKendaraan,
      },
      {
        path: "pelanggan",
        name: "pelanggan",
        component: ListPelanggan,
      },
      {
        path: "transaksi",
        name: "transaksi",
        component: ListTransaksi,
      },
      {
        path: "stats",
        name: "stats",
        component: UserProfile,
      },
      {
        path: "notifications",
        name: "notifications",
        component: Notifications,
      },
      {
        path: "icons",
        name: "icons",
        component: Icons,
      },
      {
        path: "maps",
        name: "maps",
        component: Maps,
      },
      {
        path: "typography",
        name: "typography",
        component: Typography,
      },
      {
        path: "table-list",
        name: "table-list",
        component: TableList,
      },
    ],
  },
  { path: "*", component: NotFound },
];

/**
 * Asynchronously load view (Webpack Lazy loading compatible)
 * The specified component must be inside the Views folder
 * @param  {string} name  the filename (basename) of the view to load.
function view(name) {
   var res= require('../components/Dashboard/Views/' + name + '.vue');
   return res;
};**/

export default routes;
