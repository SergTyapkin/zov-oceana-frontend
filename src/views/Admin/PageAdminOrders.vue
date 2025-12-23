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
</style>

<template>
  <div class="root-page">
    <InputComponent v-model="orderNumber" />
    <button @click="changeOrderStatus">Оплатить заказ</button>
  </div>
</template>

<script lang="ts">
import InputComponent from '~/components/InputComponent.vue';

export default {
  components: { InputComponent },

  data() {
    return {
      orderNumber: 0,

      loading: false,
    };
  },

  mounted() {},

  methods: {
    async changeOrderStatus() {
      await this.$request(
        this,
        this.$api.updateOrderStatus,
        [this.orderNumber, 'paid'],
        `Не удалось обновить статус заказа`,
        () => {
          this.$popups.success('Статус заказа обновлен');
        }
      );
    }
  },
};
</script>
