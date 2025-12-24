<template>
  <FullScreenLayout>
    <div class="relative bg-white z-1 dark:bg-gray-900 sm:p-0">
      <div
        class="relative flex flex-col justify-center items-center w-full h-screen bg-brand-950 dark:bg-white/5"
      >
        <div class="flex items-center justify-center z-1">
          <common-grid-shape />
          <div class="flex flex-col items-center max-w-xl lg:w-md bg-white p-10 rounded-md">
            <div class="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
              <div>
                <div class="text-center" v-if="!isLoading">
                  <div class="mb-8">
                    <h1
                      class="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md"
                    >
                      Email Is Verified
                    </h1>
                    <p class="text-sm text-gray-500 dark:text-gray-400">
                      Your email has been verified, please login!
                    </p>
                  </div>

                  <router-link
                    to="/login"
                    class="flex items-center justify-center w-full px-4 py-3 text-sm font-medium text-white transition rounded-lg bg-brand-500 shadow-theme-xs hover:bg-brand-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Login
                  </router-link>
                </div>
                <div v-else class="flex justify-center items-center">
                  <span
                    class="mr-2 animate-spin border-2 border-b-blue-400 border-t-transparent rounded-full w-10 h-10"
                  ></span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </FullScreenLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { showToast } from '@/plugins/Toast.ts'
import { useAuthStore } from '@/stores/auth'
import { RouterLink, useRoute } from 'vue-router'
import CommonGridShape from '@/components/common/CommonGridShape.vue'
import FullScreenLayout from '@/components/layout/FullScreenLayout.vue'

const email = ref<string>('')
const hash = ref<string>('')
const isLoading = ref<boolean>(true)

const auth = useAuthStore()
const route = useRoute()

email.value = route.query.email as string || ''
hash.value = route.query.hash as string || ''

const validateEmail = () => {
  auth
    .verifyEmail({ email: email.value, hash: hash.value })
    .then(res => {
      if (res.status === 'success') {
        isLoading.value = false
      } else {
        showToast({title: res.message, icon: 'error'})
      }
    })
    .catch(err => {
      const errorMessage = err.response?.data?.message || 'Failed to send reset password link!'
      showToast({ title: errorMessage, icon: 'error' })
    })
}

onMounted(() => {
  validateEmail()
})
</script>
