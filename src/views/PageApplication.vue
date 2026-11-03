<style scoped lang="stylus">
@import '../styles/constants.styl'
@import '../styles/components.styl'
@import '../styles/buttons.styl'
@import '../styles/fonts.styl'
@import '../styles/utils.styl'
@import '../styles/animations.styl'
@import '../styles/scrollbars.styl'

.app-download
  --ink mix(colorEmp2, colorBgDark, 8%)

  color var(--ink)
  a:focus-visible, button:focus-visible, [role='tabpanel']:focus-visible
    outline 3px solid colorEmp2
    outline-offset 5px
  button
    cursor pointer
    font inherit
  .status-dot
    width 7px
    height 7px
    border-radius 50%
    background colorEmp2
  .app-hero
    display grid
    grid-template-columns 1.1fr 1fr
    gap 20px
    align-items center
    max-width pageMaxWidth
    margin auto
    padding 76px 40px 56px
  h1
    margin 28px 0 24px
    font-large()

    font-weight 600
    line-height 1.12
    letter-spacing -3px
  .hero-description
    font-large()

    max-width 410px
    color colorText3
  .hero-link
    font-medium()
    font-semibold()

    display inline-flex
    gap 36px
    align-items center
    margin-top 30px
    padding 16px 23px
    border-radius radiusMax
    color colorTextInvert1
    background var(--ink)
    transition transform 0.2s
    &:hover
      transform translateY(-3px)
    span
      font-lerge-extra()
  .hero-facts
    font-small()

    display flex
    flex-wrap wrap
    gap 14px
    margin-top 24px
    color colorText4
    span + span::before
      content '·'
      margin-right 14px
  .phone-scene
    position relative
    display flex
    align-items center
    justify-content center
    min-height 560px
    background radial-gradient(ellipse at center, mix(colorEmp2, colorBgLight, 35%), transparent 68%)
  .orbit
    position absolute
    z-index -1
    width 410px
    height 410px
    border 1px solid alpha(colorEmp2, 0.25)
    border-radius 50%
  .orbit-two
    width 500px
    height 500px
  .scene-caption, .scene-number
    font-small()

    position absolute
    line-height 1.8
    color colorText4
    letter-spacing 2px
  .scene-caption
    top 16px
    right 0
  .scene-number
    bottom 0
    left 18px
  .phone
    position relative
    transform rotate(8deg)
    width 250px
    height 510px
    padding 9px
    border 2px solid colorText3
    border-radius 42px
    background var(--ink)
    box-shadow 18px 30px 65px alpha(colorBgDark, 0.2), inset 0 0 0 2px alpha(colorBgLight, 0.2)
  .phone-screen
    position relative
    overflow hidden
    height 100%
    border-radius 31px
    background colorBgLight
  .phone-status
    display flex
    justify-content space-between
    padding 14px 17px 19px
    font-size 9px
    font-weight 700
  .phone-island
    position absolute
    top 10px
    left 50%
    transform translateX(-50%)
    width 72px
    height 18px
    border-radius radiusMax
    background var(--ink)
  .phone-brand
    display flex
    gap 7px
    align-items center
    padding 4px 14px 12px
    font-size 9px
    font-weight 700
    letter-spacing 1px
    img
      width 25px
      height 25px
    .phone-menu
      margin-left auto
      font-size 14px
  .phone-photo
    display flex
    flex-direction column
    justify-content flex-end
    height 200px
    padding 18px
    color colorTextInvert1
    background linear-gradient(0deg, alpha(colorBgDark, 0.8), alpha(colorBgDark, 0.05)), url('/static/images/crab-bg.jpg') right center / cover
    strong
      font-size 26px
      line-height 1.15
    .phone-tag
      margin-bottom 9px
      font-size 6px
      letter-spacing 1px
  .phone-catalog
    display flex
    align-items center
    justify-content space-between
    padding 17px 15px 12px
    font-size 15px
    line-height 1.4
    .phone-arrow
      font-size 26px
      color colorEmp2
  .phone-categories
    display flex
    gap 6px
    padding 0 15px
    span
      padding 7px 10px
      border 1px solid colorBorder
      border-radius radiusMax
      font-size 8px
  .phone-order
    display flex
    gap 9px
    align-items center
    margin 15px
    padding 10px
    border-radius 10px
    font-size 8px
    small
      display block
      margin-top 4px
      font-size 7px
      color colorText4
    .order-icon
      font-size 18px
      color colorEmp2
  .phone-home
    position absolute
    bottom 7px
    left 50%
    transform translateX(-50%)
    width 65px
    height 3px
    border-radius radiusMax
    background var(--ink)
  .floating-note
    position absolute
    bottom 55px
    left 0
    transform rotate(-5deg)
    display flex
    gap 12px
    align-items center
    padding 17px 21px
    border 1px solid alpha(colorBgLight, 0.8)
    border-radius 16px
    font-size 10px
    line-height 1.7
    background alpha(colorBgLight, 0.92)
    box-shadow 0 12px 40px alpha(colorBgDark, 0.07)
    .note-icon
      display grid
      place-items center
      width 35px
      height 35px
      border-radius 50%
      font-size 22px
      background colorEmp2
  .installation
    scroll-margin-top 90px
    display grid
    grid-template-columns 1fr 1.2fr
    gap 70px
    max-width pageMaxWidth
    margin auto
    padding 30px 40px 85px
    h2
      font-large()

      margin 21px 0
    .installation-intro > p
      font-medium()

      max-width 290px
      color colorText4
  .desktop-qr
    font-small()

    display flex
    gap 18px
    align-items center
    margin-bottom 25px
    color colorText4
    :deep(img)
      width 88px
      height 88px
  .install-card
    padding 27px
    border 1px solid alpha(colorBgDark, 0.08)
    border-radius 24px
    background colorBgLight
    box-shadow 0 16px 50px alpha(colorShadow, 0.2)
  .platform-tabs
    display grid
    grid-template-columns 1fr 1fr
    gap 5px
    margin-bottom 15px
    padding 5px
    border-radius radiusMax
    background colorBlockBgLow
    button
      font-small()
      font-semibold()

      display flex
      align-items center
      justify-content space-between
      padding 13px 17px
      border 0
      border-radius radiusMax
      color colorText3
      background transparent
      &.active
        color colorTextInvert1
        background var(--ink)
      span
        font-medium()
  .platform-hint
    font-small()

    margin 13px 0 27px
    color colorText4
    text-align center
  .panel-heading
    display flex
    gap 13px
    align-items center
    margin-bottom 24px
    h3
      font-medium()

      margin 0 0 6px
    p
      font-small-extra()

      color colorText4
  .platform-mark
    font-large-extra()

    display grid
    flex-shrink 0
    place-items center
    width 46px
    height 46px
    border-radius 14px
    background colorBlockBg
  .download-button, .copy-button
    button-emp1()
    gap 10px
    color colorText1
    text-transform none
    &:hover
      color colorText2
  .download-caption
    font-small-extra()

    display block
    margin 12px 0 28px
    color colorText4
    text-align center
  .install-steps
    display grid
    gap 23px
    list-style none
    li
      display flex
      gap 15px
      align-items flex-start
      > span
        font-small-extra()
        font-semibold()

        padding-top 2px
        color colorEmp2
      b
        font-small-extra()
      p
        font-small-extra()

        margin-top 7px
        color colorText4
  .install-note
    font-small-extra-extra()

    margin-top 24px
    padding-top 18px
    border-top 1px solid colorBlockBg
    line-height 1.5
    color colorText4
  .ios-description, .installed-note
    font-small-extra-extra()

    margin-bottom 10px
    line-height 1.5
    color colorText3
  .installed-note
    padding 13px
    border-radius 10px
    background colorBlockBg
  .share-symbol
    display inline-block
    padding 0 4px
    border 1px solid currentColor
    border-radius 3px
  .app-benefits
    display grid
    grid-template-columns repeat(3, 1fr)
    gap 40px
    max-width pageMaxWidth
    margin auto
    padding 40px 40px
    h3
      font-medium()

      margin-bottom 12px
    p
      font-small-extra()

      max-width 280px
      color colorText4

  @media ({mobile})
    .app-hero
      grid-template-columns 1fr
      gap 10px
      padding 35px 22px 25px
    .hero-copy
      position relative
      z-index 1
    .hero-facts
      gap 10px
    .phone-scene
      min-height 490px
      margin-top 10px
    .phone
      transform rotate(7deg) scale(0.88)
    .scene-caption
      top 25px
      right 10px
    .scene-number
      bottom 12px
      left 0
    .floating-note
      bottom 45px
      left 0
    .installation
      grid-template-columns 1fr
      gap 28px
      padding 35px 20px 40px
    .installation-intro h2 br
      display none
    .installation-intro > p
      max-width none
    .install-card
      grid-row 1
      padding 20px
    .platform-tabs button
      padding 12px
    .app-benefits
      display none
      grid-template-columns 1fr
      gap 30px
      padding 35px 22px 45px
      p
        max-width none
