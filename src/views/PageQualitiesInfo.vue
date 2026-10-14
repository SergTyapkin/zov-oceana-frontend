<style lang="stylus" scoped>
@import '../styles/constants.styl'
@import '../styles/components.styl'
@import '../styles/buttons.styl'
@import '../styles/fonts.styl'
@import '../styles/utils.styl'
@import '../styles/animations.styl'
@import '../styles/scrollbars.styl'

.root-profile-qualities
  page-root()

  padding-top 0
  section.page-title
    cursor pointer
    padding-block 40px
    color colorTextInvert1
    background colorBgDark
    img
      trans()
    &:hover
      img
        margin-right 15px
        margin-left 5px

    @media ({mobile})
      padding-block 20px
    page-root()
    page-root-disable()
    svg-inside(1lh)
    font-small()

  section.qualities
    display flex
    flex-direction column
    gap 20px
    padding-top 24px
    padding-bottom 50px
    .qualities-heading
      display flex
      gap 14px
      align-items center
      img
        img-size(34px)
      h1
        font-large()
        font-bold()

        margin 0
        color colorText1
    .period-note
      block-bg()
      font-small()
      svg-inside(20px)

    .quality-list
      display flex
      flex-wrap wrap
      gap 14px
      justify-content space-evenly
      .quality-card
        block()

        max-width 350px
        padding 18px
        &.is-current
          border-color colorEmp2
          background mix(colorEmp2, colorBgLight, 3%)
        .quality-top
          display grid
          grid-template-columns 34px minmax(0, 1fr) auto
          gap 8px 12px
          align-items center
          img
            img-size(32px)

            grid-row 1 / span 2
          h2
            font-medium()
            font-bold()

            margin 0
            color colorText1
          .percent
            font-small()

            grid-column 2 / -1
            color colorText4
          .current-label
            font-small-extra()
            font-semibold()

            grid-column 3
            grid-row 1
            padding 5px 9px
            border-radius radiusMax
            color colorEmp2
            text-align right
            white-space nowrap
            background mix(colorEmp2, colorBgLight, 10%)
          .depth
            grid-column 2 / -1
            font-small()

            color colorText4
        .requirements
          list-no-styles()

          display flex
          flex-direction column
          gap 12px
          margin-top 18px
          padding-top 16px
          border-top 1px solid colorBorder
          li
            display grid
            grid-template-columns 20px 1fr
            gap 11px
            align-items start
            color colorText2
            font-small()
            &.title
              display block
            img
              img-size(19px)

              opacity 0.6
        .bonus
          block-emp()

          display flex
          gap 14px
          align-items center
          justify-content space-between
          margin-top 18px
          .bonus-description
            display flex
            flex-direction column
            gap 5px
            font-small()
            strong
              font-semibold()
          .bonus-value
            font-medium()
            font-bold()

            color colorEmp2
            text-align right
            white-space nowrap
          .bonus-count
            color colorTextInvert4

      @media (max-width 840px)
        flex-direction column
        align-items center
      list-no-styles()
    .divider
      &:last-child
        display none
      img
        img-size(40px)

      @media (min-width 840px)
        transform rotate(-90deg)
      centered-flex-container()
    .empty-state
      margin 0
      padding 18px
      border 1px solid colorBorder
      border-radius 8px
      font-small()

      color colorText3
</style>

<template>
  <div class="root-profile-qualities">
    <router-link :to="{ name: 'profilePartnership' }">
      <section class="page-title">
        <img src="/static/icons/arrow-left.svg" alt="arrow left">
        Назад
      </section>
    </router-link>

    <section class="qualities">
      <header class="qualities-heading">
        <img src="/static/icons/trophy.svg" alt="">
        <h1>Квалификации</h1>
      </header>

      <p class="period-note">
        <img src="/static/icons/info.svg" alt="info">
        Ваша Квалификация определяется в конце каждого периода по его результатам.
      </p>

      <ul v-if="qualities.length" class="quality-list">
        <template v-for="quality in qualities" :key="quality.id">
          <li
            class="quality-card"
            :class="{
              'has-bonus': quality.qualityBonusValue != null && quality.qualityBonusValue > 0,
              'is-current': $user.isPartner && partner.qualityId === quality.id,
            }"
          >
            <div class="quality-top">
              <img src="/static/icons/boat.svg" alt="">
              <h2>{{ quality.title }}</h2>
              <span v-if="$user.isPartner && partner.qualityId === quality.id" class="current-label">Текущая</span>
              <span class="percent">Бонус {{ quality.percentForQuality }}% за {{ quality.branchDeepForQuality }}-е поколение структуры</span>
            </div>

            <ul class="requirements">
              <li class="title" v-if="!quality.activeCountRequirement && !quality.totalPersonalBonusesRequirement && !quality.branchesCountRequirement && !quality.branchesValuesRequirement">
                Квалификация по умолчанию
              </li>
              <li class="title" v-else>Необходимо</li>
                
              <li v-if="quality.activeCountRequirement">
                <img src="/static/icons/people.svg" alt="">
                <span>Активных партнёров: {{ quality.activeCountRequirement }}</span>
              </li>
              <li v-if="quality.totalPersonalBonusesRequirement">
                <img src="/static/icons/exchange-money.svg" alt="">
                <span>Личный объём: от {{ bonusesFormatter(quality.totalPersonalBonusesRequirement) }}</span>
              </li>
              <li v-if="quality.branchesCountRequirement || quality.branchesValuesRequirement">
                <img src="/static/icons/graph-dark.svg" alt="">
                <span>
                  <template v-if="quality.branchesCountRequirement && quality.branchesValuesRequirement">
                    {{ quality.branchesCountRequirement }} веток с объёмом от
                    {{ bonusesFormatter(quality.branchesValuesRequirement) }} каждая
                  </template>
                </span>
              </li>
            </ul>

            <div v-if="quality.qualityBonusValue != null && quality.qualityBonusValue > 0" class="bonus">
              <div class="bonus-description">
                <strong>Бонус квалификаци</strong>
                <span class="bonus-count" v-if="quality.qualityBonusMaxCount != null">Не более {{ quality.qualityBonusMaxCount }} выплат</span>
              </div>
              <span class="bonus-value">{{ bonusesFormatter(quality.qualityBonusValue) }}</span>
            </div>
          </li>
          <li class="divider"><img src="/static/icons/chevron-down.svg" alt=""></li>
        </template>
      </ul>

      <p v-else-if="!loading" class="empty-state">Список квалификаций пока пуст.</p>
    </section>

    <CircleLinesLoading v-if="loading" centered />
  </div>
</template>

<script lang="ts">
import CircleLinesLoading from '~/components/loaders/CircleLinesLoading.vue';
import { bonusesFormatter } from '~/utils/utils';
import { Partner, Quality } from '~/utils/models';

export default {
  components: { CircleLinesLoading },

  data() {
    return {
      partner: {} as Partner,
      qualities: [] as Quality[],

      loading: false,
    };
  },

  async mounted() {
    this.updateQualities()
    if (this.$user.isPartner) {
      this.updatePartner();
    }
  },

  methods: {
    bonusesFormatter,
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
