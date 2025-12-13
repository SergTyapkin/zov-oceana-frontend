<style lang="stylus" scoped>
@import '../../../styles/constants.styl'
@import '../../../styles/components.styl'
@import '../../../styles/buttons.styl'
@import '../../../styles/fonts.styl'
@import '../../../styles/utils.styl'
@import '../../../styles/animations.styl'
@import '../../../styles/scrollbars.styl'

.root-profile-partnership
  .page-header
    font-large()
    font-upper()
    display flex
    justify-content space-between
    .withdraw-container
      display flex
      flex-direction column
      centered-flex-container()
      background colorBgDark
      color colorTextInvert1
      font-medium()
      padding-top 10px
      .main
        font-large()
      .button-withdraw
        button-emp2()
        padding-block 5px
        margin-top 5px


  .cards-container
    list-no-styles()
    display grid
    grid-template-columns 1fr 1fr
    @media({mobile})
      grid-template-columns 1fr
    gap 20px
    margin-top 30px
    .card
      box-shadow 0 0 10px colorShadow
      max-width 100%
      .header
        font-medium()
        font-upper()
        padding 20px
        color colorTextInvert1
        background colorBgDark
        svg-inside(25px)

      .main
        scrollable()
        padding 30px 20px
        max-height 500px
        overflow-y auto
        .dates-transactions-container
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

        .users-graph
          centered-flex-container()
          flex-direction column
          gap 15px
          .arrow
            img-size(30px)
            transform rotate(180deg)
            opacity 0.2
          .user-container
            centered-flex-container()
            flex-direction column
            .name
              font-small-extra()
              color colorText4
              text-align center
            .bottom-row
              centered-flex-container()
              gap 10px
            &.you
              .bottom-row
                .cost
                  font-semibold()
          .partners-list
            display flex
            gap 10px
            flex-wrap wrap
            justify-content space-evenly

        .qr
          centered-margin()
          max-width 300px
          width 100%
          @media({mobile})
            max-width 200px
</style>

<template>
  <div class="root-profile-partnership">
    <header class="page-header">
      <span>Статистика продаж за последний месяц</span>
      <div class="withdraw-container">
        <span class="small">БАЛАНС</span>
        <span class="main">₽{{ $user.partnerBonuses }}</span>
        <button class="button-withdraw" :disabled="$user.partnerBonuses === 0">
          Вывести
        </button>
      </div>
    </header>

    <ul class="cards-container">
      <li class="card">
        <header class="header">
          <img src="/static/icons/numbers-list.svg" alt="">
          Все ваши бонусы от продаж
        </header>

        <main class="main">
          <ul class="dates-transactions-container">
            <li class="date-container" v-for="historyRecord in compressedHistory">
              <span class="date">{{dateFormatter(historyRecord.date)}} - ₽{{historyRecord.totalValue}}</span>
              <ul class="users-transactions-container">
                <li class="transaction" v-for="transaction in historyRecord.transactions">
                  <UserAvatar :user="transaction" size="30px" size-mobile="30px"/>
                  <div class="name">{{transaction.givenName}} {{transaction.familyName}}</div>
                  <div class="cost">₽{{ transaction.value }}</div>
                </li>
              </ul>
            </li>
          </ul>
        </main>
      </li>

      <li class="card">
        <header class="header">
          <img src="/static/icons/graph.svg" alt="">
          Продажи партнеров
        </header>

        <main class="main">
          <div class="users-graph">
            <div v-if="chief" class="user-container chief">
              <div class="bottom-row">
                <UserAvatar class="avatar" :user="chief" />
                <div class="name">{{chief.givenName}} {{chief.familyName}}</div>
              </div>
            </div>

            <img v-if="chief" class="arrow" src="/static/icons/arrow-single.svg" alt="arrow-down" />

            <div class="user-container you">
              <div class="name">Я ({{$user.givenName}} {{$user.familyName}})</div>
              <div class="bottom-row">
                <UserAvatar class="avatar" :user="$user" />
                <div class="cost">₽{{ yourMonthlyTotalValue }}</div>
              </div>
            </div>

            <img class="arrow" src="/static/icons/arrow-much.svg" alt="arrow-down" />

            <div class="partners-list">
              <div v-for="partner in partners" class="user-container partner">
                <div class="name">{{partner.givenname}} {{partner.familyname}}</div>
                <div class="bottom-row">
                  <UserAvatar class="avatar" :user="partner" />
                  <div class="cost">₽{{ partner.totalvalue }}</div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </li>

      <li class="card">
        <header class="header">
          <img src="/static/icons/invite.svg" alt="">
          Реферальная ссылка
        </header>

        <main class="main">
          <InputComponent class="link" :model-value="referrerLink" readonly copyable/>

          <QRGenerator class="qr" :initial-text="referrerLink" />
        </main>
      </li>
    </ul>

    <CircleLinesLoading v-if="loading" centered />
  </div>
</template>

<script lang="ts">
import CircleLinesLoading from '~/components/loaders/CircleLinesLoading.vue';
import UserAvatar from '~/components/UserAvatar.vue';
import InputComponent from '~/components/InputComponent.vue';
import QRGenerator from '~/components/QRGenerator.vue';
import { dateFormatter } from '~/utils/utils';
import { UserOther } from '~/utils/models';


function isDatesInSameDay(d1: Date, d2: Date) {
  return d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate();
}

export default {
  components: { QRGenerator, InputComponent, UserAvatar, CircleLinesLoading },

  data() {
    return {
      history: [],
      partners: [],

      chief: null as UserOther | null,

      loading: false,
    };
  },

  computed: {
    referrerLink() {
      return `${location.origin}/?referrerId=${this.$user.id}`;
    },

    compressedHistory() {
      const res = [];
      this.history.forEach(h => {
        let foundHistory = res.find(r => isDatesInSameDay(r.date, new Date(h.date)));
        if (!foundHistory) {
          foundHistory = {
            date: new Date(h.date),
            totalValue: 0,
            transactions: [],
          }
          res.push(foundHistory);
        }
        foundHistory.totalValue += h.value;
        foundHistory.transactions.push({
          avatarUrl: h.avatarurl,
          givenName: h.givenname,
          familyName: h.familyname,
          value: h.value,
        });
      });
      return res.sort((a, b) => b.date - a.date);
    },

    yourMonthlyTotalValue() {
      return this.history.reduce((acc, h) => acc + h.value, 0);
    }
  },

  mounted() {
    this.updatePartnershipInfo();
    this.updatePartnershipHistory();
    this.updateChief();
  },

  methods: {
    dateFormatter,

    async updatePartnershipHistory() {
      this.history = (
        (await this.$request(this, this.$api.getUserBonusesHistoryMonthly, [this.$user.id], `Не удалось получить информацию по партнерству`)) as {
          history: User[];
        }
      ).history;
    },

    async updatePartnershipInfo() {
      this.partners = (
        (await this.$request(this, this.$api.getAllPartnerUsers, [this.$user.id], `Не удалось получить информацию по партнерству`)) as {
          partners: User[];
        }
      ).partners;
    },

    async updateChief() {
      if (!this.$user.referrerId) {
        this.chief = null;
        return;
      }
      this.chief = await this.$request(
        this,
        this.$api.getOtherUser,
        [this.$user.referrerId],
        `Не удалось получить информацию про вышестоящего партнера`,
      ) as UserOther;
    },
  },
};
</script>
