<template>
  <div class="home">

    <el-form ref="form" :model="form" :inline="true" @submit.native.prevent="getData">
      <el-form-item>
        <el-input v-model="form.brand" placeholder="Brand" clearable></el-input>
      </el-form-item>

      <el-form-item>
        <el-input v-model="form.device" placeholder="Device" clearable></el-input>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" native-type="submit" icon="el-icon-search"></el-button>
      </el-form-item>
    </el-form>

    <div class="device-list" v-loading="isLoading">
      <div
        class="device"
        v-for="device in deviceList"
        :key="device.DeviceName"
        @click="chooseDevice(device)"
      >
        <p><i class="el-icon-time" /> {{device.announced}}</p>
        <h2>{{device.DeviceName}}</h2>
        <p><i class="el-icon-view" /> by {{device.Brand}}</p>
      </div>
    </div> <!-- /.device-list -->

    <!-- details of a clicked device -->
    <el-dialog
      v-if="currentDevice"
      :title="currentDevice.DeviceName"
      :visible="Boolean(currentDevice)"
      custom-class="device-details"
      :before-close="handleCloseDialog"
      top="none"
    >
      <p v-for="deviceSpec in Object.keys(currentDevice)" :key="deviceSpec">
        {{deviceSpec}}: {{currentDevice[deviceSpec]}}
      </p>
    </el-dialog>

  </div>
</template>

<script>

import Vue from 'vue';
import axios from 'axios';
import { Button, Card, Input, Form, FormItem, Dialog, Loading, Notification } from 'element-ui';

Vue.use(Loading.directive);
Vue.prototype.$notify = Notification;

const TOKEN = 'fa97075e8d63d1493ee46c42c991868209908d34082d8bf3';

export default {
  name: 'home',
  components: {
    'el-button': Button,
    'el-card': Card,
    'el-input': Input,
    'el-form': Form,
    'el-form-item': FormItem,
    'el-dialog': Dialog,
  },
  data() {
    return {
      deviceList: [],
      isLoading: false,
      currentDevice: null,
      form: {
        brand: '',
        device: '',
      },
    };
  },
  methods: {
    // close a modal window with details of a clicked device
    handleCloseDialog(done) {
      this.currentDevice = null;
      done();
    },
    // open a modal window with details of a clicked device
    chooseDevice(device) {
      if (!this.currentDevice) {
        this.currentDevice = device;
      }
    },
    // load data from fonoapi
    getData() {
      // if a load already is started then show a notification about it
      // and skip the start of a new load
      if (this.isLoading) {
        this.$notify.info({
          title: 'Please wait',
        });
        return;
      }

      this.isLoading = true;
      this.deviceList = [];

      // the `getdevice` endpoint requires `device` in params,
      // while the `getlatest` does not accept it
      let requestUrl = 'https://fonoapi.freshpixl.com/v1/';
      requestUrl += !this.form.device ? 'getlatest' : 'getdevice';

      const requestParams = {
        token: TOKEN,
        brand: this.form.brand,
        device: this.form.device,
      };

      axios.get(requestUrl, { responseType: 'json', params: requestParams })
        .then((response) => {
          this.deviceList = response.data;
        })
        .catch((error) => {
          this.$notify.error({
            title: 'Error',
            message: error.data ? error.data.message : '',
          });
        })
        .then(() => {
          this.isLoading = false;
        });
    },
  },
  mounted() {
    // fonoapi returns errors with status: 200 and axios cannot handle them
    // this interceptor fixes it
    axios.interceptors.response.use((response) => {
      if (response.data.status === 'error') {
        return Promise.reject(response);
      }
      return response;
    });

    // run the first load of devices
    this.getData();
  },
};
</script>

<style>

form{
  text-align: center;
  margin: 50px 20px;
}

form button.el-button--primary{
  font-size: 20px;
  padding: 9px 12px;
}

.device-list{
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  max-width: 1100px;
  margin: auto;
  position: relative;
}

.device{
  height: 300px;
  width: 200px;
  background: linear-gradient(to bottom left, hsl(203, 50%, 98%), hsl(212, 33%, 98%));
  box-shadow: inset 6px -6px 15px rgba(145, 160, 180, 0.45),
              -10px 10px 30px rgba(118, 146, 180, 0.18);
  border-radius: 30px;
  position: relative;
  margin: 0px 35px 70px;
  padding: 40px 20px 70px;
  box-sizing: border-box;
  cursor: pointer;
  display: flex;
  flex-wrap: wrap;
  text-align: center;
  align-content: space-between;

  transition: 0.2s;
}

.device::before{
  content: '';
  position: absolute;

  width: 76px;
  height: 8px;

  left: 50%;
  transform: translateX(-50%);
  top: 17px;
  border-radius: 4px;
  background: #e4eaf1;
}

.device::after{
  content: '';
  position: absolute;

  width: 40px;
  height: 40px;

  left: 50%;
  transform: translateX(-50%);
  bottom: 18px;
  border-radius: 35px;
  background: #dde3eb;
}

.device:hover{
  box-shadow: inset 6px -6px 15px rgba(145, 160, 180, 0.45),
              -30px 30px 40px rgba(118, 146, 180, 0.18);
}

.device > p,
.device > h2{
  margin: 0;
  width: 100%;
}

.device > h2{
  font-family: 'Roboto Mono', monospace;
  font-size: 20px;
}

.device > p{
  color: rgba(0, 0, 0, 0.7);
}

.device-details{
  width: 100%;
  max-width: 650px;
  margin-top: 5vh;
}

@media(max-width: 510px){
  form .el-form-item{
    width: 100%;
  }

  .device-details{
    margin: 0;
  }
}

</style>
