<template>
  <div class="listen">
    <audio id="audio" autoplay muted>
      <source :src="msgUrl" type="audio/mp3">
    </audio>
  </div>
</template>

<script>
    export default {
      name: "MsgActive",
      props:{
            msgUrl:{
              type:String
            }
      },
      methods:{
        sing(){
          console.info(this.msgUrl);
          let audio = document.querySelector('#audio');
          audio.play();
        }
      },
      destroy(){

      },
      mounted(){

      }
    }
</script>

<style scoped>

</style>
