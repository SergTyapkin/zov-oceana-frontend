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
        <span class="main">{{ costFormatter($user.partnerBonuses) }}</span>
        <button class="button-withdraw" :disabled="$user.partnerBonuses === 0">Вывести</button>
      </div>
    </header>

    <ul class="cards-container">
      <li class="card">
        <header class="header">
          <img src="/static/icons/numbers-list.svg" alt="" />
          Все ваши бонусы от продаж
        </header>

        <main class="main">
          <PartnerTransactionsHistory :history />
        </main>
      </li>

      <li class="card">
        <header class="header">
          <img src="/static/icons/graph.svg" alt="" />
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
          <img src="/static/icons/invite.svg" alt="" />
          Реферальная ссылка
        </header>

        <main class="main">
          <InputComponent class="link" :model-value="referrerLink" readonly copyable />

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
import { costFormatter } from '~/utils/utils';
import { PartnerHistoryTransaction } from '~/utils/models';
import { QUERY_PARAM_REFERRER_ID } from '~/constants';
import PartnersGraph from '~/components/PartnersGraph.vue';
import PartnerTransactionsHistory from '~/components/PartnerTransactionsHistory.vue';

export default {
  components: { PartnerTransactionsHistory, PartnersGraph, QRGenerator, InputComponent, UserAvatar, CircleLinesLoading },

  data() {
    return {
      history: [] as PartnerHistoryTransaction[],

      loading: false,
    };
  },

  computed: {
    referrerLink() {
      return `${location.origin}/?${QUERY_PARAM_REFERRER_ID}=${this.$user.id}`;
    },
  },

  mounted() {
  },

  methods: {
    costFormatter,
  },
};
</script>
