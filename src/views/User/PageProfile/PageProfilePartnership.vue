<style lang="stylus" scoped>
@import '../../../styles/constants.styl'
@import '../../../styles/components.styl'
@import '../../../styles/buttons.styl'
@import '../../../styles/fonts.styl'
@import '../../../styles/utils.styl'
@import '../../../styles/animations.styl'
@import '../../../styles/scrollbars.styl'

.root-profile-partnership
  display flex
  flex-wrap wrap
  gap 30px
  > *
    flex 1
    min-width 320px
    animation-float()

  .your-balance
    block-emp()

    display grid
    grid-template auto 1fr / 1fr 1fr
    gap 10px
    align-items center
    justify-content space-between

    header
      font-small()
      font-upper()

      grid-column 1/-1
      align-self start

    .balance
      font-large-extra()
      font-semibold()
      font-spaced()

    .button-withdraw
      block()
      button-emp2()

      justify-self end
      width 100%
      max-width 200px
      height min-content
      padding-block 10px
      button
        button-no-styles()

    .info
      font-small-extra()

      display flex
      grid-column 1/-1
      gap 10px
      align-items center
      padding 0
      color colorTextInvert3
      &:nth-child(4)
        color colorTextInvert1
      .value
        font-semibold()
        font-medium()

    @media ({desktop})
      min-width 600px

  section.activation
    block()

    display grid
    grid-template auto auto auto / auto 1fr auto
    column-gap 10px
    margin-bottom 30px
    img
      img-size(40px)

      grid-column 1
      grid-row 1/-1
    .value
      font-small()
      font-semibold()

      grid-column 2
      width fit-content
      height fit-content
      margin-top 5px
      padding 2px 10px
      border 1px solid transparent
      border-radius radiusMax
      white-space nowrap
      &.success
        border-color colorSuccess
        color colorSuccess
        background mix(colorSuccess, transparent, 10%)
      &.error
        border-color colorError
        color colorError
        background mix(colorError, transparent, 10%)
    .time
      svg-inside(20px, 0, 5px)
      font-small()

      width max-content
      color colorText4
      text-align right
    .info
      font-small-extra()

      grid-column 1/-1
      margin-top 5px
      color colorText4

  section.quality
    block()

    display grid
    grid-template auto auto / auto 1fr auto
    column-gap 10px
    trans()
    &:hover
      background colorBlockBg
      img.chevron
        transform translateX(-5px)
    img
      img-size(40px)

      grid-column 1
      grid-row 1/-1
    .value
      font-semibold()

      grid-column 2
      .days
        font-large()
    img.chevron
      trans()

      grid-column 3

  section.stats
    block-emp()

    display grid
    grid-template auto auto auto auto / auto auto
    gap 10px
    .header
      font-small-extra()

      display grid
      grid-column 1/-1
      grid-template auto auto / auto 1fr
      column-gap 10px
      header
        font-semibold()
      img
        img-size(40px)

        grid-row 1/-1
    .card
    .graph
      block-glass()

      display grid
      grid-template auto auto / 1fr auto
      gap 10px
      padding-right 10px
      header
        grid-column 1/-1
        font-small()
      .value
        font-large()
        font-semibold()

        display flex
        align-items center
      .stat
        font-small-extra()

        position relative
        align-self center
        &::before
          content ''
          position absolute
          top 50%
          right calc(100% + 4px)
          transform translateY(-50%) rotate(-45deg)
          border 2px solid
          img-size(8px)
        &.increased
          color colorSuccess
          &::before
            border-color colorSuccess
            border-bottom none
            border-left none
        &.decreased
          color colorError
          &::before
            border-color colorError
            border-top none
            border-right none

    .graph
      grid-column 1/-1

  section.team
    block()

    display flex
    flex-direction column
    gap 10px
    .header
      display flex
      gap 10px
      align-items center
      img
        img-size(40px)
      header
        font-semibold()
    .link
      block()

      display grid
      grid-template auto auto auto / auto 1fr auto
      gap 2px 10px
      align-items center
      margin-bottom 20px
      img
        img-size(20px)
      header
        font-semibold()
        font-small()

        color colorEmp2
      .input
        grid-column 1/-1
      .info
        font-small-extra()

        grid-column 1/-1
        color colorText4
        text-wrap balance
      img.qr
        grid-column 3
        grid-row 1
        img-size(70px)

  section.history
    block-bg()
    scrollable()

    display flex
    flex-direction column
    gap 10px
    max-height 500px
    .header
      display flex
      gap 10px
      align-items center
      img
        img-size(30px)
      header
        font-semibold()

  section.bonuses
    block-emp()

    display flex
    flex-direction column
    gap 10px
    .header
      font-small-extra()

      display grid
      grid-column 1/-1
      grid-template auto auto / auto 1fr
      column-gap 10px
      header
        font-semibold()
      img
        img-size(30px)

        grid-row 1/-1

    .bonuses-container
      display flex
      flex-direction column
      gap 10px
      color colorText1
      .bonus
        block()

        background colorBgLight
        .top-row
          display grid
          grid-template auto auto / auto auto 1fr
          gap 0 10px
          align-items center
          img
            img-size(30px)
          header
            font-semibold()
          p
            font-small-extra()
            font-semibold()

            color colorText2
            text-align right
          .info
            font-small-extra()
            font-normal()

            grid-column 1/-1
            color colorText4
            text-align left
        .bottom-row
          display flex
          gap 10px
          align-items center
          justify-content space-between
          .progressbar
            position relative
            overflow hidden
            width 100%
            height 10px
            border-radius radiusMax
            background colorBlockBg
            &::before
              content ''
              position absolute
              width calc(var(--value) * 100%)
              height 100%
              background colorEmp2
          p
            font-small-extra()

            white-space nowrap
