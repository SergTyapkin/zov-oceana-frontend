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
  section.partner
    display flex
    flex-wrap wrap
    gap 20px
    width 100%
    padding-top 50px
    padding-bottom 100px

    .right-column
      display flex
      flex-direction column
      gap 40px
      > *
        padding 20px
        border-bottom 1px solid colorBorder
        color colorTextInvert1
        background colorBgDark
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

        color colorTextInvert3

      .addresses-big-container
      .partners
        overflow auto
        display flex
        flex-direction column
        max-height 500px
        padding 0
        box-shadow 0 0 10px colorShadow
        scrollable()
        .header
          font-medium()
          font-upper()

          padding 20px
          color colorTextInvert1
          background colorBgDark
          svg-inside(25px)
        .info
          color colorText2
          padding 20px
          padding-bottom 0

      .partners
        background colorBgLight
        .partners-graph
          padding 20px
        .input-container
          display flex
          align-items stretch
          width 100%
          padding 20px
          .inputs-group
            flex 1
            margin-right 20px
          .button-submit
            button-emp2()

            flex 0
            padding-inline 5px
            // height min-content
        dl.partners-info
          font-small()
          padding 20px
          display grid
          grid-template-columns auto auto
          align-items center
          justify-content space-between
          gap 10px 20px
          dr
            display grid
            grid-column 1/-1
            grid-template-columns subgrid
        .transactions-history
          padding-inline 20px
          color colorText1
          font-small-extra()

  .button-save
    button-emp2()
    centered-margin()

    width fit-content

  .partnership-request
    block-shadow()
    margin-top 20px
    display flex
    flex-wrap wrap
    justify-content space-between
    align-content center
    gap 20px
    header
      font-bold()
      width 100%
    .button-confirm
      button-emp2()
      centered-margin()
      flex 1 0.5
    .button-decline
      button-error()
      centered-margin()
      flex 1 0.5
</style>

