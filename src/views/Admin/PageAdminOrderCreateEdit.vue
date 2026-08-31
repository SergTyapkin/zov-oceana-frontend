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

  section.orders
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
        background colorBgDark
        color colorTextInvert1
    .left-column
      display flex
      flex-direction column
      gap 15px

    .left-column
    .right-column
      flex 1
      min-width 300px
      .info-header
        font-medium()
        font-upper()

        margin-bottom 10px

      .payment-container
        .buttons
          margin-top 30px
          .info
            font-small()
            font-normal()
            font-bold()

            text-align center
          .buttons-container
            display flex
            .button-confirm
              flex 1
              button-success()
            .button-cancel
              flex 1
              button-error()

  .button-save
    button-emp2()
    centered-margin()

    width fit-content
</style>

<template>
  <div class="root-page">
    <router-link :to="{ name: 'adminOrders' }">
      <section class="page-title">
        <img src="/static/icons/arrow-left.svg" alt="arrow left">
        Ко всем заказам
      </section>
    </router-link>

    <section class="orders" @input="onInput">
      <div class="left-column">
        <InputComponent v-model="order.id" disabled title="#ID" />

        <SelectList
          v-model="order.userId"
          :list="
            users?.map?.(user => ({
              id: user.id,
              name: `${user.givenName} ${user.familyName}`,
              value: user.id,
            }))
          "
          can-be-null
          :selected-id="order.userId"
          title="Пользователь"
          ref="userSelect"
        />
        <SelectList
          v-model="order.status"
          :selected-id="order.status"
          title="Статус заказа"
          :list="
            Object.entries(OrderStatuses).map(([key, status]) => ({
              id: key,
              name: status.title,
              value: key,
            }))
          "
          ref="statusSelect"
        />
        <InputComponent v-model="order.trackingCode" title="Почтовый код отслеживания" placeholder="1000200030004000" />
        <InputComponent
          v-model="order.addressTextCopy"
          title="Полный адрес"
          placeholder="г. Москва, ул. Красная, д. 1к1, п. 2, кв. 15"
        />
        <InputComponent v-model="order.commentTextCopy" title="Комментарий" placeholder="Комментарий текстом" />
        <InputComponent v-model="order.secretCode" title="Код получения заказа" disabled />
        <button class="button-save" v-if="!isCreate" @click="updateOrderData">Сохранить изменения</button>
      </div>

      <div class="right-column">
        <TableComponent
          :content="order.goods ?? []"
          title="Товары в заказе"
          :clickable="false"
          :fields="[
            // { name: '#', from: 'id' },
            { name: 'Название', from: 'title', availableValues: goods.map(g => ({name: g.title, value: g.id})) },
            { name: 'Количество', from: 'amount', changer: (_: unknown, row: Goods) => `${row.amount} ${row.isWeighed ? 'кг' : 'шт'}` },
            { name: 'Сумма за всё', from: 'costTotal', changer: (_: unknown, row: Goods) => costFormatter(row.cost * (row.amount ?? 0)) },
          ]"
          removable
          addable
          :on-add-callback="async (itemToAdd: {[key: string]: any}) => {
            // Внутри title у нас id, потому что мы так указали в :fields выше
            const goodsFound = goods.find(g => g.id === itemToAdd?.title);
            if (!itemToAdd || !goodsFound) {
              return false;
            }
            const cost = itemToAdd.costTotal / itemToAdd.amount;
            order.goods.push({
              ...deepClone(goodsFound),
              amount: itemToAdd.amount,
              cost: cost,
            });

            return !!(await updateOrderData());
          }"
          :on-remove-callback="async (itemToRemove: {[key: string]: any}) => {
            const existingIdx = order.goods.findIndex(g => g.id === itemToRemove?.id);
            if (!itemToRemove || existingIdx === -1) {
              return false;
            }
            order.goods.splice(existingIdx, 1);

            return !!(await updateOrderData());
          }"
        />

        <section class="payment-container">
          <header class="info-header">Общая сумма</header>
          <div>{{ costFormatter(order?.goods?.reduce?.((acc, g) => acc + g.cost * g.amount, 0)) }}</div>

          <br>
          
          <div v-if="order.paymentCreatedDate">
            <SelectList
              v-model="order.paymentStatus"
              :selected-id="order.paymentStatus"
              title="Статус оплаты"
              :list="
                Object.entries(PaymentStatuses).map(([key, status]) => ({
                  id: key,
                  name: status.title,
                  value: key,
                }))
              "
              ref="statusSelect"
              disabled
            />
            <InputComponent v-model="order.paymentId" title="ID оплаты банка" placeholder="Идентификатор оплаты" disabled />
            <InputComponent v-model="order.paymentUrl" title="Ссылка для оплаты банка" placeholder="https://..." disabled />
            <InputComponent v-model="order.paymentQrData" title="Ссылка внутри QR-кода СБП" placeholder="https://..." disabled />
            <div>Оплата начата: {{ dateTimeFormatter(order.paymentCreatedDate) }}</div>

            <section v-if="order.paymentStatus === 'authorized'" class="buttons">
              <div class="info">Сейчас деньги у клиента заморожены, но не списаны. Через неделю после оплаты они вернутся обратно</div>
              <div class="buttons-container">
                <button class="button-confirm" @click="confirmPayment">Подтвердить списание</button>
                <button class="button-cancel" @click="cancelPayment">Вернуть оплату</button>
              </div>
            </section>
            <section v-else-if="order.paymentStatus === 'new'" class="buttons">
              <div class="info">Сейчас клиент начал, но не завершил оплату</div>
              <div class="buttons-container">
                <button class="button-cancel" @click="cancelPayment">Прервать оплату</button>
              </div>
            </section>
            <section v-else-if="order.paymentStatus === 'confirmed'" class="buttons">
              <div class="info">Оплата полностью списана у клиента</div>
              <div class="buttons-container">
                <button class="button-cancel" @click="refundPayment">Вернуть оплату</button>
              </div>
            </section>
          </div>
          <div v-else>Оплата в банке пользователем ещё не производилась</div>
        </section>

        <div class="info" v-if="orderId">
          Создан: {{ dateTimeFormatter(order.createdDate) }} <br>
          #ID: {{ order.id }} <br>
        </div>
      </div>
    </section>

    <button class="button-save" v-if="isCreate" @click="createOrder">Создать заказ</button>

    <CircleLinesLoading v-if="loading" centered />
  </div>
