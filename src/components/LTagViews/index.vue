<template>
  <div class="tagsview-container">
    <div class="tagsview-c" ref="tagview">
      <div
        class="tagsview-item"
        :class="item.checked ? 'item-checked' : ''"
        v-for="(item, i) in tags"
        :key="i"
        @mousemove="mousemoveTag(item)"
        @mouseleave="mouseleaveTag(item)"
        @click="handleLink(item)"
      >
        <span class="item-text">{{ item.name }}</span>
        <img class="item-delete" :src="require('@/static/tagDelete.png')" v-show="item.isDelete" @click.stop="handleDeleteItem(item)" alt />
      </div>
    </div>

    <div class="tagsview-r">
      <el-dropdown class="down-icon">
        <span class="el-dropdown-link">
          <i class="el-icon-arrow-down el-icon--right"></i>
        </span>
        <el-dropdown-menu slot="dropdown" trigger="click">
          <el-dropdown-item @click.native="handleCloseOther">关闭其他</el-dropdown-item>
          <el-dropdown-item @click.native="handleCloseAll">关闭全部</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
export default {
  name: 'tagsview',
  data() {
    return {
      tags: [{ name: '首页', path: '/home', query: {}, isDelete: false, checked: false }],
      scrollLeft: 0
    };
  },
  watch: {
    $route(route) {
      this.getTags(route);
    }
  },
  methods: {
    getTags(route) {
      let tags = this.tags;
      tags.forEach(item => {
        item.checked = false;
        if (!!route.query.key) {
          if (item.query.key == route.query.key) {
            item.checked = true;
          }
        } else if (item.path === route.path) {
          item.checked = true;
        }
      });
      if (!!route.query.key) {
        let dynamicRouter = this.$store.getters.dynamicRouter;
        dynamicRouter.forEach(item => {
          if (item.path === '/configPage') {
            item.children.forEach(itemJ => {
              if (itemJ.meta.key === route.query.key && !tags.some(itemS => itemS.query.key == route.query.key)) {
                tags.push({
                  name: itemJ.meta.title,
                  path: itemJ.path,
                  query: { id: this.$route.query.id, key: itemJ.meta.key },
                  isDelete: false,
                  checked: true
                });
              }
            });
          }
        });
      } else {
        if (!tags.some(item => item.path == route.path)) {
          tags.push({
            name: route.meta.title,
            path: route.path,
            query: { id: this.$route.query.id },
            isDelete: false,
            checked: true
          });
        }
      }
    },
    handleLink(item) {
      if (!item.checked) {
        this.$router.push({ path: item.path, query: item.query });
      }
    },
    handleDeleteItem(item) {
      this.tags = this.tags.filter(items => items.name !== item.name);
    },
    mousemoveTag(item) {
      item.isDelete = true;
    },
    mouseleaveTag(item) {
      item.isDelete = false;
    },
    handleCloseOther() {
      const route = this.$route;
      this.tags = this.tags.filter(item => item.name === route.meta.title);
    },
    handleCloseAll() {
      this.tags = [{ name: '首页', path: '/home', query: {}, isDelete: false, checked: false }];
    }
  }
};
</script>

<style lang="scss" scoped>
.tagsview-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 60px;
  background-color: #fff;
  font-size: 14px;
  .tagsview-c {
    width: 100%;
    height: 60px;
    white-space: nowrap;
    overflow: hidden;
    overflow-x: scroll;
    .tagsview-item {
      display: inline-block;
      line-height: 60px;
      padding: 0 10px;
      text-align: center;
      vertical-align: middle;
      .item-delete {
        width: 15px;
        height: 15px;
        border-radius: 50%;
        margin: 0 0 2px 2px;
        vertical-align: middle;
      }
    }
    .tagsview-item:hover {
      cursor: pointer;
      color: rgba(24, 144, 255, 0.8);
    }
    .item-checked {
      color: rgba(24, 144, 255, 0.8);
    }
  }
  .tagsview-c::-webkit-scrollbar {
    display: none;
  }
  .tagsview-r {
    display: flex;
    align-items: center;
  }
  .tagsview-r .right-icon,
  .down-icon {
    cursor: pointer;
    width: 40px;
    min-width: 40px;
    border-left: 1px solid #eee;
    text-align: center;
  }
}
</style>
