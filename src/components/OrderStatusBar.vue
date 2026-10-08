<style lang="stylus" scoped>
@import '../styles/constants.styl'
@import '../styles/components.styl'
@import '../styles/utils.styl'
@import '../styles/fonts.styl'
@import '../styles/scrollbars.styl'

gap = 5px
height = 60px
bg = colorBgDark

.order-satus-bar-root
  page-root-disable()
  font-small()
  page-root()

  display flex
  flex-direction column
  gap gap
  width unset
  padding-block 10px
  background bg

  .consistent-statuses
  .special-statuses
    display flex
    gap gap
    width 100%

    .status-container
      position relative
      flex 1
      height height
      trans()
      &:hover
        &:not(:first-child)
          margin-left 10px
        &:not(:last-child)
          margin-right 10px

      .status
        cursor pointer
        width 100%
        height 100%
        padding 0 15px
        color colorTextInvert1
        img
          display none
          border-radius radiusMax
          background bg
          trans()
          &.done
            display block
          &.current
            padding 5px

        @media ({mobile})
          display flex
          flex-direction column
        svg-inside(30px)
        centered-flex-container()
        font-spaced()
        trans()

      &:not(:first-child)
        .status
          padding-left 30px

      &:not(:last-child)
        .arrow-colored
        .arrow-white
          content ''
          position absolute
          z-index 2
          top 0
          left 100%
          width 0
          height 0
          border-top (height / 2) solid transparent
          border-bottom (height / 2) solid transparent
          border-left (height / 2) solid
          trans()

        .arrow-white
          z-index 1
          left 'calc(100% + %s)' % gap
          border-left-color bg

      &.red
        .status
          background colorError
        .arrow-colored
          border-left-color colorError
      &.green
        .status
          background colorSuccess
        .arrow-colored
          border-left-color colorSuccess
      &.yellow
        .status
          background colorEmp1
        .arrow-colored
          border-left-color colorEmp1
      &.blue
        .status
          background colorEmp2
        .arrow-colored
          border-left-color colorEmp2
      &.gray
        .status
          background colorTextInvert4
        .arrow-colored
          border-left-color colorTextInvert4

      &.active
        img.current
          display block
        img.done
          display none
      &.not-active
      &.active ~ *
        img.done
          display none

      &.active ~ *:not(:hover)
      &.not-active:not(:hover):not(.active)
        &.red
          .status
            background mix(colorError, bg)
          .arrow-colored
            border-left-color mix(colorError, bg)
        &.green
          .status
            background mix(colorSuccess, bg)
          .arrow-colored
            border-left-color mix(colorSuccess, bg)
        &.yellow
          .status
            background mix(colorEmp1, bg)
          .arrow-colored
            border-left-color mix(colorEmp1, bg)
        &.blue
          .status
            background mix(colorEmp2, bg)
          .arrow-colored
            border-left-color mix(colorEmp2, bg)
        &.gray
          .status
            background mix(colorTextInvert4, bg)
          .arrow-colored
            border-left-color mix(colorTextInvert4, bg)

    @media ({mobile})
      flex-wrap wrap
</style>

<template>
  <section class="order-satus-bar-root">
    <div class="consistent-statuses">
      <div 
        class="status-container"
        v-for="(s, key) in ConsistentOrderStatuses" 
        :class="{
          [s.color]: true,
          active: key === status,
          'not-active': SPECIAL_ORDER_STATUSES.includes(status),
        }"
      > 
        <div
          class="status" 
          :title="`Изменить статус заказа на '${s.title}'`"
          @click="onClickStatus(key as OrderStatus)"
        >
          <img src="/static/icons/ok.svg" class="done" alt="done">
          <img src="/static/icons/location.svg" class="current" alt="done">
          {{ s.title }}
        </div>
        <div class="arrow-white" />
        <div class="arrow-colored" />
      </div>
    </div>

    <div class="special-statuses">
      <div 
        class="status-container not-active"
        v-for="(s, key) in SpecialOrderStatuses" 
        :class="{
          [s.color]: true,
          active: key === status,
        }"
      > 
        <div 
          class="status" 
          :title="`Изменить статус заказа на '${s.title}'`"
          @click="onClickStatus(key as OrderStatus)"
        >
          <img src="/static/icons/location.svg" class="current" alt="done">
          {{ s.title }}
        </div>
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import {PropType} from "vue";
import { OrderStatuses } from "~/constants";
import { OrderStatus } from "~/utils/models";

const SPECIAL_ORDER_STATUSES = ['cancelled'];

export default {
  emits: ['change'],

  props: {
    status: {
      type: String as PropType<OrderStatus>,
      required: true,
    },
  },

  data() {
    return {
      SPECIAL_ORDER_STATUSES,
      SpecialOrderStatuses: Object.fromEntries(Object.entries(OrderStatuses).filter(([key]) => SPECIAL_ORDER_STATUSES.includes(key))),
      ConsistentOrderStatuses: Object.fromEntries(Object.entries(OrderStatuses).filter(([key]) => !SPECIAL_ORDER_STATUSES.includes(key))),
    };
  },

  methods: {
    onClickStatus(key: OrderStatus) {
      this.$emit('change', key)
    }
  }
};
</script>
