<style lang="stylus" scoped>
@import '../../../styles/constants.styl'
@import '../../../styles/components.styl'
@import '../../../styles/buttons.styl'
@import '../../../styles/fonts.styl'
@import '../../../styles/utils.styl'
@import '../../../styles/animations.styl'
@import '../../../styles/scrollbars.styl'

.root-profile
  page-root()

  padding-top 0

  section.title
  nav.navigation
    page-root-disable()

  section.title
    page-root()

    display flex
    gap 20px
    padding-block 70px
    color colorTextInvert1
    background linear-gradient(#00000077, #00000077), url("/static/images/crab-bg.jpg")
    background-position 100% 100%
    background-size cover
    .avatar
      centered-flex-container()
      animation-float()
    .username
      font-large-extra-extra()
      font-semibold()
      font-upper()
      animation-float(0.5s, -20px, 0, left)

      margin-bottom 20px
    .telegram-link
      animation-float()

      width fit-content
      margin-top 20px
      .root-tg-auth
        align-items flex-start
      p
        font-small()
        font-thin()

        margin-bottom 10px
        color colorTextInvert3
    .info-date
      font-small()
      font-thin()
      animation-float()

      color colorTextInvert3

    @media ({mobile})
      padding-top 30px
      padding-bottom 20px

  nav.navigation
    overflow-x auto
    display flex
    color colorTextInvert1
    text-align center
    background colorBgDark
    box-shadow 0 0 10px colorShadow
    > *
      display block
      flex 1
      padding 15px 20px
      background colorBgDark
      &.router-link-exact-active
        background colorEmp2

      @media ({mobile})
        font-small()

        padding 10px 10px
      trans()
      hover-effect()
      animation-float()

    @media ({mobile})
      display flex
      flex-wrap wrap
    scrollable()

  section.profile-main
    animation-float()

    margin-top 60px

    @media ({mobile})
      margin-top 20px
</style>

<template>
  <div class="root-profile">
    <section class="title page-title">
      <UserAvatar class="avatar" :user="$user" size="100px" size-mobile="80px" />

      <div>
        <header class="username" style="--animation-index: 1">{{ $user.givenName }} {{ $user.familyName }}</header>
        <div class="info-date" style="--animation-index: 2">Участник с {{ dateFormatter($user.joinedDate) }}</div>
        <div v-if="$user.tgId" class="info-date" style="--animation-index: 3">
          Telegram: {{ $user.tgUsername ? `@${$user.tgUsername}` : `id: ${$user.tgId}` }}
        </div>
        <div v-else class="telegram-link" :aria-busy="loading" style="--animation-index: 3">
          <!-- <p v-show="!loading" v-if="!isTgAuthError">Привяжите Telegram, чтобы получать уведомления о заказах</p> -->
          <TGAuth @login="linkTelegram" @error="isTgAuthError = true" />
          <CircleLinesLoading v-if="loading" />
        </div>
      </div>
    </section>

    <nav class="navigation">
      <router-link :to="{name: 'profile'}" style="--animation-index: 0">Профиль</router-link>
      <router-link v-if="$user.isPartner" :to="{name: 'profilePartnership'}" style="--animation-index: 1">Партнерство</router-link>
      <router-link :to="{name: 'profileOrders'}" style="--animation-index: 1">Заказы</router-link>
      <router-link :to="{name: 'profileAddresses'}" style="--animation-index: 2">Адреса</router-link>
      <router-link :to="{name: 'profileSettings'}" style="--animation-index: 3">Настройки</router-link>
    </nav>

    <section class="profile-main" style="--animation-index: 1">
      <router-view #default="{ Component }">
        <transition name="opacity" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </section>
  </div>
</template>

<script lang="ts">
import { dateFormatter } from '~/utils/utils';
import TGAuth, { type TGUser } from '~/components/TGAuth.vue';
import CircleLinesLoading from '~/components/loaders/CircleLinesLoading.vue';
import UserAvatar from '~/components/UserAvatar.vue';

export default {
  components: { UserAvatar, TGAuth, CircleLinesLoading },

  data() {
    return {
      loading: false,

      isTgAuthError: false,
    };
  },

  async mounted() {
  },

  methods: {
    dateFormatter,
    async linkTelegram(user: TGUser) {
      if (this.loading || this.$user.tgId) return;
      await this.$request(
        this, 
        this.$api.linkTelegram,
        [String(user.id), user.username, user.hash, user.auth_date, user.photo_url, user.first_name, user.last_name],
        'Не удалось привязать Telegram', 
        async () => {
          await this.$store.dispatch('GET_USER');
          this.$popups.success('Telegram успешно привязан');
        },
      );
    },
  },
};
</script>
