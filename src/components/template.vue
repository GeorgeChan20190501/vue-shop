<template>
    <div>
        <el-breadcrumb separator-class="el-icon-arrow-right">
                <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
                <el-breadcrumb-item>商品管理</el-breadcrumb-item>
                <el-breadcrumb-item>分类参数</el-breadcrumb-item>
        </el-breadcrumb>
        <el-card class="box-card">
                  <el-alert title="注意：只允许为第三级分类设置相关参数！"  type="warning"> </el-alert>
        </el-card>    
    </div>
</template>

<script>
export default {
    data(){
       return{
           
       }
    },
    created(){

    },
    methods:{

    }

}
</script>

<style lang="less" scoped>

</style>