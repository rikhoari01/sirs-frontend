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
                <div class="mb-5 sm:mb-8">
                  <h1
                    class="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md"
                  >
                    Forgot Password
                  </h1>
                  <p class="text-sm text-gray-500 dark:text-gray-400">
                    Enter your email to reset your password!
                  </p>
                </div>
                <div>
                  <form @submit.prevent="handleSubmit">
                    <div class="space-y-5">
                      <!-- Email -->
                      <div>
                        <label
                          for="email"
                          class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400"
                        >
                          Email<span class="text-error-500">*</span>
                        </label>
                        <input
                          :disabled="isLoading"
                          v-model="email"
                          type="email"
                          id="email"
                          name="email"
                          placeholder="info@gmail.com"
                          class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                        />
                      </div>
                      <!-- Button -->
                      <div>
                        <button
                          type="submit"
                          class="flex items-center justify-center w-full px-4 py-3 text-sm font-medium text-white transition rounded-lg bg-brand-500 shadow-theme-xs hover:bg-brand-600 disabled:opacity-50 disabled:cursor-not-allowed"
                          :disabled="isLoading"
                        >
                          <span
                            v-if="isLoading"
                            class="mr-2 animate-spin border-2 border-white border-t-transparent rounded-full w-4 h-4"
                          ></span>
                          {{ isLoading ? 'Sending Email...' : 'Send Email' }}
                        </button>
                      </div>
                    </div>
                  </form>
                  <div class="mt-5 flex flex-col">
                    <p class="text-sm font-normal text-gray-700 dark:text-gray-400">
                      Don't have an account?
                      <router-link
                        to="/register"
                        class="text-brand-500 hover:text-brand-600 dark:text-brand-400"
                      >Register
                      </router-link>
                    </p>

                    <p
                      class="text-sm font-normal text-center text-gray-700 dark:text-gray-400 sm:text-start"
                    >
                      Already have an account?
                      <router-link
                        to="/login"
                        class="text-brand-500 hover:text-brand-600 dark:text-brand-400"
                      >Login</router-link
                      >
                    </p>
                  </div>
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
import { ref } from 'vue'
import { showToast } from '@/plugins/Toast.ts'
import { useAuthStore } from '@/stores/auth'
import { RouterLink } from 'vue-router'
import CommonGridShape from '@/components/common/CommonGridShape.vue'
import FullScreenLayout from '@/components/layout/FullScreenLayout.vue'

const email = ref<string>('')
const isLoading = ref<boolean>(false)

const auth = useAuthStore()

const handleSubmit = () => {
  const isValidEmail = validateEmail(email.value)
  if (!isValidEmail) {
    showToast({title: 'Please enter a valid email!', icon: 'error'})
    return
  }

  isLoading.value = true
  auth
    .forgotPassword({email: email.value})
    .then(res => {
      if (res.status === 'success') {
        showToast({title: res.message})
      } else {
        showToast({title: res.message, icon: 'error'})
      }
    })
    .catch(err => {
      const errorMessage = err.response?.data?.message || 'Failed to send reset password link!'
      showToast({ title: errorMessage, icon: 'error' })
    })
    .finally(() => {
      isLoading.value = false
    })
}

const validateEmail = (email: string) => {
  return email.includes('@')
}
</script>
