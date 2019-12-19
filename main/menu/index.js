/*
 * @Author: yangjj
 * @Date: 2019-12-16 14:38:04
 * @LastEditors: yangjj
 * @LastEditTime: 2019-12-17 13:20:49
 * @Description: 菜单
 */
import { app, BrowserWindow, Menu } from 'electron'
const url = require('url');
const path = require('path');
const UpdateHelper = require('./../update');
const pkg = require(path.resolve(global.__dirname, 'package.json'));
const build = pkg['build-config'];

let template = [
    {
      label: '工具',
      submenu: [
        {
          label: '开发者工具',
          accelerator: (function () {
            if (process.platform === 'darwin') { //操作系统
              return 'Alt+Command+I'
            } else {
              return 'Ctrl+Shift+I'
            }
          })(),
          click: function (item, focusedWindow) {
            if (focusedWindow) {
              focusedWindow.toggleDevTools()
            }
          }
        },
        {
          label: '环境选择',
          click: function (item, focusedWindow) {
            const p = url.format({
              protocol: 'file:',
              pathname: path.join(__dirname, '..', `env/environment.html`),
              slashes: true,
              query: { debugger: build.env === "development", edit: true },
            });
            focusedWindow.loadURL(p);
          }
        }
      ]
    },
    {
      label: '查看',
      submenu: [{
        label: '重载',
        accelerator: 'CmdOrCtrl+R',
        click: function (item, focusedWindow) {
          if (focusedWindow) {
            // 重载之后, 刷新并关闭所有的次要窗体
            if (focusedWindow.id === 1) {
              BrowserWindow.getAllWindows().forEach(function (win) {
                if (win.id > 1) {
                  win.close()
                }
              })
            }
            focusedWindow.reload()
          }
        }
      }, {
        label: '切换全屏',
        accelerator: (function () {
          if (process.platform === 'darwin') {
            return 'Ctrl+Command+F'
          } else {
            return 'F11'
          }
        })(),
        click: function (item, focusedWindow) {
          if (focusedWindow) {
            focusedWindow.setFullScreen(!focusedWindow.isFullScreen())
          }
        }
      }, {
        type: 'separator'
      }, {
        label: '应用程序菜单演示',
        click: function (item, focusedWindow) {
          if (focusedWindow) {
            const options = {
              type: 'info',
              title: '应用程序菜单演示',
              buttons: ['好的'],
              message: '此演示用于 "菜单" 部分, 展示如何在应用程序菜单中创建可点击的菜单项.'
            }
            electron.dialog.showMessageBox(focusedWindow, options, function () { })
          }
        }
      }]
    }, {
      label: '窗口',
      role: 'window',
      submenu: [{
        label: '最小化',
        accelerator: 'CmdOrCtrl+M',
        role: 'minimize'
      }, {
        label: '关闭',
        accelerator: 'CmdOrCtrl+W',
        role: 'close'
      }, {
        type: 'separator'
      }, {
        label: '重新打开窗口',
        accelerator: 'CmdOrCtrl+Shift+T',
        enabled: false,
        key: 'reopenMenuItem',
        click: function () {
          app.emit('activate')
        }
      }]
    }]
  
    //更新菜单列表
  function addUpdateMenuItems(items, position) {
    if (process.mas) return
    console.log("TCL: addUpdateMenuItems -> process.mas", process.mas)
  
    const version = electron.app.getVersion()
    let updateItems = [{
      label: `Version ${version}`,
      enabled: false
    }, {
      label: '检查更新',
      click: function () {
        UpdateHelper.checkUpdate(null, false)
      }
    }]
  
    //更新检查
    items.splice.apply(items, [position, 0].concat(updateItems))
  }
  
  //
  function findReopenMenuItem() {
    const menu = Menu.getApplicationMenu()
    if (!menu) return
  
    let reopenMenuItem
    menu.items.forEach(function (item) {
      if (item.submenu) {
        item.submenu.items.forEach(function (item) {
          if (item.key === 'reopenMenuItem') {
            reopenMenuItem = item
          }
        })
      }
    })
    return reopenMenuItem
  }
  //mac or unix 系统
  if (process.platform === 'darwin') {
    const name = electron.app.getName()
    template.unshift({
      label: name,
      submenu: [{
        label: `关于 ${name}`,
        role: 'about'
      }, {
        type: 'separator'
      }, {
        label: '服务',
        role: 'services',
        submenu: []
      }, {
        type: 'separator'
      }, {
        label: `隐藏 ${name}`,
        accelerator: 'Command+H',
        role: 'hide'
      }, {
        label: '隐藏其它',
        accelerator: 'Command+Alt+H',
        role: 'hideothers'
      }, {
        label: '显示全部',
        role: 'unhide'
      }, {
        type: 'separator'
      }, {
        label: '退出',
        accelerator: 'Command+Q',
        click: function () {
          app.quit()
        }
      }]
    })
  
    // 窗口菜单.
    template[3].submenu.push({
      type: 'separator'
    }, {
        label: '前置所有',
        role: 'front'
      })
  
    addUpdateMenuItems(template[0].submenu, 1)
  }
  
  if (process.platform === 'win32') {
    const helpMenu = template[template.length - 1].submenu
    addUpdateMenuItems(helpMenu, 0)
  }
  
  //构建/添加菜单
  app.on('ready', function () {
    const menu = Menu.buildFromTemplate(template)
    Menu.setApplicationMenu(menu)
  })
  
  //创建设置 菜单-重新打开窗口是否显示
  app.on('browser-window-created', function () {
    let reopenMenuItem = findReopenMenuItem()
    if (reopenMenuItem) reopenMenuItem.enabled = false
  })
  //当所有的窗口都被关闭时触发
  app.on('window-all-closed', function () {
    let reopenMenuItem = findReopenMenuItem()
    if (reopenMenuItem) reopenMenuItem.enabled = true
  })