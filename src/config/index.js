export default {
  /**
   * @description 配置显示在浏览器标签的title
   */
  loginTitle: '企业项目开发骨架',  // 登陆背景显示的标题
  cmsTitle: '后台管理系统', // 登录后显示的标题
  copy_right:'Copyright © 2020-2021 www.ginskeleton.com, All rights reserved.',
  login_params:{
    user_name:'admin',
    pass:'ginskeleton'
  },
  /**
   * @description token在Cookie中存储的天数，默认1天
   */
  cookieExpires: 1,

  // 目前不支持国际化，请保持false
  useI18n: false,
  /**
   * @description api请求基础路径
   */
  baseUrl: {
    // npm run dev 有效
    dev_captcha: 'http://8.141.145.204:8201',
    dev: 'http://8.141.145.204:8201/admin',

    // npm run build 有效
    pro_captcha: 'http://139.196.101.31:8201',
    pro: 'http://139.196.101.31:8201/admin'
  },
  /**
   * @description 默认打开的首页的路由name值，默认为home
   */
  homeName: 'home',
  /**
   * @description 需要加载的插件
   */
  plugin: {
    'error-store': {
      showInHeader: true, // 设为false后不会在顶部显示错误日志徽标
      developmentOff: true // 设为true后在开发环境不会收集错误信息，方便开发中排查错误
    }
  },

  uploadPath: 'upload/files'
}
