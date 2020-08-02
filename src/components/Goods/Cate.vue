<template>
    <div>

        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>商品列表</el-breadcrumb-item>
        </el-breadcrumb>

        <el-card class="box-card"> 
             <el-button  type="primary" @click="addCate()" >添加分类</el-button>

        <tree-table :data="catalist" border :columns="columns" show-index index-text="#" :expand-type="false" :selection-type="false">
                <template slot="isok"  slot-scope="scope">
                    <i style="color:green" class="el-icon-success" v-if="scope.row.cat_deleted === false"></i>
                    <i style="color:red"  class="el-icon-error" v-else></i>
                </template>

                 <template slot="order"  slot-scope="scope">
                    <el-tag size="mini" v-if="scope.row.cat_level===0">一级</el-tag>
                    <el-tag size="mini"  type="success" v-else-if="scope.row.cat_level===1">二级</el-tag>
                    <el-tag size="mini"  type="warning" v-else>三级</el-tag>
                </template>
                
                 <template slot="opt"  slot-scope="scope">
                    <el-button type="primary" size="mini" icon="el-icon-edit">编辑</el-button>
                    <el-button type="danger" size="mini" icon="el-icon-delete">删除</el-button>
                </template>
        </tree-table>

           <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="queryInfo.pagenum"
                :page-sizes="[3, 5, 10, 15]"
                :page-size="queryInfo.pagesize"
                layout=" prev, pager, next, jumper, sizes,total"
                :total="total">
    </el-pagination>
        </el-card>  

        <el-dialog
            title="添加分类"
            :visible.sync="catedialogVisible"
            width="50%"
            @close="closeCade"
             >
            <el-form ref="aformRef" :model="addCateform" label-width="80px">
                <el-form-item label="分类名称">
                    <el-input v-model="addCateform.cat_name"></el-input>
                </el-form-item>
                <el-form-item label="父级分类">
                      <el-cascader
                            
                            v-model="selectedKeys"
                            :options="parentCateList"
                            :props="cascaderProps"
                            @change="handleChange"
                            clearable
                            change-on-select
                            
                            >
                        </el-cascader>
                </el-form-item>
           </el-form>  

            <span slot="footer" class="dialog-footer">
                <el-button @click="catedialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="addCate1">确 定</el-button>
            </span>
        </el-dialog> 
    </div>
</template>

<script>
export default {
    data(){
        return{
            catedialogVisible:false, 
            addCateform:{
                cat_name:'',
                cat_level:0,
                cat_pid:0
            },
            catalist:[],
            queryInfo:{
                type:3,
                pagenum:1,
                pagesize:5
            },
            total:0,
            columns:[{
                label:'分类名称',
                prop:'cat_name'
            },
            {
                label:'是否有效',
                type:'template',
                template:'isok'
            },
            {
                label:'排序',
                type:'template',
                template:'order'
            },
            {
                label:'操作',
                type:'template',
                template:'opt'
            }
            ],
            parentCateList:[],
            cascaderProps:{
                expandTrigger: 'hover',
                value:'cat_id',
                label:'cat_name',
                children:'children'
            },
            selectedKeys:[]
        }
    }
    ,created(){
        this.getCateList();
        
    },
    methods:{

        closeCade(){
            console.log('情况')
            this.$refs.aformRef.resetFields();
            
            this.selectedKeys=[];
            this.addCateform.cat_name=''
            this.addCateform.cat_level=0;
            this.addCateform.cat_pid=0;
        },
        async addCate1(){
           const {data:res} = await this.$http.post('categories',this.addCateform)
                if(res.meta.status!=201){
                    return this.$message.error('添加分类失败')
                }
                this.$message.success('添加分类成功')
                this.getCateList();
            
            
                this.catedialogVisible = false
        },
        handleChange(){
            console.log(this.selectedKeys)
            if(this.selectedKeys.length>0){
                this.addCateform.cat_pid=this.selectedKeys[this.selectedKeys.length-1]
                this.addCateform.cat_level=this.selectedKeys.length;
                return ;
            }
            else{
                 this.addCateform.cat_pid=0;
                 this.addCateform.cat_level
            }
        },
        addCate(){
            this.getParentCateList();
            
            this.catedialogVisible=true;
        },
        async getParentCateList(){
            const {data:res} = await this.$http.get('categories',{params:{type:2}})
                if(res.meta.status!=200){
                    return this.$message.error('获取父级分类失败')
                }
                this.parentCateList=res.data
       },
        handleSizeChange(newSize){
            this.queryInfo.pagesize=newSize;
            this.getCateList();
        },
        handleCurrentChange(newpage){
             this.queryInfo.pagenum=newpage;
             this.getCateList();
        },
        async getCateList(){
           const {data:res} =await this.$http.get('categories',{params:this.queryInfo})
            if(res.meta.status!==200){
                return this.$message.error('获取失败')
            }
            this.$message.success('获取成功')
            this.catalist=res.data.result;
            this.total=res.data.total;
        }
    }
}
</script>

<style lang="less" scoped>

</style>
