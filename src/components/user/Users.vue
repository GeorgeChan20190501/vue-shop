<template>
    <div>
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>用户管理</el-breadcrumb-item>
            <el-breadcrumb-item>用户列表</el-breadcrumb-item>
        </el-breadcrumb>

        <el-card class="box-card">
             
              <el-row :gutter="20">
                    <el-col :span='8'>

                         <el-input placeholder="请输入内容"  v-model="getParam.query"  class="input-with-select" clearable @clear='getUserList'>         
                            <el-button slot="append" icon="el-icon-search" @click='getUserList'></el-button>
                         </el-input>
                    </el-col>
                    <el-col :span='4'>

                              
                            <el-button  type="primary" @click="dialogVisible=true">添加用户</el-button>
                         
                    </el-col>
              </el-row>  

            
        <el-table :data="userList"  border  stripe style="width: 100%">
            <el-table-column
                type="index"
                label="#"
                 >
            </el-table-column>
            <el-table-column
                prop="username"
                label="姓名"
                width="120">
            </el-table-column>
            <el-table-column
                prop="email"
                label="邮箱"
                width="180">
            </el-table-column>
            <el-table-column min-width="120"
                prop="mobile"
                label="电话">
            </el-table-column>
            <el-table-column min-width="90"
                prop="role_name"
                label="角色">
            </el-table-column>
            <el-table-column
                prop="mg_state"
                label="状态">
                <template slot-scope="scope">
                    <el-switch
                        v-model="scope.row.mg_state" @change="userStateChange(scope.row)"
                         >
                    </el-switch>
                </template>
            </el-table-column>
            <el-table-column  label="操作" min-width="180">
                 <template slot-scope="scope">
                     <el-tooltip  :enterable="false" effect="dark"  content="编辑" placement="top-start">
                        <el-button type="primary" size="mini" icon="el-icon-edit" circle @click="updateUser(scope.row.id)"></el-button>
                     </el-tooltip>
                      <el-tooltip   effect="dark"  content="删除" placement="top-start">
                     <el-button type="danger" size="mini" @click="open(scope.row.id)" icon="el-icon-delete" circle></el-button>
                     </el-tooltip>
                      <el-tooltip   effect="dark" content="授权" placement="top-start">
                     <el-button type="warning" size="mini" icon="el-icon-setting" circle></el-button>
                     </el-tooltip>
                </template>
            </el-table-column>
        </el-table>

    <el-pagination  @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="getParam.pagenum"
      :page-sizes="[1, 2, 5, 10]"
      :page-size="getParam.pagesize"
      layout=" prev, pager, next, jumper, sizes,total"
      :total="totalPage">
    </el-pagination>

 
        </el-card>

        <el-dialog
                title="添加用户"
                :visible.sync="dialogVisible"
                width="50%"
                @close="addUserClosed"
                >
                
                
<el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="70px">
  <el-form-item label="用户名" prop="username">
    <el-input v-model="addForm.username"></el-input>
  </el-form-item>
  <el-form-item label="密码" prop="password">
    <el-input v-model="addForm.password"></el-input>
  </el-form-item>
  <el-form-item label="邮箱" prop="email">
    <el-input v-model="addForm.email"></el-input>
  </el-form-item>
  <el-form-item label="手机" prop="mobile">
    <el-input v-model="addForm.mobile"></el-input>
  </el-form-item>

</el-form>


                <span slot="footer" class="dialog-footer">
                    <el-button @click="dialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="addUser" >确 定</el-button>
                </span>
        </el-dialog>


       <el-dialog
                title="修改用户"
                :visible.sync="updatedialogVisible"
                width="50%"
                 
                >
                
                
<el-form :model="updateForm"   ref="updateFormRef" label-width="70px">
  <el-form-item label="用户名" prop="username" >
    <el-input v-model="updateForm.username" disabled> </el-input>
  </el-form-item>
   
  <el-form-item label="邮箱" prop="email">
    <el-input v-model="updateForm.email"></el-input>
  </el-form-item>
  <el-form-item label="手机" prop="mobile">
    <el-input v-model="updateForm.mobile"></el-input>
  </el-form-item>

