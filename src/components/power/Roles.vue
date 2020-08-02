<template>
    <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>权限管理</el-breadcrumb-item>
            <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>

       <el-card class="box-card">
           <el-row>
                <el-col>
                    <el-button type="primary" @click="dialogVisible=true" >添加角色</el-button>
                </el-col>    
            </el-row>   
            <el-table :data="rolesList" border stripe>
                <el-table-column type="expand">
                    <template slot-scope="scope">
                        <el-row :class="['bdbottom',i1===0?'bdtop':'','vcenter']" v-for="(item1,i1) in scope.row.children" :key="item1.id">
                            <el-col :span="5" >

                                    <el-tag>{{item1.authName}}</el-tag>
                                    <i class="el-icon-caret-right"></i>
                            </el-col>
                            <el-col :span="19">
                              <el-row  :class="['bdbottom','vcenter']"  v-for="(item2,i2) in item1.children" :key="item2.id">
                            <el-col :span="6">

                                    <el-tag type="success">{{item2.authName}}</el-tag>
                                    <i class="el-icon-caret-right"></i>
                            </el-col>
                                <el-col :span="18">
                                    <el-tag type="warning" closable @close="remoteRight(scope.row,item3.id)" v-for="(item3) in item2.children" :key="item3.id">
                                        {{item3.authName}}</el-tag>                 
                                </el-col>
                            </el-row>
                                 
                            </el-col>
                        </el-row>
                     
                    </template>
                </el-table-column>
                <el-table-column type="index" label="#"></el-table-column>
                <el-table-column label="角色名称" prop="roleName"></el-table-column>
                <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
                <el-table-column label="操作"   min-width="300px">
                    <template slot-scope="scope">
                        <el-button type="primary" icon="el-icon-edit" size="mini"  @click="updateRole(scope.row.id)" >编辑 </el-button>
                        <el-button type="danger" icon="el-icon-delete"  @click="open(scope.row.id)" size="mini">删除</el-button>
                        <el-button type="warning" icon="el-icon-setting"  size="mini" @click="showSetRightlog(scope.row)">分配权限</el-button>
                    </template>       
                </el-table-column>
             </el-table>    
        </el-card>  


       <el-dialog
                title="修改角色"
                :visible.sync="updatedialogVisible"
                width="50%"
                 
                >
        <el-form :model="updateForm"   ref="updateFormRef" label-width="70px">
 
   <el-form-item label="角色ID" prop="roleName" >
    <el-input v-model="updateForm.roleId" disabled> </el-input>
  </el-form-item>
  <el-form-item label="角色名称" prop="roleName" >
    <el-input v-model="updateForm.roleName"> </el-input>
  </el-form-item>
   
  <el-form-item label="角色描述" prop="roleDesc">
    <el-input v-model="updateForm.roleDesc"></el-input>
  </el-form-item>
 

</el-form>


                <span slot="footer" class="dialog-footer">
                    <el-button @click="updatedialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="updateUser1" >确 定</el-button>
                </span>
 </el-dialog>


<el-dialog title="分配权限"  @close="setRightClosed" :visible.sync="setRightDialogVisible"  width="50%" >
 
    <el-tree :data="rightList" :props="treeProps" show-checkbox node-key="id" 
    :default-expand-all="true" :default-checked-keys="defkeys" ref="treeRef">

    </el-tree>   
    <span slot="footer" class="dialog-footer">
        <el-button @click="setRightDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="setRight()" >确 定</el-button>
    </span>
 </el-dialog>


         <el-dialog
                title="添加用户"
                :visible.sync="dialogVisible"
                width="50%"
                
                >
                
                
<el-form :model="addForm"  ref="addFormRef" label-width="70px">
 
  <el-form-item label="角色名称" >
    <el-input v-model="addForm.roleName"></el-input>
  </el-form-item>
  <el-form-item label="角色描述"  >
    <el-input v-model="addForm.roleDesc"></el-input>
  </el-form-item>
 

