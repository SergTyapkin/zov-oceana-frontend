<style lang="stylus" scoped>
@import '../../../styles/constants.styl'
@import '../../../styles/components.styl'
@import '../../../styles/buttons.styl'
@import '../../../styles/fonts.styl'
@import '../../../styles/utils.styl'
@import '../../../styles/animations.styl'
@import '../../../styles/scrollbars.styl'

.root-profile-addresses
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
    .desc
      font-small()
      font-spaced()
      text-align center
      color colorText5
      margin-bottom 20px
    .addresses-list
      list-no-styles()

      display flex
      flex-wrap wrap
      gap 20px
      width 100%
      > *
        flex 1
        min-width 250px
      .add-address-button
        button-no-styles()
        centered-flex-container()
        font-small()
        svg-inside(20px)

        padding 20px
        color colorText1
        background colorBlockBg
        trans()
        &:hover
          color colorEmp2
          box-shadow 0 0 10px colorShadow

  .modal
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
      .buttons-container
        display flex
        gap 20px
        margin-top 40px
        .submit
          button-emp2()
          flex 1
        .cancel
          button-attention()
      .button-different-login
        button-no-fill()
        font-lower()
        font-small-extra()
        centered-margin()
        color colorText1
        width fit-content
        margin-top 10px
</style>

<template>
  <div class="root-profile-addresses">
    <header class="header">
      <header class="header-title">Сохраненные адреса</header>
      <div class="header-desc">Управляйте адресами доставки</div>
    </header>

    <main class="main">
      <p v-if="!addresses.length && !loading" class="desc">Добавьте ваш адрес доставки</p>
      <ul class="addresses-list">
        <AddressCard
          v-for="address in addresses"
          :address="address"
          :key="address.id"
          @edit="startEditAddress(address)"
          @delete="deleteAddress(address)" />

        <button @click="$refs.addAddressModal.showModal()" class="add-address-button">
          <img src="/static/icons/plus-thin.svg" alt="plus" />
          Добавить адрес
        </button>
      </ul>
    </main>

    <dialog class="modal" ref="addAddressModal" closedby="any">
      <div class="modal-inside">
        <header class="header">Добавить адрес</header>
        <main class="main">
          <InputComponent
            v-model="addressData.title"
            :error="errors.title"
            title="Название"
            placeholder="Мой дом"
            class="field"
            @submit="addAddress" />
          <InputComponent
            v-model="addressData.city"
            :error="errors.city"
            error-text="Обязательное поле"
            title="Город"
            autocomplete="address-level2"
            placeholder="Москва"
            class="field"
            @submit="addAddress" />
          <InputComponent
            v-model="addressData.street"
            :error="errors.street"
            error-text="Обязательное поле"
            autocomplete="street-address"
            title="Улица"
            placeholder="Улица"
            class="field"
            @submit="addAddress" />
          <InputComponent
            v-model="addressData.house"
            :error="errors.house"
            error-text="Обязательное поле"
            autocomplete="address-house"
            title="Дом"
            placeholder="1к11"
            class="field"
            @submit="addAddress" />
          <InputComponent
            v-model="addressData.entrance"
            :error="errors.entrance"
            autocomplete="address-entrance"
            title="Подъезд"
            placeholder="4"
            class="field"
            @submit="addAddress" />
          <InputComponent
            v-model="addressData.floor"
            :error="errors.floor"
            autocomplete="address-floor"
            title="Этаж"
            placeholder="10"
            class="field"
            @submit="addAddress" />
          <InputComponent
            v-model="addressData.apartment"
            :error="errors.apartment"
            autocomplete="address-apartment"
            title="Квартира"
            placeholder="103"
            class="field"
            @submit="addAddress" />
          <InputComponent
            v-model="addressData.code"
            :error="errors.code"
            autocomplete="address-house-code"
            title="Код домофона"
            placeholder="В103В9999"
            class="field"
            @submit="addAddress" />
          <InputComponent
            v-model="addressData.comment"
            :error="errors.comment"
            :max-symbols="200"
            textarea
            title="Комментарий"
            placeholder="Ваши пояснения"
            class="field" />

          <div class="buttons-container">
            <button class="submit" @click="addAddress">Добавить</button>
            <button class="cancel" @click="$refs.addAddressModal.close()">Отменить</button>
          </div>
        </main>
      </div>
    </dialog>

    <dialog class="modal" ref="editAddressModal" closedby="any">
      <div class="modal-inside">
        <header class="header">Изменить адрес</header>
        <main class="main">
          <InputComponent
            v-model="addressData.title"
            :error="errors.title"
            title="Название"
            placeholder="Мой дом"
            class="field"
            @submit="editAddress" />
          <InputComponent
            v-model="addressData.city"
            :error="errors.city"
            error-text="Обязательное поле"
            title="Город"
            placeholder="Москва"
            class="field"
            @submit="editAddress" />
          <InputComponent
            v-model="addressData.street"
            :error="errors.street"
            error-text="Обязательное поле"
            title="Улица"
            placeholder="Улица"
            class="field"
            @submit="editAddress" />
          <InputComponent
            v-model="addressData.house"
            :error="errors.house"
            error-text="Обязательное поле"
            title="Дом"
            placeholder="1к11"
            class="field"
            @submit="editAddress" />
          <InputComponent
            v-model="addressData.entrance"
            :error="errors.entrance"
            title="Подъезд"
            placeholder="4"
            class="field"
            @submit="editAddress" />
          <InputComponent
            v-model="addressData.floor"
            :error="errors.floor"
            title="Этаж"
            placeholder="10"
            class="field"
            @submit="editAddress" />
          <InputComponent
            v-model="addressData.apartment"
            :error="errors.apartment"
            title="Квартира"
            placeholder="103"
            class="field"
            @submit="editAddress" />
          <InputComponent
            v-model="addressData.code"
            :error="errors.code"
            title="Код домофона"
            placeholder="В103В9999"
            class="field"
            @submit="editAddress" />
          <InputComponent
            v-model="addressData.comment"
            :error="errors.comment"
            :max-symbols="200"
            textarea
            title="Комментарий"
            placeholder="Ваши пояснения"
            class="field" />

          <div class="buttons-container">
            <button class="submit" @click="editAddress">Изменить</button>
            <button class="cancel" @click="$refs.editAddressModal.close()">Отменить</button>
          </div>
        </main>
      </div>
    </dialog>

    <CircleLinesLoading v-if="loading" centered />
  </div>