</style>

<template>
  <div class="root-profile-partnership">
    <section class="your-balance" :style="{'--animation-index': 0}">
      <header>Ваш баланс</header>

      <p class="balance">{{ bonusesFormatter(partner.totalBonuses) }}</p>

      <router-link :to="{name: 'payout'}" class="button-withdraw" :disabled="partner.totalBonuses <= 0">
        <button :disabled="!partner.totalBonuses">Вывести</button>
      </router-link>

      <div class="info">
        До конца текущего периода
        <div class="value">
          <span class="days">{{ (new Date((new Date()).getFullYear(), (new Date()).getMonth() + 1, 0)).getDate() - (new Date()).getDate() }}</span>
          дней
        </div>
      </div>

      <p class="info">
        Текущий курс рублей к баллам {{ $globals.moneyForBonuses }}:1. То есть за каждые {{ costFormatter($globals.moneyForBonuses) }} рублей покупки начисляется {{ bonusesFormatter(1) }} ЛО
      </p>

      <p class="info">
        Ваши ЛО и ГO за текущий период поступят к вам на баланс после его окончания
      </p>
    </section>

    <div :style="{'--animation-index': 1}">
      <section class="activation">
        <img src="/static/icons/shield-done.svg" alt="place">
        <header>Активация</header>
        <div class="value success" v-if="partner.isActive">Активирован</div>
        <div class="value error" v-else>Не активирован</div>

        <div class="time"><img src="/static/icons/time.svg">{{ dateFormatter(partner.activatedDate) }}</div>
        <p class="info" v-if="partner.activatedDate?.getMonth?.() === new Date().getMonth() && partner.activatedDate.getFullYear() === new Date().getFullYear()">
          Вы были активированы в этом периоде, поэтому останетесь активны в следующем
        </p>
        <p class="info" v-else-if="partner.isActive">
          Вы были активированы в предыдущем периоде, и активация будет сброшена в конце текущего периода. Чтобы активироваться, совершите покупку на {{ bonusesFormatter(75) }}. Так же вас активирует активация любого партнера в 1-м уровне вашей структуры
        </p>
        <p class="info" v-else>
          Бонусы на ваш счет не начисляются. Чтобы активироваться, совершите покупку на {{ bonusesFormatter(75) }}. Так же вас активирует активация любого партнера в 1-м уровне вашей структуры
        </p>
      </section>

      <router-link :to="{name: 'qualities'}">
        <section class="quality">
          <img src="/static/icons/place.svg" alt="place">
          <header>Ваша квалификация</header>
          <div class="value">{{ qualities.find(q => q.id === partner.qualityId)?.title || 'нет' }}</div>
          <img class="chevron" src="/static/icons/chevron-right.svg" alt="details">
        </section>
      </router-link>
    </div>

    <section class="stats" :style="{'--animation-index': 2}">
      <div class="header">
        <img src="/static/icons/stats.svg" alt="place">
        <header>Статистика продаж</header>
        <p>За последний месяц</p>
      </div>
      <div class="card">
        <header>Личный объем (ЛО)</header>
        <div class="value">{{ bonusesFormatter(partner.personalBonuses) }}</div>
        <!-- <div class="stat" :class="`increased`">+12%</div> -->
      </div>
      <div class="card">
        <header>Групповой объем (ГО)</header>
        <div class="value">{{ bonusesFormatter(partner.groupBonuses) }}</div>
        <!-- <div class="stat" :class="`increased`">+12%</div> -->
      </div>
      <div class="card">
        <header>Общий оборот веток</header>
        <div class="value">{{ bonusesFormatter(partner.branchTotalBonuses) }}</div>
        <!-- <div class="stat" :class="`increased`">+12%</div> -->
      </div>
      <div class="card">
        <header>Квалификация</header>
        <div class="value">{{ qualities.find(q => q.id === partner.qualityId)?.title || 'нет' }}</div>
        <!-- <div class="stat" /> -->
      </div>
      <!-- <div class="graph">
        <header>Динамика продаж</header>
        <div class="value">ГРАФИК</div>
      </div> -->
    </section>

    <section class="team" :style="{'--animation-index': 3}">
      <div class="header">
        <img src="/static/icons/people.svg" alt="place">
        <header>Ваша команда</header>
      </div>
      <div class="link">
        <img src="/static/icons/link.svg" alt="place">
        <header>Выша реферальная ссылка</header>
        <InputComponent class="input" :model-value="referrerLink" readonly copyable />
        <p class="info">Бонусы за заказы приглашенного человека начисляются после их доставки</p>

        <QRGenerator class="qr" :text="referrerLink" />
      </div>
      <div class="partners">
        <PartnersGraph
          :user="$user"
          show-as-me
          @history-gotten="(gottenHistory) => history = gottenHistory"
        />
      </div>
    </section>

    <section class="history" :style="{'--animation-index': 4}">
      <div class="header">
        <img src="/static/icons/time.svg" alt="place">
        <header>История начислений</header>
      </div>
      
      <PartnerTransactionsHistory :user-id="$user.id" />
    </section>

    <section class="bonuses" :style="{'--animation-index': 5}">
      <div class="header">
        <img src="/static/icons/gift.svg" alt="place">
        <header>Бонусы</header>
        <p>Приятные бонусы и предложения</p>
      </div>
      
      <div class="bonuses-container">
        <div class="bonus">
          <div class="top-row">
            <img src="/static/icons/star.svg" alt="place">
            <header>Бонус новичка</header>
            <p>{{ partner.newbieBonusPeriodsLeft }} периодов осталось</p>
            <p class="info">+3% бонусов от продаж первых 3-х уровнях партнерской структуры</p>
          </div>
          <div class="bottom-row">
            <div class="progressbar" :style="{'--value': 2 / 4}" />
            <p>{{ partner.newbieBonusPeriodsLeft }} / 4</p>
          </div>
        </div>

        <div class="bonus">
          <div class="top-row">
            <img src="/static/icons/pearl.svg" alt="place">
            <header>Бонус чёрной икры</header>
            <p>{{ partner.blackPearlBonuses }} / {{ $globals.blackPearlCost }} бонусов</p>
            <p class="info">10% бонусов от покупок в 1-м уровне идет накапливается здесь. Накопите на баночку черной икры для вас!</p>
          </div>
          <div class="bottom-row">
            <div class="progressbar" :style="{'--value': partner.blackPearlBonuses / $globals.blackPearlCost}" />
            <p>{{ Math.floor(partner.blackPearlBonuses / $globals.blackPearlCost * 100) }}%</p>
          </div>
          <div v-if="partner.blackPearlBonuses >= $globals.blackPearlCost" class="top-row">
            <br>
            <br>
            <header>У вас достаточно бонусов!</header>
            <p class="info">Оформите новый заказ с баночкой черной икры, а в комментариях укажите, что используете бонус черной икры. Не оплачивайте заказ</p>
          </div>
        </div>

        <div class="bonus">
          <div class="top-row">
            <img src="/static/icons/people.svg" alt="place">
            <header>Бонус большой команды</header>
            <p>{{ partner.bonusBigTeamPeriods }} периодов</p>
            <p class="info">Удерживайте два периода подряд команду из 5+ активных партнеров в 1-м уровне и 10+ активных во втором. В зачет не более 5-ти партнеров 2-го уровня у каждого партнера 1-го уровня</p>
          </div>
          <div class="bottom-row">
            <div class="progressbar" :style="{'--value': partner.bonusBigTeamPeriods / 2 }" />
            <p>{{ partner.bonusBigTeamPeriods }} / 2</p>
          </div>
        </div>

        <div class="bonus">
          <div class="top-row">
            <img src="/static/icons/trophy.svg" alt="place">
            <header>Бонус квалификации</header>
            <p class="info">Начисляется в конце периода за удержание некоторых квалификаций</p>
          </div>
        </div>
      </div>
    </section>

    <CircleLinesLoading v-if="loading" centered />
  </div>
</template>

<script lang="ts">
import CircleLinesLoading from '~/components/loaders/CircleLinesLoading.vue';
import InputComponent from '~/components/InputComponent.vue';
import QRGenerator from '~/components/QRGenerator.vue';
import { costFormatter, bonusesFormatter, dateFormatter } from '~/utils/utils';
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
    costFormatter,

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
