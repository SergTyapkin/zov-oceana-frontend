<style lang="stylus" scoped>
@import '../../../styles/constants.styl'
@import '../../../styles/components.styl'
@import '../../../styles/buttons.styl'
@import '../../../styles/fonts.styl'
@import '../../../styles/utils.styl'
@import '../../../styles/animations.styl'
@import '../../../styles/scrollbars.styl'

.root-profile-settings
  box-shadow 0 0 10px colorShadow
  .header
    padding 30px
    color colorTextInvert1
    background colorBgDark
    .header-title
      font-large()
      font-upper()

      margin-bottom 5px
    .header-desc
      font-small()
      font-thin()

      color colorTextInvert3

  .main
    width 100%
    padding-block 30px
    .settings-list
      list-no-styles()

      display flex
      flex-direction column
      flex-wrap wrap
      width 100%
      .setting
        display flex
        gap 15px
        justify-content space-between
        padding 20px 30px
        &.selected
          box-shadow 0 0 10px colorShadow

        .icon-container
          centered-flex-container()
          img
            img-size(25px)

        .text-container
          flex 1
          .title
            font-medium()

            margin-bottom 5px
          .desc
            font-small()
            font-thin()

            color colorText3
          .inputs-container
            display flex
            flex-direction column
            gap 10px
            width 100%
            padding-top 30px
            .save-button
              button-emp2()


        .action-container
          centered-flex-container()
          .button-change-password
            button-no-styles()
            font-small()

            cursor pointer
            padding 10px
            color colorText1
            trans()
            &:hover
              color colorTextInvert1
              background colorBgDark
</style>

<template>
  <div class="root-profile-settings">
    <header class="header">
      <header class="header-title">Настройки аккаунта</header>
      <div class="header-desc">Управление настройками учетной записи</div>
    </header>

    <main class="main">
      <ul class="settings-list">
        <li class="setting">
          <div class="icon-container">
            <img src="/static/icons/settings.svg" alt="setting">
          </div>

          <div class="text-container">
            <div class="title">Email уведомления</div>
            <div class="desc">Получать уведомления о статусе заказов</div>
          </div>

          <div class="action-container">
            <InputSwitch v-model="fields.isEmailNotificationsOn" @input="updateisEmailNotificationsOn" />
          </div>
        </li>

        <li class="setting" :class="{ selected: passwordChangeBlockOpened }">
          <div v-if="!passwordChangeBlockOpened" class="icon-container">
            <img src="/static/icons/settings.svg" alt="setting">
          </div>

          <div class="text-container">
            <div class="title">Изменить пароль</div>
            <div class="desc">Обновить пароль учетной записи</div>
            <transition name="opacity">
              <div v-if="passwordChangeBlockOpened" class="inputs-container">
                <InputComponent
                  v-model="fields.oldPassword"
                  title="Текущий пароль"
                  placeholder="Старый пароль"
                  hideable
                  hidden-by-default
                  :error="errors.oldPassword"
                />
                <InputComponent
                  v-model="fields.newPassword"
                  title="Новый пароль"
                  placeholder="Новый пароль"
                  hideable
                  hidden-by-default
                  :error="errors.newPassword"
                  description="Более 6 символов"
                />
                <InputComponent
                  :error="errors.newPasswordConfirmation"
                  v-model="fields.newPasswordConfirmation"
                  title="Новый пароль ещё раз"
                  placeholder="Новый пароль ещё раз"
                  hideable
                  hidden-by-default
                />
                <button
                  @click="changePassword"
                  class="save-button"
                  :disabled="!fields.oldPassword || !fields.newPassword || !fields.newPasswordConfirmation"
                >
                  Изменить
                </button>
              </div>
            </transition>
          </div>

          <div v-if="!passwordChangeBlockOpened" class="action-container">
            <button @click="passwordChangeBlockOpened = true" class="button-change-password">Изменить</button>
          </div>
        </li>
      </ul>
    </main>

    <CircleLoading v-if="loading" centered />
  </div>
</template>

<script lang="ts">
import CircleLoading from '~/components/loaders/CircleLoading.vue';
import InputSwitch from '~/components/InputSwitch.vue';
import InputComponent from '~/components/InputComponent.vue';
import Validators from '~/utils/validators';

export default {
  components: { InputComponent, InputSwitch, CircleLoading },

  data() {
    return {
      fields: {
        isEmailNotificationsOn: this.$user.isEmailNotificationsOn,
        oldPassword: '',
        newPassword: '',
        newPasswordConfirmation: '',
      },
      errors: {
        oldPassword: false,
        newPassword: false,
        newPasswordConfirmation: false,
      },

      passwordChangeBlockOpened: false,

      loading: false,
    };
  },

  mounted() {},

  methods: {
    async updateisEmailNotificationsOn() {
      await this.$request(
        this,
        this.$api.updateProfile,
        [
          this.$user.id,
          {
            isEmailNotificationsOn: this.fields.isEmailNotificationsOn,
          },
        ],
        `Не удалось обновить данные пользователя`,
      );
    },

    async changePassword() {
      this.errors.oldPassword = !Validators.password.validate(this.fields.oldPassword);
      this.errors.newPassword = !Validators.password.validate(this.fields.newPassword);
      this.errors.newPasswordConfirmation =
        !Validators.password.validate(this.fields.newPasswordConfirmation) ||
        this.fields.newPasswordConfirmation !== this.fields.newPassword;
      if (this.errors.oldPassword || this.errors.newPassword || this.errors.newPasswordConfirmation) {
        return;
      }
      this.fields.oldPassword = Validators.password.prettifyResult(this.fields.oldPassword);
      this.fields.newPassword = Validators.password.prettifyResult(this.fields.newPassword);
      this.fields.newPasswordConfirmation = Validators.password.prettifyResult(this.fields.newPasswordConfirmation);

      await this.$request(
        this,
        this.$api.updateProfilePassword,
        [
          this.$user.id,
          {
            oldPassword: this.fields.oldPassword,
            newPassword: this.fields.newPassword,
          },
        ],
        `Не удалось обновить пароль`,
      );
    },
  },
};
</script>
