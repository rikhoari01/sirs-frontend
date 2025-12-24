<template>
  <aside
    :class="[
      'fixed mt-16 flex flex-col lg:mt-0 top-0 px-5 left-0 bg-white dark:bg-gray-900 dark:border-gray-800 text-gray-900 h-screen transition-all duration-300 ease-in-out z-20 border-r border-gray-200',
      {
        'lg:w-[290px]': isExpanded || isMobileOpen || isHovered,
        'lg:w-[90px]': !isExpanded && !isHovered,
        'translate-x-0 w-[290px]': isMobileOpen,
        '-translate-x-full': !isMobileOpen,
        'lg:translate-x-0': true,
      },
    ]"
    @mouseenter="!isExpanded && (isHovered = true)"
    @mouseleave="isHovered = false"
  >
    <div
      :class="[
        'py-8 flex',
        !isExpanded && !isHovered ? 'lg:justify-center' : 'justify-start',
      ]"
    >
      <router-link to="/">
        <img
          v-if="isExpanded || isHovered || isMobileOpen"
          :src="logoUrl"
          alt="Logo"
          height="40"
        />
        <img
          v-else
          :src="iconUrl"
          alt="Logo"
          height="40"
        />
      </router-link>
    </div>
    <div
      class="flex flex-col overflow-y-auto duration-300 ease-linear no-scrollbar"
    >
      <nav class="mb-6">
        <div class="flex flex-col gap-4">
          <div v-for="(menuGroup, groupIndex) in menuGroups" :key="groupIndex">
            <h2
              :class="[
                'mb-4 text-xs uppercase flex leading-[20px] text-gray-400',
                !isExpanded && !isHovered
                  ? 'lg:justify-center'
                  : 'justify-start',
              ]"
            >
              <template v-if="isExpanded || isHovered || isMobileOpen">
                {{ menuGroup.title }}
              </template>
              <HorizontalDots v-else />
            </h2>
            <ul class="flex flex-col gap-4">
              <li v-for="(item, index) in menuGroup.items" :key="item.name">
                <router-link
                  v-if="isAvailable(item.roleRequired)"
                  :to="item.path"
                  :class="[
                    'menu-item group',
                    {
                      'menu-item-active': isActive(item.path),
                      'menu-item-inactive': !isActive(item.path),
                    },
                  ]"
                >
                  <span
                    :class="[
                      isActive(item.path)
                        ? 'menu-item-icon-active'
                        : 'menu-item-icon-inactive',
                    ]"
                  >
                    <component :is="item.icon" />
                  </span>
                  <span
                    v-if="isExpanded || isHovered || isMobileOpen"
                    class="menu-item-text"
                    >{{ item.name }}</span
                  >
                </router-link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { useRoute } from "vue-router";

import {
  GridIcon,
  UserCircleIcon,
  UserGroupIcon,
  HorizontalDots,
  TableIcon,
} from "../../icons";
import { useAuthStore } from '@/stores/auth.ts'
import { useSidebar } from "@/composables/useSidebar";
import { storeToRefs } from 'pinia'

const route = useRoute();

const { isExpanded, isMobileOpen, isHovered } = useSidebar();

const logoUrl = '/images/logo/SIR-Logo.png';
const iconUrl = '/images/logo/SIR-Icon.png';

const menuGroups = [
  {
    title: "Menu",
    items: [
      {
        icon: GridIcon,
        name: "Dashboard",
        path: "/",
        roleRequired: []
      },
      {
        icon: TableIcon,
        name: "Reports",
        path: "/reports",
        roleRequired: []
      },
      {
        icon: UserCircleIcon,
        name: "User Management",
        path: "/user-management",
        roleRequired: ['Admin']
      },
      {
        icon: UserGroupIcon,
        name: "Role Management",
        path: "/role-management",
        roleRequired: ['Admin']
      },
    ],
  },
];

const authStore = useAuthStore();
const { user } = storeToRefs(authStore)

const isActive = (path) => route.path === path;
const isAvailable = (requiredRole: string[] = []) => {
  if (requiredRole.length === 0) return true

  // if user or roles not loaded yet, deny
  if (!user.value?.user_roles) return false

  return user.value.user_roles.some(role =>
    requiredRole.includes(role)
  )
}
</script>
