## 项目说明
这是一个基于Vue2.X+Vue-router2.X+vue-resource1.X的后台管理项目

## 项目结构
    ├── build/                   - webpack相关配置
    ├── config/                  - webpack相关配置
    ├── dist/                    - 采购通打包输出文件夹
    │   ├── index.html           - 采购通打包输出首页
    │   ├── static/              - 采购通打包输出静态文件文件夹
    │       ├── css/             - 样式文件夹
    │       ├── img/             - 图片文件夹
    │       ├── js/              - js文件夹
    ├── src/                     - 采购通源代码目录
    │   ├── assets/              - 需要webpack处理的静态文件
    │   ├── components/          - 公共组件文件夹
    │   ├── router/              - 路由
    │   ├── services/            - API地址
    |   ├── style/               - scss样式文件夹
    |   ├── views/               - 页面文件夹
    |   ├── App.vue              - vue视图模板公共入口
    |   ├── main.js              - Vue公共入口
    |   ├── config.js            - 配置文件
    ├── static/                  - 不需要webpack处理的静态文件
    ├── .babelrc                 - babel配置
    ├── .editorconfig            - 代码规范
    ├── .eslintignore            - ESLint忽略的文件夹
    ├── .eslintrc.js             - ESLint配置
    ├── .gitignore               - git管理文件的配置
    ├── .postcssrc.js            - postcss配置
    ├── index.html               - 采购通首页
    ├── package.json             - 项目包依赖
    ├── README.md                - 项目说明文件

## 项目初始化
    > 1.windows环境下，Win+R 在项目目录下 执行 npm install
    > PS：如果配置了cnpm ，请用cnpm，你懂的
    > 2.开发执行 npm run start
    > 3.发布执行 npm run build

## 项目技术

### Vue2.2.2
    https://cn.vuejs.org/
### vue-router2.3.0
    https://router.vuejs.org/zh-cn/
### vue-resource1.3.1
    https://github.com/pagekit/vue-resource
### jQuery3.2.1
    https://api.jquery.com/

## 特别说明

作为开发人员，有必要且有义务维护项目代码质量，在日常开发中发现项目中若有代码不规范的地方，应该及时修正，通过大家一起努力才能将整个项目代码质量提高，
在开发的过程中也应该尽量按照规范进行编码，不能将别人已规范化的代码，改成非规范化的代码。如果你对项目有更好的建议，请联系我(E-Mail:chenlong8520@foxmail.com)

