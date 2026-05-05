<template>
  <div
    class="sidebar-logo-container"
    :class="{ collapse: collapse }"
  >
    <transition :enter-active-class="proxy?.animate.logoAnimate.enter" mode="out-in">
      <router-link v-if="collapse" key="collapse" class="sidebar-logo-link" to="/">
        <svg class="sidebar-logo" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
          <!-- 厨师帽 -->
          <ellipse cx="32" cy="14" rx="12" ry="8" fill="#FFFFFF"/>
          <circle cx="22" cy="12" r="6" fill="#FFFFFF"/>
          <circle cx="42" cy="12" r="6" fill="#FFFFFF"/>
          <circle cx="32" cy="8" r="6" fill="#FFFFFF"/>
          <rect x="21" y="14" width="22" height="8" rx="1" fill="#FFFFFF"/>
          <line x1="21" y1="22" x2="43" y2="22" stroke="#E0E0E0" stroke-width="1.5"/>
          <!-- 脸 -->
          <ellipse cx="32" cy="32" rx="11" ry="12" fill="#F5CBA7"/>
          <!-- 眼睛 -->
          <circle cx="27" cy="30" r="1.8" fill="#333"/>
          <circle cx="37" cy="30" r="1.8" fill="#333"/>
          <!-- 微笑 -->
          <path d="M27 36 Q32 41 37 36" fill="none" stroke="#333" stroke-width="1.5" stroke-linecap="round"/>
          <!-- 腮红 -->
          <ellipse cx="24" cy="35" rx="3" ry="2" fill="#F5A9A9" opacity="0.5"/>
          <ellipse cx="40" cy="35" rx="3" ry="2" fill="#F5A9A9" opacity="0.5"/>
          <!-- 身体/衣服 -->
          <path d="M20 44 Q20 42 24 42 L40 42 Q44 42 44 44 L46 56 L18 56Z" fill="#FFFFFF"/>
          <line x1="32" y1="42" x2="32" y2="56" stroke="#E0E0E0" stroke-width="1"/>
          <!-- 领巾 -->
          <path d="M26 42 L32 48 L38 42" fill="#E67E22"/>
        </svg>
      </router-link>
      <router-link v-else key="expand" class="sidebar-logo-link" to="/">
        <svg class="sidebar-logo" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
          <!-- 厨师帽 -->
          <ellipse cx="32" cy="14" rx="12" ry="8" fill="#FFFFFF"/>
          <circle cx="22" cy="12" r="6" fill="#FFFFFF"/>
          <circle cx="42" cy="12" r="6" fill="#FFFFFF"/>
          <circle cx="32" cy="8" r="6" fill="#FFFFFF"/>
          <rect x="21" y="14" width="22" height="8" rx="1" fill="#FFFFFF"/>
          <line x1="21" y1="22" x2="43" y2="22" stroke="#E0E0E0" stroke-width="1.5"/>
          <!-- 脸 -->
          <ellipse cx="32" cy="32" rx="11" ry="12" fill="#F5CBA7"/>
          <!-- 眼睛 -->
          <circle cx="27" cy="30" r="1.8" fill="#333"/>
          <circle cx="37" cy="30" r="1.8" fill="#333"/>
          <!-- 微笑 -->
          <path d="M27 36 Q32 41 37 36" fill="none" stroke="#333" stroke-width="1.5" stroke-linecap="round"/>
          <!-- 腮红 -->
          <ellipse cx="24" cy="35" rx="3" ry="2" fill="#F5A9A9" opacity="0.5"/>
          <ellipse cx="40" cy="35" rx="3" ry="2" fill="#F5A9A9" opacity="0.5"/>
          <!-- 身体/衣服 -->
          <path d="M20 44 Q20 42 24 42 L40 42 Q44 42 44 44 L46 56 L18 56Z" fill="#FFFFFF"/>
          <line x1="32" y1="42" x2="32" y2="56" stroke="#E0E0E0" stroke-width="1"/>
          <!-- 领巾 -->
          <path d="M26 42 L32 48 L38 42" fill="#E67E22"/>
        </svg>
        <h1 class="sidebar-title">
          {{ title }}
        </h1>
      </router-link>
    </transition>
  </div>
</template>

<script setup lang="ts">
import variables from '@/assets/styles/variables.module.scss';

import { useSettingsStore } from '@/store/modules/settings';
const { proxy } = getCurrentInstance() as ComponentInternalInstance;
import { NavTypeEnum } from '@/enums/NavTypeEnum';

defineProps({
  collapse: {
    type: Boolean,
    required: true
  }
});

const title = import.meta.env.VITE_APP_LOGO_TITLE;
const settingsStore = useSettingsStore();
const sideTheme = computed(() => settingsStore.sideTheme);

// 获取Logo背景色
const getLogoBackground = computed(() => {
  if (settingsStore.isDark) {
    return 'var(--sidebar-bg)'
  }
  if (settingsStore.navType == NavTypeEnum.TOP) {
    return variables.menuLightBackground
  }
  return sideTheme.value === 'theme-dark' ? variables.menuBg : variables.menuLightBackground
})

// 获取Logo文字颜色
const getLogoTextColor = computed(() => {
  if (settingsStore.isDark) {
    return 'var(--sidebar-text)'
  }
  if (settingsStore.navType == NavTypeEnum.TOP) {
    return variables.logoLightTitleColor
  }
  return sideTheme.value === 'theme-dark' ? variables.logoTitleColor : variables.logoLightTitleColor
})
</script>

<style lang="scss" scoped>
.sidebarLogoFade-enter-active {
  transition: opacity 1.5s;
}

.sidebarLogoFade-enter,
.sidebarLogoFade-leave-to {
  opacity: 0;
}

.sidebar-logo-container {
  position: relative;
  height: 50px;
  line-height: 50px;
  background: v-bind(getLogoBackground);
  text-align: center;
  overflow: hidden;

  & .sidebar-logo-link {
    height: 100%;
    width: 100%;

    & .sidebar-logo {
      width: 32px;
      height: 32px;
      vertical-align: middle;
      margin-right: 12px;
      margin-left: 12px;
    }

    & .sidebar-title {
      display: inline-block;
      margin: 0;
      color: v-bind(getLogoTextColor);
      font-weight: 600;
      line-height: 50px;
      font-size: 14px;
      font-family: Avenir, Helvetica Neue, Arial, Helvetica, sans-serif;
      vertical-align: middle;
    }
  }

  &.collapse {
    .sidebar-logo {
      margin-right: 0px;
    }
  }
}
</style>