</el-form>


                <span slot="footer" class="dialog-footer">
                    <el-button @click="updatedialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="updateUser1" >确 定</el-button>
                </span>
 </el-dialog>

    </div>
</template>

<script>
export default {
   data(){
       var checkEmail =(rule,value,cb)=>{
           const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/

           if(regEmail.test(value)){
               return cb();
           }
           cb(new Error('请输入合法邮箱'))
       }

       var checkMobile =(rule,value,cb)=>{
           const regMobile = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/

           if(regMobile.test(value)){
               return cb();
           }
           cb(new Error('请输入合法手机号'))
       }
       return{
           getParam:{
               query:'',
               pagenum:1,
               pagesize:2
           },
           
           userList:[],
           totalPage:0,
           dialogVisible:false,
           updatedialogVisible:false,
           addForm:{
               username:'',
               password:'',
               email:'',
               mobile:''

           },
           updateForm:{
               username:'',
               email:'',
               mobile:''

           },
           addFormRules:{
               username:[
                   { required: true, message: '请输入姓名', trigger: 'blur' },
                   { min: 3, max: 10, message: '长度在 3 到 5 个字符', trigger: 'blur' }
               ],
               password:[
                   { required: true, message: '请输入密码', trigger: 'blur' },
                    { min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur' }
               ],
               email:[
                   { required: true, message: '请输入邮箱', trigger: 'blur' },
                   {validator:checkEmail,trigger:'blur'}
               ],
               mobile:[
                   { required: true, message: '请输入手机', trigger: 'blur' },
                   { validator:checkMobile,trigger:'blur'}
               ]
           }
       }
   },
   created(){
       this.getUserList();
   },
   methods:{
       open(id) {
        this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
           const {data:res}=await this.$http.delete('users/'+id)
           if(res.meta.status!=200){
               return this.$message.error('删除失败')
           }
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
          this.getUserList();
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
      },
       async updateUser(id){
           console.log(id)
           const {data: res} =await this.$http.get('users/'+id)
            if(res.meta.status!==200) return this.$message.error('获取用户失败')
            console.log(res)
            this.updateForm=res.data
            this.updatedialogVisible=true;
       },
        async getUserList(){
            const {data: res} =await this.$http.get('users',{params: this.getParam})
            if(res.meta.status!==200) return this.$message.error('获取用户列表失败')
            console.log(res)
             
            this.userList=res.data.users;
            this.totalPage=res.data.total;
        } ,
        handleSizeChange(newsize){
            console.log(newsize)
            this.getParam.pagesize=newsize;
            this.getUserList();
        }
        ,
        handleCurrentChange(newpage){
            console.log(newpage)
            this.getParam.pagenum=newpage;
            this.getUserList();
        },
        async userStateChange(row){

        console.log(row);
           const {data: res} = await this.$http.put(`users/${row.id}/state/${row.mg_state}`)
            if(res.meta.status!==200) {
            row.mg_state=!row.mg_state
            return this.$message.error('用户状态失败')
            }
            this.$message.success('用户状态更新成功')
        },
        addUserClosed(){
            this.$refs.addFormRef.resetFields();
        },
         addUser(){
            this.$refs.addFormRef.validate(async valid=>{
                console.log(valid)
                if(!valid) return;
                //添加用户开始
               const {data: res} =  await this.$http.post('users',this.addForm)
                if(res.meta.status!==201) {
                
                return this.$message.error('用户添加失败')
            }
            this.$message.success('用户添加成功')
            this.dialogVisible=false;
            this.getUserList();
           })
        }
        ,
         async updateUser1(){
            
                //添加用户开始
               const {data: res} =  await this.$http.put('users/'+this.updateForm.id,{email:this.updateForm.email,mobile:this.updateForm.mobile})
                if(res.meta.status!==200) {
                
                return this.$message.error('用户修改失败')
            }
            this.$message.success('用户修改成功')
            this.dialogVisible=false;
            this.getUserList();
           
        }
   }
}
</script>

<style lang="less" scoped>

</style>
