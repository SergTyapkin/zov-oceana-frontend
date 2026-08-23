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

  padding-block 0

  section.page-title
  section.filters
    page-root()
    page-root-disable()

    width 100vw

  section.page-title
    cursor pointer
    padding-block 40px
    color colorTextInvert1
    background colorBgDark
    svg-inside(1lh)
    font-small()
    img
      trans()
    &:hover
      img
        margin-right 15px
        margin-left 5px

  section.users
    width 100%
    padding-top 50px
    padding-bottom 100px
    display flex
    flex-wrap wrap
    gap 20px

    .right-column
      display flex
      flex-direction column
      gap 40px
      > *
        padding 10px
        border-bottom 1px solid colorBorder
        box-shadow 0 0 10px colorShadow
    .left-column
      display flex
      flex-direction column
      gap 10px

    .left-column
    .right-column
      flex 1
      min-width 300px
      .info-header
        font-medium()
        font-upper()
        margin-bottom 10px
      .info
        font-upper()
        font-small-extra()
        font-thin()
        font-spaced()

        color colorText3

      .addresses-big-container
      .orders-big-container
      .partners
        max-height 700px
        overflow auto
        padding 10px

        display flex
        flex-direction column
        scrollable()
        .orders-container
          list-no-styles()
          display grid
          grid-template-columns repeat(4, auto)
          overflow auto
          scrollable()
          .orders-one-container
            display contents
            &.header
              font-semibold()
              > *
                text-align center
                justify-content center
            &:not(.header):hover
              > *
                opacity 0.6
            > *
              display flex
              align-items center
              justify-content flex-end
              text-align right
              padding 10px 5px
              width 100%
              height 100%
              trans()
            &:nth-child(2n) > *
              background mix(colorBlockBg, transparent, 30%)
            .title
              font-medium()
              flex 1
            .button-add
            .button-delete
              button-no-fill()
              padding 5px
              img
                margin 0
      .addresses-big-container
        .orders-container
          grid-template-columns repeat(2, auto)

      .partners
        .partners-graph
          padding 20px
        .input-container
          display flex
          align-items stretch
          width 100%
          margin-block 30px
          .inputs-group
            flex 1
          .button-submit
            button-emp2()
            flex 0
            padding-inline 5px
            //height min-content

  .button-save
    button-emp2()
    centered-margin()
    width fit-content
</style>

