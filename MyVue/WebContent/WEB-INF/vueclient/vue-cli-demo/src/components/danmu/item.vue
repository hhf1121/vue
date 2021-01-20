<template>
  <div ref="myself" class="item" :style="style" ><p v-if="danmu.isMe" style="border: 1px solid #f547dd;color: #8e34ff">{{danmu.text}}</p><p v-else style="color: #43a6ff">{{danmu.text}}</p></div>
</template>

<script type="text/ecmascript-6">
  export default{
    name:'item',
    props: {
      danmu: {}
    },
    data() {
      return {
        start: this.danmu.begin,
        isEmit: false
      }
    },
    created: function () {
      this.$nextTick(() => {
        this.move();
      })
    },
    computed: {
      style: function () {
        return {
          left: this.start + 'px',
          top: this.danmu.top + 'px',
          opacity: this.danmu.opacity
        };
      },
      speed: function () {
        return this.danmu.speed;
      },
      width: function () {
        return this.$refs.myself.offsetWidth;
      }
    },
    methods: {
      move: function () {
        setInterval(() => {
          this.start = this.start - this.speed;
//          弹幕完全进入
          if ((this.start + this.width - this.danmu.begin) < this.speed && (this.start + this.width - this.danmu.begin) >= 0) {
            this.$emit('enter', this.danmu.top);
          }
//          弹幕退出
          if (this.start < (this.danmu.end - this.width) && !this.isEmit) {
            this.$emit('remove', this.danmu);
            this.isEmit = true;
          }
        }, 17);
      }
    }
  }
</script>

<style scoped >
  .item{
    position: absolute;
    height: 30px;
    font-size: 20px;
    line-height: 20px;
    vertical-align: top;
    /*font-weight: 800;*/
    color: #222;
    white-space: nowrap;
    z-index: 100;
  }

</style>
