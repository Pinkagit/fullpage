# fullpage

## HTML结构

```html
    <div class="wrap">
        <div class="page"></div>
        <div class="page"></div>
        <div class="page"></div>
    </div>
```

## 初始化

```js
let fullpage = new FullPage({
    containerClassName: ".wrap",        // 页面容器类名
    pageClassName: ".page"              // 页面元素类名
})
fullpage.init()
```

## 选项
+ `disableSrcollClassName` : (默认 [ ]) 禁止触发滚动的元素类名
+ `lastBar`: (默认 false) 页面是否显示最后一个单独高度版块(滚动距离会自动计算))

## 参数
+ `activeIndex` : 当前页面的索引
+ `translateDis` : 当前页面滚动偏移距离
+ `viewHeight` : 当前页面元素高度

## 方法

### fullpage.goTo(index)

跳转到指定页面

```js
    fullpage.goTo(index)
```

### fullpage.fullScrollDisable(disable)

页面是否禁用全屏滚动能力(disable => true: 禁用全屏滚动 || false: 启用全屏滚动)

```js
    fullpage.fullScrollDisable(true)
```

### fullpage.bodyScrollable(able)

页面滚动条滚动能力(able => true : 显示滚动条 || false : 隐藏滚动条)

```js
    fullpage.bodyScrollable(false)
```

## 常见问题

+ Q : vue-router 跳转页面后，返回fullpage页面，页面发生滚动偏移

  A : 在路由导航内，设置滚动位置
     ```js
        scrollBehavior (to, from, savedPosition) {
            if (savedPosition) {
                return savedPosition
            } else {
                return { x: 0, y: 0 }
            }
        }
     ```