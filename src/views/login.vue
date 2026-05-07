<template>
  <div class="login">
    <div class="bg-icons">
      <span class="bg-icon icon-1">🍳</span>
      <span class="bg-icon icon-2">🔪</span>
      <span class="bg-icon icon-3">👨‍🍳</span>
      <span class="bg-icon icon-4">🥘</span>
      <span class="bg-icon icon-5">🍲</span>
    </div>
    <el-form ref="loginRef" :model="loginForm" :rules="loginRules" class="login-form">
      <div class="title-box">
        <h3 class="title">{{ title }}</h3>
      </div>
      <el-form-item prop="username">
        <el-input v-model="loginForm.username" type="text" size="large" auto-complete="off" :placeholder="proxy.$t('login.username')">
          <template #prefix><svg-icon icon-class="user" class="el-input__icon input-icon" /></template>
        </el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input
          v-model="loginForm.password"
          type="password"
          size="large"
          auto-complete="off"
          :placeholder="proxy.$t('login.password')"
          @keyup.enter="handleLogin"
        >
          <template #prefix><svg-icon icon-class="password" class="el-input__icon input-icon" /></template>
        </el-input>
      </el-form-item>
      <el-form-item v-if="captchaEnabled" prop="code">
        <el-input
          v-model="loginForm.code"
          size="large"
          auto-complete="off"
          :placeholder="proxy.$t('login.code')"
          style="width: 63%"
          @keyup.enter="handleLogin"
        >
          <template #prefix><svg-icon icon-class="validCode" class="el-input__icon input-icon" /></template>
        </el-input>
        <div class="login-code">
          <img :src="codeUrl" class="login-code-img" @click="getCode" />
        </div>
      </el-form-item>
      <el-checkbox v-model="loginForm.rememberMe" style="margin: 0 0 25px 0">{{ proxy.$t('login.rememberPassword') }}</el-checkbox>
      <el-form-item style="width: 100%">
        <el-button :loading="loading" size="large" type="primary" style="width: 100%" @click.prevent="handleLogin">
          <span v-if="!loading">{{ proxy.$t('login.login') }}</span>
          <span v-else>{{ proxy.$t('login.logging') }}</span>
        </el-button>
        <div v-if="register" style="float: right">
          <router-link class="link-type" :to="'/register'">{{ proxy.$t('login.switchRegisterPage') }}</router-link>
        </div>
      </el-form-item>
    </el-form>
    <div class="el-login-footer">
      <span>让美味上门，让生活更简单</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { getCodeImg } from '@/api/login';
import { useUserStore } from '@/store/modules/user';
import { LoginData } from '@/api/types';
import { to } from 'await-to-js';
import { useI18n } from 'vue-i18n';

const { proxy } = getCurrentInstance() as ComponentInternalInstance;

const title = import.meta.env.VITE_APP_TITLE;
const userStore = useUserStore();
const router = useRouter();
const { t } = useI18n();

const loginForm = ref<LoginData>({
  username: '',
  password: '',
  rememberMe: false,
  code: '',
  uuid: ''
} as LoginData);

const loginRules: ElFormRules = {
  username: [{ required: true, trigger: 'blur', message: t('login.rule.username.required') }],
  password: [{ required: true, trigger: 'blur', message: t('login.rule.password.required') }],
  code: [{ required: true, trigger: 'change', message: t('login.rule.code.required') }]
};

const codeUrl = ref('');
const loading = ref(false);
// 验证码开关
const captchaEnabled = ref(true);

// 注册开关
const register = ref(false);
const redirect = ref('/');
const loginRef = ref<ElFormInstance>();

watch(
  () => router.currentRoute.value,
  (newRoute: any) => {
    redirect.value = newRoute.query && newRoute.query.redirect && decodeURIComponent(newRoute.query.redirect);
  },
  { immediate: true }
);

const handleLogin = () => {
  loginRef.value?.validate(async (valid: boolean, fields: any) => {
    if (valid) {
      loading.value = true;
      // 勾选了需要记住密码设置在 localStorage 中设置记住用户名和密码
      if (loginForm.value.rememberMe) {
        localStorage.setItem('username', String(loginForm.value.username));
        localStorage.setItem('password', String(loginForm.value.password));
        localStorage.setItem('rememberMe', String(loginForm.value.rememberMe));
      } else {
        // 否则移除
        localStorage.removeItem('username');
        localStorage.removeItem('password');
        localStorage.removeItem('rememberMe');
      }
      // 调用action的登录方法
      const [err] = await to(userStore.login(loginForm.value));
      if (!err) {
        const redirectUrl = redirect.value || '/';
        await router.push(redirectUrl);
        loading.value = false;
      } else {
        loading.value = false;
        // 重新获取验证码
        if (captchaEnabled.value) {
          await getCode();
        }
      }
    } else {
      console.log('error submit!', fields);
    }
  });
};

/**
 * 获取验证码
 */
const getCode = async () => {
  const res = await getCodeImg();
  const { data } = res;
  captchaEnabled.value = data.captchaEnabled === undefined ? true : data.captchaEnabled;
  if (captchaEnabled.value) {
    // 刷新验证码时清空输入框
    loginForm.value.code = '';
    codeUrl.value = 'data:image/gif;base64,' + data.img;
    loginForm.value.uuid = data.uuid;
  }
};