<template>
  <div class="root-page">
    <router-link :to="{ name: 'adminUsers' }">
      <section class="page-title">
        <img src="/static/icons/arrow-left.svg" alt="arrow left">
        Ко всем пользователям
      </section>
    </router-link>

    <div class="partnership-request" v-if="user.isPartnershipRequested !== false && !user.isPartner">
      <header>Пользователь отправил запрос на статус партнёра</header>
      <p v-if="!user.isPartnershipRequested && user.isPartnershipRequested !== false">Запрос пользователя отклонён</p>
      <template v-else>
        <button class="button-confirm" @click="setPartnershipRequestStatus(true)">Подтвердить запрос</button>
        <button class="button-decline" @click="setPartnershipRequestStatus(false)">Отклонить запрос</button>
      </template>
    </div>
    <div class="partnership-request" v-else-if="user.isPartner">
      <header>Пользователь является партнёром</header>
    </div>

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
          with-search
          title-always-shown
          ref="userSelect"
        />
        <InputSwitch v-model="user.isPartnershipRequested" title="Отправил ли заявку на партнерство" />
        <br>
        <br>
        <details>
          <summary class="info-header">Админские разрешения</summary>
          <InputSwitch v-model="user.canEditGoods" title="Изменение товаров" />
          <InputSwitch v-model="user.canEditOrders" title="Изменение заказов" />
          <InputSwitch v-model="user.canEditUsers" title="Изменение пользователей" />
          <InputSwitch v-model="user.canEditPartners" title="Изменение партнеров" />
          <InputSwitch v-model="user.canEditGlobals" title="Изменение глобальных настроек" />
        </details>

        <button class="button-save" @click="updateUserData">Сохранить изменения</button>
      </div>

      <div class="right-column">
        <TableComponent
          :content="orders ?? []"
          title="Заказы пользователя"
          :clickable="false"
          :fields="[
            // { name: '#', from: 'id' },
            { name: 'Номер', from: 'number' },
            { name: 'Товаров', from: 'goods', changer: (goods: Goods[]) => goods.length },
            { name: 'Стоимость', from: 'goods', changer: (goods: Goods[]) => costFormatter(goods.reduce((acc, g) => acc + (g.amount ?? 0) * g.cost, 0)) },
            { name: 'Дата', from: 'createdDate', changer: dateTimeFormatter },
          ]"
        />

        <TableComponent
          :content="addresses ?? []"
          title="Адреса пользователя"
          :clickable="false"
          :fields="[
            { name: '#', from: 'id', addable: false },
            { name: 'Короткая запись', from: undefined, addable: false, changer: (_: unknown, row: any) => addressFormatter(row, '', true) },
            { name: 'Название', from: 'title' },
            { name: 'Город', from: 'city' },
            { name: 'Улица', from: 'street' },
            { name: 'Дом', from: 'house' },
            { name: 'Подъезд', from: 'entrance' },
            { name: 'Этаж', from: 'floor' },
            { name: 'Квартира', from: 'apartment' },
            { name: 'Код домофона', from: 'code' },
            { name: 'Комментарий', from: 'comment' },
            { name: 'Создан', from: 'createdDate', changer: dateTimeFormatter, addable: false },
          ]"
          removable
          addable
          :on-add-callback="async (itemToAdd: {[key: string]: any}) => {
            $popups.alert('Пока что создание адресов не поддерживается', 'Очень жаль');
            
            // addresses.push(deepClone(itemToAdd as Address));
            // return !!(await updateGoodsData());
          }"
          :on-remove-callback="async (itemToRemove: {[key: string]: any}) => {
            const existingIdx = addresses.findIndex(g => g.id === itemToRemove?.id);
            if (!itemToRemove || existingIdx === -1) {
              return false;
            }
            $popups.alert('Пока что удаление адресов не поддерживается', 'Очень жаль');
            
            // addresses.splice(existingIdx, 1);
            // return !!(await updateGoodsData());
          }"
        />

        <div class="info" v-if="userId">
          Присоединился: {{ dateTimeFormatter(user.joinedDate) }} <br>
          #ID: {{ user.id }} <br>
        </div>
      </div>
    </section>

    <!-- PARTNERS -->

    <section class="page-title" v-if="user.isPartner">Партнерство</section>
    <section class="partner" v-if="user.isPartner" @input="onInput">
      <div class="left-column">
        <article class="partners">
          <header class="header">
            <img src="/static/icons/graph.svg" alt="">
            Продажи партнеров за месяц
          </header>
          <div class="info">Баланс бонусов: {{ costFormatter(user.partnerBonuses) }}</div>
          <PartnersGraph
            ref="partnersGraph"
            :user="user"
            class="partners-graph"
            @history-gotten="gottenHistory => (partnerHistory = gottenHistory)"
          />
        </article>

        <article class="partners">
          <header class="header">
            <img src="/static/icons/graph.svg" alt="">
            Партнёрская информация
          </header>
          <dl class="partners-info">
            <dr>
              <dt>Активен</dt>
              <dd><InputSwitch v-model="partner.isActive" /></dd>
            </dr>
            <dr>
              <dt>Личный объём (ЛО)</dt>
              <dd>{{ bonusesFormatter(partner.personalBonuses) }}</dd>
            </dr>
            <dr>
              <dt>Групповой объём (ГО)</dt>
              <dd>{{ bonusesFormatter(partner.groupBonuses) }}</dd>
            </dr>
            <dr>
              <dt>Оборот всех рефералов</dt>
              <dd>{{ bonusesFormatter(partner.branchTotalBonuses) }}</dd>
            </dr>
            <dr>
              <dt>Квалификация</dt>
              <dd>
                <SelectList
                  v-model="partner.qualityId"
                  :list="
                    qualities?.map?.(u => ({
                      id: u.id,
                      name: u.title,
                      value: u.id,
                    }))
                  "
                  can-be-null
                />
              </dd>
            </dr>
            <dr>
              <dt>Стал партнёром</dt>
              <dd>{{ dateFormatter(partner.joinedDate) }}</dd>
            </dr>
          </dl>
        </article>
        
        <article class="partners">
          <header class="header">
            <img src="/static/icons/graph.svg" alt="">
            Бонусы
          </header>
          <dl class="partners-info">
            <dr>
              <dt>Осталось периодов "Бонуса Новичка"</dt>
              <dd><InputComponent v-model="partner.newbieBonusPeriodsLeft" placeholder="0" /></dd>
            </dr>
            <dr>
              <dt>Баллов "Бонуса Чёрной Икры"</dt>
              <dd><InputComponent v-model="partner.blackPearlBonuses" placeholder="0" /></dd>
            </dr>
            <dr>
              <dt>Периодов "Бонуса Большой Команды"</dt>
              <dd><InputComponent v-model="partner.bonusBigTeamPeriods" placeholder="1" /></dd>
            </dr>
          </dl>
        </article>

        <button class="button-save" @click="updatePartnerData">Сохранить изменения</button>
      </div>
        
      <div class="right-column">
        <article class="partners">
          <header class="header">
            <img src="/static/icons/graph.svg" alt="">
            История бонусов за месяц
          </header>
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
          <PartnerTransactionsHistory class="transactions-history" :history="partnerHistory" />
        </article>
      </div>
    </section>

    <CircleLinesLoading v-if="loading" centered />
  </div>
