<style scoped lang="stylus">
@import '../../styles/constants.styl'
@import '../../styles/components.styl'
@import '../../styles/buttons.styl'
@import '../../styles/fonts.styl'
@import '../../styles/utils.styl'
@import '../../styles/animations.styl'
@import '../../styles/scrollbars.styl'

.root-page-about
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

  p
  li
    font-body()

    margin-bottom 10px

  ul
    margin-bottom 15px
    padding-left 25px

  .about-header
    margin-bottom 30px
    padding 20px
    border-left 4px solid #ff6b00
    background #f8f9fa

  .contacts-grid
    display grid
    grid-template-columns 1fr 1fr
    gap 30px
    margin 20px 0

    .contact-item
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
        font-weight bold

    @media ({mobile})
      grid-template-columns 1fr

  .map
    margin 30px 0
    iframe
      display block
      width 100%
      height 400px
      border none

  .info-box
    margin 20px 0
    padding 20px
    border-left 4px solid #17a2b8
    background #f8f9fa

  .offer-footer
    margin-top 40px
    padding-top 20px
    border-top 2px solid #eee
    font-small()

    color colorText5
    text-align center
</style>

<template>
  <div class="root-page-about">
    <h1>О компании</h1>

    <div class="about-header">
      <p><strong>Интернет-магазин "{{ companyTitle }}"</strong></p>
      <p>Мы продаем свежие и качественные морепродукты с доставкой по Москве и Московской области.</p>
    </div>

    <!-- Контакты -->
    <h2>Контакты</h2>
    <div class="contacts-grid">
      <div class="contact-item">
        <div class="label">Название компании</div>
        <div class="value">{{ companyShortName }}</div>
      </div>
      <div class="contact-item">
        <div class="label">Телефон</div>
        <div class="value"><a :href="'tel:' + phone">{{ phone }}</a></div>
      </div>
      <div class="contact-item">
        <div class="label">Электронная почта</div>
        <div class="value"><a :href="'mailto:' + email">{{ email }}</a></div>
      </div>
      <div class="contact-item">
        <div class="label">Режим работы</div>
        <div class="value">{{ workingHours }}</div>
      </div>
      <div class="contact-item">
        <div class="label">Юридический адрес</div>
        <div class="value">{{ legalAddress }}</div>
      </div>
      <div class="contact-item">
        <div class="label">ИНН / ОГРН</div>
        <div class="value">{{ inn }} / {{ ogrn }}</div>
      </div>
    </div>

    <!-- Реквизиты -->
    <h2>Реквизиты</h2>
    <ul>
      <li><strong>Полное наименование:</strong> {{ companyName }}</li>
      <li><strong>ИНН:</strong> {{ inn }}</li>
      <li><strong>ОГРН:</strong> {{ ogrn }}</li>
      <li><strong>Юридический адрес:</strong> {{ legalAddress }}</li>
      <li><strong>Расчетный счет:</strong> {{ bankAccount }}</li>
      <li><strong>Банк:</strong> {{ bankName }}</li>
      <li><strong>БИК:</strong> {{ bankBic }}</li>
      <li><strong>Корр. счет:</strong> {{ bankCorrAccount }}</li>
    </ul>

    <!-- Карта -->
    <h2>Мы на карте</h2>
    <section class="map">
      <iframe
        src="https://yandex.ru/map-widget/v1/?um=constructor%3Ac914dfeff51dc6796ef3189e4751752b5485322ca6eb7a64ff2e78d8d4fcb896&amp;source=constructor"
        width="100%"
        height="400"
        frameborder="0"
        loading="lazy"
      />
    </section>

    <!-- Подвал -->
    <div class="offer-footer">
      <p>© {{ currentYear }} {{ companyShortName }}. Все права защищены.</p>
    </div>
  </div>
</template>

<script lang="ts">
import {
  COMPANY_FULL_NAME,
  COMPANY_SHORT_NAME,
  COMPANY_LEGAL_ADDRESS,
  COMPANY_INN,
  COMPANY_OGRN,
  COMPANY_PHONE,
  COMPANY_EMAIL,
  COMPANY_DATA_UPDATED_YEAR,
  COMPANY_TITLE,
  COMPANY_BANK_ACCOUNT,
  COMPANY_BANK_NAME,
  COMPANY_BANK_BIC,
  COMPANY_BANK_CORR_ACCOUNT,
} from '~/constants';

export default {
  data() {
    return {
      companyTitle: COMPANY_TITLE,
      companyName: COMPANY_FULL_NAME,
      companyShortName: COMPANY_SHORT_NAME,
      legalAddress: COMPANY_LEGAL_ADDRESS,
      inn: COMPANY_INN,
      ogrn: COMPANY_OGRN,
      phone: COMPANY_PHONE,
      email: COMPANY_EMAIL,
      currentYear: COMPANY_DATA_UPDATED_YEAR,

      // Банковские реквизиты
      bankAccount: COMPANY_BANK_ACCOUNT,
      bankName: COMPANY_BANK_NAME,
      bankBic: COMPANY_BANK_BIC,
      bankCorrAccount: COMPANY_BANK_CORR_ACCOUNT,

      workingHours: 'Ежедневно с 9:00 до 21:00',
    };
  },
};
</script>