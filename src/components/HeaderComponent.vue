<style lang="stylus" scoped>
@import '../styles/constants.styl'
@import '../styles/components.styl'
@import '../styles/buttons.styl'
@import '../styles/fonts.styl'
@import '../styles/utils.styl'
@import '../styles/animations.styl'
@import '../styles/scrollbars.styl'


.root-header
  .row-inner
    scrollbars-hidden()
    page-root()
    font-small()

    overflow-x auto
    display flex
    gap 5%
    align-items center
    justify-content space-between
    margin-inline auto
    padding-block 15px
    background colorBgLight

    .left-group
      hover-effect()
      animation-float()

      white-space nowrap
      font-upper()
      svg-inside(45px)
      font-medium()
      font-bold-extra()
      .text
        mobile-hidden()

    .center-group
      display flex
      flex 1
      gap 30px
      align-items center
      justify-content center
      font-upper()
      font-medium()
      animation-float()
      .button-home
        mobile-hidden()

      > *
        padding 5px 5px
        white-space nowrap
        hover-effect()
        trans()

        &.router-link-active
          color colorEmp2

    .right-group
      display flex
      flex 0
      gap 20px
      align-items center
      animation-float()
      .search
        flex 1

      .cart
      .profile
      .menu
        button-no-styles()
        hover-effect()

      .cart
        position relative
        display block
        .goods-number
          centered-flex-container()

          position absolute
          top -10px
          right -10px
          width 16px
          height 16px
          border-radius radiusMax
          font-size 10px
          color colorTextInvert1
          background colorEmp2

      .menu
        button-no-styles()
        animation-float()
        desktop-hidden()
        img
          img-size(20px)

  .overlay-menu
    position fixed
    z-index 999999
    inset 0 0 0 30vw
    padding 40px
    color colorTextInvert1
    background colorBgDark
    trans()
    .bg
      trans()

      position fixed
      z-index -1
      inset 0
      opacity 0.7
      background colorBgDark
      transition-delay 0.15s
    &.hidden
      transform translateX(100%)
      opacity 0
      filter blur(4px)
      .bg
        opacity 0
    a
      display block
      width min-content
      margin-inline auto
      padding 5px 10px
      white-space nowrap
    .header
      font-large()
      font-bold-extra()
      font-upper()
      svg-inside(40px)

      justify-content center
    .nav
      margin-block 20px
      font-medium()
      .header
        font-large()
        font-semibold()

        padding-block 5px
      .buttons-container
        button
          centered-margin()
          button-no-styles()
          font-medium()
          display block
          padding 5px 10px
    .button-close
      button-no-fill()
      svg-inside(25px)

      position absolute
      top 30px
      right 0
      &:hover
        background none

  .modal-inside
    width 70vw
    max-width 600px
    min-width 450px
    @media({mobile})
      width calc(100vw - 40px)
      min-width unset
    .header
      font-large()
      font-spaced()

      background colorBgDark
      color colorTextInvert1
      padding 30px
      text-align center
    .main
      background colorBgLight
      padding 30px
      .desc
        font-small()
        font-spaced()
        margin-block 10px
        text-align center
      .field
        margin-block 10px
      .submit
        button-emp2()
        centered-margin()
        width fit-content
        margin-top 40px
      .button-different-signin
        button-no-fill()
        font-lower()
        font-small-extra()
        centered-margin()
        color colorText1
        width fit-content
        margin-top 10px
</style>

