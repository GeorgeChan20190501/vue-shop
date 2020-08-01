import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'
import Home from '../components/Home.vue'
Vue.use(VueRouter)

const routes = [{
        path: '/',
        redirect: "/login"
    },
    { path: '/login', component: Login },
    { path: '/home', component: Home }
]

const router = new VueRouter({
    routes
})

router.beforeEach((to, form, next) => {
    //to 要到那个路径
    //FROM 从那个路径过来
    //next 放行，强制跳转
    if (to.path === '/login') return next();
    const tokenStr = window.sessionStorage.getItem("token")
    if (!tokenStr) return next('/login')
    next();
})

export default router