<template>
  <div class="root-page">
    <router-link :to="{ name: 'adminUsers' }">
      <section class="page-title">
        <img src="/static/icons/arrow-left.svg" alt="arrow left">
        Ко всем пользователям
      </section>
    </router-link>

    <section class="users" @input="onInput">
      <div class="left-column">
        <InputComponent v-model="user.familyName" title="Фамилия" placeholder="Фамилия" />
        <InputComponent v-model="user.givenName" title="Имя" placeholder="Имя" />
        <InputComponent v-model="user.middleName" title="Отчество" placeholder="Отчество" />
        <br>
        <InputComponent v-model="user.city" title="Город" placeholder="Город" />
        <InputComponent v-model="user.tel" title="Телефон" placeholder="+7 999 100 20 30" />
        <InputComponent v-model="user.email" title="Email" placeholder="some.email@mail.com" />
        <br>
        <InputComponent v-model="user.tgId" title="Telegram ID" placeholder="1000000" />
        <InputComponent v-model="user.tgUsername" title="Telegram тэг" placeholder="Some_User" />
        <InputComponent v-model="user.avatarUrl" title="Telegram url аватарки" placeholder="https://some_image.png" />
        <br>
        <InputSwitch v-model="user.isEmailNotificationsOn" title="Уведомления по email" />
        <br>
        <SelectList
          class="category-selector"
          title="Партнерство"
          ref="partnerStatusSelector"
          :list="[
            {
              id: 'partner',
              name: 'Партнёр',
              value: true,
            },
            {
              id: 'user',
              name: 'Не партнёр',
              value: false,
            },
            {
              id: 'on-hold',
              name: 'Подал заявку',
              value: undefined,
            },
          ]"
          v-model="user.partnerStatus"
        />
        <SelectList
          v-model="user.referrerId"
          :list="
            users?.map?.(u => ({
              id: u.id,
              name: `${u.givenName} ${u.familyName}`,
              value: u.id,
            }))
          "
          can-be-null
          :selected-id="user.referrerId"
          title="Пригласил пользователь"
          ref="userSelect"
        />
        <br>
        <br>
        <header class="info-header">Админские разрешения</header>
        <InputSwitch v-model="user.canEditGoods" title="Изменение товаров" />
        <InputSwitch v-model="user.canEditOrders" title="Изменение заказов" />
        <InputSwitch v-model="user.canEditUsers" title="Изменение пользователей" />
        <InputSwitch v-model="user.canEditPartners" title="Изменение партнеров" />
        <InputSwitch v-model="user.canEditGlobals" title="Изменение глобальных настроек" />
      </div>

      <div class="right-column">
        <article class="orders-big-container">
          <header class="info-header">Заказы</header>

          <div class="info" v-if="!orders.length && !loading">Пользователь не делал заказов</div>
          <ul class="orders-container" v-else>
            <li class="orders-one-container header">
              <div class="title">Номер</div>
              <div class="goods">Товаров</div>
              <div class="cost">Стоимость</div>
              <div class="date">Дата</div>
            </li>

            <router-link
              :to="{ name: 'adminOrderEdit', params: { id: order.id } }"
              class="orders-one-container"
              v-for="order in orders"
              :key="order.id"
            >
              <div class="title">{{ order.number }}</div>
              <div class="goods">{{ order.goods.length }}</div>
              <div class="cost">{{ costFormatter(order.goods.reduce((acc, g) => acc + g.amount * g.cost, 0)) }}</div>
              <div class="date">{{ dateTimeFormatter(order.createdDate) }}</div>
            </router-link>
          </ul>
        </article>

        <article class="addresses-big-container">
          <header class="info-header">Адреса</header>

          <div class="info" v-if="!addresses.length && !loading">У пользователя нет адресов</div>
          <ul class="orders-container" v-else>
            <li class="orders-one-container header">
              <div class="title">#ID</div>
              <div class="goods">Адрес</div>
            </li>

            <li class="orders-one-container" v-for="address in addresses" :key="address.id">
              <div class="title">{{ address.id }}</div>
              <div class="goods">{{ addressFormatter(address, '', true) }}</div>
            </li>
          </ul>
        </article>

        <article class="partners" v-if="user.partnerStatus">
          <header class="info-header">Партнерство за месяц</header>
          <div class="info">Баланс бонусов: {{ costFormatter(user.partnerBonuses) }}</div>
          <PartnersGraph
            ref="partnersGraph"
            :user="user"
            class="partners-graph"
            @history-gotten="gottenHistory => (partnerHistory = gottenHistory)"
          />
        </article>

        <article class="partners" v-if="user.partnerStatus">
          <header class="info-header">История партнерских начислений за месяц</header>
          <div class="input-container">
            <div class="inputs-group">
              <InputComponent
                v-model="newTransactionValue"
                type="number"
                class="input"
                title="Начислить партнерские бонусы"
                placeholder="1000"
                description="Чтобы отнять, введите отрицательное значение"
              />
              <InputComponent 
                v-model="newTransactionComment"
                class="input"
                placeholder="Ваш комментарий к начислению"
              />
            </div>
            <button class="button-submit" @click="createBonusesTransaction">Начислить</button>
          </div>
          <PartnerTransactionsHistory :history="partnerHistory" />
        </article>

        <div class="info" v-if="userId">
          Присоединился: {{ dateTimeFormatter(user.joinedDate) }} <br>
          #ID: {{ user.id }} <br>
        </div>
      </div>
    </section>

    <button class="button-save" @click="updateUserData">Сохранить изменения</button>

    <CircleLinesLoading v-if="loading" centered />
  </div>
</template>

