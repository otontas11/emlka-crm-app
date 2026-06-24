import { createRouter, createWebHistory } from "vue-router";
import MainLayout from "@/layouts/MainLayout.vue";

import DashboardView from "@/modules/core/dashboard/views/DashboardView.vue";
import ContactsView from "@/modules/crm/contacts/views/ContactsView.vue";
import PropertiesView from "@/modules/listings/properties/views/PropertiesView.vue";
import TasksView from "@/modules/core/tasks/views/TasksView.vue";
import FinanceView from "@/modules/finance/income-expense/views/FinanceView.vue";
import ProfileSiteView from "@/modules/core/profile-site/views/ProfileSiteView.vue";
import OfficeDashboardView from "@/modules/office/office-dashboard/views/OfficeDashboardView.vue";

const routes = [
  {
    path: "/",
    component: MainLayout,
    children: [
      {
        path: "",
        name: "dashboard",
        component: DashboardView,
      },
      {
        path: "contacts",
        name: "contacts",
        component: ContactsView,
      },
      {
        path: "properties",
        name: "properties",
        component: PropertiesView,
      },
      {
        path: "tasks",
        name: "tasks",
        component: TasksView,
      },
      {
        path: "finance",
        name: "finance",
        component: FinanceView,
      },
      {
        path: "profile-site",
        name: "profile-site",
        component: ProfileSiteView,
      },
      {
        path: "office",
        name: "office-dashboard",
        component: OfficeDashboardView,
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;