</template>

<script lang="ts">
import { Address, Order, Partner, PartnerHistoryTransaction, Quality, User, UserOther } from '~/utils/models';
import CircleLinesLoading from '~/components/loaders/CircleLinesLoading.vue';
import InputComponent from '~/components/InputComponent.vue';
import { addressFormatter, bonusesFormatter, costFormatter, dateFormatter, dateTimeFormatter, deepClone } from '~/utils/utils';
import PartnersGraph from '~/components/PartnersGraph.vue';
import TableComponent from '~/components/tables/TableComponent.vue';
import PartnerTransactionsHistory from '~/components/PartnerTransactionsHistory.vue';
import SelectList from '~/components/SelectList.vue';
import InputSwitch from '~/components/InputSwitch.vue';

export default {
  components: { InputSwitch, SelectList, PartnerTransactionsHistory, PartnersGraph, InputComponent, CircleLinesLoading, TableComponent },

  data() {
    return {
      userId: this.$route.params.id as string,

      user: {} as User,
      partner: {} as Partner,
      qualities: [] as Quality[],
      users: [] as UserOther[],
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
    if (this.user.isPartner) {
      this.updatePartner();
      this.updatePartnershipInfo();
      this.updateQualities();
    }
  },

  methods: {
    addressFormatter,
    dateTimeFormatter,
    dateFormatter,
    costFormatter,
    bonusesFormatter,
    deepClone,

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
    },
    async updatePartner() {
      this.partner = (await this.$request(
        this,
        this.$api.getUserPartnerInfo,
        [this.userId],
        `Не удалось получить данные партнера`,
      )) as Partner;
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
    async updateQualities() {
      this.qualities = (
        (await this.$request(
          this,
          this.$api.getAllQualities,
          [],
          `Не удалось получить список квалификаций`,
        )) as {
          qualities: Quality[];
        }
      ).qualities;
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
          this.user.isPartnershipRequested,
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

    async updatePartnerData() {
      await this.$request(
        this,
        this.$api.updateUserPartnerInfo,
        [
          this.partner.id,
          this.partner.isConfirmed,
          this.partner.personalBonuses,
          this.partner.groupBonuses,
          this.partner.qualityId,
          this.partner.newbieBonusPeriodsLeft,
          this.partner.blackPearlBonuses,
          this.partner.bonusBigTeamPeriods,
          this.partner.isActive,
        ],
        `Не удалось обновить данные партнера`,
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
          (this.$refs.partnersGraph as typeof PartnersGraph).update();
          this.updatePartnerData();
          this.newTransactionValue = 0;
          this.newTransactionComment = '';
        },
      );
    },

    onInput() {
      window.onbeforeunload = () => {};
    },

    async declinePartnershipRequest() {
      await this.$request(
        this,
        this.$api.declinePartnershipRequest,
        [this.user.id],
        `Не удалось отклонить заявку`,
        () => {
          this.$popups.success('Заявка отклонена');
          this.updateUser();
        },
      );
    },
    async acceptPartnershipRequest() {
      await this.$request(
        this,
        this.$api.createUserPartner,
        [this.user.id],
        `Не удалось принять заявку в партнеры`,
        () => {
          this.$popups.success('Заявка принята', 'Теперь пользователь является партнером');
          this.updateUser();
          this.updatePartner();
        },
      );
    },
  },
};
</script>
