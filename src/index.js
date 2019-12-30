class FullPage {
    // 构造函数
    constructor(options) {
        const defaultOptions = {        // 默认配置
            containerClassName: ".fullpage-container",
            pageClassName: ".fullpage",
            delay: 600,
            lastBar: false,     // 页面是否显示最后一个单独高度版块
            disableSrcollClassName: []  // 禁止触发滚动的元素类名
        }
        this.options = Object.assign(defaultOptions, options)      // 合并自定义配置
        this.activeIndex = 1                                                                   // 当前展示的页面序号
        this.containerDom = document.querySelector(`${this.options.containerClassName}`)        // 容器dom
        this.pagesNum = document.querySelectorAll(`${this.options.containerClassName}>${this.options.pageClassName}`).length       // 计算page页数
        this.viewHeight = document.documentElement.clientHeight                                 // 计算浏览器可视区域高度
        this.delay = this.options.delay     // 截流和防抖函数的延迟时间
        this.translateDis = 0      // 元素偏移距离
        this.scrollDisable = false     // 禁止全屏滚动
        this.disableSrcollClassName = this.options.disableSrcollClassName
        this.lastBar = this.options.lastBar
        this.lastHeight = this.lastBar ? document.querySelector(`${this.options.pageClassName}:last-child`).offsetHeight : 0   // 最后页面的高度
        this.scrollable = false     // 页面是否能滚动条滚动
    }
    // 原型方法
    debounce(method, context, delay) {       // 防抖动函数，method 回调函数， context 上下文, delay 延迟时间
        let timer
        return function() {
            clearTimeout(timer)
            timer = setTimeout(() => {
                method.apply(context, arguments)
            }, delay)
        }
    }
    throttle(method, context, delay) {       // 截流函数，method 回调函数，context 上下文, delay 延迟时间
        let wait = false
        return function() {
            if (!wait) {
                method.apply(context, arguments)
                wait = true
                setTimeout(() => {
                    wait = false
                }, delay)               // TODO: 截流延迟时间要大于containerDom的transition-duration + transition-delay
            }
        }
    }
    getWheelDelta(event) {      // 判断滚轮滚动方向
        event = event || window.event
        if (event.wheelDelta) {
            this.getWheelDelta = event => event.wheelDelta;     // 第一次调用后惰性载入，之后无需再做检测
            return event.wheelDelta
        } else {        // 兼容火狐
            this.getWheelDelta = event => -event.detail;
            return -event.detail
        }
    }
    scrollMouse(event) {
        for(let i = 0, len = this.disableSrcollClassName.length; i < len; i++) {
            let disClassName = this.disableSrcollClassName[i];
            if(event.target.className.indexOf(disClassName) !== -1) {       // 根据触发元素类名禁用滚动
                return false;
            }
        }
        
        if(this.scrollDisable) {        // 根据参数禁用滚动
            return false;
        }
        
        let delta = this.getWheelDelta(event)
        if (delta < 0) {        // delta < 0，页面向下滚动
            this.goDown()
        } else {
            this.goUp()
        }
    }
    touchEnd(event) {
        for(let i = 0, len = this.disableSrcollClassName.length; i < len; i++) {
            let disClassName = this.disableSrcollClassName[i];
            if(event.target.className.indexOf(disClassName) !== -1) {       // 根据触发元素类名禁用滚动
                return false;
            }
        }
        
        if(this.scrollDisable) {        // 根据参数禁用滚动
            return false;
        }
        
        this.endY = event.changedTouches[0].pageY

        if(Math.abs(this.endY - this.startY) <= 50) {       // 滑动太短
            return false;
        }
        
        if (this.endY - this.startY < 0) {      // 手指向上滑动，对应页面向下滚动
            this.goDown()
        } else if(this.endY - this.startY > 0) {        // 手指向下滑动，对应页面向上滚动
            this.goUp()
        }
    }
    goDown() {
        if (-this.translateDis <= this.viewHeight * (this.pagesNum - 2)) {
            this.containerDom.style.transition = "all 0.6s ease-in-out";
            this.activeIndex += 1

            if(this.lastBar && this.pagesNum == this.activeIndex) {
                this.lastHeight = document.querySelector(`${this.options.pageClassName}:last-child`).offsetHeight    // 计算最后一个版块高度
                this.translateDis -= this.lastHeight
            } else {
                this.translateDis -= this.viewHeight
            }
            this.containerDom.style.transform = `translate3d(0, ${this.translateDis}px, 0)`
            // this.ofsetBgPosition()
        }
    }
    goUp() {
        if (-this.translateDis >= this.viewHeight) {
            
            this.containerDom.style.transition = "all 0.6s ease-in-out";
            this.activeIndex -= 1

            if(this.lastBar && this.pagesNum == this.activeIndex+1) {
                this.translateDis += this.lastHeight
            } else {
                this.translateDis += this.viewHeight
            }
            this.containerDom.style.transform = `translate3d(0, ${this.translateDis}px, 0)`
            // this.ofsetBgPosition()
        }
    }
    resizeEvent() {
        this.containerDom.style.transition = "none";
        this.viewHeight = document.documentElement.clientHeight;
        this.containerDom.style.height = this.viewHeight + "px"

        if(this.lastBar) {      // 计算最后一个版块高度
            this.lastHeight = document.querySelector(`${this.options.pageClassName}:last-child`).offsetHeight
        }

        if(this.lastBar && this.pagesNum == this.activeIndex) {
            this.translateDis = -this.viewHeight * (this.activeIndex - 2) - this.lastHeight
        } else {
            this.translateDis = -this.viewHeight * (this.activeIndex - 1)
        }
        this.containerDom.style.transform = `translate3d(0, ${this.translateDis}px, 0)`
    }
    addScrollMouseEvent() {
        if (navigator.userAgent.toLowerCase().indexOf("firefox") === -1) {      // 鼠标滚轮监听，火狐鼠标滚动事件不同其他
            document.addEventListener("mousewheel", this.throttle(this.scrollMouse, this, this.delay))
        } else {
            document.addEventListener("DOMMouseScroll", this.throttle(this.scrollMouse, this, this.delay))
        }
    }
    addTouchMoveEvent() {
        document.addEventListener("touchstart", (event) => {
            this.startY = event.touches[0].pageY
        })
        document.addEventListener("touchend", this.throttle(this.touchEnd, this, this.delay))
        document.addEventListener("touchmove", event => {        // 阻止 touchmove 下拉刷新
            if(!this.scrollable)  {
                event.preventDefault()
            }
        }, { passive: false })
    }
    addResizeEvent() {
        window.addEventListener("resize", this.debounce(this.resizeEvent, this, 0))       // 浏览器窗口大小改变时
    }
    ofsetBgPosition() {      // 给页面添加背景定位偏移
        for(let i = 0, len = this.containerDom.children.length; i < len; i++) {
            let pageDom = this.containerDom.children[i];
            if(this.activeIndex-1 === i) {
                pageDom.style.backgroundPosition = `center center`
            } else {
                pageDom.style.backgroundPosition = `center ${ this.viewHeight/10*(i-(this.activeIndex-1)) }px`
            }
        }
    }
    addStyle() {        // 添加初始样式
        document.body.style.overflowY = 'hidden';       // 隐藏body滚动条
        this.containerDom.style.position = 'relative';
        this.containerDom.style.zIndex = '999';
        this.containerDom.style.height = this.viewHeight + "px"     // 初始给容器高度
        this.containerDom.style.transition = "all 0.6s ease-in-out";
    }
    goTo(index) {       // 跳转到指定页面
        this.containerDom.style.transition = "all 0.6s ease-in-out";
        this.activeIndex = parseInt(index);
        this.translateDis = -this.viewHeight*(this.activeIndex-1);
        this.containerDom.style.transform = `translate3d(0, ${this.translateDis}px, 0)`
    }
    bodyScrollable(able) {      // 页面滚动条滚动能力
        if(able) {
            document.body.style.overflowY = 'auto';       // 显示body滚动条
            this.scrollable = true;
        } else {
            document.body.style.overflowY = 'hidden';       // 隐藏body滚动条
            this.scrollable = false;
        }
    }
    fullScrollDisable(disable) {       // 页面禁止全屏滚动能力
        this.scrollDisable = disable
    }

    // 初始化函数
    init() {
        window.history.scrollRestoration && (window.history.scrollRestoration = 'manual');    // 取消浏览器历史导航记录页面滚动位置
        this.addStyle()
        this.addScrollMouseEvent()
        this.addTouchMoveEvent()
        this.addResizeEvent()
    }
}

export default FullPage