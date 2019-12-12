<template>
  <section class="menu-left" :class="!isOpean ? 'menu-close' : 'menu-open'">
    <div class="menu-switch clearfix">
      <div class="tab left">
        <span :class="currMenuType === 'all' ? 'checked' : ''" @click="toggleNav('all')" v-text="!isOpean ? '全' : '全部'">全部</span>
        <span :class="currMenuType === 'common' ? 'checked' : ''" @click="toggleNav('common')" v-text="!isOpean ? '常' : '常用'">常用</span>
      </div>
      <div class="switch left" @click="toggleMenu" :title="isOpean ? '收起' : '展开'">
        <yl-icon icon="icon-daohang-shousuocaidan"></yl-icon>
      </div>
    </div>
    <div class="menu-content" :class="currMenuType === 'all' ? 'menu-content-all' : 'menu-content-common'" ref="menuContent">
      <el-scrollbar wrap-class="scrollbar-wrapper" :style="{'height': menuMaxHeight}">
        <ul class="menu-all">
          <li v-for="(item, index) in leftMenu" :key="index" class="menu-item" :class="{'checked': item.checked,'hover':item.hover}" v-if="!item.hidden" @click.stop="gotoUrl(item)" @mouseenter="showNavDetail(item, item.children)" @mouseleave="hideNavDetail" :id="item.name">
            <div class="menu-item-tt" :title="item.label" v-if="item.children && item.children.length">
              <yl-icon class="menu-icon" :icon="item.funcIcon"></yl-icon>
              <span class="menu-item-tt-text" v-text="item.label"></span>
              <b class="menu-icon-right"></b>
            </div>
            <router-link tag="div" class="menu-item-tt" v-else :to="item.path">
              <yl-icon class="menu-icon" :icon="item.funcIcon"></yl-icon>
              <span class="menu-item-tt-text" v-text="item.label"></span>
            </router-link>
          </li>
        </ul>
        <ul class="menu-common">
          <li v-for="(item, index) in collectList" :key="index">
            <router-link :to="item.permissionUrl" :title="item.permissionName">
              <yl-icon class="menu-icon" :icon="item.permissionIcon"></yl-icon>
              <span class="text" v-text="item.permissionName"></span>
            </router-link>
            <i class="remove el-icon-close" @click="cancelCollect(item)" title="移除"></i>
          </li>
        </ul>
      </el-scrollbar>
    </div>
    <!--客服电话-->
    <div class="menu-footer" :class="{'close-footer':hideFooter}">
      <div class="footer-switch" @click="switchFooter">
        <yl-icon :icon="hideFooter ? 'icon-shang' : 'icon-xia'" class="pointer"></yl-icon>
      </div>
      <div class="tel" v-if="isOpean">
        <p>热线电话(工作日 8:30 - 17:30)</p>
        <span>0571 - 6513 9096</span>
      </div>
      <ul>
        <li @click="handleQQ">
          <yl-icon icon="icon-QQ1"></yl-icon>
          <span>客服</span>
        </li>
        <li @mouseenter="enterQr"  @mouseleave="leaveQr"  id="w-chart-li">
          <yl-icon icon="icon-erweima"></yl-icon>
          <span>小程序</span>
        </li>
      </ul>
    </div>

    <!-- 导航菜单详情 -->
    <div class="menu-nav-box" ref="menuNavBox" id="menuNavBox" v-show="navShow" @mouseenter="menuNavEnter"  @mouseleave="menuNavLeave">
      <dl v-for="(nav, navIndex) in navData" :key="navIndex">
          <dd>
              <el-button type="text" @click.stop="gotoUrl(nav)" v-text="nav.label"></el-button>
          </dd>
        <!--<dt v-text="nav.label"></dt>
        <dd v-for="(list, listIndex) in nav.children" :key="listIndex" v-if="nav.children && nav.children.length && !list.hidden">

        </dd>-->
      </dl>
    </div>
    <div class="w-chart" v-show="showQr" id="wChart">
      <img src="./img/wchart.jpg" />
    </div>
  </section>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
const URL = {
    save: 'ddc.uim.employeFavourFunc.save' // 保存，取消常用
};
// 过滤菜单
const filterlist = list => {
    let menus = list.filter(item => {
        item.checked = false;
        item.children &&
      item.children.length &&
      (item.children = filterlist(item.children));
        return item.funcType === 'MENU';
    });
    return menus;
};

