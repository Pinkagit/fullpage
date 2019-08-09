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
+ `scrollDisable` : (默认 false) 是否禁用滚动
+ `disableSrcollClassName` : (默认 [ ]) 禁止触发滚动的元素类名

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