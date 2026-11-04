<style lang="stylus" scoped>
@import 'styles/constants.styl'
@import 'styles/components.styl'
@import 'styles/buttons.styl'
@import 'styles/fonts.styl'
@import 'styles/utils.styl'
@import 'styles/animations.styl'
@import 'styles/scrollbars.styl'

.wrapper
  flex 1
  width 100%

.initial-page-loading
  display flex
  flex-direction column
  align-items center
  gap 20px
  padding 60px 20px
  // height 100%
  // min-height 100vh

  // > *
  //  position absolute
  //  width 100%
  //  min-height 100vh
</style>

<style lang="stylus">
@keyframes scale-out
  from
    transform scale(1)
    opacity 1

  to
    transform scale(0.95)
    opacity 0


@keyframes scale-in
  0%
    transform scale(1.05)
    opacity 0

  25%
    transform scale(1.05)
    opacity 0

  100%
    transform scale(1)
    opacity 1


.scale-in-enter-active
  overflow hidden
  animation scale-in 0.2s ease

.scale-in-leave-active
  overflow hidden
  animation scale-out 0.2s ease


.opacity-enter-active
  animation opacity 0.2s

.opacity-leave-active
  animation opacity 0.2s reverse forwards


@keyframes opacity
  0%
    opacity 0

  100%
    opacity 1
</style>

<template>
  <HeaderComponent ref="header" class="header" />

  <div class="wrapper">
    <router-view #default="{ Component }">
      <div v-if="!Component && !$store.state.userReady" role="status" class="initial-page-loading">
        <CircleLinesLoading />
        <p>Загружаем данные профиля…</p>
      </div>
      <transition name="opacity" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>
  </div>

  <FooterComponent ref="footer" class="footer" />

  <Popups ref="popups" />
  <Modals ref="modals" />
</template>

<script lang="ts">
import { getCurrentInstance } from 'vue';
import { Modals, Popups } from '@sergtyapkin/modals-popups';
import API from '~/utils/API';
import { getRequestFoo, saveAllAssetsByServiceWorker, setDisableCachingUrlsByServiceWorker } from '~/utils/utils';
import HeaderComponent from '~/components/HeaderComponent.vue';
import FooterComponent from '~/components/FooterComponent.vue';
import { DISABLED_CACHING_URLS } from '~/constants';
import CircleLinesLoading from '~/components/loaders/CircleLinesLoading.vue';
import swAPI from '~/serviceWorker/swAPI';

function removeAllHoverStyles() {
  // try {
  //   // prevent exception on browsers not supporting DOM styleSheets properly
  //   for (var si in document.styleSheets) {
  //     var styleSheet = document.styleSheets[si];
  //     if (!styleSheet.rules) continue;

  //     for (var ri = styleSheet.rules.length - 1; ri >= 0; ri--) {
  //       if (!styleSheet.rules[ri].selectorText) continue;

  //       if (styleSheet.rules[ri].selectorText.match(':hover')) {
  //         styleSheet.deleteRule(ri);
  //       }
  //     }
  //   }
  // } catch (err) {
  //   console.log('Error while removing hover styles:', err);
  // }
}

export default {
  components: { HeaderComponent, FooterComponent, Modals, Popups, CircleLinesLoading },

  data(): {
    transitionName: string;
    global?: Record<string, any>;
  } {
    return {
      transitionName: '',
      global: undefined,
    };
  },

  async mounted() {
    const globals = getCurrentInstance()!.appContext.config.globalProperties;
    this.global = globals;
    this.global.$modals = this.$refs.modals;
    this.global.$popups = this.$refs.popups;
    this.global.$app = this;
    this.global.$api = new API(`/api`);
    this.global.$log = (...data: any[]) => console.log(...data);
    this.global.$request = getRequestFoo(this.$popups.error);
    this.$store.$app = this;

    this.checkMobileScreen();
    window.addEventListener('resize', this.checkMobileScreen);

    void this.$store.dispatch('LOAD_REFERRER_ID');
    void this.$store.dispatch('LOAD_CART');
    void this.$store.dispatch('GET_GLOBALS');
    void this.$store.dispatch('GET_USER').then(() => this.$store.dispatch('LOAD_CART'));

    await swAPI.register();
    setDisableCachingUrlsByServiceWorker(DISABLED_CACHING_URLS);
    saveAllAssetsByServiceWorker(({ current, total, progress }) => {
      console.log(`Saved resource by SW: ${current}. Progress: ${progress}/${total}`);
    });
  },

  unmounted() {
    window.removeEventListener('resize', this.checkMobileScreen);
  },

  methods: {
    checkMobileScreen() {
      if (window.innerWidth <= 700) {
        this.global!.$isMobile = true;
        removeAllHoverStyles();
        return;
      }
      this.global!.$isMobile = false;
    },

    updateElements() {
      (this.$refs.footer as typeof FooterComponent).$forceUpdate();
      (this.$refs.header as typeof HeaderComponent).$forceUpdate();
    },

    showSignInModal() {
      (this.$refs.header as typeof HeaderComponent).showSignInModal();
    },
    showRegisterModal() {
      (this.$refs.header as typeof HeaderComponent).showRegisterModal();
    },
  },

  watch: {
    $route(to, from) {
      this.transitionName = 'scale-in';

      console.log(from.path, 'TO', to.path);
    },
  },
};
</script>
