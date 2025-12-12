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
                justify-content space-between
                padding-block 5px

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
</style>

<template>
  <div class="root-profile-partnership">
    <header class="page-header">
      <span>Статистика продаж за последний месяц</span>
      <div class="withdraw-container">
        <span class="small">БАЛАНС</span>
        <span class="main">₽{{ 5320 }}</span>
        <button class="button-withdraw">
          Вывести
        </button>
      </div>
    </header>

    <ul class="cards-container">
      <li class="card">
        <header class="header">
          <img src="/static/icons/numbers-list.svg" alt="">
          Ваши продажи
        </header>

        <main class="main">
          <ul class="dates-transactions-container">
            <li class="date-container" v-for="_ in 4">
              <span class="date">29 ноября - ₽{{3500 * 4}}</span>
              <ul class="users-transactions-container">
                <li class="transaction" v-for="_ in 4">
                  <UserAvatar :user="$user" size="30px" size-mobile="30px"/>
                  <div class="name">Имя Фамилия</div>
                  <div class="cost">₽{{ 3500 }}</div>
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
            <div class="user-container chief">
              <div class="name">Имя Фамилия</div>
              <div class="bottom-row">
                <UserAvatar class="avatar" :user="$user" />
                <div class="cost">₽{{ 3500 }}</div>
              </div>
            </div>

            <img class="arrow" src="/static/icons/arrow-single.svg" alt="arrow-down" />

            <div class="user-container you">
              <div class="name">Я ({{$user.givenName}} {{$user.familyName}})</div>
              <div class="bottom-row">
                <UserAvatar class="avatar" :user="$user" />
                <div class="cost">₽{{ 3500 }}</div>
              </div>
            </div>

            <img class="arrow" src="/static/icons/arrow-much.svg" alt="arrow-down" />

            <div class="partners-list">
              <div v-for="_ in 20" class="user-container partner">
                <div class="name">Имя Фамилия</div>
                <div class="bottom-row">
                  <UserAvatar class="avatar" :user="$user" />
                  <div class="cost">₽{{ 3500 }}</div>
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
          <InputComponent class="link" :model-value="referalLink" readonly copyable/>

          <QRGenerator class="qr" :initial-text="referalLink" />
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
import { Goods } from '~/utils/models';

export default {
  components: { QRGenerator, InputComponent, UserAvatar, CircleLinesLoading },

  data() {
    return {
      loading: false,
    };
  },

  computed: {
    referalLink() {
      return `${location.origin}/?referalId=${this.$user.id}`;
    }
  },

  mounted() {
    // this.updatePartnershipInfo();
  },

  methods: {
    async updatePartnershipInfo() {
      this.goods = (
        (await this.$request(this, this.$api.getPartnershipInfo, [], `Не удалось получить информацию по партнерству`)) as {
          goods: Goods[];
        }
      ).goods;
    },
  },
};
</script>
