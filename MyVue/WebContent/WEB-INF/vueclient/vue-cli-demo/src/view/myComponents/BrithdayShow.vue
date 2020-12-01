<template>
  <div style="text-align:center">
    <img :src="imgdata"/>
  </div>
</template>

<script>
export default {
  name: 'BrithdayShow',
  props: {
    imgdata:{
      type:String
    }
  }
};
</script>
