<style lang="stylus" scoped>
@import '../../../styles/constants.styl'
@import '../../../styles/components.styl'
@import '../../../styles/buttons.styl'
@import '../../../styles/fonts.styl'
@import '../../../styles/utils.styl'
@import '../../../styles/animations.styl'
@import '../../../styles/scrollbars.styl'

.root-profile-info
  .header
    color colorText1
    .header-title
      font-large()
      font-upper()
      margin-bottom 5px
    .header-desc
      font-small()
      font-thin()
      color colorText3

  .main
    padding 30px 0
    .addresses-list
      list-no-styles()
      display flex
      flex-wrap wrap
      gap 20px
      width 100%
      > *
        flex 1
        min-width 300px
      .add-address-buton
        button-no-styles()
        centered-flex-container()
        font-small()
        svg-inside(20px)
        background colorBlockBg
        color colorText1
        trans()
        &:hover
          color colorEmp2
          box-shadow 0 0 10px colorShadow
</style>

<template>
  <div class="root-profile-info">
    <header class="header">
      <header class="header-title">Сохраненные адреса</header>
      <div class="header-desc">Управляйте адресами доставки</div>
    </header>

    <main class="main">
      <ul class="addresses-list">
        <AddressCard
          v-for="address in addresses"
          :address="address"
          :key="address.id"
          @edit="editAddress(address)"
          @delete="deleteAddress(address)"
        />

        <button @click="addAddress" class="add-address-buton">
          <img src="/static/icons/plus-thin.svg" alt="plus" />
          Добавить адрес
        </button>
      </ul>
    </main>

    <CircleLoading v-if="loading" />
  </div>
</template>

<script lang="ts">
import CircleLoading from '~/components/loaders/CircleLoading.vue';
import AddressCard from '~/components/AddressCard.vue';
import { Address } from '~/utils/models';

export default {
  components: { AddressCard, CircleLoading },

  data() {
    return {
      addresses: [] as Address[],

      loading: false,
    };
  },

  mounted() {
    this.updateAddresses();
  },

  methods: {
    async updateAddresses() {
      this.addresses = (
        (await this.$request(this, this.$api.getMyAddresses, [], `Не удалось получить список адресов`)) as {
          addresses: Address[];
        }
      ).addresses;
    },
  },
};
</script>
