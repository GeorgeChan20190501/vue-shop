<template>
    <div>
        <el-breadcrumb separator-class="el-icon-arrow-right">
                <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
                <el-breadcrumb-item>商品管理</el-breadcrumb-item>
                <el-breadcrumb-item>分类参数</el-breadcrumb-item>
        </el-breadcrumb>
        <el-card class="box-card">
                 
                  <el-alert show-icon title="注意：只允许为第三级分类设置相关参数！"  type="warning" :closable="false">  </el-alert>
            <el-row class="cat_opt">
                <el-col>
                        选择商品分类：

                         <el-cascader  v-model="value" 
                         :options="cateList"
                          :props="cateProps"
                           @change="handleChange1">
                        </el-cascader>
                 </el-col>
            </el-row>  

              <el-tabs v-model="activeName" @tab-click="handleTabClick">
                    <el-tab-pane label="动态参数" name="many">
                        
                         <el-button :disabled="isDisabled" type="primary" size="mini">添加属性</el-button>
                   
                    <el-table :data="manyTabData" border stripe>
                        <el-table-column type="expand"  ></el-table-column>
                        <el-table-column type="index" label="#"></el-table-column>
                        <el-table-column label="参数名称" prop="attr_name"></el-table-column>
                        <el-table-column label="操作"  >
                            <template slot-scope="scope">
                                     <el-button   type="primary" icon="el-icon-edit" size="mini">编辑</el-button>
                                      <el-button   type="danger" icon="el-icon-delete"  size="mini">删除</el-button>
                            </template>    
                        </el-table-column>
                    </el-table> 
                    </el-tab-pane>
                    <el-tab-pane label="静态属性" name="only">
                         <el-button :disabled="isDisabled" type="primary" size="mini">添加属性</el-button>
                         <el-table :data="onlyTabData" border stripe>
                        <el-table-column type="expand"  ></el-table-column>
                        <el-table-column type="index" label="#"></el-table-column>
                        <el-table-column label="属性名称" prop="attr_name"></el-table-column>
                        <el-table-column label="操作"  >
                            <template slot-scope="scope">
                                     <el-button   type="primary" icon="el-icon-edit" size="mini">编辑</el-button>
                                      <el-button   type="danger" icon="el-icon-delete"  size="mini">删除</el-button>
                            </template>    
                        </el-table-column>
                    </el-table> 
                   
                    </el-tab-pane>
                   
               </el-tabs> 
        </el-card>    
    </div>
</template>

<script>
export default {
    data(){
       return{
           cateList:[],
           value:[],
           cateProps:{ 
               expandTrigger: 'hover' ,
               value:'cat_id',
               label:'cat_name',
               children:'children'
           },
           activeName:'many',
            onlyTabData:[],
            manyTabData:[]
       }
    },
    computed:{
        isDisabled(){
            if(this.value.length!=3){
                return true;
            }
            return false;
        },
        cateId(){
            if(this.value.length===3){
                return this.value[2];
            }
            return null
        }
    },
    created(){
        this.getCateList();
    },
    methods:{
         
        async getParamesList(){
            if(this.value.length!=3){
                this.value=[];
                return
            }
            const {data:res} = await this.$http.get(`categories/${this.cateId}/attributes`,{params:{sel:this.activeName}})
            if(res.meta.status!=200){
                return this.$message.error('获取商品分类失败');
            }
            console.log("选了3"+res.data)

            if(this.activeName=='many'){
                this.manyTabData=res.data;
            }
            else{
                this.onlyTabData=res.data;
            }
        },
        handleTabClick(){
             this.getParamesList()
        },
         handleChange1(){
            this.getParamesList()
        },
        async getCateList(){
            const {data:res} = await this.$http.get('categories')
            if(res.meta.status!=200){
                return this.$message.error('获取商品分类失败');
            }
            this.cateList=res.data;
          
        },
    }

}
</script>

<style lang="less" scoped>
.cat_opt{
    margin-top: 15px;;
}
</style>