</style>

<template>
  <main class="app-download">
    <section class="app-benefits" aria-label="Возможности приложения"><article><h3>Море выбора</h3><p>Любимые морепродукты и новые вкусы — в одном каталоге.</p></article><article><h3>Всё под контролем</h3><p>Корзина, адреса и заказы в вашем личном кабинете.</p></article><article><h3>Ближе, чем кажется</h3><p>Одна иконка на экране — и вы снова у нас. Для работы нужен интернет.</p></article></section>
    
    <section id="installation" class="installation" aria-labelledby="install-heading">
      <div class="installation-intro">
        <div class="phone-scene" role="img" aria-label="Иллюстрация приложения Зов Океана на экране телефона">
          <div class="orbit orbit-one" /><div class="orbit orbit-two" />
          <div class="phone">
            <div class="phone-screen">
              <div class="phone-status"><span>9:41</span><span>●●● ▰</span></div>
              <div class="phone-island" />
              <div class="phone-brand"><img :src="'/static/favicon.png'" alt=""><span>ЗОВ ОКЕАНА</span><span class="phone-menu">☰</span></div>
              <div class="phone-photo"><span class="phone-tag">СОТНИ МОРЕПРОДУКТОВ В КАРМАНЕ</span><strong>Море вкуса.<br>К вашему столу.</strong></div>
              <div class="phone-catalog"><span>Ваш следующий<br><b>вкусный выбор</b></span><span class="phone-arrow">↗</span></div>
              <div class="phone-categories"><span>Креветки</span><span>Краб</span><span>Рыба</span></div>
              <div class="phone-order"><span class="order-icon">✓</span><span><b>Всё в одном месте</b><small>Каталог · Корзина · Заказы</small></span></div>
              <div class="phone-home" />
            </div>
          </div>
        </div>
      </div>

      <div class="install-card">
        <div class="platform-tabs" role="tablist" aria-label="Операционная система">
          <button id="android-tab" ref="androidTab" type="button" role="tab" :aria-selected="platform === 'android'" aria-controls="android-panel" :tabindex="platform === 'android' ? 0 : -1" :class="{ active: platform === 'android' }" @click="platform = 'android'" @keydown="switchTab">Android <span aria-hidden="true">↗</span></button>
          <button id="ios-tab" ref="iosTab" type="button" role="tab" :aria-selected="platform === 'ios'" aria-controls="ios-panel" :tabindex="platform === 'ios' ? 0 : -1" :class="{ active: platform === 'ios' }" @click="platform = 'ios'" @keydown="switchTab">iPhone / iPad <span aria-hidden="true">↗</span></button>
        </div>

        <transition name="opacity" mode="out-in">
          <div v-if="platform === 'android'" id="android-panel" role="tabpanel" aria-labelledby="android-tab" tabindex="0" class="platform-panel">
            <div class="panel-heading"><span class="platform-mark" aria-hidden="true">↓</span><div><h3>Скачайте. Откройте. Готово.</h3><p>Приложение для Android 7.0 и новее</p></div></div>
            <a class="download-button" href="/downloads/zov-oceana.apk" download="zov-oceana.apk">Скачать для Android <span aria-hidden="true">↓</span></a>
            <span class="download-caption">APK-файл · Без магазина приложений</span>
            <ol class="install-steps">
              <li><span>01</span><div><b>Скачайте APK</b><p>Нажмите кнопку выше и дождитесь окончания загрузки.</p></div></li>
              <li><span>02</span><div><b>Откройте файл</b><p>Найдите его в загрузках браузера. Если Android попросит, разрешите этому браузеру установку приложений.</p></div></li>
              <li><span>03</span><div><b>Нажмите «Установить»</b><p>Откройте «Зов Океана» с экрана телефона и войдите в свой аккаунт.</p></div></li>
            </ol>
            <p class="install-note">Android может показать предупреждение о скачивании APK — это обычная проверка файлов вне магазина. Скачивайте приложение только с нашего сайта.</p>
          </div>

          <div v-else-if="platform === 'ios'" id="ios-panel" role="tabpanel" aria-labelledby="ios-tab" tabindex="0" class="platform-panel">
            <div class="panel-heading"><span class="platform-mark" aria-hidden="true">＋</span><div><h3>Добавьте на экран «Домой».</h3><p>Прямо из Safari, без App Store</p></div></div>
            <p v-if="isStandalone" class="installed-note">Похоже, вы уже открыли сайт как приложение. Всё готово!</p>
            <p v-else class="ios-description">На iPhone и iPad приложение устанавливается через браузер. На экране появится наша иконка — открывайте магазин одним касанием.</p>
            <div v-if="!detectedPlatform" class="desktop-qr"><QRGenerator :text="pageUrl" /><span>Откройте эту страницу<br>камерой телефона</span></div>
            <ol class="install-steps">
              <li><span>01</span><div><b>Откройте сайт в Safari</b><p>Если вы перешли из Telegram или другого приложения, скопируйте ссылку ниже и откройте её в Safari.</p></div></li>
              <li><span>02</span><div><b>Нажмите «Поделиться» <span class="share-symbol" aria-hidden="true">↑</span></b><p>Найдите значок квадрата со стрелкой вверх. В некоторых версиях Safari он находится в меню «Ещё».</p></div></li>
              <li><span>03</span><div><b>Выберите «На экран “Домой”»</b><p>Если есть переключатель «Открывать как веб-приложение», включите его. Затем нажмите «Добавить».</p></div></li>
            </ol>
            <p class="copy-status" role="status">{{ copyStatus }}</p>
            <p class="install-note">Не видите нужного пункта? Прокрутите список действий вниз и нажмите «Изменить действия». Названия пунктов могут немного отличаться в зависимости от версии iOS.</p>
          </div>
        </transition>
      </div>
    </section>
  </main>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import QRGenerator from '~/components/QRGenerator.vue';
