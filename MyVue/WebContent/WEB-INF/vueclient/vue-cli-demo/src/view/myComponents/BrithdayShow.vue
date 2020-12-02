<template>
  <div style="text-align:center">
    <img :src="imgdata"/>
    <button disabled>
      ({{timeOut}} S)
    </button>
  </div>
</template>

<script>
export default {
  name: 'BrithdayShow',
  props: {
    imgdata:{
      type:String
    }
  },
  data(){
    return{
      timeOut:20,
      timeTask:null
    }
  },
  mounted(){
    this.timeTask=setInterval(()=> {
      this.timeOut=this.timeOut-1;
      console.info(this.timeOut)
      if(this.timeOut==0){
        //关闭
        clearInterval(this.timeTask);
        this.$emit('closeBrithday');
      }
    },1000)
  }
};
</script>
