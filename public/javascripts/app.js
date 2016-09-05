(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){

var Main = Main || {};

Main.Home = require('./main/_home.msx');
//Main.Dashboard = require('./main/_dashboard.msx');
Main.Product = require('./main/_product.msx');
Main.Category = require('./main/_category.msx');
Main.Search = require('./main/_search.msx');

module.exports = Main;
},{"./main/_category.msx":5,"./main/_home.msx":7,"./main/_product.msx":9,"./main/_search.msx":10}],2:[function(require,module,exports){
var fn = require('./fn.msx');
var Data = Data | {};

//Data.urls =
//console.log(window.allCategory)

module.exports = Data;


},{"./fn.msx":3}],3:[function(require,module,exports){
var fn = fn || {};

fn.checkMenu = function(link){
    var partRoute = m.route().split('/');
    var result = true;
    var partLink = link.replace('https://', '').replace('http://', '').split('/');
    if(!(partLink[1] === "c" || partLink[1] === "p")){
        return false;
    }
    for(var i = 2; i < partLink.length; i++){
        if(partLink[i] != partRoute[i]){
            result = false;
        }
    }
    return result;
};
fn.price = function(price){
    var priceString = price.toString();
    var priceArray = priceString.split( /(?=(?:...)*$)/ );
    return priceArray.join(',');
};

fn.cache = undefined;
fn.url = m.route()

fn.createMenu = function(menuJson, level){
    return m('ul.level' + level, [
        menuJson.map(function(child){
            return m('li' + ((child.children != undefined)?'.has-sub':'.no-sub') + (fn.checkMenu(child.http)?'.active':'') +  ((fn.checkMenu(child.http) || (level === 1))?'.open':'') + (( level === 1 )?'.topMenu':''),  [
                m('.link-menu-wr', [
                    m('span', {
                        onclick: function(event){
                            var el = event.target.parentNode.parentNode;

                            var flag = el.classList.contains('open');

                            var listContainer = document.querySelectorAll('.level2 .open');

                            for(var i = 0; i < listContainer.length; i++){
                                listContainer[i].classList.remove('open')
                            }

                            if (el.classList) {
                                if(!el.classList.contains('open') && !flag) {
                                    el.classList.add('open');
                                }
                            } else {
                                var classes = el.className.split(' ');
                                var existingIndex = classes.indexOf('open');

                                if (existingIndex >= 0)
                                    classes.splice(existingIndex, 1);
                                else
                                    classes.push('open');
                                el.className = classes.join(' ');
                            }
                        }
                    } ,''),
                    m('a', {href: child.http, config: m.route} ,m('span', child.title))
                ]),
                (child.children != undefined)?fn.createMenu(child.children, level + 1):''
            ])
        })
    ])
};

fn.runCreateMenu = function(menuJson, level){
    if(fn.url !== m.route()){
        fn.url = m.route();
        fn.cache = undefined;
    };
    if(fn.cache !== undefined){
        return fn.cache;
    } else {
        fn.cache = fn.createMenu(menuJson, level)
        return fn.cache;
    }
};

fn.preloadImages = function(srcArray) {
    for (var i = 0, len = srcArray.length; i < len; i++) {
        var img = new Image();
        img.src = srcArray[i];
        img.style.display = 'none';
        document.body.appendChild(img);
    }
};



fn.buildBreadcrumb = function(urls, category, currentCategory, result){
    if(currentCategory === "NONE") {
        result.push({tag: "div", attrs: {}, children: [{tag: "a", attrs: {href:"/", config:m.route}, children: ["Trang chủ"]}, " / "]});
        return result;
    }
    var jsonCategory = category.getItemByParam({slug: currentCategory});
    result.push({tag: "div", attrs: {}, children: [{tag: "a", attrs: {href:window.urls[currentCategory], config:m.route}, children: [" ", jsonCategory.name, " "]}, "  / "]});
    return fn.buildBreadcrumb(urls, category, jsonCategory.sku.slug, result);
};

fn.requestWithFeedback = function(args, bind, fn) {
    var data = m.prop();
    var completed = m.prop(false);
    var complete = function() {
        completed(true)
    };
    args.background = true;
    args.config = function(xhr) {
        xhr.timeout = 4000;
        xhr.ontimeout = function() {
            complete();
            m.redraw();
        }
    };
    return {
        request: m.request(args).then(data).then(function(data){
            if(bind !== undefined) bind(data);
            if(fn !== undefined) fn();
            complete();
            m.redraw();
        }),
        data: data,
        ready: completed
    }
};

fn.changePage = function(currPage, newPage, maxPage){
    var url = m.route();
    console.log(url)
    var newUrl;
    var currParam = m.route.param('_page');
    if(url.indexOf('?') < 0){
        url += '?';
    }

    if(currParam === undefined){
        newUrl = url + '&_page=' + newPage;
    } else {
        var oldParam = '_page=' + currParam;
        var newParam = '_page=' + newPage;
        newUrl = url.toString().replace(oldParam, newParam);
    }

    console.log(newUrl)
    m.route(newUrl);
}

fn.buildPageNav = function(currPage, maxPage){
  return (
    {tag: "div", attrs: {className:"pageNav clearfix"}, children: [
          {tag: "div", attrs: {className:"pagePrev bo bo-3", 
            onclick:
            function(){
                if(currPage() > 1){
                    fn.changePage(currPage(), currPage() - 1, maxPage)
                }
            }
            
          }, children: ["<<"]}, 
          {tag: "input", attrs: {className:"currpage bo-5", 
                 onchange:m.withAttr("value", currPage), 
                 config:
                    function(el, isInited){
                        if(!isInited){
                            el.value = currPage()
                        }
                    }, 
                 
                 onkeydown:
                    function(){
                        if (event.keyCode == 13) {
                            if(event.target.value > maxPage || event.target.value < 1 || event.target.value === currPage()){
                               event.target.value = currPage()
                            } else {
                                fn.changePage(currPage, event.target.value, maxPage)
                            }
                        }
                    }
                 }
          }, 
           {tag: "div", attrs: {}, children: ["/"]}, 
          {tag: "div", attrs: {className:"currPage"}, children: [maxPage]}, 
          {tag: "div", attrs: {className:"pageNext bo bo-3", 
            onclick:
            function(){
                    if(currPage() < maxPage){
                        fn.changePage(currPage, currPage() + 1, maxPage)
                    }
                }
            
          }, children: [">>"]}
    ]}
  )
};


module.exports = fn;

},{}],4:[function(require,module,exports){
"use strict";


m.route.mode = "pathname";

//window.Nav = require('./_nav.msx');
window.Main = require('./_main.msx');
//window.Footer = require('./_footer.msx');



//re-route to dashboard
//m.route("/dashboard"); // logs "unloading home component"








},{"./_main.msx":1}],5:[function(require,module,exports){
var Nav = require('./_nav.msx');
var Footer = require('./_footer.msx');
var Left = require('./partials/_left.msx');
var Middle = require('./partials/_middle-category.msx');
var Right = require('./partials/_right.msx');
var fn = require('../core/fn.msx');

var Category = {
    controller: function() {
        m.redraw.strategy("diff")
        var ctrl = this;
        if(window._kw !== undefined ) {
            ctrl._kw = window._kw;
        } else {
            ctrl._kw = ""
        }
        //ctrl.slides = m.prop(window.demoSlide);
        ctrl.currentSlide = m.prop({});
        ctrl.products = m.prop([]);
        ctrl.total = m.prop(0);
        ctrl.maxPage = m.prop(0);
        ctrl.slides = m.prop([]);
        ctrl.current = 0;

        //ctrl.currentSlide(window.demoSlide[0]);

        ctrl.loading = true;
        ctrl.ok = false;
        ctrl.setup = function(){
            ctrl.products(ctrl.request.data().products);
            ctrl.total(ctrl.request.data().total);
            ctrl.currPage = m.prop(ctrl.request.data().page);
            ctrl.maxPage = m.prop(ctrl.request.data().totalPage);
            if(ctrl.request.data().products.length >3 ) {
                ctrl.slides(ctrl.request.data().products.slice(0, 4));
            } else {
                ctrl.slides(ctrl.request.data().products);
            }
            ctrl.currentSlide(ctrl.slides()[0]);
            ctrl.maxSlide = ctrl.slides().length;
        };

        if(window.demoSlide === undefined || window.demoSlide.length == 0) {
            ctrl.request = fn.requestWithFeedback({method: "GET", url: "/api/getProductInCategory/" + m.route.param('category1') + "?" + ((m.route.param('_page') !== undefined)?("_page=" + m.route.param("_page")):"")}, ctrl.products, ctrl.setup);
        } else {
                ctrl.request = {
                    ready: function () {
                        return true
                    },
                    data: m.prop(window.demoSlide)
                };
                ctrl.setup()
        }
        window.demoSlide = [];
        //console.log(window.demoSlide.length)
        //ctrl.data = m.prop([]);
        //m.request({method: "GET", url: "/data1.json"}).then(function(res){
        //  ctrl.data(res.data)
        //});
    },
    view: function(ctrl) {
        return m('div', [
            Nav.view(ctrl),
            {tag: "div", attrs: {id:"main", className:"clearfix"}, children: [
                [
                    Left(ctrl),
                    Middle(ctrl),
                    Right(ctrl),
                ]
            ]},
            Footer.view(ctrl)
        ])
    }
};


module.exports = Category;
},{"../core/fn.msx":3,"./_footer.msx":6,"./_nav.msx":8,"./partials/_left.msx":11,"./partials/_middle-category.msx":12,"./partials/_right.msx":17}],6:[function(require,module,exports){
var Footer = Footer || {};

Footer.controller = function(){
    m.redraw.strategy("diff");
};

Footer.view = function(ctrl){
    return (
        {tag: "div", attrs: {id:"footer"}, children: [
            "FOOTER"
        ]}
    )
}

module.exports = Footer;
},{}],7:[function(require,module,exports){
var Nav = require('./_nav.msx');
var Footer = require('./_footer.msx');
var Left = require('./partials/_left.msx');
var Middle = require('./partials/_middle.msx');
var Right = require('./partials/_right-tmp.msx');
var fn = require('../core/fn.msx');

var Home = {
    controller: function() {
        m.redraw.strategy("diff");

        var ctrl = this;
        if(window._kw !== undefined ) {
            ctrl._kw = window._kw;
        } else {
            ctrl._kw = ""
        }
        //ctrl.slides = m.prop(window.demoSlide);
        ctrl.currentSlide = m.prop({});
        ctrl.products = m.prop([]);
        ctrl.slides = m.prop([]);
        ctrl.current = 0;

        //ctrl.currentSlide(window.demoSlide[0]);

        ctrl.loading = true;
        ctrl.ok = false;
        ctrl.setup = function(){
            ctrl.products(ctrl.request.data());
            ctrl.slides(ctrl.request.data()[0].value.products.slice(2, 6));
            ctrl.currentSlide(ctrl.slides()[0]);
            ctrl.maxSlide = ctrl.slides().length;
        };

        if(window.demoSlide === undefined || window.demoSlide.length == 0) {
            ctrl.request = fn.requestWithFeedback({method: "GET", url: "/api/getProductsForIndex"}, ctrl.products, ctrl.setup);
        } else {
            ctrl.request = {
                ready: function () {
                    return true
                },
                data: m.prop(window.demoSlide)
            };
            ctrl.setup()
        }
        window.demoSlide = [];
    },
    view: function(ctrl) {
        return m('div', [
            Nav.view(ctrl),
            {tag: "div", attrs: {id:"main", className:"clearfix"}, children: [
                [
                    Left(ctrl),
                    Middle(ctrl),
                    Right(ctrl),
                ]
            ]},
            Footer.view(ctrl)
        ])
    }
};


module.exports = Home;
},{"../core/fn.msx":3,"./_footer.msx":6,"./_nav.msx":8,"./partials/_left.msx":11,"./partials/_middle.msx":15,"./partials/_right-tmp.msx":16}],8:[function(require,module,exports){


var Nav = {};
Nav.controller = function(){
    m.redraw.strategy("diff");
    var ctrl = this;
    if(window._kw !== undefined ) {
        ctrl._kw = window._kw;
    } else {
        ctrl._kw = ""
    }
    //setInterval(function(){m.redraw()}, 2000)
};
Nav.view = function(ctrl){
    //console.log("render view");
    return (
        {tag: "div", attrs: {id:"header"}, children: [
        {tag: "div", attrs: {className:"h-container"}, children: [
            {tag: "div", attrs: {className:"h-left"}}, 
            {tag: "div", attrs: {className:"h-right"}, children: [
                {tag: "div", attrs: {className:"h-top"}, children: [
                    {tag: "div", attrs: {className:"search clearfix"}, children: [
                        {tag: "div", attrs: {className:"searchWr"}, children: [
                            {tag: "form", attrs: {action:"tim-kiem", method:"get"}, children: [
                            {tag: "input", attrs: {type:"text", id:"_kw", name:"_kw", 
                                   onkeydown:function(){
                                        if (event.keyCode == 13) {
                                                event.preventDefault();
                                                m.route("/tim-kiem?_kw=" + event.target.value);
                                            }
                                        }, 
                                    
                                   config:
                                      function(el, isInited){
                                        if(!isInited){
                                            if(ctrl._kw.length>0){
                                                el.value = ctrl._kw;
                                            }
                                        }
                                      }
                                   }
                            }, 
                            {tag: "span", attrs: {className:"search-icon"}}
                            ]}
                        ]}, 
                        {tag: "a", attrs: {href:"#", className:"cartWr clearfix"}, children: [

                            {tag: "span", attrs: {className:"cart-icon"}}, 
                            {tag: "span", attrs: {className:"number-items"}, children: [
                                "(0) Mục"
                            ]}
                        ]}, 
                        {tag: "div", attrs: {className:"userWr bo bo-5"}
                        }
                    ]}

                ]}, 
                {tag: "div", attrs: {className:"h-bot"}, children: [
                    {tag: "ul", attrs: {className:"navMenu"}, children: [
                        {tag: "li", attrs: {}, children: [{tag: "a", attrs: {href:"/", config:m.route}, children: ["GIỚI THIỆU"]}]}, 
                        {tag: "li", attrs: {}, children: [{tag: "a", attrs: {href:"/", config:m.route, className:"active"}, children: ["LINH KIỆN"]}]}, 
                        {tag: "li", attrs: {}, children: [{tag: "a", attrs: {href:"/", config:m.route}, children: ["SẢN PHẨM"]}]}, 
                        {tag: "li", attrs: {}, children: [{tag: "a", attrs: {href:"/", config:m.route}, children: ["NGHIÊN CỨU"]}]}, 
                        {tag: "li", attrs: {}, children: [{tag: "a", attrs: {href:"/", config:m.route}, children: ["DỊCH VỤ"]}]}, 
                        {tag: "li", attrs: {}, children: [{tag: "a", attrs: {href:"/", config:m.route}, children: ["LIÊN HỆ"]}]}
                    ]}
                ]}
            ]}
        ]}
        ]}
    )
};


module.exports = Nav;
},{}],9:[function(require,module,exports){
var Nav = require('./_nav.msx');
var Footer = require('./_footer.msx');
var Left = require('./partials/_left.msx');
var Middle = require('./partials/_middle-product.msx');
var Right = require('./partials/_right.msx');
var fn = require('../core/fn.msx');

var Product = {
    controller: function() {
        m.redraw.strategy("diff")
        var ctrl = this;
        if(window._kw !== undefined ) {
            ctrl._kw = window._kw;
        } else {
            ctrl._kw = ""
        }
        ctrl.product = m.prop({status: "loading"});
        ctrl.zoom = false;
        ctrl.setup = function(){
            ctrl.product(ctrl.request.data())
        };
        if(window.product === undefined || window.product.length == 0) {
            ctrl.request = fn.requestWithFeedback({method: "GET", url: "/api/getProduct/" + m.route.param('item')}, ctrl.product, ctrl.setup);
        } else {
            ctrl.request = {
                ready: function () {
                    return true
                },
                data: m.prop(window.product)
            };
            ctrl.setup();
        }
        window.product = [];

    },
    view: function(ctrl) {
        return m('div', [
            Nav.view(ctrl),
            {tag: "div", attrs: {id:"main", className:"clearfix"}, children: [
                [
                    Left(ctrl),
                    Middle(ctrl),
                ]
            ]},
            Footer.view(ctrl)
        ])
    }
};


module.exports = Product;
},{"../core/fn.msx":3,"./_footer.msx":6,"./_nav.msx":8,"./partials/_left.msx":11,"./partials/_middle-product.msx":13,"./partials/_right.msx":17}],10:[function(require,module,exports){
var Nav = require('./_nav.msx');
var Footer = require('./_footer.msx');
var Left = require('./partials/_left.msx');
var Middle = require('./partials/_middle-search.msx');
var Right = require('./partials/_right.msx');
var fn = require('../core/fn.msx');

var Search = {
    controller: function() {
        m.redraw.strategy("diff")
        var ctrl = this;
        if(window._kw !== undefined ) {
            ctrl._kw = window._kw;
        } else {
            ctrl._kw = ""
        }
        //ctrl.slides = m.prop(window.demoSlide);
        ctrl.currentSlide = m.prop({});
        ctrl.products = m.prop([]);
        //ctrl.currPage = m.prop(1);
        ctrl.total = m.prop(0);
        ctrl.maxPage = m.prop(0);
        ctrl.slides = m.prop([]);
        ctrl.current = 0;

        //ctrl.currentSlide(window.demoSlide[0]);

        ctrl.loading = true;
        ctrl.ok = false;
        ctrl.setup = function(){
            ctrl.products(ctrl.request.data().products);
            ctrl.total(ctrl.request.data().total);
            ctrl.currPage = m.prop(ctrl.request.data().page);
            ctrl.maxPage(ctrl.request.data().totalPage);
            ctrl.slides(ctrl.request.data().products.slice(2, 6));
            ctrl.currentSlide(ctrl.slides()[0]);
            ctrl.maxSlide = ctrl.slides().length;
        };

        if(window.demoSlide === undefined || window.demoSlide.length == 0) {
            ctrl.request = fn.requestWithFeedback({method: "GET", url: "/api/search?_kw=" + m.route.param('_kw') + "&" + ((m.route.param('_page') !== undefined)?("_page=" + m.route.param("_page")):"")}, ctrl.products, ctrl.setup);
        } else {
            ctrl.request = {
                ready: function () {
                    return true
                },
                data: m.prop(window.demoSlide)
            };
            ctrl.setup()
        }
        window.demoSlide = [];
        //console.log(window.demoSlide.length)
        //ctrl.data = m.prop([]);
        //m.request({method: "GET", url: "/data1.json"}).then(function(res){
        //  ctrl.data(res.data)
        //});
    },
    view: function(ctrl) {
        return m('div', [
            Nav.view(ctrl),
            {tag: "div", attrs: {id:"main", className:"clearfix"}, children: [
                [
                    Left(ctrl),
                    Middle(ctrl),
                ]
            ]},
            Footer.view(ctrl)
        ])
    }
};


module.exports = Search;
},{"../core/fn.msx":3,"./_footer.msx":6,"./_nav.msx":8,"./partials/_left.msx":11,"./partials/_middle-search.msx":14,"./partials/_right.msx":17}],11:[function(require,module,exports){
var fn = require('../../core/fn.msx');
var data = require('../../core/data.js');

var Left = function(ctrl){
    url = 'http://' + document.domain + ':9000' + m.route();
    return m('.left', {
        config: function(){

        }
    }, m('#sideMenu', fn.runCreateMenu(window.menu, 1)))
};



module.exports = Left;
},{"../../core/data.js":2,"../../core/fn.msx":3}],12:[function(require,module,exports){
var fn = require('../../core/fn.msx');

var Middle =  function(ctrl){
    return (!ctrl.request.ready()?(
        {tag: "div", attrs: {className:"mid"}, children: [
            {tag: "div", attrs: {class:"loader"}, children: ["Loading..."]}
        ]}):(
        (ctrl.request.data().products.length < 1)?(
            {tag: "div", attrs: {className:"mid"}, children: [
                {tag: "div", attrs: {className:"noProduct"}, children: ["Hiện chưa có sản phẩm nào !"]}
            ]}
        ):(
        {tag: "div", attrs: {className:"mid"}, children: [
            {tag: "div", attrs: {className:"slider clearfix"}, children: [

                {tag: "div", attrs: {className:"sliderWr", 
                     config:
                        function(el, isInited, ctx){
                            if(!isInited){
                                ctx.preloadedAllImages = false;
                                ctx.running = false;
                                var nextSlide = function(){
                                    if(ctrl.current == (ctrl.maxSlide - 1 )){
                                        ctrl.current = 0;
                                    } else {
                                        ctrl.current += 1;
                                    }
                                    ctrl.currentSlide(ctrl.slides()[ctrl.current]);
                                    m.redraw();

                                };

                                var slideOut;
                                var run = function(){
                                    if(ctx.running == false){
                                        slideOut = setInterval(function(){
                                            ctx.running = true;
                                            if(!ctx.preloadedAllImages){
                                                fn.preloadImages([ctrl.slides()[ctrl.current+1].info.image[0].origin]);
                                                if( ctrl.current + 1 === ctrl.maxSlide - 1) ctx.preloadedAllImages = true;
                                            }
                                                el.classList.add("fadeOutLeft");
                                                el.classList.add("animated");
                                                setTimeout(function(){
                                                    nextSlide();
                                                    var animated = el.querySelectorAll('.animated');
                                                    for(var i = 0; i < animated.length; i++){
                                                        animated[i].classList.remove("animated");
                                                        ["fadeInDown", "fadeInLeft", "fadeInUp"].map(function(cName){
                                                            if(animated[i].classList.contains(cName)){
                                                                animated[i].classList.remove(cName);

                                                                animated[i].offsetWidth = animated[i].offsetWidth;

                                                                animated[i].classList.add(cName);
                                                            }
                                                        });
                                                        animated[i].classList.add("animated");
                                                    }
                                                    el.classList.remove("fadeOutLeft");
                                                    el.classList.remove("animated");
                                                }, 700)

                                        }, 3700);
                                    }
                                };

                                run();
                                //setTimeout(function(){
                                //    el.classList.remove("fadeOutLeft")
                                //    el.classList.remove("animated")
                                //}, 4000)

                                el.parentNode.addEventListener('mouseover', function(){
                                    ctx.running = false;
                                    clearInterval(slideOut)
                                });
                                el.parentNode.addEventListener('mouseleave', function(){
                                    run();
                                });
                            }
                        }
                     
                }, children: [
                    {tag: "div", attrs: {}, children: [
                        {tag: "div", attrs: {className:"slider-img fadeInLeft animated"}, children: [
                            {tag: "img", attrs: {src:ctrl.currentSlide().info.image[0].origin, alt:""}}
                        ]}, 
                        {tag: "div", attrs: {className:"slider-text"}, children: [
                            {tag: "div", attrs: {className:"slider-header fadeInDown animated"}, children: [
                                ctrl.currentSlide().core.name
                            ]}, 
                            {tag: "div", attrs: {className:"slider-info fadeInUp animated"}, children: [
                                m.trust(ctrl.currentSlide().extra.note)
                            ]}
                        ]}
                    ]}
                ]}

            ]}, 

            {tag: "div", attrs: {className:"categoryWr clearfix"}, children: [
                {tag: "div", attrs: {className:"clearfix"}, children: [
                    {tag: "h3", attrs: {}, children: [window.allCategory.getItemByParam({slug: m.route.param('category1')}).name]}, 
                    {tag: "div", attrs: {className:"fr"}, children: [
                        "Sắp xếp sản phẩm:", 
                        {tag: "select", attrs: {class:"select", id:"sortMode"}, children: [
                            {tag: "option", attrs: {value:"by_pass"}, children: ["Mặc định"]}, 
                            {tag: "option", attrs: {value:"n-1"}, children: ["ID sản phẩm giảm dần"]}, 
                            {tag: "option", attrs: {value:"1-n"}, children: ["ID sản phẩm tăng dần"]}, 
                            {tag: "option", attrs: {value:"a-z"}, children: ["Tên sản phẩm từ A-Z"]}, 
                            {tag: "option", attrs: {value:"z-a"}, children: ["Tên sản phẩm từ Z-A"]}, 
                            {tag: "option", attrs: {value:"max-min"}, children: ["Giá sản phẩm giảm dần"]}, 
                            {tag: "option", attrs: {value:"min-max", selected:"selected"}, children: ["Giá sản phẩm tăng dần"]}
                        ]}, 

                        {tag: "select", attrs: {class:"select", id:"sortLimit"}, children: [
                            {tag: "option", attrs: {value:"20", selected:"selected"}, children: ["20"]}, 
                            {tag: "option", attrs: {value:"32"}, children: ["32"]}, 
                            {tag: "option", attrs: {value:"48"}, children: ["48"]}, 
                            {tag: "option", attrs: {value:"56"}, children: ["56"]}
                        ]}

                    ]}, 
                    {tag: "br", attrs: {}}, 
                    {tag: "br", attrs: {}}, 
                    fn.buildPageNav(ctrl.currPage, ctrl.maxPage()), 
                    {tag: "div", attrs: {className:"total fl clearfix"}, children: [
                        ctrl.total(), " Sản phẩm"
                    ]}

                ]}, 



                (ctrl.products().length<1)?(
                    {tag: "div", attrs: {className:"loading"}, children: [
                        "LOADING !!!"
                    ]}
                ):(
                    {tag: "div", attrs: {className:"listProduct inCategory clearfix"}, children: [
                        ctrl.products().map(function(item){
                            return (


                                    {tag: "div", attrs: {className:"itemWr"}, children: [
                                        {tag: "a", attrs: {href:(urls[item.sku.slug].replace('/c/', '/p/') + "/" + item.slug), config:m.route}, children: [
                                        {tag: "div", attrs: {className:"img-item"}, children: [
                                            {tag: "img", attrs: {src:item.info.image[0].small, alt:""}}
                                        ]}, 

                                        {tag: "div", attrs: {className:"info-item"}, children: [
                                            {tag: "div", attrs: {className:"name-item"}, children: [
                                                item.core.name
                                            ]}, 
                                            {tag: "div", attrs: {className:"info-extra-item"}, children: [
                                                {tag: "span", attrs: {}, children: ["Bán lẻ:"]}, 
                                                {tag: "div", attrs: {className:"price-item"}, children: [fn.price(item.core.price[0].price), " Đ"]}
                                            ]}
                                        ]}
                                        ]}, 
                                        {tag: "div", attrs: {className:"side-info"}, children: [
                                            m.trust(item.extra.note)
                                        ]}
                                    ]}
                            )
                        })
                    ]}
                )
            ]}, 
            fn.buildPageNav(ctrl.currPage, ctrl.maxPage())


        ]}
        )
        )
    )
};

module.exports = Middle;
},{"../../core/fn.msx":3}],13:[function(require,module,exports){
var fn = require('../../core/fn.msx');

var Middle =  function(ctrl){
    var status_loading = ctrl.product().status === "loading";
    var status_ok = ctrl.product().status === "ok";

    return (
        {tag: "div", attrs: {className:"productWrap clearfix"}, children: [
            !ctrl.request.ready()?(
                {tag: "div", attrs: {className:"mid"}, children: [
                    {tag: "div", attrs: {class:"loader"}, children: ["Loading..."]}
                ]}
            ):(
                (ctrl.product().length < 0)?(
                    {tag: "div", attrs: {}, children: [
                        {tag: "div", attrs: {className:"noProduct"}, children: ["Hiện chưa có sản phẩm nào !"]}
                    ]}
                ):(
                    {tag: "div", attrs: {class:true}, children: [
                        {tag: "div", attrs: {className:"clearfix"}, children: [
                            {tag: "div", attrs: {className:"breadCrumb"}, children: [fn.buildBreadcrumb(window.urls, window.allCategory,ctrl.product()[0].sku.slug, []).reverse(), " ", {tag: "div", attrs: {className:"current"}, children: [window.allCategory.getItemByParam({slug: ctrl.product()[0].sku.slug}).name]}]}
                        ]}, 
                        {tag: "div", attrs: {className:"p-top clearfix"}, children: [
                            {tag: "div", attrs: {className:"pt-left"}, children: [
                                {tag: "img", attrs: {src:ctrl.product()[0].info.image[0].small, alt:"", 
                                    onclick:function(){
                                            ctrl.zoom=true;
                                        }
                                    }
                                }
                            ]}, 
                            {tag: "div", attrs: {className:"pt-right"}, children: [
                                {tag: "h1", attrs: {className:"name"}, children: [ctrl.product()[0].core.name]}, 
                                {tag: "div", attrs: {className:"msp"}, children: ["Mã Sản phẩm: ", {tag: "span", attrs: {}, children: [ctrl.product()[0].core.code]}]}, 
                                {tag: "div", attrs: {className:"price"}, children: ["Giá: ", {tag: "span", attrs: {}, children: [fn.price(ctrl.product()[0].core.price[0].price), " VNĐ"]}]}
                            ]}
                        ]}, 
                        {tag: "div", attrs: {className:"p-bot"}

                        }, 
                        ctrl.zoom?({tag: "div", attrs: {className:"zoomWr"}, children: [
                            {tag: "div", attrs: {className:"zoomImageWr noScroll zoomIn animated "}, children: [
                                {tag: "img", attrs: {class:"", src:ctrl.product()[0].info.image[0].origin, alt:"", 
                                 onclick:
                                    function(event){
                                        //var el = event.target;
                                        //el.classList.remove("zoomIn");
                                        //el.classList.add("zoomOut");
                                        ctrl.zoom = false;
                                    }
                                 }
                                }
                            ]}
                        ]}):""
                    ]}
                )
            )
        ]}
    )
};

module.exports = Middle;
},{"../../core/fn.msx":3}],14:[function(require,module,exports){
var fn = require('../../core/fn.msx');

var Middle =  function(ctrl){
    return (!ctrl.request.ready()?({tag: "div", attrs: {className:"mid"}, children: [
            {tag: "div", attrs: {class:"loader"}, children: ["Loading..."]}
        ]}):(
        (ctrl.request.data().products.length < 1)?(
            {tag: "div", attrs: {className:"mid"}, children: [
                {tag: "div", attrs: {className:"categoryWr"}, children: [
                    {tag: "div", attrs: {className:"clearfix"}, children: [
                        {tag: "h3", attrs: {}, children: ["Không tìm thấy \"", m.route.param('_kw'), "\" trong sản phẩm nào!"]}
                    ]}
                ]}
            ]}
        ):(
        {tag: "div", attrs: {className:"mid"}, children: [

            {tag: "div", attrs: {className:"categoryWr "}, children: [
                {tag: "div", attrs: {className:"clearfix"}, children: [
                    {tag: "h3", attrs: {}, children: ["Tìm kiếm: ", m.route.param('_kw')]}, 
                    {tag: "div", attrs: {className:"fr"}, children: [
                        "Sắp xếp sản phẩm:", 
                        {tag: "select", attrs: {class:"select", id:"sortMode"}, children: [
                            {tag: "option", attrs: {value:"by_pass"}, children: ["Mặc định"]}, 
                            {tag: "option", attrs: {value:"n-1"}, children: ["ID sản phẩm giảm dần"]}, 
                            {tag: "option", attrs: {value:"1-n"}, children: ["ID sản phẩm tăng dần"]}, 
                            {tag: "option", attrs: {value:"a-z"}, children: ["Tên sản phẩm từ A-Z"]}, 
                            {tag: "option", attrs: {value:"z-a"}, children: ["Tên sản phẩm từ Z-A"]}, 
                            {tag: "option", attrs: {value:"max-min"}, children: ["Giá sản phẩm giảm dần"]}, 
                            {tag: "option", attrs: {value:"min-max", selected:"selected"}, children: ["Giá sản phẩm tăng dần"]}
                        ]}, 

                        {tag: "select", attrs: {class:"select", id:"sortLimit"}, children: [
                            {tag: "option", attrs: {value:"20", selected:"selected"}, children: ["20"]}, 
                            {tag: "option", attrs: {value:"32"}, children: ["32"]}, 
                            {tag: "option", attrs: {value:"48"}, children: ["48"]}, 
                            {tag: "option", attrs: {value:"56"}, children: ["56"]}
                        ]}

                    ]}, 

                    {tag: "br", attrs: {}}, 
                    {tag: "br", attrs: {}}, 
                    fn.buildPageNav(ctrl.currPage, ctrl.maxPage()), 
                    {tag: "div", attrs: {className:"total fl clearfix"}, children: [
                        ctrl.total(), " Sản phẩm"
                    ]}
                ]}, 
                (ctrl.products().length<1)?(
                    {tag: "div", attrs: {className:"loading"}, children: [
                        "LOADING !!!"
                    ]}
                ):(
                    {tag: "div", attrs: {className:"listProduct inCategory clearfix"}, children: [
                        ctrl.products().map(function(item){
                            return (


                                    {tag: "div", attrs: {className:"itemWr"}, children: [
                                        {tag: "a", attrs: {href:(urls[item.sku.slug].replace('/c/', '/p/') + "/" + item.slug), config:m.route}, children: [
                                        {tag: "div", attrs: {className:"img-item"}, children: [
                                            {tag: "img", attrs: {src:item.info.image[0].small, alt:""}}
                                        ]}, 

                                        {tag: "div", attrs: {className:"info-item"}, children: [
                                            {tag: "div", attrs: {className:"name-item"}, children: [
                                                item.core.name
                                            ]}, 
                                            {tag: "div", attrs: {className:"info-extra-item"}, children: [
                                                {tag: "span", attrs: {}, children: ["Bán lẻ:"]}, 
                                                {tag: "div", attrs: {className:"price-item"}, children: [fn.price(item.core.price[0].price), " Đ"]}
                                            ]}
                                        ]}
                                        ]}, 
                                        {tag: "div", attrs: {className:"side-info"}, children: [
                                            m.trust(item.extra.note)
                                        ]}
                                    ]}
                            )
                        })
                    ]}
                )
            ]}


        ]}
        )
        )
    )
};

module.exports = Middle;
},{"../../core/fn.msx":3}],15:[function(require,module,exports){
var fn = require('../../core/fn.msx');

var Middle =  function(ctrl){
    return (!ctrl.request.ready()?(
            {tag: "div", attrs: {className:"mid"}, children: [
                {tag: "div", attrs: {class:"loader"}, children: ["Loading..."]}
            ]}
        ):(
        (ctrl.request.data().length < 1)?(
            {tag: "div", attrs: {className:"mid"}, children: [
                {tag: "div", attrs: {className:"noProduct"}, children: ["Hiện chưa có sản phẩm nào !"]}
            ]}
        ):(
        {tag: "div", attrs: {className:"mid"}, children: [
            {tag: "div", attrs: {className:"slider clearfix"}, children: [
                {tag: "div", attrs: {className:"sliderWr", 
                     config:
                        function(el, isInited, ctx){
                            if(!isInited){
                                ctx.preloadedAllImages = false;
                                ctx.running = false;
                                var nextSlide = function(){
                                    if(ctrl.current == (ctrl.maxSlide - 1 )){
                                        ctrl.current = 0;
                                    } else {
                                        ctrl.current += 1;
                                    }
                                    ctrl.currentSlide(ctrl.slides()[ctrl.current]);
                                    m.redraw();

                                };

                                var slideOut;
                                var run = function(){
                                    if(ctx.running == false){
                                        slideOut = setInterval(function(){
                                            ctx.running = true;
                                            if(!ctx.preloadedAllImages){
                                                fn.preloadImages([ctrl.slides()[ctrl.current+1].info.image[0].origin]);
                                                if( ctrl.current + 1 === ctrl.maxSlide - 1) ctx.preloadedAllImages = true;
                                            }
                                                el.classList.add("fadeOutLeft");
                                                el.classList.add("animated");
                                                setTimeout(function(){
                                                    nextSlide();
                                                    var animated = el.querySelectorAll('.animated');
                                                    for(var i = 0; i < animated.length; i++){
                                                        animated[i].classList.remove("animated");
                                                        ["fadeInDown", "fadeInLeft", "fadeInUp"].map(function(cName){
                                                            if(animated[i].classList.contains(cName)){
                                                                animated[i].classList.remove(cName);

                                                                animated[i].offsetWidth = animated[i].offsetWidth;

                                                                animated[i].classList.add(cName);
                                                            }
                                                        });
                                                        animated[i].classList.add("animated");
                                                    }
                                                    el.classList.remove("fadeOutLeft");
                                                    el.classList.remove("animated");
                                                }, 700)

                                        }, 3700);
                                    }
                                };

                                run();
                                //setTimeout(function(){
                                //    el.classList.remove("fadeOutLeft")
                                //    el.classList.remove("animated")
                                //}, 4000)

                                el.parentNode.addEventListener('mouseover', function(){
                                    ctx.running = false;
                                    clearInterval(slideOut)
                                });
                                el.parentNode.addEventListener('mouseleave', function(){
                                    run();
                                });
                            }
                        }
                     
                }, children: [
                    {tag: "div", attrs: {}, children: [
                        {tag: "div", attrs: {className:"slider-img fadeInLeft animated"}, children: [
                            {tag: "img", attrs: {src:ctrl.currentSlide().info.image[0].origin, alt:""}}
                        ]}, 
                        {tag: "div", attrs: {className:"slider-text"}, children: [
                            {tag: "div", attrs: {className:"slider-header fadeInDown animated"}, children: [
                                ctrl.currentSlide().core.name
                            ]}, 
                            {tag: "div", attrs: {className:"slider-info fadeInUp animated"}, children: [
                                m.trust(ctrl.currentSlide().extra.note)
                            ]}
                        ]}
                    ]}
                ]}
            ]}, 

            ctrl.products().map(function(listProducts){
                return (
                    {tag: "div", attrs: {className:"productWr"}, children: [
                        {tag: "h3", attrs: {}, children: [{tag: "a", attrs: {href:urls[listProducts.id], config:m.route}, children: [allCategory.getItemByParam({slug: listProducts.id}).name, " (", listProducts.value.total, " Sản phẩm)"]}, " "]}, 
                            {tag: "div", attrs: {className:"listProduct clearfix"}, children: [
                                listProducts.value.products.map(function(item){
                                    return (
                                        {tag: "div", attrs: {className:"itemWr"}, children: [
                                            {tag: "a", attrs: {href:(urls[item.sku.slug].replace('/c/', '/p/') + "/" + item.slug), config:m.route}, children: [
                                                {tag: "div", attrs: {className:"img-item bo-5"}, children: [
                                                    {tag: "img", attrs: {class:"bo-5", src:item.info.image[0].small, alt:""}}
                                                ]}, 

                                                {tag: "div", attrs: {className:"info-item"}, children: [
                                                    {tag: "div", attrs: {className:"name-item"}, children: [
                                                        item.core.name
                                                    ]}, 
                                                    {tag: "div", attrs: {className:"info-extra-item"}, children: [
                                                        {tag: "span", attrs: {}, children: ["Bán lẻ:"]}, 
                                                        {tag: "div", attrs: {className:"price-item"}, children: [fn.price(item.core.price[0].price), " Đ"]}
                                                    ]}
                                                ]}
                                            ]}, 
                                            {tag: "div", attrs: {className:"side-info"}, children: [
                                                m.trust(item.extra.note)
                                            ]}
                                        ]}
                                    )
                                })
                            ]}

                    ]}
                )
            })

        ]}
        )
        )
    )
};

module.exports = Middle;
},{"../../core/fn.msx":3}],16:[function(require,module,exports){
var fn = require('../../core/fn.msx');

var Right = function(ctrl){
    return (
        {tag: "div", attrs: {className:"right"}, children: [
            {tag: "div", attrs: {className:"notify"}, children: [
                {tag: "div", attrs: {className:"notify-header"}, children: [
                    "THÔNG BÁO"
                ]}, 
                {tag: "div", attrs: {className:"notify-body"}, children: [
                    "- Ship nội thành: 10,000Đ -", 
                    {tag: "br", attrs: {}}, 
                    {tag: "br", attrs: {}}, 
                    "Miễn phí tiền ship với đơn hàng trên 200,000Đ (HN), trên 500,000Đ (TQ)"
                ]}
            ]}, 
            {tag: "div", attrs: {className:"saleWr "}, children: [
                {tag: "h3", attrs: {}, children: ["SẢN PHẨM KHUYẾN MÃI"]}, 
                
                    (!ctrl.request.ready()?({tag: "div", attrs: {className:"mid"}, children: [
                        {tag: "div", attrs: {class:"loader"}, children: ["Loading..."]}
                    ]}):((ctrl.products()[0].value.products.length<1)?(
                    ""
                ):(
                    {tag: "div", attrs: {className:"listSale"}, children: [
                        ctrl.products()[0].value.products.map(function(item){
                            return (
                                {tag: "div", attrs: {className:"saleWr clearfix"}, children: [
                                    {tag: "div", attrs: {className:"sale-info"}, children: [
                                        {tag: "div", attrs: {className:"sale-name"}, children: [item.core.name]}, 
                                        {tag: "div", attrs: {className:"sale-price"}, children: [
                                            fn.price((item.extra.saleOff2>0)?(item.core.price[0].price -item.extra.saleOff2):(
                                                (100 - item.extra.saleOff1)* (item.core.price[0].price) /100
                                            )), " Đ"
                                        ]}, 
                                        {tag: "div", attrs: {className:"old-price"}, children: [ fn.price(item.core.price[0].price), " Đ"]}
                                    ]}, 
                                    {tag: "div", attrs: {className:"sale-img"}, children: [
                                        {tag: "img", attrs: {src:item.info.image[0].thumb, alt:""}}
                                    ]}
                                ]}

                            )
                        })
                    ]}
                )))
            ]}
        ]}
    )
};

module.exports = Right;

},{"../../core/fn.msx":3}],17:[function(require,module,exports){
var fn = require('../../core/fn.msx');

var Right = function(ctrl){
    return (
        {tag: "div", attrs: {className:"right"}, children: [
            {tag: "div", attrs: {className:"notify"}, children: [
                {tag: "div", attrs: {className:"notify-header"}, children: [
                    "THÔNG BÁO"
                ]}, 
                {tag: "div", attrs: {className:"notify-body"}, children: [
                    "- Ship nội thành: 10,000Đ -", 
                    {tag: "br", attrs: {}}, 
                    {tag: "br", attrs: {}}, 
                    "Miễn phí tiền ship với đơn hàng trên 200,000Đ (HN), trên 500,000Đ (TQ)"
                ]}
            ]}, 
            {tag: "div", attrs: {className:"saleWr "}, children: [
                {tag: "h3", attrs: {}, children: ["SẢN PHẨM KHUYẾN MÃI"]}, 
                (ctrl.products().length<1)?(
                    ""
                ):(
                    {tag: "div", attrs: {className:"listSale"}, children: [
                        ctrl.products().map(function(item){
                            return (
                                {tag: "div", attrs: {className:"saleWr clearfix"}, children: [
                                    {tag: "div", attrs: {className:"sale-info"}, children: [
                                        {tag: "div", attrs: {className:"sale-name"}, children: [item.core.name]}, 
                                        {tag: "div", attrs: {className:"sale-price"}, children: [
                                            fn.price((item.extra.saleOff2>0)?(item.core.price[0].price -item.extra.saleOff2):(
                                                (100 - item.extra.saleOff1)* (item.core.price[0].price) /100
                                            )), " Đ"
                                        ]}, 
                                        {tag: "div", attrs: {className:"old-price"}, children: [ fn.price(item.core.price[0].price), " Đ"]}
                                    ]}, 
                                    {tag: "div", attrs: {className:"sale-img"}, children: [
                                        {tag: "img", attrs: {src:item.info.image[0].thumb, alt:""}}
                                    ]}
                                ]}

                            )
                        })
                    ]}
                )
            ]}
        ]}
    )
};

module.exports = Right;

},{"../../core/fn.msx":3}]},{},[4])