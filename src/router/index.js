import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'index',
      component: () =>
        import ('@/index')
    },
    {
      path: '/layout',
      name: 'layout',
      component: () =>
        import ('@/views/layout/layout'),
      children: [{
          /*数据库数据*/
          path: 'dataChoose',
          name: 'dataChoose',
          component: () =>
            import ('@plat/dataChoose')
        },
        {
          /*多维数据*/
          path: 'cube',
          name: 'cube',
          component: () =>
            import ('@plat/cubeShow')
        },
        {
          /*echarts实例展示区*/
          path: 'echartsShow',
          name: 'echartsShow',
          component: () =>
            import ('@plat/echartsShow')
        },
        {
          /*报表中心*/
          path: 'reportCenter',
          name: 'reportCenter',
          component: () =>
            import ('@plat/reportCenter')
        }
      ]
    }
  ]
})
