<style scoped lang="stylus">
@import '../../styles/constants.styl'
@import '../../styles/components.styl'
@import '../../styles/buttons.styl'
@import '../../styles/fonts.styl'
@import '../../styles/utils.styl'
@import '../../styles/animations.styl'
@import '../../styles/scrollbars.styl'

.root-page-delivery
  max-width 900px
  margin 0 auto
  padding 40px 20px
  line-height 1.8
  color #333

  h1
    font-h2()

    margin-bottom 30px
    color colorText1
    text-align center

  h2
    font-h3()

    margin-top 30px
    margin-bottom 15px
    color colorText2

  h3
    font-h4()

    margin-top 20px
    margin-bottom 10px
    color colorText3

  p
  li
    font-body()

    margin-bottom 10px

  ul
  ol
    margin-bottom 15px
    padding-left 25px

  .delivery-header
    margin-bottom 30px
    padding 20px
    border-left 4px solid #ff6b00
    background #f8f9fa

  .delivery-grid
    display grid
    grid-template-columns 1fr 1fr
    gap 30px
    margin 20px 0

    .delivery-item
      padding 15px 0
      border-bottom 1px solid #eee

      .label
        font-small()

        color colorText5
        text-transform uppercase
        letter-spacing 0.5px

      .value
        font-body()

        margin-top 5px

    @media ({mobile})
      grid-template-columns 1fr

  .info-box
    margin 20px 0
    padding 20px
    border-left 4px solid #17a2b8
    background #f8f9fa

  .warning
    margin 20px 0
    padding 15px 20px
    border-left 4px solid #dc3545
    color #721c24
    background #f8d7da

  .delivery-footer
    margin-top 40px
    padding-top 20px
    border-top 2px solid #eee
    font-small()

    color colorText5
    text-align center
</style>

<template>
  <div class="root-page-delivery">
    <h1>Информация о доставке</h1>

    <div class="delivery-header">
      <p><strong>Интернет-магазин "{{ companyTitle }}"</strong></p>
      <p>Мы доставляем свежие морепродукты по Москве и Московской области с соблюдением всех температурных режимов.</p>
    </div>

    <!-- Основные условия -->
    <h2>1. Условия доставки</h2>
    <div class="delivery-grid">
      <div class="delivery-item">
        <div class="label">Территория доставки</div>
        <div class="value">{{ deliveryArea }}</div>
      </div>
      <div class="delivery-item">
        <div class="label">Срок доставки</div>
        <div class="value">{{ deliveryDays }}</div>
      </div>
      <div class="delivery-item">
        <div class="label">Время доставки</div>
        <div class="value">{{ deliveryTime }}</div>
      </div>
      <div class="delivery-item">
        <div class="label">Стоимость доставки</div>
        <div class="value">{{ deliveryCost }}</div>
      </div>
    </div>

    <!-- Бесплатная доставка -->
    <h2>2. Бесплатная доставка</h2>
    <div class="info-box">
      <p><strong>✔ {{ freeDeliveryText }}</strong></p>
    </div>

    <!-- Условия хранения -->
    <h2>3. Условия хранения и приемки товара</h2>
    <p>Мы заботимся о качестве наших продуктов и соблюдаем все температурные режимы при доставке:</p>
    <ul>
      <li><strong>Температурный режим:</strong> все морепродукты доставляются в специальных термосумках при температуре не выше {{ storageTemperature }};</li>
      <li><strong>Срок годности:</strong> при доставке курьер передает товар с актуальным сроком годности (не менее {{ minShelfLife }});</li>
      <li><strong>Рекомендация по приемке:</strong> проверяйте целостность упаковки и температуру товара при получении. Если вы обнаружили нарушение условий хранения или брак — откажитесь от товара, и мы заменим его или вернем деньги.</li>
    </ul>

    <div class="warning">
      <p><strong>⚠️ ВАЖНО:</strong> После приемки товара ответственность за соблюдение температурного режима и условий хранения переходит к Покупателю. Рекомендуем сразу поместить морепродукты в холодильник или морозильную камеру.</p>
    </div>

    <!-- Порядок оформления -->
    <h2>4. Порядок оформления доставки</h2>
    <ol>
      <li>Вы оформляете заказ на сайте, указывая адрес доставки и удобное время;</li>
      <li>Менеджер связывается с вами для подтверждения заказа и уточнения деталей;</li>
      <li>Курьер доставляет заказ в указанный интервал времени;</li>
      <li>При получении вы проверяете заказ, подписываете товарный чек и оплачиваете (если не было оплачено онлайн).</li>
    </ol>

    <div class="info-box">
      <p><strong>📌 Примечание:</strong> В случае задержки по вине курьерской службы, мы свяжемся с вами и предложим компенсацию или перенос времени доставки.</p>
    </div>

    <!-- Контакты -->
    <h2>5. Контакты по вопросам доставки</h2>
    <p>По всем вопросам, связанным с доставкой, вы можете обратиться к нам:</p>
    <ul>
      <li><strong>Телефон:</strong> <a :href="'tel:' + phone">{{ phone }}</a></li>
      <li><strong>Электронная почта:</strong> <a :href="'mailto:' + email">{{ email }}</a></li>
    </ul>

    <!-- Подвал -->
    <div class="delivery-footer">
      <p>© {{ currentYear }} {{ companyShortName }}. Все права защищены.</p>
    </div>
  </div>
</template>

<script lang="ts">
import {
  COMPANY_FULL_NAME,
  COMPANY_SHORT_NAME,
  COMPANY_PHONE,
  COMPANY_EMAIL,
  COMPANY_DATA_UPDATED_YEAR,
  COMPANY_TITLE,
} from '~/constants';

export default {
  data() {
    return {
      companyTitle: COMPANY_TITLE,
      companyName: COMPANY_FULL_NAME,
      companyShortName: COMPANY_SHORT_NAME,
      phone: COMPANY_PHONE,
      email: COMPANY_EMAIL,
      currentYear: COMPANY_DATA_UPDATED_YEAR,

      // Доставка
      deliveryArea: 'город Москва и Московская область',
      deliveryDays: '1-3 рабочих дня',
      deliveryTime: 'с 10:00 до 22:00',
      deliveryCost: 'от 300 рублей (зависит от адреса)',
      freeDeliveryText: 'Бесплатная доставка при заказе от 6000 ₽',
      storageTemperature: '-18°C (для замороженных продуктов)',
      minShelfLife: '1 месяца',
    };
  },
};
</script>