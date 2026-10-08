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
    margin-bottom 20px
    .withdraw-container
      display flex
      flex-direction column
      padding-top 10px
      color colorTextInvert1
      background colorBgDark
      centered-flex-container()
      font-medium()
      .main
        font-large()
      .button-withdraw
        button-emp2()

        margin-top 5px
        padding-block 5px


  .cards-container
    display grid
    grid-template-columns 1fr 1fr
    gap 20px
    margin-top 30px
    .card
      max-width 100%
      box-shadow 0 0 10px colorShadow
      .header
        font-medium()
        font-upper()

        padding 20px
        color colorTextInvert1
        background colorBgDark
        svg-inside(25px)

      .main
        scrollable()

        overflow-y auto
        max-height 500px
        padding 30px 20px

        .qr
          centered-margin()

          width 100%
          max-width 300px

          @media ({mobile})
            max-width 200px

    @media ({mobile})
      grid-template-columns 1fr
    list-no-styles()
</style>

<template>
  <div class="root-profile-partnership">
    <header class="page-header">
      <div>
        <span>Статистика продаж за последний месяц</span>
        <br>
        <small>Ваша квалификация: {{ qualities.find(q => q.id === partner.qualityId) || 'нет' }}</small>
      </div>

      <router-link :to="{name: 'payout'}" class="withdraw-container">
        <span class="small">БАЛАНС</span>
        <span class="main">{{ bonusesFormatter(partner.totalBonuses) }}</span>
        <button class="button-withdraw" :disabled="partner.totalBonuses <= 0">Вывести</button>
      </router-link>
    </header>

    <ul class="cards-container">
      <li class="card">
        <header class="header">
          <img src="/static/icons/numbers-list.svg" alt="">
          Статистика за месяц и состояние
        </header>

        <main class="main">
          <small>Активирован: {{ partner.isActive ? 'Да' : 'Нет' }}</small>
          <br>
          <small>Последняя активация: {{ dateFormatter(partner.activatedDate) }}</small>
          <br>
          <small>Личный объём (ЛО) за месяц: {{ bonusesFormatter(partner.personalBonuses) }}</small>
          <br>
          <small>Групповой объём (ГО) за месяц: {{ bonusesFormatter(partner.groupBonuses) }}</small>
          <br>
          <small>Общий оборот за месяц: {{ bonusesFormatter(partner.branchTotalBonuses) }}</small>
          <br>
          <small>Стал партнером: {{ dateFormatter(partner.joinedDate) }}</small>
        </main>
      </li>

      <li class="card">
        <header class="header">
          <img src="/static/icons/numbers-list.svg" alt="">
          Бонусы
        </header>

        <main class="main">
          <small>Осталось периодов "Бонуса Новичка": {{ partner.newbieBonusPeriodsLeft }}</small>
          <br>
          <small>Баллов "Бонуса Чёрной Икры": {{ bonusesFormatter(partner.blackPearlBonuses) }} из {{ bonusesFormatter($globals.blackPearlCost) }} </small>
          <br>
          <small>Периодов "Бонуса Большой Команды": {{ bonusesFormatter(partner.bonusBigTeamPeriods) }}</small>
        </main>
      </li>

      <li class="card">
        <header class="header">
          <img src="/static/icons/numbers-list.svg" alt="">
          Все ваши бонусы от продаж
        </header>

        <main class="main">
          <PartnerTransactionsHistory :history />
        </main>
      </li>

      <li class="card">
        <header class="header">
          <img src="/static/icons/graph.svg" alt="">
          Продажи партнеров
        </header>

        <main class="main">
          <PartnersGraph
            :user="$user"
            show-as-me
            @history-gotten="(gottenHistory) => history = gottenHistory"
          />
        </main>
      </li>

      <li class="card">
        <header class="header">
          <img src="/static/icons/invite.svg" alt="">
          Реферальная ссылка
        </header>

        <main class="main">
          <InputComponent class="link" :model-value="referrerLink" readonly copyable />

          <QRGenerator class="qr" :text="referrerLink" />
        </main>
      </li>

      <li class="card">
        <header class="header">
          <img src="/static/icons/invite.svg" alt="">
          Все квалификации
        </header>

        <main class="main">
          <div v-for="quality in qualities">
            {{ quality.title }}
            <br>
            На {{ quality.branchDeepForQuality }} вложенности бонус {{ quality.percentForQuality }}
            <br>
            Нужно
            {{ quality.activeCountRequirement }} автивных в 1 вложенности,
            {{ quality.branchesCountRequirement }} веток по {{ quality.branchesValuesRequirement }} оборота,
            {{ quality.totalPersonalBonusesRequirement }} ЛО
            <br>
            За это бонус
            {{ quality.qualityBonusValue }} максимум {{ quality.qualityBonusMaxCount }} раз
            <br>
            <br>
          </div>
        </main>
      </li>
    </ul>

    <CircleLinesLoading v-if="loading" centered />
  </div>
</template>

<script lang="ts">
import CircleLinesLoading from '~/components/loaders/CircleLinesLoading.vue';
import InputComponent from '~/components/InputComponent.vue';
import QRGenerator from '~/components/QRGenerator.vue';
import { bonusesFormatter, dateFormatter } from '~/utils/utils';
import { Partner, PartnerHistoryTransaction, Quality } from '~/utils/models';
import { QUERY_PARAM_REFERRER_ID } from '~/constants';
import PartnersGraph from '~/components/PartnersGraph.vue';
import PartnerTransactionsHistory from '~/components/PartnerTransactionsHistory.vue';

export default {
  components: { PartnerTransactionsHistory, PartnersGraph, QRGenerator, InputComponent, CircleLinesLoading },

  data() {
    return {
      history: [] as PartnerHistoryTransaction[],
      partner: {} as Partner,
      qualities: [] as Quality[],

      loading: false,
    };
  },

  computed: {
    referrerLink() {
      return `${location.origin}/?${QUERY_PARAM_REFERRER_ID}=${this.$user.id}`;
    },
  },

  mounted() {
    this.updatePartner();
    this.updateQualities();
  },

  methods: {
    bonusesFormatter,
    dateFormatter,

    async updatePartner() {
      this.partner = (await this.$request(
        this,
        this.$api.getUserPartnerInfo,
        [this.$user.id],
        `Не удалось получить данные партнера`,
      )) as Partner;
    },
    async updateQualities() {
      this.qualities = (await this.$request(
        this,
        this.$api.getAllQualities,
        [],
        `Не удалось получить список всех квалификаций`,
      ) as {qualities: Quality[]}).qualities;
    },
  },
};
</script>
