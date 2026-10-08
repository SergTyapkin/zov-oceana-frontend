<style scoped lang="stylus">
@import '../styles/constants.styl'
@import '../styles/components.styl'
@import '../styles/buttons.styl'
@import '../styles/fonts.styl'
@import '../styles/utils.styl'
@import '../styles/animations.styl'
@import '../styles/scrollbars.styl'

.root-page
  page-root()

  padding-block 0

  section.title
    page-root()
    page-root-disable()

    width 100vw
    padding-block 70px
    color colorTextInvert1
    background linear-gradient(#00000077, #00000077), url("/static/images/ocean-bg.jpg")

    .header
      font-large-extra-extra()
      font-semibold()
      font-upper()
      animation-float(0.5s, -20px, 0, left)

      text-align center

  section.info
    margin-bottom 100px
    .button-submit
      button-emp2()
      centered-margin()

      width fit-content
      margin-top 50px
    .info-block
      centered-margin()

      max-width 600px
      margin-top 30px
      padding 30px
      background colorBlockBg
  
    .payout
      overflow auto
      display flex
      flex-direction column
      gap 20px
      padding 20px
      box-shadow 0 0 10px colorShadow
      margin-top 20px
      .header
        font-medium()
        font-upper()

        padding 20px
        margin -20px
        margin-bottom 0
        
        color colorTextInvert1
        background colorBgDark
        svg-inside(25px)
        .info
          font-small-extra()
          color colorTextInvert3
</style>

<template>
  <div class="root-page">
    <section class="title">
      <header class="header" style="--animation-index: 0">Вывод партнерских бонусов</header>
    </section>

    <section class="info">
      <p class="info-block">
        Вывод происходит через СБП. <br>
        <small>НДФЛ включены. Никаких налогов платить не нужно</small>
      </p>

      <CircleLinesLoading v-if="loading" centered />
      <p v-else-if="!$user.isPartner" class="text">
        Нужно являться партнером, чтобы выводить средства
      </p>
      <article class="payout" v-else-if="$user.isPartnershipRequested === false">
        <header class="header">
          <img src="/static/icons/graph.svg" alt="">
          <div>
            Вам доступно {{ bonusesFormatter(partner.totalBonuses) }}
            <div class="info">Это {{ costFormatter(partner.totalBonuses * $globals.moneyForBonuses) }}</div>
          </div>
        </header>


        <SelectList
          v-model="bank"
          :list="
            banks?.map?.(b => ({
              id: b.id,
              name: `${b.titleRus} (${b.title})`,
              value: b,
            }))
          "
          title="Выплатить в банк"
          with-search
          title-always-shown
        />

        <InputComponent
          v-model="tel"
          type="phone"
          class="input"
          title="Телефон получателя"
          placeholder="8-(123)-456-78-90"
          description="В любом формате. Внимательно перепроверьте. В выбранном банке должен быть создан счет на этот номер"
        />

        <InputComponent
          v-model="amount"
          type="number"
          class="input"
          title="Сумма для вывода"
          placeholder="1000"
          description="В бонусах, а не рублях"
          @input="amount = Math.min(amount, partner.totalBonuses)"
        />

        <div>Будет выведено {{ costFormatter(amount * $globals.moneyForBonuses) }}</div>

        <button
          class="button-submit"
          @click="submit"
          :disabled="loading"
        >
          Вывести средства
        </button>
      </article>
    </section>
  </div>
</template>

<script lang="ts">
import CircleLinesLoading from '~/components/loaders/CircleLinesLoading.vue';
import SelectList from '~/components/SelectList.vue';
import InputComponent from '~/components/InputComponent.vue';
import { Partner, SBPBank } from '~/utils/models';
import { costFormatter, bonusesFormatter } from '~/utils/utils';

export default {
  components: { CircleLinesLoading, SelectList, InputComponent },

  data() {
    return {
      partner: {} as Partner,
      banks: [] as SBPBank[],

      tel: this.$user.tel,
      bank: null as SBPBank | null,
      amount: 0,

      loading: false,
    };
  },

  computed: {},

  mounted() {
    this.updatePartner();
    this.updateBanks();
  },

  methods: {
    costFormatter,
    bonusesFormatter,
    
    async submit() {
      if (
        !(await this.$modals.confirm(
          'Вы подтверждаете правильность номера телефона и банка?',
          `Телефон: ${this.tel}. Банк: ${this.bank?.titleRus} (${this.bank?.title})`,
        ))
      ) {
        return;
      }

      await this.$request(
        this,
        this.$api.sendPartnershipRequest,
        [this.$user.id],
        `Не удалось отправить заявку на вывод средств`,
        () => {
          this.$popups.success('Заявка на вывод отправлена', 'Деньги скоро поступят по указанному номеру телефона');
          this.$router.push({name: 'profilePartnership'});
        }
      );
    },

    async updatePartner() {
      this.partner = (await this.$request(
        this,
        this.$api.getUserPartnerInfo,
        [this.$user.id],
        `Не удалось получить данные партнера`,
      )) as Partner;

      this.amount = this.partner?.totalBonuses ?? 0;
    },

    async updateBanks() {
      this.banks = ((await this.$request(
        this,
        this.$api.getSpbBanks,
        [],
        `Не удалось получить список банков`,
      )) as {banks: SBPBank[]}).banks;
    },
  },
};
</script>