<template>
  <header class="root-header">
    <div class="row-inner">
      <router-link :to="{ name: 'default' }" class="left-group" style="--animation-index: 0">
        <img class="logo" src="/static/images/logo-small.png" alt="logo" />
        <span class="text">Зов океана</span>
      </router-link>

      <div class="center-group" style="--animation-index: 1">
        <router-link :to="{ name: 'default' }" @click="isOverlayMenuShown = false" class="button-home">
          Главная
        </router-link>
        <router-link :to="{ name: 'market' }" @click="isOverlayMenuShown = false">Магазин</router-link>
      </div>

      <div class="right-group" style="--animation-index: 3">
        <router-link :to="{ name: 'cart' }" class="cart" @click="isOverlayMenuShown = false">
          <img src="/static/icons/cart-dark.svg" alt="cart" />
          <div class="goods-number" v-if="$store.state.cart.length">{{ $store.state.cart.length }}</div>
        </router-link>

        <router-link
          v-if="$store.state.user.isSignedIn"
          :to="{ name: 'profile' }"
          class="profile"
          @click="isOverlayMenuShown = false">
          <img src="/static/icons/profile.svg" alt="profile" />
        </router-link>
        <button v-else @click="$refs.signInModal.show()" class="profile">
          <img src="/static/icons/profile.svg" alt="profile" />
        </button>

        <button class="menu" @click="isOverlayMenuShown = true" style="--animation-index: 4">
          <img src="/static/icons/menu.svg" alt="menu" />
        </button>
      </div>
    </div>

    <section class="overlay-menu" :class="{ hidden: !isOverlayMenuShown }">
      <div class="bg" @click="isOverlayMenuShown = false" />

      <header class="header"><img src="/static/images/logo-big.png" alt="logo" />Зов океана</header>

      <nav class="nav">
        <header class="header">Навигация</header>
        <router-link :to="{ name: 'default' }" @click="isOverlayMenuShown = false">Главная</router-link>
        <router-link :to="{ name: 'market' }" @click="isOverlayMenuShown = false">Магазин</router-link>

        <router-link v-if="$store.state.user.isSignedIn" :to="{ name: 'profile' }" @click="isOverlayMenuShown = false">
          Профиль
        </router-link>
        <div v-else class="buttons-container">
          <button
            @click="
              $refs.signInModal.show();
              isOverlayMenuShown = false;
            ">
            Войти
          </button>
          <button
            @click="
              $refs.registerModal.show();
              isOverlayMenuShown = false;
            ">
            Регистрация
          </button>
        </div>

        <router-link :to="{ name: 'cart' }" @click="isOverlayMenuShown = false">Корзина</router-link>
      </nav>

      <nav class="nav">
        <header class="header">Категории</header>
        <router-link
          v-for="category in $globals?.categories"
          :to="{ name: 'market', query: { categoryId: category.id } }"
          :key="category.id"
          @click="isOverlayMenuShown = false">
          {{ category.title }}
        </router-link>
      </nav>

      <button class="button-close" @click="isOverlayMenuShown = false">
        <img src="/static/icons/cross.svg" alt="close" />
      </button>
    </section>

    <ModalsExpandable ref="registerModal">
      <div class="modal-inside">
        <header class="header">Регистрация</header>
        <main class="main">
          <div v-if="!userData.tgId">
            <TGAuth @signin="onTGSignIn" />

            <div class="desc">или</div>
          </div>
          <div v-else>
            Вы успешно авторизованы через Telegram: @{{ userData.tgUsername }}<br>
            Заполните данные ниже для завершения регистрации
          </div>

          <InputComponent
            v-model="userData.givenName"
            :error="errors.givenName"
            title="Имя"
            placeholder="Иван"
            autocomplete="given-name"
            :icon="IconProfile"
            icon-in-left
            class="field"
            @submit="register"
          />
          <InputComponent
            v-model="userData.familyName"
            :error="errors.familyName"
            title="Фамилия"
            placeholder="Иванов"
            autocomplete="family-name"
            :icon="IconProfile"
            icon-in-left
            class="field"
            @submit="register"
          />
          <InputComponent
            v-model="userData.middleName"
            :error="errors.middleName"
            title="Отчество"
            placeholder="Иванович"
            autocomplete="additional-name"
            :icon="IconProfile"
            icon-in-left
            class="field"
            @submit="register"
          />
          <InputComponent
            v-model="userData.email"
            :error="errors.email"
            title="Email"
            placeholder="ivan.ivanov@email.com"
            autocomplete="email"
            :icon="IconEmail"
            icon-in-left
            class="field"
            @submit="register"
          />
          <InputComponent
            v-model="userData.tel"
            :error="errors.tel"
            title="Телефон"
            placeholder="+7 (999) 123-4567"
            autocomplete="tel"
            :icon="IconTelephone"
            icon-in-left
            class="field"
            @submit="register"
          />
          <InputComponent
            v-model="userData.password"
            :error="errors.password"
            error-text="Пароль должен содержать минимум 6 символов"
            title="Пароль"
            placeholder="Пароль"
            autocomplete="password"
            hideable
            class="field"
            @submit="register"
          />
          <InputComponent
            v-model="userData.passwordRepeat"
            :error="errors.passwordRepeat"
            error-text="Пароли не совпадают"
            title="Повтор пароля"
            placeholder="Пароль"
            hideable
            class="field"
            @submit="register"
          />

          <button class="submit" @click="register">Зарегистрироваться</button>
          <button
            class="button-different-signin"
            @click="
              showSignInModal();
              hideRegisterModal();
            ">
            Войти
          </button>
        </main>
      </div>
    </ModalsExpandable>

    <ModalsExpandable ref="signInModal">
      <div class="modal-inside">
        <header class="header">Вход</header>
        <main class="main">
          <div>
            <TGAuth @signin="onTGSignIn" />

            <div class="desc">или</div>
          </div>

          <InputComponent
            v-model="userData.emailOrTel"
            :error="errors.emailOrTel"
            title="Email или телефон"
            placeholder="Email или телефон"
            autocomplete="email"
            :icon="IconProfile"
            icon-in-left
            class="field"
            @submit="signIn"
          />
          <InputComponent
            v-model="userData.password"
            :error="errors.password"
            error-text="Пароль должен содержать минимум 6 символов"
            title="Пароль"
            placeholder="Пароль"
            autocomplete="password"
            hideable
            class="field"
            @submit="signIn"
          />

          <button class="submit" @click="signIn">Войти</button>
          <button
            class="button-different-signin"
            @click="
              hideSignInModal();
              showRegisterModal();
            ">
            Зарегистрироваться
          </button>
        </main>
      </div>
    </ModalsExpandable>
  </header>