import { detectMobilePlatform, type MobilePlatform } from '~/utils/utils';

export default defineComponent({
  components: { QRGenerator },
  data() {
    const detectedPlatform = detectMobilePlatform(navigator.userAgent, navigator.platform, navigator.maxTouchPoints);
    return {
      detectedPlatform,
      platform: (detectedPlatform || 'android') as MobilePlatform,
      pageUrl: `${window.location.origin}/app`,
      copyStatus: '',
      isStandalone: window.matchMedia('(display-mode: standalone)').matches || Boolean((navigator as Navigator & { standalone?: boolean }).standalone),
    };
  },
  methods: {
    async copyLink() {
      try {
        await navigator.clipboard.writeText(this.pageUrl);
        this.copyStatus = 'Ссылка скопирована. Вставьте её в адресную строку Safari.';
      } catch {
        this.copyStatus = `Скопируйте адрес вручную: ${this.pageUrl}`;
      }
    },
    async switchTab(event: KeyboardEvent) {
      if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
      event.preventDefault();
      this.platform = event.key === 'Home' ? 'android' : event.key === 'End' ? 'ios' : this.platform === 'ios' ? 'android' : 'ios';
      await this.$nextTick();
      (this.$refs[this.platform === 'ios' ? 'iosTab' : 'androidTab'] as HTMLButtonElement).focus();
    },
  },
});
</script>