const getLoginData = () => {
  const username = localStorage.getItem('username');
  const password = localStorage.getItem('password');
  const rememberMe = localStorage.getItem('rememberMe');
  loginForm.value = {
    ...loginForm.value,
    username: username === null ? String(loginForm.value.username) : username,
    password: password === null ? String(loginForm.value.password) : String(password),
    rememberMe: rememberMe === 'true'
  } as LoginData;
};

onMounted(() => {
  getCode();
  getLoginData();
});
</script>

<style lang="scss" scoped>
.login {
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  height: 100%;
  overflow: hidden;
  background:
    linear-gradient(120deg, rgba(84, 125, 95, 0.16) 0%, rgba(255, 255, 255, 0) 42%),
    linear-gradient(145deg, #eef3e9 0%, #f7f3ea 52%, #f8e1c2 100%);
}

.bg-icons {
  position: absolute;
  inset: 0;
  pointer-events: none;
  overflow: hidden;
}

.bg-icon {
  position: absolute;
  font-size: 64px;
  opacity: 0.3;
  user-select: none;
}

.icon-1 {
  top: 8%;
  left: 6%;
  font-size: 80px;
  transform: rotate(-15deg);
}

.icon-2 {
  top: 18%;
  right: 8%;
  font-size: 60px;
  transform: rotate(20deg);
}

.icon-3 {
  bottom: 22%;
  left: 10%;
  font-size: 72px;
  transform: rotate(-8deg);
}

.icon-4 {
  bottom: 10%;
  right: 12%;
  font-size: 68px;
  transform: rotate(12deg);
}

.icon-5 {
  top: 50%;
  right: 28%;
  font-size: 56px;
  transform: rotate(-22deg);
}

.login::before {
  content: '';
  position: absolute;
  inset: 0;
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.58) 0%, rgba(255, 255, 255, 0.12) 46%, rgba(214, 107, 42, 0.08) 100%),
    repeating-linear-gradient(90deg, rgba(84, 125, 95, 0.08) 0 1px, transparent 1px 96px);
  pointer-events: none;
}

.title-box {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 12px;
  margin-bottom: 26px;

  .title {
    margin: 0;
    color: #2f3f32;
    font-size: 21px;
    font-weight: 600;
    line-height: 1.3;
    letter-spacing: 0;
  }
}

.login-form {
  border-radius: var(--app-radius-lg);
  background: rgba(255, 255, 255, 0.92);
  border: 1px solid rgba(255, 255, 255, 0.72);
  width: min(424px, 90vw);
  padding: 34px 32px 14px 32px;
  z-index: 1;
  box-shadow: 0 24px 70px rgba(47, 63, 50, 0.18);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  .el-input {
    height: 40px;
    input {
      height: 40px;
    }
  }

  .input-icon {
    height: 39px;
    width: 14px;
    margin-left: 0px;
  }
}

.login-tip {
  font-size: 13px;
  text-align: center;
  color: #bfbfbf;
}

.login-form :deep(.el-input__wrapper) {
  background-color: rgba(255, 255, 255, 0.92);
  box-shadow: 0 0 0 1px rgba(84, 125, 95, 0.12) inset;
}

.login-form :deep(.el-input__wrapper.is-focus) {
  box-shadow: 0 0 0 2px rgba(214, 107, 42, 0.22);
}

.login-form :deep(.el-button--primary) {
  border-radius: var(--app-radius-md);
  background: linear-gradient(135deg, #c95f23, #d98238);
  border: none;
  box-shadow: 0 10px 24px rgba(214, 107, 42, 0.3);
}

.login-form :deep(.el-button--primary:hover) {
  background: linear-gradient(135deg, #b95520, #d1742e);
}

.login-code {
  width: calc(37% - 10px);
  height: 40px;
  float: right;
  margin-left: 10px;
  box-sizing: border-box;
  border-radius: var(--app-radius-sm);
  overflow: hidden;
  background: rgba(255, 255, 255, 0.92);
  border: 1px solid rgba(84, 125, 95, 0.12);

  img {
    cursor: pointer;
    vertical-align: middle;
    display: block;
    width: 100%;
    height: 40px;
    object-fit: cover;
  }
}

.el-login-footer {
  height: 40px;
  line-height: 40px;
  position: fixed;
  bottom: 0;
  width: 100%;
  text-align: center;
  color: rgba(47, 63, 50, 0.85);
  font-family: Arial, serif;
  font-weight: 500;
  font-size: 12px;
  letter-spacing: 0;
}

.login-code-img {
  height: 40px;
  padding-left: 0;
}

:global(html.dark) {
  .login-form {
    background: rgba(17, 24, 39, 0.9);
    border-color: rgba(148, 163, 184, 0.2);
  }

  .title-box {
    .title {
      color: #f8fafc;
    }

  }

  .login-form :deep(.el-input__wrapper) {
    background-color: rgba(17, 24, 39, 0.7);
    box-shadow: 0 0 0 1px rgba(148, 163, 184, 0.18) inset;
  }

  .el-login-footer {
    color: rgba(226, 232, 240, 0.62);
  }
}
</style>