</template>

<script lang="ts">
import ModalsExpandable from '~/components/ModalsExpandable.vue';
import InputComponent from '~/components/InputComponent.vue';

import IconProfile from '#/icons/profile.svg';
import IconEmail from '#/icons/email.svg';
import IconTelephone from '#/icons/telegram-logo.svg';
import TGAuth, { TGUser } from '~/components/TGAuth.vue';
import Validators from '~/utils/validators';

export default {
  components: { TGAuth, InputComponent, ModalsExpandable },
  data() {
    return {
      isOverlayMenuShown: false,

      IconProfile,
      IconEmail,
      IconTelephone,

      userData: {
        tgId: '',
        tgUsername: '',
        givenName: '',
        middleName: '',
        familyName: '',
        email: '',
        tel: '',
        password: '',
        passwordRepeat: '',
        emailOrTel: '',
      },
      errors: {
        givenName: false,
        middleName: false,
        familyName: false,
        email: false,
        tel: false,
        password: false,
        passwordRepeat: false,
        emailOrTel: false,
      } as Record<PropertyKey, boolean | string>,

      loading: false,
    };
  },

  mounted() {},

  methods: {
    async onTGSignIn(user: TGUser) {
      // Попытаемся войти
      await this.$request(
        this,
        this.$api.loginWithTG,
        [String(user.id), user.username, user.hash, user.auth_date, user.photo_url, user.first_name, user.last_name],
        'Ошибка запроса входа через Telegram',
        async () => {
          await this.$store.dispatch('GET_USER');
          this.$store.dispatch('LOAD_CART');
          await this.$router.push({ name: 'profile' });
          this.hideSignInModal();
          this.hideRegisterModal();
        },
        true,
        {
          401: () => {
            this.$popups.error('Ошибка данных авторизации Telegram', 'Попробуйте ещё раз или войдите обычным способом');
          },
          404: () => {
            this.userData.tgId = String(user.id);
            this.userData.tgUsername = user.username || '';
            this.userData.givenName = user.first_name;
            this.userData.familyName = user.last_name || '';
            this.hideSignInModal();
            this.showRegisterModal();
          },
        },
      );
    },

    async register() {
      Object.keys(this.errors).forEach(key => (this.errors[key] = false));

      this.errors.givenName = !Validators.name.validate(this.userData.givenName);
      this.errors.middleName = !Validators.name.validate(this.userData.middleName);
      this.errors.familyName = !Validators.name.validate(this.userData.familyName);
      this.errors.email = !Validators.email.validate(this.userData.email);
      this.errors.tel = !Validators.phone.validate(this.userData.tel);
      this.errors.password = !Validators.password.validate(this.userData.password);
      this.errors.passwordRepeat = this.userData.password !== this.userData.passwordRepeat;

      if (Object.values(this.errors).findIndex(err => err) !== -1) {
        return;
      }

      this.userData.givenName = Validators.name.prettifyResult(this.userData.givenName);
      this.userData.middleName = Validators.name.prettifyResult(this.userData.middleName);
      this.userData.familyName = Validators.name.prettifyResult(this.userData.familyName);
      this.userData.email = Validators.email.prettifyResult(this.userData.email);
      this.userData.tel = Validators.phone.prettifyResult(this.userData.tel);
      this.userData.password = Validators.password.prettifyResult(this.userData.password);

      await this.$request(
        this,
        this.$api.register,
        [
          this.userData.givenName,
          this.userData.middleName,
          this.userData.familyName,
          this.userData.email,
          this.userData.tel,
          this.userData.password,
        ],
        `Не удалось зарегистрироваться`,
        async () => {
          await this.$store.dispatch('GET_USER');
          this.$store.dispatch('LOAD_CART');
          await this.$router.push({ name: 'profile' });
          this.hideSignInModal();
          this.hideRegisterModal();
        },
        true,
        {
          409: () => {
            this.errors.tel = 'Телефон или email уже заняты';
            this.errors.email = 'Телефон или email уже заняты';
          },
        },
      );
    },

    async signIn() {
      Object.keys(this.errors).forEach(key => (this.errors[key] = false));

      this.errors.password = !Validators.password.validate(this.userData.password);
      this.errors.emailOrTel =
        !Validators.email.validate(this.userData.emailOrTel) && !Validators.phone.validate(this.userData.emailOrTel);

      if (Object.values(this.errors).findIndex(err => err) !== -1) {
        return;
      }

      this.userData.password = Validators.password.prettifyResult(this.userData.password);
      if (Validators.email.validate(this.userData.emailOrTel)) {
        this.userData.emailOrTel = Validators.email.prettifyResult(this.userData.emailOrTel);
      } else {
        this.userData.emailOrTel = Validators.phone.prettifyResult(this.userData.emailOrTel);
      }

      await this.$request(
        this,
        this.$api.login,
        [this.userData.emailOrTel, this.userData.password],
        `Не удалось войти`,
        async () => {
          await this.$store.dispatch('GET_USER');
          this.$store.dispatch('LOAD_CART');
          await this.$router.push({ name: 'profile' });
          this.hideSignInModal();
          this.hideRegisterModal();
        },
        true,
        {
          401: () => {
            this.errors.password = 'Неверные email/телефон или пароль';
            this.errors.emailOrTel = 'Неверные email/телефон или пароль';
          },
        },
      );
    },

    showSignInModal() {
      (this.$refs.signInModal as HTMLDialogElement).show();
      this.hideRegisterModal();
    },
    hideSignInModal() {
      (this.$refs.signInModal as HTMLDialogElement).hide();
    },
    showRegisterModal() {
      (this.$refs.registerModal as HTMLDialogElement).show();
      this.hideSignInModal();
    },
    hideRegisterModal() {
      (this.$refs.registerModal as HTMLDialogElement).hide();
    },
  },
};
</script>
