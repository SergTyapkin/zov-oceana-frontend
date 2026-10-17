<style scoped lang="stylus">
@import '../../styles/constants.styl'
@import '../../styles/components.styl'
@import '../../styles/buttons.styl'
@import '../../styles/fonts.styl'
@import '../../styles/utils.styl'
@import '../../styles/animations.styl'
@import '../../styles/scrollbars.styl'

.root-page-return
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

  a
    color #0066cc
    text-decoration none

    &:hover
      text-decoration underline

  .return-header
    margin-bottom 30px
    padding 20px
    border-left 4px solid #ff6b00
    background #f8f9fa

  .return-grid
    display grid
    grid-template-columns 1fr 1fr
    gap 30px
    margin 20px 0

    .return-item
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

  .return-footer
    margin-top 40px
    padding-top 20px
    border-top 2px solid #eee
    font-small()

    color colorText5
    text-align center
</style>

<template>
  <div class="root-page-return">
    <h1>Возврат товара и денежных средств</h1>

    <div class="return-header">
      <p><strong>Интернет-магазин "{{ companyTitle }}"</strong></p>
      <p>Мы внимательно относимся к качеству нашей продукции. Если по какой-то причине вы остались недовольны заказом, вы можете вернуть его в соответствии с законодательством РФ и нашими условиями.</p>
    </div>

    <!-- Основные условия возврата -->
    <h2>1. Условия возврата</h2>
    <div class="return-grid">
      <div class="return-item">
        <div class="label">Срок подачи заявления</div>
        <div class="value">{{ returnDays }}</div>
      </div>
      <div class="return-item">
        <div class="label">Состояние товара</div>
        <div class="value">{{ returnCondition }}</div>
      </div>
      <div class="return-item">
        <div class="label">Что нужно приложить</div>
        <div class="value">{{ requiredDocuments }}</div>
      </div>
      <div class="return-item">
        <div class="label">Способ возврата денег</div>
        <div class="value">{{ refundMethod }}</div>
      </div>
    </div>

    <!-- Категории товаров -->
    <h2>2. Возврат товара надлежащего и ненадлежащего качества</h2>
    <h3>Товар ненадлежащего качества (с браком)</h3>
    <p>Если вы обнаружили брак, нарушение температурного режима или иные недостатки, вы вправе вернуть товар и потребовать:</p>
    <ul>
      <li>замены на аналогичный товар надлежащего качества;</li>
      <li>соразмерного уменьшения покупной цены;</li>
      <li>возврата уплаченной суммы за товар.</li>
    </ul>

    <h3>Товар надлежащего качества</h3>
    <p>Согласно Постановлению Правительства РФ № 2463, продовольственные товары и морепродукты <strong>надлежащего качества возврату и обмену не подлежат</strong>. Исключение составляют случаи, когда товар был поврежден при доставке или его характеристики не соответствуют заявленным на сайте.</p>

    <!-- Порядок оформления -->
    <h2>3. Порядок оформления возврата</h2>
    <ol>
      <li>Свяжитесь с нами по телефону или электронной почте (см. ниже) в течение {{ returnDays }} с момента получения заказа;</li>
      <li>Опишите проблему и приложите фотографии товара, упаковки и чека, если есть брак или нарушение температурного режима;</li>
      <li>Менеджер рассмотрит заявку и согласует с вами удобный способ возврата (самовывоз или вызов курьера);</li>
      <li>После возврата товара мы проведем проверку и примем решение о возврате средств или замене.</li>
    </ol>

    <div class="warning">
      <p><strong>⚠️ ВАЖНО:</strong> Пожалуйста, не выбрасывайте товар до момента решения вопроса. В случае спора нам необходимо будет провести проверку качества. Возврат товара надлежащего качества возможен только при сохранении его потребительских свойств и упаковки (если это применимо).</p>
    </div>

    <!-- Возврат денег -->
    <h2>4. Сроки и способы возврата денежных средств</h2>
    <div class="info-box">
      <p><strong>✔ {{ refundTimeText }}</strong></p>
    </div>
    <p>Возврат денежных средств осуществляется тем же способом, которым была произведена оплата:</p>
    <ul>
      <li>при оплате банковской картой — на ту же карту;</li>
      <li>при оплате наличными — наличными или переводом на карту по реквизитам;</li>
      <li>при оплате через СБП — по номеру телефона.</li>
    </ul>

    <!-- Контакты -->
    <h2>5. Контакты для вопросов по возврату</h2>
    <p>По всем вопросам, связанным с возвратом, вы можете обратиться к нам:</p>
    <ul>
      <li><strong>Телефон:</strong> <a :href="'tel:' + phone">{{ phone }}</a></li>
      <li><strong>Электронная почта:</strong> <a :href="'mailto:' + email">{{ email }}</a></li>
    </ul>

    <!-- Подвал -->
    <div class="return-footer">
      <p>© {{ currentYear }} {{ companyShortName }}. Все права защищены.</p>
    </div>
  </div>
</template>

<script lang="ts">
import {
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
      companyShortName: COMPANY_SHORT_NAME,
      phone: COMPANY_PHONE,
      email: COMPANY_EMAIL,
      currentYear: COMPANY_DATA_UPDATED_YEAR,

      // Возврат
      returnDays: '1-3 рабочих дня', // Уточните по закону о защите прав потребителей (обычно 7-14 дней для заявки)
      returnCondition: 'сохранение упаковки и температурного режима (для брака)',
      requiredDocuments: 'фото брака, чек или подтверждение оплаты',
      refundMethod: 'на карту или счет покупателя',
      refundTimeText: 'Возврат денег осуществляется в течение 10 рабочих дней с момента получения нами возвращенного товара и подписания заявления.',
    };
  },
};
</script>