<script lang="ts">
import { Address, Order, PartnerHistoryTransaction, User, UserOther } from '~/utils/models';
import CircleLinesLoading from '~/components/loaders/CircleLinesLoading.vue';
import InputComponent from '~/components/InputComponent.vue';
import { addressFormatter, costFormatter, dateTimeFormatter } from '~/utils/utils';
import { nextTick } from 'vue';
import PartnersGraph from '~/components/PartnersGraph.vue';
import PartnerTransactionsHistory from '~/components/PartnerTransactionsHistory.vue';
import SelectList from '~/components/SelectList.vue';
import InputSwitch from '~/components/InputSwitch.vue';

export default {
  components: { InputSwitch, SelectList, PartnerTransactionsHistory, PartnersGraph, InputComponent, CircleLinesLoading },

  data() {
    return {
      userId: this.$route.params.id as string,

      user: {} as User,
      users: [] as User[],
      orders: [] as Order[],
      addresses: [] as Address[],
      partners: [],

      newTransactionValue: 0,
      newTransactionComment: '',

      partnerHistory: [] as PartnerHistoryTransaction[],

      loading: false,
    };
  },

  async mounted() {
    if (this.userId === undefined) {
      this.$router.push({ name: 'adminUsers' });
      this.$popups.error('ID пользователя не найдено в url');
      return;
    }
    this.updateOrders();
    this.updateAddresses();
    this.updateUsers();
    await this.updateUser();
    if (this.user.partnerStatus === undefined) {
      this.$refs.partnerStatusSelector.selectItemById('on-hold');
    } else if (this.user.partnerStatus) {
      this.updatePartnershipInfo();
    }
  },

  methods: {
    addressFormatter,
    dateTimeFormatter,
    costFormatter,

    async updateUsers() {
      this.users = (
        (await this.$request(this, this.$api.getAllUsersAdmin, [], `Не удалось получить список пользователей`)) as {
          users: UserOther[];
        }
      ).users;
    },
    async updateUser() {
      this.user = (await this.$request(
        this,
        this.$api.getOtherUserAdmin,
        [this.userId],
        `Не удалось получить пользователя`,
      )) as User;
      await nextTick();
    },
    async updateOrders() {
      this.orders = (
        (await this.$request(
          this,
          this.$api.getUserOrders,
          [this.userId],
          `Не удалось получить список заказов пользователя`,
        )) as {
          orders: Order[];
        }
      ).orders;
    },
    async updateAddresses() {
      this.addresses = (
        (await this.$request(
          this,
          this.$api.getUserAddresses,
          [this.userId],
          `Не удалось получить список адресов пользователя`,
        )) as {
          addresses: Address[];
        }
      ).addresses;
    },
    async updatePartnershipInfo() {
      this.partners = (
        (await this.$request(
          this,
          this.$api.getAllPartnerUsers,
          [this.userId],
          `Не удалось получить информацию по партнерству`,
        )) as {
          partners: User[];
        }
      ).partners;
    },

    async updateUserData() {
      await this.$request(
        this,
        this.$api.updateProfileAdmin,
        [
          this.user.id,
          this.user.givenName,
          this.user.familyName,
          this.user.middleName,
          this.user.email,
          this.user.avatarUrl,
          this.user.tel,
          this.user.city,
          this.user.partnerStatus,
          this.user.isEmailNotificationsOn,
          this.user.tgUsername,
          this.user.tgId,
          this.user.referrerId,
          this.user.canEditGoods,
          this.user.canEditOrders,
          this.user.canEditUsers,
          this.user.canEditPartners,
          this.user.canEditGlobals,
        ],
        `Не удалось обновить данные пользователя`,
        () => {
          window.onbeforeunload = null;
          this.$router.push({ name: 'adminUsers' });
        },
      );
    },

    async createBonusesTransaction() {
      if (!this.newTransactionValue) {
        return;
      }
      await this.$request(
        this,
        this.$api.createHistoryBonusesRecord,
        [
          this.user.id,
          this.newTransactionValue,
          this.newTransactionComment,
        ],
        `Не удалось начислить бонусы`,
        () => {
          window.onbeforeunload = null;
          this.$popups.success('Бонусы начислены', String(this.newTransactionValue));
          this.$refs.partnersGraph.update();
          this.updateUser();
          this.newTransactionValue = 0;
          this.newTransactionComment = '';
        },
      );
    },

    onInput() {
      window.onbeforeunload = () => {};
    },
  },
};
</script>
