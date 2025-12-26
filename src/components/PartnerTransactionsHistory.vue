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
  .date-container
    padding-block 5px
    .date
      font-small-extra()
      color colorText5
    .users-transactions-container
      list-no-styles()
      .transaction
        display flex
        align-items center
        justify-content space-between
        padding-block 5px
        gap 10px
        .name
          flex 1
</style>

<template>
  <ul class="root-transactions-history">
    <li v-if="!compressedHistory.length && !loading">Нет ни одного начисления бонусов</li>
    <li class="date-container" v-for="historyRecord in compressedHistory">
      <span class="date">
        {{ dateFormatter(historyRecord.date) }} - {{ costFormatter(historyRecord.totalValue) }}
      </span>
      <ul class="users-transactions-container">
        <li class="transaction" v-for="transaction in historyRecord.transactions">
          <UserAvatar v-if="transaction.fromUserId" :user="transaction" size="30px" size-mobile="30px" />
          <div class="name" v-if="transaction.fromUserId">{{ transaction.givenName }} {{ transaction.familyName }}</div>
          <div class="name" v-else>
            Начисление<span v-if="transaction.comment"> с комментарием: {{ transaction.comment }}</span>
          </div>
          <div class="cost">{{ costFormatter(transaction.value) }}</div>
        </li>
      </ul>
    </li>
  </ul>
</template>

<script lang="ts">
import { costFormatter, dateFormatter } from '~/utils/utils';
import UserAvatar from '~/components/UserAvatar.vue';
import { PropType } from 'vue';
import { PartnerHistoryTransaction } from '~/utils/models';

function isDatesInSameDay(d1: Date, d2: Date) {
  return d1.getFullYear() === d2.getFullYear() && d1.getMonth() === d2.getMonth() && d1.getDate() === d2.getDate();
}

export default {
  emits: ['historyGotten', 'headUserGotten', 'partnersGotten'],

  components: { UserAvatar },

  props: {
    history: {
      type: Array as PropType<PartnerHistoryTransaction[]>,
      required: true,
    },
  },

  data() {
    return {};
  },

  computed: {
    compressedHistory() {
      const res = [] as {
        date: Date;
        totalValue: number;
        transactions: {
          avatarUrl?: string;
          givenName?: string;
          familyName?: string;
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
            totalValue: 0,
            transactions: [],
          };
          res.push(foundHistory);
        }
        foundHistory.totalValue += h.value;
        foundHistory.transactions.push({
          avatarUrl: h.avatarurl,
          givenName: h.givenname,
          familyName: h.familyname,
          value: h.value,
          fromUserId: h.fromuserid,
          comment: h.comment,
        });
      });
      return res.sort((a, b) => b.date - a.date);
    },
  },

  mounted() {
    if (this.user?.id) {
      this.updatePartnershipInfo();
      this.updatePartnershipHistory();
      this.updateHeadUser();
    }
  },

  methods: {
    dateFormatter,
    costFormatter,
  },

  watch: {},
};
</script>
