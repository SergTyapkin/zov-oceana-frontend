<style scoped lang="stylus">
@import '../../styles/constants.styl'
@import '../../styles/components.styl'
@import '../../styles/buttons.styl'
@import '../../styles/fonts.styl'
@import '../../styles/utils.styl'
@import '../../styles/animations.styl'
@import '../../styles/scrollbars.styl'

.root-page
  page-root()
  display flex
  flex-direction column
  gap 30px

  .input *
    font-family monospace !important

  .button-save
    button-emp2()
    centered-margin()
    width fit-content
</style>

<template>
  <div class="root-page">
    <InputComponent v-model="SQLText" title="Ваш SQL-запрос" textarea @keydown.ctrl.enter="executeSQL" :rows="10" class="input" />
    <InputComponent v-model="result" title="Результат выполнения" textarea disabled :rows="20" class="input" />

    <button class="button-save" @click="executeSQL">Выполнить</button>

    <CircleLinesLoading v-if="loading" centered />
  </div>
</template>

<script lang="ts">
import InputComponent from '~/components/InputComponent.vue';
import CircleLinesLoading from '~/components/loaders/CircleLinesLoading.vue';

export default {
  components: { CircleLinesLoading, InputComponent },

  data() {
    return {
      SQLText: '',
      result: '',

      loading: false,
    };
  },

  mounted() {
  },

  methods: {
    async executeSQL() {
      console.log(this.SQLText);
      const tabSymbols = '  ';

      await this.$request(
        this,
        this.$api.executeAdminSQL,
        [this.SQLText],
        `Не удалось исполнить SQL`,
        (res: {response: object[]}) => {
          this.$popups.success('Выполнено');
          this.result = '[';
          console.log(res.response);
          res.response.forEach(row => {
            this.result += `\r\n${tabSymbols}{`;
            for (const key in row) {
              this.result += `\r\n${tabSymbols}${tabSymbols}${key}: ${row[key]},`;
            }
            this.result += `\r${tabSymbols}},`;
          });
          this.result += '\r\n]';
          return;
        },
      );
    },
  },
};
</script>