</el-form>


                <span slot="footer" class="dialog-footer">
                    <el-button @click="dialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="addRole" >确 定</el-button>
                </span>
        </el-dialog>
    </div>
</template>

<script>
export default {
   data(){
       return{
           updatedialogVisible:false,
           dialogVisible:false,
           setRightDialogVisible:false,
           rolesList:[],
           updateForm:{
               roleId:'',
               roleName:'',
               roleDesc:''

           },
            addForm:{
               roleId:'',
               roleName:'',
               roleDesc:''

           },
           treeProps:{
               label:'authName',
               children:'children'

           },
           defkeys:[
               105,116
           ],
           rightList:[],
           roleId:'',
       }
   },
    created(){
       this.getRoleList();
   },
    methods:{
           getLeafKyes(node,arr){
              if(!node.children){
                  return arr.push(node.id)
              }
              node.children.forEach(item=>{
                  this.getLeafKyes(item,arr)
              })  
 
        },
        async showSetRightlog(row){
            this.roleId=row.id;
            const {data:res}=await this.$http.get('rights/tree')
            if(res.meta.status!=200){
                return this.$message.error('获取权限失败')
            }
            this.rightList=res.data;
            console.log(this.rightList)
            this.getLeafKyes(row,this.defkeys);
            this.setRightDialogVisible=true;
            
        },
        remoteRight(row,rightId){
            //弹框提示
          this.$confirm('此操作将永久删除该权限, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
           const {data:res}=await this.$http.delete(`roles/${row.id}/rights/${rightId}`)
           if(res.meta.status!=200){
               return this.$message.error('删除失败')
           }
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
          row.children=res.data;
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });

        },
        async getRoleList(){
            const {data:res} = await this.$http.get('roles')
            if(res.meta.status!=200){
                return this.$message.error('获取失败');
            }
            this.rolesList=res.data;
            
        },
         open(id) {
        this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
           const {data:res}=await this.$http.delete('roles/'+id)
           if(res.meta.status!=200){
               return this.$message.error('删除失败')
           }
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
          this.getRoleList();
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
      },
       async updateRole(id){
           console.log(id)
           const {data: res} =await this.$http.get('roles/'+id)
            if(res.meta.status!==200) return this.$message.error('更新角色失败')
            console.log(res)
            this.updateForm=res.data
            this.updatedialogVisible=true;
       },
         async updateUser1(){
            
                //添加用户开始
               const {data: res} =  await this.$http.put('roles/'+this.updateForm.roleId,{roleName:this.updateForm.roleName,roleDesc:this.updateForm.roleDesc})
                if(res.meta.status!==200) {
                
                return this.$message.error('角色修改失败')
            }
            this.$message.success('角色修改成功')
            this.dialogVisible=false;
            this.getRoleList();
           
        },
         async addRole(){
             
                 
                
                //添加用户开始
               const {data: res} =  await this.$http.post('roles',this.addForm)
                if(res.meta.status!==201) {
                
                return this.$message.error('角色添加失败')
            }
            this.dialogVisible=false;
            this.$message.success('角色添加成功')
            
            this.getRoleList();
           
        }
        ,
        setRightClosed(){
            this.defkeys=[]
        },
        async setRight(){

            const keys=[
                ...this.$refs.treeRef.getCheckedKeys(),
            ...this.$refs.treeRef.getHalfCheckedKeys()
            ];
            const idstr=keys.join(',');

            console.log("即将分配权限"+keys)
            const {data: res} =  await this.$http.post(`roles/${this.roleId}/rights`,{rids:idstr})
            if(res.meta.status!==200) {
                
                return 
                this.$message.error('角色分配失败')
            }
            this.$message.success('角色分配成功')
            this.getRoleList();
            this.setRightDialogVisible=false;
        }
    }
}
</script>

<style lang="less" scoped>
.el-tag{
    margin:7px;
}
.bdtop{
    border-top: 1px solid #eee;
}
.bdbottom{
    border-bottom: 1px solid #eee;
}
.vcenter{
    display: flex;
    align-items: center;
}
</style>
