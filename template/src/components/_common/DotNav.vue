<template>
  <div class="dot-nav">
    <div
      class="dot"
      v-if="total > 1"
      v-for="dot in total"
      :class="{ 'active': $index + 1 === current }">
    </div>
  </div>
</template>

<script>
export default {
  props: {
    current: {
      type: Number,
      required: true,
    },
    total: {
      type: Number,
      required: true,
    },
  },
};
</script>

<style lang="scss" scoped>
@import '../../mixins/scss/main';

.dot-nav {
  pointer-events: none;
  display: flex;
  align-items: center;
  justify-content: center;

  .dot {
    border-radius: 50%;
    background: rgba(#fff, 0.5);
    width: $s * 10;
    height: $s * 10;
    margin-right: $s * 13;

    &:last-child {
      margin-right: 0;
    }

    &.active {
      background: #fff;
      width: $s * 12;
      height: $s * 12;
    }
  }

  &.dark {
    .dot {
      background-color: rgba(#000, 0.5);

      &.active {
        background-color: #000;
      }
    }
  }
}
</style> 