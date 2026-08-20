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

  section.title
    page-root()
    page-root-disable()

    width 100vw
    padding-block 70px
    color colorTextInvert1
    background linear-gradient(#00000077, #00000077), url("/static/images/ocean-bg.jpg")
    .title-button-back
      svg-inside(1lh)
      font-small()
      animation-float(0.5s, -20px, 0, left)

      cursor pointer
      margin-bottom 20px
      img
        trans()
      &:hover
        img
          margin-right 15px
          margin-left 5px
    .header
      font-large-extra-extra()
      font-semibold()
      font-upper()
      animation-float(0.5s, -20px, 0, left)
    .order-status
      animation-float(0.5s, -20px, 0, left)
      display flex
      align-items center
      gap 10px
      .date
        font-small-extra()
        color colorTextInvert4
      .status
        font-small-extra()

        width min-content
        white-space nowrap
        padding 5px 10px
        color colorText1
        text-align center
        background mix(colorEmp1, transparent, 90%)
        &.red
          background mix(colorError, transparent, 90%)
        &.green
          background mix(colorSuccess, transparent, 90%)
        &.yellow
          background mix(colorEmp1, transparent, 90%)
        &.blue
          background mix(colorEmp2, transparent, 90%)
        &.gray
          background mix(colorTextInvert2, transparent, 90%)
    .address-info
      animation-float(0.5s, -20px, 0, left)
      font-small()
      margin-bottom 30px
      color colorTextInvert2

    .order-payment
      animation-float(0.5s, -20px, 0, left)
      font-small-extra()
      margin-top 10px
      padding 5px 10px
      color colorText1
      text-align center
      background mix(colorEmp1, transparent, 90%)
      width min-content
      white-space nowrap
    
    section.payment
      margin-top 30px
      padding 20px
      width fit-content
      background colorEmp2
      .button-continue-payment
        button-emp2()

  section.cart
    display flex
    flex-wrap wrap
    gap 30px
    width 100%
    padding-top 50px
    padding-bottom 100px
    @media({mobile})
      flex-direction column
    .goods-list
      display flex
      flex 3
      flex-direction column
      gap 20px
      list-no-styles()
      animation-float(0.5s, -20px, 0, left)
      .goods
        display flex
        gap 20px
        justify-content space-between
        padding 20px
        background colorBlockBg
        .preview
          min-width 200px
          max-width 250px
          height 100%
          img
            img-size(100%)

            object-fit contain
            object-position top

            @media ({mobile})
              object-fit cover

          @media ({mobile})
            width 20%
            min-width 50px
        .text-container
          display flex
          flex 1
          flex-direction column
          justify-content space-between
          .title
            font-large()

            word-wrap anywhere
            .location
              font-small()
              font-upper()
              font-thin()
              svg-inside()

              margin-top 10px
          .amount-selector-container
            display flex
            align-items center
            justify-content space-between
            width 100%
            max-width 300px
            margin-top 10px
            font-large()
            font-bold-extra()
            button
              button-no-fill()

              padding-block 5px
              color colorText1
              font-large()

        .right-container
          display flex
          flex-direction column
          align-items end
          justify-content space-between
          .button-remove
            button-no-fill()

            width min-content
            padding 5px
            img
              img-size(20px)

              margin 0
          .cost-total
            font-large()
            font-bold-extra()

            margin-bottom 5px
          .cost
            font-small-extra()
            font-upper()

            color colorText3

    .order-controls
      animation-float(0.5s, 20px, 0, right)

      flex 1
      min-width 300px
      .total-info-container
        padding 20px
        color colorTextInvert1
        background colorBgDark
        .header
          font-large()
          font-upper()
          font-semibold()
        .costs-list
          display flex
          flex-direction column
          gap 15px
          padding-block 25px
          border-bottom 1px solid colorTextInvert5
          .cost-container
            display flex
            gap 10px
            align-items center
            justify-content space-between
            .title
              font-small-extra()

              color colorTextInvert3
            .cost
              font-medium()
              font-bold-extra()

        .cost-total-container
          display flex
          gap 10px
          align-items center
          justify-content space-between
          margin-top 20px
          .title
            font-large()
          .cost
            font-large()
            font-bold-extra()

      .button-confirm-order
        button-emp2()

        width 100%
        margin-top 20px
</style>

<template>
  <div class="root-page">
    <section class="title">
      <header class="header" style="--animation-index: 1">Оплата заказа №{{ order.number }}</header>
      <div class="address-info">
        <div>Доставляется по адресу: {{ order.addressTextCopy }}</div>
        <div v-if="order.commentTextCopy">Комментарий: {{ order.commentTextCopy }}</div>
      </div>
      <div class="order-status">
        <!-- <div class="status" :class="OrderStatuses[order.status]?.color">{{ OrderStatuses[order.status]?.title }}</div> -->
        <div class="status" :class="PaymentStatuses[order.paymentStatus]?.color">{{ PaymentStatuses[order.paymentStatus]?.title }}</div>
        
        <div v-if="!order.paymentCreatedDate" class="" />
        <div v-else-if="order.status === 'created' && !isPaymentTimeOver" class="status yellow">
          Осталось {{ timeMinutesFormatter(new Date(paymentTimeLeft)) }}
        </div>
        <div v-else-if="order.status === 'created'" class="status red">Время на оплату вышло</div>
      </div>

      <!-- Платёжный виджет -->
      <section class="payment">
        <CircleLinesLoading v-if="widgetLoading" />
        <div v-else-if="isWidgetLoadingError">Ошибка загрузки виджета оплаты. Проверьте возможные проблемы с соединением</div>
        <a 
          v-else-if="order.paymentUrl && !isPaymentTimeOver" 
          :href="order.paymentUrl" 
          class="button-continue-payment"
        >
          Продолжить оплату <img src="/static/icons/external-link.svg" alt="link">
        </a>

        <div v-show="!isWidgetLoadingError && !(order.paymentUrl && !isPaymentTimeOver)" id="payment-widget-target" />

        <img class="img-qr-code" :src="qrCodeDataUrl" alt="SBP payment QR Code">
      </section>
    </section>

    <section class="cart">
      <ul class="goods-list" style="--animation-index: 1">
        <li class="goods" v-if="!order.goods?.length">В заказе нет товаров</li>
        <GoodsInfoCard
          v-for="goods in order.goods"
          :key="goods.id"
          class="goods"
          :goods="goods"
          no-amount-selectors
          no-delete-button
        />
      </ul>

      <section class="order-controls" style="--animation-index: 1">
        <article class="total-info-container">
          <header class="header">Итого</header>

          <ul class="costs-list">
            <li class="cost-container">
              <p class="title">Стоимость товаров</p>
              <div class="cost">
                {{ costFormatter(order.goods?.reduce?.((total, g) => total + g.cost * (g.amount || 0), 0)) }}
              </div>
            </li>
            <li class="cost-container">
              <p class="title">Стоимость Доставки</p>
              <div class="cost">{{ costFormatter(0) }}</div>
            </li>
          </ul>

          <div class="cost-total-container">
            <p class="title">Всего</p>
            <div class="cost">
              {{ costFormatter(order.goods?.reduce?.((total, g) => total + g.cost * (g.amount || 0), 0)) }}
            </div>
          </div>
        </article>
      </section>
    </section>

    <CircleLinesLoading v-if="loading" centered />
  </div>
</template>

<script lang="ts">
import QRCode from 'qrcode';

import CircleLinesLoading from '~/components/loaders/CircleLinesLoading.vue';
import GoodsInfoCard from '~/components/GoodsInfoCard.vue';
import { costFormatter, dateFormatter, dateTimeFormatter, initPaymentWidget, timeMinutesFormatter } from '~/utils/utils';
import { OrderStatuses, PAYMENT_TIME_TO_BE_PAYED_MS, PaymentStatuses } from '~/constants';
import { Order } from '~/utils/models';

export default {
  components: { GoodsInfoCard, CircleLinesLoading },

  data() {
    return {
      orderId: this.$route.params.id as string,

      qrCodeDataUrl: '',
      paymentTimeLeft: 0,
      updatingInterval: null as ReturnType<typeof setInterval> | null,

      order: {} as Order,

      loading: false,
      widgetLoading: false,
      isWidgetLoadingError: false,

      OrderStatuses,
      PaymentStatuses,
      PAYMENT_TIME_TO_BE_PAYED_MS,
    };
  },

  computed: {
    isPaymentTimeOver() {
      const res = this.paymentTimeLeft <= 0;
      // Перестаем обновлять, если время вышло
      if (res && this.updatingInterval) {
        clearInterval(this.updatingInterval);
      }
      return res;
    },
  },

  async mounted() {
    if (!this.orderId) {
      this.$popups.error('id заказа не задан', 'В url нет id заказа');
      this.$router.push({ name: 'profileOrders' });
      return;
    }
    this.updateOrder();

    this.updatingInterval = setInterval(this.updatePaymentTimeLeft, 1000);

    this.widgetLoading = true;
    try {
      // 1. Инициализируем виджет
      const integration = await initPaymentWidget({
        terminalKey: '1781187421158DEMO', // Значение TerminalKey из личного кабинета
        product: 'eacq',
        features: {
          payment: {
            container: document.getElementById('payment-widget-target'),
            paymentStartCallback: async () => {
              // Запрос к бэкенду для создания платежа и получения ссылки на оплату
              const response = await this.$request(
                this,
                this.$api.createPayment,
                [this.orderId],
                'Не удалось создать платеж на сервере'
              );

              console.log("GOTTEN RES", response);

              // Возвращаем URL для оплаты
              if (!response.ok) {
                return null;
              }
              return response.data.paymentUrl;
            },
          },
        },
      });

      const mainPaymentIntegration = await integration.payments.get('main-integration'); // Получение интеграции. При интеграции «Все доступные способы оплаты» присваивается имя "main-integration"

      console.log('Виджет оплаты успешно инициализирован', mainPaymentIntegration);
      this.isWidgetLoadingError = false;
    } catch (error) {
      console.error('Ошибка инициализации виджета:', error);
      this.$popups.error('Ошибка', 'Не удалось загрузить платежный виджет');
      this.isWidgetLoadingError = true;
    }
    this.widgetLoading = false;
  },

  unmounted() {
    if (this.updatingInterval) {
      clearInterval(this.updatingInterval);
    }
  },

  methods: {
    dateTimeFormatter,
    dateFormatter,
    costFormatter,
    timeMinutesFormatter,
    
    async updatePaymentQRCode() {
      try {
        this.qrCodeDataUrl = await QRCode.toDataURL(
          this.order.paymentQrData,
          {
            width: 400,
            margin: 2,
            color: {
              dark: '#000000',
              light: '#ffffff',
            },
            errorCorrectionLevel: 'M',
          }
        );
      } catch (err) {
        this.$popups.error('Не удалось сгенерировать QR код СБП', err);
      }
    },

    updatePaymentTimeLeft() {
      if (!this.order.id) {
        this.paymentTimeLeft = 0;
        return;
      }
      const paymentTimeSpent = Number(new Date()) - Number(this.order.paymentCreatedDate);
      this.paymentTimeLeft = PAYMENT_TIME_TO_BE_PAYED_MS - paymentTimeSpent;
    },

    async updateOrder() {
      this.order = (await this.$request(
        this,
        this.$api.getOrder,
        [this.orderId],
        `Не удалось получить данные заказа`,
      )) as Order;

      this.updatePaymentTimeLeft();

      this.updatePaymentQRCode();
    },
  },
};
</script>
