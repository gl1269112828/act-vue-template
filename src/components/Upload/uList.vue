<template>
  <div>
    <div class="upload-list" v-for="(item, i) in list" :key="i">
      <div class="img-list">
        <img :src="verUrl(item)" alt />
        <img class="del" :src="require('@/static/del.png')" alt @click="remove(i)" />
      </div>
      <!-- <div class="videos" v-else-if="item.file_type === 15">
        <video :src="item.file_url" controls preload height="200px" width="100%"></video>
        <img class="del" :src="require('@/static/del.png')" alt @click="remove(index)" />
      </div>
      <div class="img-list" v-else>
        <img :src="item.cover_url" alt />
        <div class="file_name">
          <el-tooltip class="item" effect="dark" :content="item.file_name" placement="top-start">
            <span>{{ item.file_name }}</span>
          </el-tooltip>
        </div>
        <img class="del" :src="require('@/static/del.png')" alt @click="remove(index)" />
      </div> -->
    </div>
  </div>
</template>
<script>
import config from 'config';
export default {
  name: 'uList',
  props: {
    list: {
      type: Array,
      default: () => []
    }
  },
  methods: {
    verUrl(url) {
      const ulrPrefix = config.devServer.proxy['/'].target;
      if (typeof url === 'object') {
        return window.URL.createObjectURL(url.raw);
      } else if (typeof url === 'string') {
        return `${ulrPrefix}${url}`;
      }
    },
    //移除图片触发
    remove(index) {
      this.$emit('update:list', this.list.splice(index, 1));
    }
  }
};
</script>

<style lang="scss" scoped>
.upload-list {
  margin: 5px 10px 0 0;
  display: inline-block;
  .img-list {
    position: relative;
    width: 120px;
    height: 120px;
    vertical-align: middle;
    img {
      width: 120px;
      height: 120px;
      border-radius: 6px;
    }
  }
  .videos {
    position: relative;
    margin: 10px 0 0 0;
    width: 100%;
    height: 200px;
    border: 1px solid #eee;
  }
  .del {
    cursor: pointer;
    position: absolute;
    top: -2px;
    right: -3px;
    width: 18px !important;
    height: 18px !important;
  }
  .file_name {
    position: absolute;
    left: 0;
    bottom: 20px;
    width: 120px;
    padding: 0 10px;
    text-align: center;
    font-size: 12px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}
</style>
