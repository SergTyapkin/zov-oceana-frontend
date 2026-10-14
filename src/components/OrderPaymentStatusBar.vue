<style lang="stylus" scoped>
@import '../styles/constants.styl'
@import '../styles/components.styl'
@import '../styles/utils.styl'
@import '../styles/fonts.styl'
@import '../styles/scrollbars.styl'

gap = 5px
height = 60px
bg = colorBgDark

.payment-satus-bar-root
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

      .status
        flex-direction column
        // cursor pointer
        width 100%
        height 100%
        padding 0 15px
        color colorTextInvert1
        text-align center
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

      &:not(.active)
        .status
          color colorTextInvert4
        &.red
          .status
            background mix(colorError, bg, 30%)
          .arrow-colored
            border-left-color mix(colorError, bg, 30%)
        &.green
          .status
            background mix(colorSuccess, bg, 30%)
          .arrow-colored
            border-left-color mix(colorSuccess, bg, 30%)
        &.yellow
          .status
            background mix(colorEmp1, bg, 30%)
          .arrow-colored
            border-left-color mix(colorEmp1, bg, 30%)
        &.blue
          .status
            background mix(colorEmp2, bg, 30%)
          .arrow-colored
            border-left-color mix(colorEmp2, bg, 30%)
        &.gray
          .status
            background mix(colorTextInvert4, bg, 30%)
          .arrow-colored
            border-left-color mix(colorTextInvert4, bg, 30%)

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

    @media ({mobile})
      flex-wrap wrap
</style>

<template>
  <section class="payment-satus-bar-root">
    <div class="consistent-statuses">
      <div 
        class="status-container"
        v-for="(s, key) in ConsistentPaymentStatuses" 
        :class="{
          [s.color]: true,
          active: key === status,
        }"
      > 
        <div
          class="status" 
          :title="`Изменить статус оплаты на '${s.title}'`"
          @click="onClickStatus(key as PaymentStatus)"
        >
          <div>{{ s.title }}</div>
          <div v-if="totalValue && key === status">{{ costFormatter(totalValue) }}</div>
        </div>
        <div class="arrow-white" />
        <div class="arrow-colored" />
      </div>
    </div>

    <div class="special-statuses" v-if="SPECIAL_PAYMENT_STATUSES.includes(status)">
      <div 
        class="status-container not-active"
        v-for="(s, key) in SpecialPaymentStatuses" 
        :class="{
          [s.color]: true,
          active: key === status,
        }"
      > 
        <div 
          class="status" 
          :title="`Изменить статус оплаты на '${s.title}'`"
          @click="onClickStatus(key as PaymentStatus)"
        >
          <img src="/static/icons/location.svg" class="current" alt="done">
          {{ s.title }}
        </div>
      </div>
    </div>

    <div class="special-statuses" v-if="SPECIAL_PAYMENT_STATUSES_2.includes(status)">
      <div 
        class="status-container not-active"
        v-for="(s, key) in SpecialPaymentStatuses2" 
        :class="{
          [s.color]: true,
          active: key === status,
        }"
      > 
        <div 
          class="status" 
          :title="`Изменить статус оплаты на '${s.title}'`"
          @click="onClickStatus(key as PaymentStatus)"
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
import { PaymentStatuses } from "~/constants";
import { PaymentStatus } from "~/utils/models";
import { costFormatter } from "~/utils/utils";

const SPECIAL_PAYMENT_STATUSES = ['expired', 'rejected', 'cancelled'];
const SPECIAL_PAYMENT_STATUSES_2 = ['refunded'];

export default {
  emits: ['change'],

  props: {
    status: {
      type: String as PropType<PaymentStatus>,
      required: true,
    },
    totalValue: {
      type: Number,
      default: undefined,
    },
  },

  data() {
    return {
      SPECIAL_PAYMENT_STATUSES,
      SPECIAL_PAYMENT_STATUSES_2,

      SpecialPaymentStatuses2: Object.fromEntries(Object.entries(PaymentStatuses).filter(([key]) => SPECIAL_PAYMENT_STATUSES_2.includes(key))),
      SpecialPaymentStatuses: Object.fromEntries(Object.entries(PaymentStatuses).filter(([key]) => SPECIAL_PAYMENT_STATUSES.includes(key))),
      ConsistentPaymentStatuses: Object.assign({
        none: { title: 'Оплата не начата', color: 'gray' },
      }, Object.fromEntries(Object.entries(PaymentStatuses).filter(([key]) => !SPECIAL_PAYMENT_STATUSES.includes(key) && !SPECIAL_PAYMENT_STATUSES_2.includes(key)))),
    };
  },

  methods: {
    costFormatter,

    onClickStatus(key: PaymentStatus) {
      this.$emit('change', key)
    }
  }
};
</script>