</template>

<script lang="ts">
import CircleLinesLoading from '~/components/loaders/CircleLinesLoading.vue';
import AddressCard from '~/components/AddressCard.vue';
import { Address } from '~/utils/models';
import InputComponent from '~/components/InputComponent.vue';

export default {
  components: { InputComponent, AddressCard, CircleLinesLoading },

  data() {
    return {
      addresses: [] as Address[],

      addressData: {
        id: '',
        title: '',
        city: '',
        street: '',
        house: '',
        entrance: '',
        floor: '',
        apartment: '',
        code: '',
        comment: '',
      } as Address,

      errors: {
        title: false,
        city: false,
        street: false,
        house: false,
        entrance: false,
        floor: false,
        apartment: false,
        code: false,
        comment: false,
      },

      loading: false,
    };
  },

  mounted() {
    this.updateAddresses();
  },

  methods: {
    async updateAddresses() {
      this.addresses = (
        (await this.$request(
          this,
          this.$api.getUserAddresses,
          [this.$user.id],
          `Не удалось получить список адресов`,
        )) as {
          addresses: Address[];
        }
      ).addresses;
    },

    async addAddress() {
      this.errors.city = !this.addressData.city;
      this.errors.street = !this.addressData.street;
      this.errors.house = !this.addressData.house;

      if (Object.values(this.errors).findIndex(err => err) !== -1) {
        return;
      }

      this.$refs.addAddressModal.close();
      await this.$request(
        this,
        this.$api.createAddress,
        [
          this.$user.id,
          this.addressData.title,
          this.addressData.city,
          this.addressData.street,
          this.addressData.house,
          this.addressData.entrance,
          this.addressData.floor,
          this.addressData.apartment,
          this.addressData.code,
          this.addressData.comment,
        ],
        `Не удалось создать адрес`,
        () => {
          this.updateAddresses();
        },
      );
    },

    startEditAddress(address: Address) {
      this.addressData.id = address.id;
      this.addressData.title = address.title;
      this.addressData.city = address.city;
      this.addressData.street = address.street;
      this.addressData.house = address.house;
      this.addressData.entrance = address.entrance;
      this.addressData.floor = address.floor;
      this.addressData.apartment = address.apartment;
      this.addressData.code = address.code;
      this.addressData.comment = address.comment;
      this.$refs.editAddressModal.showModal()
    },

    async editAddress() {
      this.errors.city = !this.addressData.city;
      this.errors.street = !this.addressData.street;
      this.errors.house = !this.addressData.house;

      if (Object.values(this.errors).findIndex(err => err) !== -1) {
        return;
      }

      this.$refs.editAddressModal.close();
      await this.$request(
        this,
        this.$api.updateAddress,
        [
          this.addressData.id,
          this.addressData.title,
          this.addressData.city,
          this.addressData.street,
          this.addressData.house,
          this.addressData.entrance,
          this.addressData.floor,
          this.addressData.apartment,
          this.addressData.code,
          this.addressData.comment,
        ],
        `Не удалось обновить адрес`,
        () => {
          this.updateAddresses();
        },
      );
    },

    async deleteAddress(address: Address) {
      if (!(await this.$modals.confirm(
        `Удаляем адрес "${address.title || (address.city + ', ' + address.street + ', ' + address.house)}"?`,
        'Отменить удаление не получится',
      ))) {
        return;
      }
      await this.$request(
        this,
        this.$api.deleteAddress,
        [address.id],
        `Не удалось удалить адрес`,
        () => {
          this.updateAddresses();
        },
      );
    },
  },
};
</script>