export default {
    data () {
        return {
            showQr: false,
            navShow: false,
            navCur: '',
            navData: [],
            menuMaxHeight: '100%',
            isMaster: false,
            hideFooter: false,
            close: false,
            currMenuType: 'all', // all: 全部  common:常用
            commonList: [
                {
                    // 常用
                    name: '首页',
                    icon: 'icon-gongzuotai',
                    path: '/index'
                },
                {
                    name: '导航',
                    icon: 'icon-gongzuoliuchengtu',
                    path: '/nav'
                }
            ]
        };
    },
    methods: {
        ...mapActions(['getCollectList']),
        menuNavEnter () {
            this.navShow = true;
            document.getElementById(this.navCur).className = 'menu-item hover';
        },
        menuNavLeave () {
            this.navShow = false;
            document.getElementById(this.navCur).className = 'menu-item';
        },
        hideNavDetail () {
            this.navShow = false;
        },
        showNavDetail (item, navList) {
            this.navData = navList;
            this.navCur = item.name;
            this.navShow = true;
            this.$nextTick(() => {
                let dH = 0, // 计算后的高度
                    wH = window.innerHeight, // 可视区高度
                    bT = document.getElementById(item.name) && document.getElementById(item.name).getBoundingClientRect().top,
                    bH = document.getElementById('menuNavBox').getBoundingClientRect().height;// 菜单高度
                dH = bT;
                if (wH - bH - bT < 0) {
                    this.$refs.menuNavBox.style.top = 'initial';
                    this.$refs.menuNavBox.style.bottom = '10px';
                } else {
                    this.$refs.menuNavBox.style.bottom = 'initial';
                    this.$refs.menuNavBox.style.top = dH + 'px';
                }
            });
        },
        switchFooter () {
            this.hideFooter = !this.hideFooter;
            this.setHeight();
        },
        toggleMenu () {
            this.$store.commit('TOGGLE_SIDEBAR');
            this.setHeight();
        },
        toggleNav (type) {
            this.currMenuType = type;
            /* if(type === 'common') {

      } */
        },
        setHeight () {
            let dH = 0, // 计算后的高度
                wH = window.innerHeight, // 可视区高度
                fH = 120, // 底部高度
                fmH = 20, // 底部收起高度
                hH = 113, // 顶部高度
                hmH = 151; // 顶部收起高度
            if (this.hideFooter) {
                dH = wH - fmH - (this.isOpean ? hH : hmH);
            } else {
                dH = wH - fH - (this.isOpean ? hH : hmH);
            }
            this.menuMaxHeight = dH + 'px';
        },
        // 取消收藏
        cancelCollect (item) {
            this.Http(URL.save, {
                params: {
                    employeeNo: this.userInfo.employerNo,
                    enterpriseNo: this.userInfo.enterpriseNo,
                    releaseNo: item.releaseNo,
                    relasePermissionNo: item.id
                }
            }).then(result => {
                // this.getCollectList(item.releaseNo);
            });
        },
        splitStr (str) {
            if (!str) {
                return null;
            }
            let obj = {},
                arr = str.split('&');
            arr.forEach(item => {
                let temp = item.split('=');
                obj[temp[0]] = temp[1];
            });
            return obj;
        },
        gotoUrl (item) {
            // let query = item.meta.query;
            console.log(item);
            this.$router.push({
                name: item.name
                // query: this.splitStr(query)
            });
        },
        // 联系客服
        handleQQ () {
            window.location.href = 'tencent://message/?uin=651422016&Site=&Menu=yes';
        },
        enterQr () {
            let { top, left, width } = document.getElementById('w-chart-li').getBoundingClientRect();
            document.getElementById('wChart').style.top = top - 80 + 'px';
            document.getElementById('wChart').style.left = width + left + 13 + 'px';
            this.showQr = true;
        },
        leaveQr () {
            this.showQr = false;
        }
    },
    computed: {
        ...mapGetters(['userInfo', 'routers', 'isOpean', 'leftMenu', 'collectList'])
    },
    // 获取常用菜单
    created () {
    /* if (this.leftMenu.length) {
        let releaseNo = this.leftMenu[0].releaseNo;
        this.getCollectList(releaseNo);
    } */
    },
    mounted () {
        this.setHeight();
        window.onresize = () => {
            this.setHeight();
        };
    }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
$txtColor: #95acc3;
.menu-left {
  width: $menu-width;
  height: 100%;
  position: relative;
  background-color: $menu-bg;
  border-right: 1px solid $menu-right-line;
  /deep/ .el-scrollbar__wrap {
    overflow-x: hidden;
    z-index: 2;
    position: relative;
  }

  .menu-switch {
    color: $txtColor;
    padding: 12px 24px 12px 30px;
    border-bottom: 1px solid $menu-li-line-color;
    .tab {
      border: 1px solid $txtColor;
      margin-right: 12px;
      font-size: 12px;
      border-radius: 3px;
      span {
        display: inline-block;
        width: 47px;
        height: 26px;
        line-height: 26px;
        text-align: center;
        cursor: pointer;
        &.checked {
          color: #fff;
          background-color: $txtColor;
        }
      }
    }
    .switch {
      font-size: 14px;
      border: 1px solid $txtColor;
      height: 26px;
      line-height: 26px;
      width: 26px;
      text-align: center;
      border-radius: 3px;
      cursor: pointer;
    }
  }

  .menu-content {
    margin-top: -1px;
    .menu-all {
      display: none;
      .menu-item {
        &:hover,
        &.hover {
          color: #fff;
          background-color: $menu-bg-hover;
          .menu-item-tt {
            .menu-icon-right {
              display: block;
            }
          }
        }
        .menu-item-tt {
          position: relative;
          height: $menu-li-height;
          line-height: $menu-li-height;
          border-bottom: 1px $menu-li-line-color solid;
          cursor: pointer;
          padding-left: 30px;
          font-size: 14px;
          .menu-icon {
            line-height: 22px;
            font-size: 22px;
            margin-right: 12px;
            display: inline-block;
            vertical-align: middle;
            width: 20px;
            text-align: center;
          }
          &-text {
            vertical-align: middle;
          }
          .menu-icon-right {
            position: absolute;
            top: 20px;
            right: 0;
            display: none;
            width: 0;
            height: 0;
            border-style: solid;
            border-width: 6px 8px 6px 0;
            border-color: transparent #fff transparent transparent;
          }
          &:hover {
            .nav-box {
              display: table;
            }
          }
        }
      }
    }

    .menu-common {
      display: none;
      font-size: 14px;
      li {
        position: relative;
        .remove {
          position: absolute;
          right: 10px;
          top: 18px;
          transition: all ease-out 0.2s;
          cursor: pointer;
          display: none;
          color: #fff;
        }
        &:hover {
          .remove {
            display: block;
          }
          a {
            color: $menu-bg;
            background-color: $menu-bg-hover;
          }
        }
        a {
          border-bottom: 1px $menu-li-line-color solid;
          position: relative;
          padding-left: 30px;
          color: inherit;
          height: $menu-li-height;
          line-height: $menu-li-height;
          display: block;
          cursor: pointer;
          text-decoration: none;
          .menu-icon {
            width: 18px;
            height: 18px;
            line-height: $menu-li-height;
            font-size: 18px;
            margin-right: 5px;
            vertical-align: middle;
            transform: translateY(-2px);
            //display: none;
          }
          .text {
            vertical-align: 0;
          }

          &.checked {
            color: $menu-nav-line-color;
            background-color: $menu-bg-hover;
            &::before {
              content: "";
              display: block;
              width: 0 !important;
              height: 0 !important;
              border: 12px solid;
              border-color: transparent #f5f7fa transparent transparent;
              position: absolute;
              right: 0;
              margin-top: -12px;
              top: 50%;
            }
          }
        }
      }
    }

    &.menu-content-all {
      .menu-all {
        display: block;
      }
    }
    &.menu-content-common {
      .menu-common {
        display: block;
      }
    }
  }
  .menu-footer {
    position: absolute;
    bottom: 57px;
    left: 0;
    width: 100%;
    color: $txtColor;
    transition: bottom 0.3s;
    height: 120px;
    background-color: $menu-bg;

    &.close-footer {
      bottom: -43px;
    }

    .footer-switch {
      position: relative;
      text-align: center;
      &::before {
        content: "";
        display: block;
        width: 100%;
        height: 1px;
        background-color: #b4c3d2;
        position: absolute;
        top: 7px;
        left: 0;
        z-index: 1;
      }

      .icon {
        font-size: 13px;
        padding: 0 3px;
        background-color: $menu-bg;
        position: relative;
        z-index: 2;
      }
    }
    .tel {
      margin: 0 12px 10px;
      color: $txtColor;
      p {
        font-size: 12px;
        margin-bottom: 8px;
      }
      span {
        font-size: 20px;
      }
    }
    ul {
      padding-left: 12px;
      li {
        border-radius: 5px;
        padding: 0 10px;
        margin-right: 12px;
        line-height: 30px;
        margin-bottom: 10px;
        // box-shadow: 0 0 4px rgba(255,255,255, .1) inset;
        border: 1px solid $menu-right-line;
        cursor: pointer;
        font-size: 14px;
        float: left;
        span {
          padding-left: 5px;
        }
        &:hover {
          // background-color: rgba(255,255,255, .1);
        }
      }
    }
  }
  //收起菜单
  &.menu-close {
    width: $menu-close-width;

    .menu-nav-box {
      left: $menu-close-width - 1;
    }

    .menu-switch {
      padding: 12px;
      .tab {
        margin-right: 0px;
        margin-bottom: 12px;
        span {
          display: inline-block;
          width: 22px;
          &.checked {
            color: #fff;
            background-color: $txtColor;
          }
        }
      }
      .switch {
        width: 46px;
      }
    }

    .menu-footer {
      ul {
        padding: 0 10px;
        margin-top: 4px;
        li {
          text-align: center;
          width: 48px;
          padding: 0;
          span {
            display: none;
          }
        }
      }
    }
    .menu-content {
      .menu-all {
        .menu-item-tt {
          padding-left: 25px;
          &-text {
            display: none;
          }
          .nav-box {
            left: $menu-close-width;
          }
        }
      }
      .menu-common {
        li {
          a {
            padding-left: 0;
            font-size: 12px;
            text-align: center;
            .menu-icon {
              padding-top: 20px;
              display: none;
            }
            .text {
              display: inline-block;
              width: 48px;
              overflow: hidden;
              word-break: keep-all;
            }
          }
          &:hover {
            .remove {
              right: 1px;
            }
            a {
              text-align: left;
              padding-left: 7px;
            }
          }
        }
      }
    }
  }

  .menu-nav-box {
    padding: 10px 0 14px;
    background-color: #fff;
    position: fixed;
    z-index: 1100;
    color: #333;
    text-align: left;
    line-height: normal;
    cursor: default;
    font-size: 14px;
    margin: 0px;
    top: 0;
    left: $menu-width - 1;
    box-shadow: 10px -8px 20px -10px #aaa, 5px 12px 20px -10px #aaa;
    border: 1px solid #e1e1e1;
    border-left: 0;
    dl {
      /*display: table-cell;
      border-right: 1px solid #e4e7ed;*/
      padding: 0 20px;
      white-space: nowrap;
      &:last-child {
        border-right: none;
      }
      /*dt {
        color: $menu-nav-line-color;
        font-size: 16px;
        position: relative;
        padding-left: 16px;
        margin-bottom: 10px;
        &::before {
          content: "";
          display: block;
          position: absolute;
          left: 0;
          top: 8px;
          width: 6px;
          height: 6px;
          background-color: $menu-nav-line-color;
          border-radius: 50%;
        }
      }*/
      dd {
        font-size: 13px;
        padding-left: 16px;
        button,
        a {
          color: #555;
          padding: 8px 0;
          &:hover {
            color: $menu-nav-line-color;
            cursor: pointer;
          }
        }
        span {
          color: #fff;
          background-color: #34a7b2;
          height: 20px;
          line-height: 20px;
          padding: 0 4px;
          border-radius: 4px;
          font-size: 12px;
          display: inline-block;
        }
      }
    }
  }
  .w-chart {
    position: fixed;
    width: 121px;
    height: 121px;
    background: #fff;
    @include flex;
    top: -999px;
    left: -999px;
    z-index: 999;
    border:1px #d1dbe5 solid;
    &::before {
      content: "";
      display: block;
      position: absolute;
      bottom: 20px;
      left: -12px;
      width: 0;
      height: 0;
      border-style: solid;
      border-width: 8px 12px 8px 0;
      border-color: transparent #fff transparent transparent;
    }
    img {
      height: 107px;
      width: 107px;
    }
  }
}
</style>
