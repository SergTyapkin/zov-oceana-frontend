<style lang="stylus" scoped>
@import '../../../styles/constants.styl'
@import '../../../styles/components.styl'
@import '../../../styles/buttons.styl'
@import '../../../styles/fonts.styl'
@import '../../../styles/utils.styl'
@import '../../../styles/animations.styl'
@import '../../../styles/scrollbars.styl'

.root-profile-info
  box-shadow 0 0 10px colorShadow
  .header
    background colorBgDark
    color colorTextInvert1
    padding 30px
    .header-title
      font-large()
      font-upper()
      margin-bottom 5px
    .header-desc
      font-small()
      font-thin()
      color colorTextInvert3

  .main
    padding 30px
    display flex
    flex-direction column
    gap 15px
    width 100%
    .row
      flex 1
      display flex
      gap 10px
      flex-wrap wrap
      > *
        flex 1
        min-width 200px
      .button-save
        button-emp2()
</style>

<template>
  <div class="root-profile-info">
    <header class="header">
      <header class="header-title">Личная информация</header>
      <div class="header-desc">Обновите свои личные данные</div>
    </header>

    <main class="main" @input="isEdited = true">
      <div class="row">
        <InputComponent title="Фамилия" v-model="fields.familyName" placeholder="Ваша фамилия" :error="errors.familyName" />
        <InputComponent title="Имя" v-model="fields.givenName" placeholder="Ваше имя" :error="errors.givenName" />
        <InputComponent title="Отчество" v-model="fields.middleName" placeholder="Ваше отчество" :error="errors.middleName" />
      </div>
      <div class="row">
        <InputComponent title="Email" v-model="fields.email" placeholder="your@email.ru" :error="errors.email" />
      </div>
      <div class="row">
        <InputComponent title="Телефон" v-model="fields.tel" placeholder="+7 (999) 123-45-67" :error="errors.tel" />
      </div>
      <div class="row">
        <button class="button-save" @click="save" :disabled="!isEdited">Сохранить изменения</button>
      </div>
    </main>

    <CircleLoading v-if="loading" centered />
  </div>
</template>

<script lang="ts">
import CircleLoading from '~/components/loaders/CircleLoading.vue';
import Validators from '~/utils/validators';
import InputComponent from '~/components/InputComponent.vue';

export default {
  components: { InputComponent, CircleLoading },

  data() {
    return {
      loading: false,

      fields: {
        givenName: this.$user.givenName,
        familyName: this.$user.familyName,
        middleName: this.$user.middleName || '',
        email: this.$user.email,
        tel: this.$user.tel || '',
      },

      errors: {
        givenName: false,
        familyName: false,
        middleName: false,
        email: false,
        tel: false,
      },

      isEdited: false,
    };
  },

  async mounted() {},

  methods: {
    async save() {
      if (!this.isEdited) {
        return;
      }

      this.errors.givenName = !Validators.name.validate(this.fields.givenName);
      this.errors.familyName = !Validators.name.validate(this.fields.familyName);
      this.errors.middleName = !Validators.nameOptional.validate(this.fields.middleName);
      this.errors.email = !Validators.email.validate(this.fields.email);
      this.errors.tel = !Validators.phone.validate(this.fields.tel);
      if (
        this.errors.givenName ||
        this.errors.familyName ||
        this.errors.middleName ||
        this.errors.email ||
        this.errors.tel
      ) {
        return;
      }
      this.fields.givenName = Validators.name.prettifyResult(this.fields.givenName);
      this.fields.familyName = Validators.name.prettifyResult(this.fields.familyName);
      this.fields.middleName = Validators.nameOptional.prettifyResult(this.fields.middleName);
      this.fields.email = Validators.email.prettifyResult(this.fields.email);
      this.fields.tel = Validators.phone.prettifyResult(this.fields.tel);

      await this.$request(
        this,
        this.$api.updateProfile,
        [
          this.$user.id,
          this.fields,
        ],
        `Не удалось обновить данные пользователя`,
      );
    },

    async logout() {
      await this.$request(
        this,
        this.$api.logout,
        [],
        `Не удалось выйти из аккаунта`,
      );
      this.$store.dispatch('DELETE_USER');
      this.$router.push({ name: 'login' });
    },

    copyToClipboard(str, description) {
      navigator.clipboard.writeText(str);
      this.$popups.success('Скопировано', `${description} скопировано в буфер обмена`);
    },
  },
};
</script>
