<style lang="stylus" scoped>
@import '../styles/constants.styl'
@import '../styles/components.styl'
@import '../styles/buttons.styl'
@import '../styles/fonts.styl'
@import '../styles/utils.styl'
@import '../styles/animations.styl'
@import '../styles/scrollbars.styl'


.root-transactions-history
  list-no-styles()

  position relative
  .date-container
    block()

    margin-top 5px
    padding-bottom 5px
    background colorBgLight
    .date
      display flex
      gap 12px
      align-items center
      margin-bottom 5px
      color colorEmp2
      font-small-extra()
      font-semibold()
      .day-total
        font-small-extra()
        font-normal()

        color colorEmp2
    .users-transactions-container
      list-no-styles()
      .transaction
        display flex
        gap 12px
        align-items center
        min-height 40px
        padding-block 6px
        border-bottom 1px solid colorBorder
        &:last-child
          border-bottom 0
        .transaction-icon
          position relative
          flex 0 0 22px
          width 22px
          height 22px
          color colorEmp2
        .name
          flex 1
          font-small()

          color colorText2
        .cost
          font-small()
          font-semibold()

          color colorEmp2
          text-align right
          &.is-negative
            color colorError
          span
            font-normal()

            color colorText4
</style>

<template>
  <ul class="root-transactions-history">
    <li v-if="!compressedHistory.length && !loading">Нет ни одного начисления бонусов</li>
    <li class="date-container" v-for="historyRecord in compressedHistory">
      <div class="date">
        <span>{{ dateFormatter(historyRecord.date) }}</span>
        <span class="day-total" v-if="historyRecord.totalPersonalValue">{{ historyRecord.totalPersonalValue > 0 ? '+ ' : '' }}{{ bonusesFormatter(historyRecord.totalPersonalValue) }} ЛО</span>
        <span class="day-total" v-if="historyRecord.totalGroupValue">{{ historyRecord.totalGroupValue > 0 ? '+ ' : '' }}{{ bonusesFormatter(historyRecord.totalGroupValue) }} ГО</span>
      </div>
      <ul class="users-transactions-container">
        <li class="transaction" v-for="transaction in historyRecord.transactions">
          <img v-if="transaction.type === HistoryRecordTypes.group" class="transaction-icon" src="/static/icons/percent-cirle.svg" alt="group"> 
          <img v-else-if="transaction.type === HistoryRecordTypes.personal" class="transaction-icon" src="/static/icons/sell.svg" alt="personal"> 
          <img v-else-if="transaction.type === HistoryRecordTypes.total && transaction.value >= 0" class="transaction-icon" src="/static/icons/plus-circle.svg" alt="total"> 
          <img v-else-if="transaction.type === HistoryRecordTypes.total && transaction.value < 0" class="transaction-icon" src="/static/icons/minus-circle.svg" alt="total"> 

          <UserAvatar v-if="transaction.fromUserId" :user="transaction" size="30px" size-mobile="30px" />
          <div class="name" v-if="transaction.fromUserId">{{ transaction.givenName }} {{ transaction.familyName }}</div>
          <div class="name" v-else>
            <span v-if="transaction.comment">{{ transaction.comment }}</span>
            <span v-else-if="transaction.value >= 0">Начисление</span>
            <span v-else>Списание</span>
          </div>
          <div class="cost" :class="{ 'is-negative': transaction.value < 0 }">
            {{ transaction.value > 0 ? '+ ' : '' }}{{ bonusesFormatter(transaction.value) }} 
            <span v-if="transaction.type === HistoryRecordTypes.personal">ЛО</span>
            <span v-else-if="transaction.type === HistoryRecordTypes.group">ГО</span>
            <span v-else-if="transaction.type === HistoryRecordTypes.total">на баланс</span>
            <span v-else>? НЕИЗВЕСТНО ?</span>
          </div>
        </li>
      </ul>
    </li>

    <CircleLoading v-if="loading" centered />
  </ul>
</template>

<script lang="ts">
import { bonusesFormatter, dateFormatter } from '~/utils/utils';
import UserAvatar from '~/components/UserAvatar.vue';
import CircleLoading from '~/components/loaders/CircleLoading.vue';
import { HistoryRecordType, PartnerHistoryTransaction, User } from '~/utils/models';
import { HistoryRecordTypes } from '~/constants';

function isDatesInSameDay(d1: Date, d2: Date) {
  return d1.getFullYear() === d2.getFullYear() && d1.getMonth() === d2.getMonth() && d1.getDate() === d2.getDate();
}

export default {
  emits: ['historyGotten', 'headUserGotten', 'partnersGotten'],

  components: { UserAvatar, CircleLoading },

  props: {
    userId: {
      type: String,
      required: true,
    },
  },

  data() {
    return {
      history: [] as PartnerHistoryTransaction[],

      loading: false,

      HistoryRecordTypes,
    };
  },

  computed: {
    compressedHistory() {
      const res = [] as {
        date: Date;
        totalPersonalValue: number;
        totalGroupValue: number;
        transactions: {
          avatarUrl?: string;
          givenName?: string;
          familyName?: string;
          type: HistoryRecordType;
          value: number;
          fromUserId?: string;
          comment?: string;
        }[];
      }[];
      this.history.forEach(h => {
        let foundHistory = res.find(r => isDatesInSameDay(r.date, new Date(h.date)));
        if (!foundHistory) {
          foundHistory = {
            date: new Date(h.date),
            totalPersonalValue: 0,
            totalGroupValue: 0,
            transactions: [],
          };
          res.push(foundHistory);
        }
        if (h.type === HistoryRecordTypes.personal) 
          foundHistory.totalPersonalValue += h.value;
        else if (h.type === HistoryRecordTypes.group) 
          foundHistory.totalGroupValue += h.value;
        foundHistory.transactions.push({
          avatarUrl: h.avatarurl,
          givenName: h.givenname,
          familyName: h.familyname,
          type: h.type,
          value: h.value,
          fromUserId: h.fromuserid,
          comment: h.comment,
        });
      });
      return res.sort((a, b) => Number(b.date) - Number(a.date));
    },
  },

  mounted() {
    this.updatePartnershipHistory();
  },

  methods: {
    dateFormatter,
    bonusesFormatter,

    async updatePartnershipHistory() {
      this.history = (
        (await this.$request(
          this,
          this.$api.getHistoryBonusesRecords,
          [this.userId],
          `Не удалось получить информацию по истории партнерства`,
        )) as {
          history: User[];
        }
      ).history;

      this.$emit('historyGotten', this.history);
    },
  },

  watch: {},
};
</script>
