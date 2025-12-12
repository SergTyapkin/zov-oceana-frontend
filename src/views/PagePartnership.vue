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
    .button-submit
      button-emp2()
      centered-margin()
      width fit-content
      margin-top 50px
    .text
      centered-margin()
      max-width 600px
      background colorBlockBg
      padding 30px
      margin-top 30px
      mark
        font-semibold()
        background none
</style>

<template>
  <div class="root-page">
    <section class="title">
      <header class="header" style="--animation-index: 0">Сотрудничество</header>
    </section>

    <section class="info">
      <p class="text">
        Станьте нашим партнером, получайте проценты за ваши продажи, привлекайте новых партнёров и получайте прибыль от
        их продаж.
        <br />
        <mark>Станьте получать доход прямо сейчас!</mark>
      </p>

      <button
        class="button-submit"
        @click="submit"
        :disabled="!$user.isSignedIn || $user.partnerStatus !== false || loading"
      >
        Отправить заявку
      </button>

      <p v-if="$user.partnerStatus !== false" class="text">
        Ваша заявка отправлена. Ожидайте звонка оператора
      </p>
    </section>

    <CircleLinesLoading v-if="loading" centered />
  </div>
</template>

<script lang="ts">
import CircleLinesLoading from '~/components/loaders/CircleLinesLoading.vue';

export default {
  components: { CircleLinesLoading },

  data() {
    return {
      loading: false,
    };
  },

  computed: {},

  mounted() {},

  methods: {
    async submit() {
      if (
        !(await this.$modals.confirm(
          'Вы точно хотите стать партнером?',
          'Мы свяжемся с вами в ближайшее время по телефону, указанному в профиле',
        ))
      ) {
        return;
      }

      await this.$request(this, this.$api.sendPartnershipRequest, [this.$user.id], `Не удалось отправить заявку на сотрудничество`);
      await this.$store.dispatch('GET_USER');
      this.$forceUpdate();
    },
  },
};
</script>
