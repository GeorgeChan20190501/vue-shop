<template>
  <div class="login_container">
     <div class="login_box">
        <div class="avatar_box">
            <img src="../assets/logo.png"/>
        </div>
        <el-form  ref="loginFormRef" :model="loginForm" :rules="loginRule" class="login_form">
            <el-form-item prop="username">
                 <el-input prefix-icon="el-icon-s-custom" v-model="loginForm.username"></el-input>
            </el-form-item>
            <el-form-item prop="password">
                <el-input prefix-icon="el-icon-view" type="password" v-model="loginForm.password"></el-input>
            </el-form-item>
            <el-form-item class="btns">
                <el-button type="primary" @click="login">登录</el-button>
                <el-button type="info" @click="resetFrom">重置</el-button>
            </el-form-item>
    
        </el-form>    
    </div>
  </div>
</template>

<script>
export default {
   data(){
       return {
           loginForm:{
                username:'admin',
                password:'123456'
           },
           loginRule:{
               username:[
                   { required: true, message: '请输入姓名', trigger: 'blur' },
                   { min: 3, max: 10, message: '长度在 3 到 5 个字符', trigger: 'blur' }
               ],
               password:[
                   { required: true, message: '请输入密码', trigger: 'blur' },
                    { min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur' }
               ]
           }
          
       }
   },
   methods:{
       resetFrom(){
           console.log(this.$refs.loginFormRef.resetFields())
       },
       login(){
           this.$refs.loginFormRef.validate(async valid=>{
              if(!valid) return;
              const {data:res} =await this.$http.post('login',this.loginForm)
       
              if(res.meta.status !=200){
                  return this.$message.error('登录失败')
              }
              this.$message.success('登录成功')
              window.sessionStorage.setItem('token',res.data.token)

              this.$router.push('/home')
          })
       }
   }

}
</script>

<style lang="less" scoped>
.login_container{
    background-color: #2b4b6b;
    height:100%;
}
.login_box{
     height:300px;
     width:450px;
     border-radius: 3px;
     background-color: #fff;
     position: absolute;
     left:50%;
     top:50%;
     transform: translate(-50%,-50%);

     .avatar_box{
         height:130px;
         width:130px;
         border: 1px solid #eee;
         border-radius: 50%;
         padding: 10px;
         box-shadow: 0 0 10px #ddd; 
         position: absolute;
         left:50%;
         background-color: #fff;
         transform: translate(-50%,-50%);
         img{
             height:100%;
             width:100%;
             border-radius: 50%;
             background: #eee;
         }
     }
     .btns{
         display: flex;
         justify-content: flex-end;
     }
     .login_form{
         position: absolute;
         bottom: 0;
         width: 100%;
         padding: 0 20px;
         box-sizing: border-box;
     }
}
</style>
