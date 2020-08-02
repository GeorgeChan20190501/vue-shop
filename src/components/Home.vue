<template>
       <el-container>
            <el-header>
                <div>
                    <img src="../assets/shop.jpg">
                    <span>AMS商城</span>
                </div>
                <el-button @click="logout"> 退出 </el-button>
            </el-header>
            <el-container>
                <el-aside :width="isCollapse ? '64px':'200px'">
                  <div class="toggle-button" @click="toggle1">| | |</div>  
                 <el-menu
                    background-color="#333744"
                    text-color="#fff"
                    active-text-color="#409EFF"
                    :default-active="activePath"
                    :router="true"
                    :unique-opened="true"  :collapse="isCollapse" :collapse-transition="false">
                    <el-submenu :index="item.path+''" v-for="item in menuList" :key='item.id'>
                        <template slot="title">
                            <i :class="iconsObj[item.id]"></i>
                            <span>{{item.authName}}</span>
                        </template>
                        <el-menu-item @click="saveNavState('/'+item1.path)" :index="'/'+item1.path" v-for="item1 in item.children" :key="item1.id">
                            <template slot="title">
                                <i class="el-icon-menu"></i>
                                <span>{{item1.authName}}</span>
                             </template>
                        </el-menu-item>
                    </el-submenu>
                    </el-menu>
                </el-aside>
                <el-main>
                    <router-view></router-view>
                </el-main>
            </el-container>
        </el-container>
</template>

<script>
export default {
    data(){
        return{
            menuList:[],
            iconsObj:{
                125:'el-icon-s-help',
                103:'el-icon-camera-solid',
                101:'el-icon-s-promotion',
                102:'el-icon-s-opportunity',
                145:'el-icon-s-data'
            },
            isCollapse: false,
            activePath:''
        }
    },
    methods:{
        logout(){
            window.sessionStorage.clear;
            this.$router.push('/login')
        },
        async getMenuList(){
            const {data:res}=await this.$http.get('menus')
            console.log(res)
            if(res.meta.status!==200){
                return this.$message.error(res.meta.msg)
            }

            this.menuList=res.data
        },
        toggle1(){
   
            this.isCollapse=!this.isCollapse;
        },
        saveNavState(path){
            window.sessionStorage.setItem('activePath',path);
            this.activePath=path;
        }
    },
    created(){
        this.getMenuList();
        this.activePath=window.sessionStorage.getItem('activePath')
    }
}
</script>

<style lang="less" scoped>
.el-header{
    background: #373d41;
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: #fff;
    font-size: 20px;
    > div{
        display: flex;
        align-items: center;
        span{
            margin-left: 20px;
        }
    }


}
.el-aside{
    background: #373744;
    
    .el-menu{
        border-right:none;
    }
    .toggle-button{
        background: #4a5064;
        font-size:10px;
        color:#fff;
        text-align: center;
        cursor: pointer;
        padding: 5px;
    }
}
.el-main{
    background: #fff;
}
.el-container{
    height: 100%;
}
</style>