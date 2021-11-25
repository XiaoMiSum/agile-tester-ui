<template>
  <div class="login">
    <el-form
      ref="registerForm"
      :model="registerForm"
      :rules="registerRules"
      class="login-form"
      auto-complete="on"
      label-position="left"
    >
      <div class="title-container">
        <h3 class="title">Agile Tester</h3>
      </div>

      <el-form-item
        prop="email"
      >
        <el-input
          ref="email"
          v-model="email"
          :disabled="show"
          placeholder="请输入你的邮箱地址"
          name="email"
          type="text"
          tabindex="1"
          auto-complete="on"
        >
          <svg-icon slot="prefix" icon-class="email" class="el-input__icon input-icon" />
          <el-button slot="append" :loading="loading" :disabled="show" icon="el-icon-circle-check" @click.native.prevent="handleSignIn">{{ show ? '通过' : '检查' }}</el-button>
        </el-input>
      </el-form-item>

      <el-form-item v-if="show" prop="name">
        <el-input
          ref="name"
          v-model="registerForm.name"
          placeholder="请输入你的名字"
          name="name"
          tabindex="2"
          auto-complete="on"
        >
          <svg-icon slot="prefix" icon-class="user" class="el-input__icon input-icon" />
        </el-input>
      </el-form-item>

      <el-form-item v-if="show" prop="teamId">
        <el-select
          ref="teamId"
          v-model="registerForm.teamId"
          name="teamId"
          tabindex="3"
          auto-complete="on"
          placeholder="请选择你的团队"
        >
          <el-option
            v-for="item in options"
            :key="item.key"
            :label="item.value"
            :value="item.key"
          />

          <svg-icon slot="prefix" icon-class="user" class="el-input__icon input-icon" />
        </el-select>
      </el-form-item>

      <el-form-item v-if="show" prop="phone">
        <el-input
          ref="phone"
          v-model="registerForm.phone"
          placeholder="请输入你的手机号"
          name="phone"
          tabindex="4"
          auto-complete="on"
        >
          <i slot="prefix" class="el-icon-mobile-phone" />
        </el-input>
      </el-form-item>

      <el-form-item v-if="show" prop="password">
        <el-input
          ref="password"
          v-model="registerForm.password"
          type="password"
          placeholder="请输入你的登录密码"
          name="password"
          tabindex="5"
          auto-complete="on"
        >
          <svg-icon slot="prefix" icon-class="password" />
        </el-input>
      </el-form-item>

      <el-button
        v-if="show"
        :loading="loading"
        type="primary"
        style="width: 100%; margin-bottom: 30px"
        @click.native.prevent="handleImproveInfo"
      >完善信息并登录</el-button>

      <div v-if="!show" class="tips">
        <router-link
          style="margin-right: 20px"
          to="/login"
        >已有账号？请登录！</router-link>
      </div>
    </el-form>
  </div>
</template>

<script>
import { getTeamOptions } from '@/api/team'

export default {
  name: 'Signup',
  data() {
    const validateName = (rule, value, callback) => {
      if (!value || value === '') {
        callback(new Error('请输入你的名字'))
      } else {
        callback()
      }
    }
    const validatePassword = (rule, value, callback) => {
      if (value.length < 10) {
        callback(new Error('登录密码长度必须大于等于10'))
      } else {
        callback()
      }
    }
    const validateTeam = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请选择你所在的团队'))
      } else {
        callback()
      }
    }
    return {
      email: '',
      registerForm: {
        name: '',
        phone: '',
        password: ''
      },
      registerRules: {
        name: [
          { required: true, trigger: 'blur', validator: validateName }
        ],
        password: [
          { required: true, trigger: 'blur', validator: validatePassword }
        ],
        teamId: [
          { required: true, trigger: 'blur', validator: validateTeam }
        ]
      },
      loading: false,
      passwordType: 'password',
      show: false,
      options: []
    }
  },
  methods: {
    handleSignIn() {
      this.$store.dispatch('user/signupCheck', this.email).then(() => {
        this.loading = false
        this.show = true
        getTeamOptions().then(response => {
          this.options = response.data
        })
      }).catch(() => {
        this.loading = false
      })
    },
    handleImproveInfo() {
      this.$refs.registerForm.validate((valid) => {
        if (valid) {
          this.loading = true
          this.$store
            .dispatch('user/signup', this.registerForm)
            .then(() => {
              this.$router.push('/')
              this.loading = false
            })
            .catch(() => {
              this.loading = false
            })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scop>
.login {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  background-image: url("../../assets/background/bg.jpg");
  background-size: cover;
  .tips {
    font-size: 14px;
    color: #409eff;
    margin-bottom: 10px;
    text-align: right;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }
}
.title {
  margin: 0px auto 30px auto;
  text-align: center;
  color: #707070;
}

.login-form {
  border-radius: 6px;
  background: #ffffff;
  width: 400px;
  padding: 25px 25px 5px 25px;
  .el-input {
    height: 38px;
    input {
      height: 38px;
    }
  }
  .input-icon {
    height: 39px;
    width: 14px;
    margin-left: 2px;
  }
  .el-select {
    width: 100%;
  }
}
.login-tip {
  font-size: 13px;
  text-align: center;
  color: #bfbfbf;
}
.login-code {
  width: 33%;
  height: 38px;
  float: right;
  img {
    cursor: pointer;
    vertical-align: middle;
  }
}
.el-login-footer {
  height: 40px;
  line-height: 40px;
  position: fixed;
  bottom: 0;
  width: 100%;
  text-align: center;
  color: #fff;
  font-family: Arial;
  font-size: 12px;
  letter-spacing: 1px;
}
.login-code-img {
  height: 38px;
}
.oauth-login {
  display: flex;
  cursor:pointer;
}
.oauth-login-item {
  display: flex;
  align-items: center;
  margin-right: 10px;
}
.oauth-login-item img {
  height: 25px;
  width: 25px;
}
.oauth-login-item span:hover {
  text-decoration: underline red;
  color: red;
}
</style>