</template>

<script lang="ts">
import { Goods, Order, UserOther } from '~/utils/models';
import CircleLinesLoading from '~/components/loaders/CircleLinesLoading.vue';
import InputComponent from '~/components/InputComponent.vue';
import TableComponent from '~/components/tables/TableComponent.vue';
import SelectList from '~/components/SelectList.vue';
import { costFormatter, dateTimeFormatter, deepClone } from '~/utils/utils';
import { OrderStatuses, PaymentStatuses } from '~/constants';
import { nextTick } from 'vue';

export default {
  components: { SelectList, InputComponent, CircleLinesLoading, TableComponent },

  data() {
    return {
      orderId: this.$route.params.id as string,

      order: {} as Order,
      users: [] as UserOther[],
      goods: [] as Goods[],

      newGoods: undefined as undefined | Goods,
      newGoodsAmount: undefined as undefined | number,
      newGoodsCost: undefined as undefined | number,

      loading: false,

      OrderStatuses,
      PaymentStatuses,
    };
  },

  computed: {
    isCreate() {
      return this.orderId === undefined;
    },
  },

  async mounted() {
    this.updateUsers();
    this.updateGoods();

    if (this.orderId !== undefined) {
      await this.updateOrder();
    } else {
      this.order.goods = [];
    }
  },

  methods: {
    dateTimeFormatter,
    costFormatter,
    deepClone,

    async updateOrder() {
      this.order = (await this.$request(
        this,
        this.$api.getOrder,
        [this.orderId],
        `Не удалось получить заказ`,
      )) as Order;
      await nextTick();
    },
    async updateUsers() {
      this.users = (
        (await this.$request(this, this.$api.getAllUsersAdmin, [], `Не удалось получить список пользователей`)) as {
          users: UserOther[];
        }
      ).users;
    },
    async updateGoods() {
      this.goods = (
        (await this.$request(this, this.$api.getAllAdminGoodsList, [], `Не удалось получить список товаров`)) as {
          goods: Goods[];
        }
      ).goods;
    },

    async updateOrderData() {
      return await this.$request(
        this,
        this.$api.updateOrder,
        [
          this.order.id,
          this.order.userId,
          this.order.number,
          this.order.addressTextCopy,
          this.order.commentTextCopy!,
          this.order.status!,
          this.order.trackingCode!,
          this.order.goods,
        ],
        `Не удалось обновить данные заказа`,
        () => {
          window.onbeforeunload = null;
          this.$router.push({ name: 'adminOrders' });
        },
      );
    },

    async createOrder() {
      await this.$request(
        this,
        this.$api.createOrderAdmin,
        [
          this.order.userId!,
          this.order.goods,
          this.order.status,
          this.order.trackingCode!,
          this.order.addressTextCopy,
          this.order.commentTextCopy!,
        ],
        `Не удалось создать заказ`,
        () => {
          window.onbeforeunload = null;
          this.$router.push({ name: 'adminOrders' });
        },
      );
    },

    async confirmPayment() {
      if (!(await this.$modals.confirm(
        "Списываем оплату?", 
        "После подтверждения деньги поступят на счет магазина, и будет уплачена комиссия банку"
      ))) {
        return;
      }

      await this.$request(
        this,
        this.$api.confirmPayment,
        [this.order.id],
        `Не удалось подтвердить оплату`,
        () => {
          this.$popups.success("Оплата списана", "Средства перечислены на счет магазина");
          this.$router.push({ name: 'adminOrders' });
        },
      );
    },

    async cancelPayment() {
      if (!(await this.$modals.confirm("Отменяем оплату клиента?", "Деньги, замороженные на счете клиента, вернутся к нему"))) {
        return;
      }

      await this.$request(
        this,
        this.$api.cancelPayment,
        [this.order.id],
        `Не удалось отменить оплату`,
        () => {
          this.$popups.success("Оплата отменена", "Средства на счете клиента разморожены или возвращены, если уже были списаны");
          this.$router.push({ name: 'adminOrders' });
        },
      );
    },

    async refundPayment() {
      if (!(await this.$modals.confirm(
        "Возвращаем оплату за заказ?", 
        "Деньги вернутся клиенту, и отменить это не получится. \
После получения денег и возврата в итоге вы теряете комиссию банка за перевод от суммы заказа"
      ))) {
        return;
      }

      await this.$request(
        this,
        this.$api.cancelPayment,
        [this.order.id],
        `Не удалось провести возврат`,
        () => {
          this.$popups.success("Возврат проведен", "Средства вернутся на счет клиента");
          this.$router.push({ name: 'adminOrders' });
        },
      );
    },

    onInput() {
      window.onbeforeunload = () => {};
    },
  },
};
</script>
