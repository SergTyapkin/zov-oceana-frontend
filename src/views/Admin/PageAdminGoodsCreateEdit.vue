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

  section.goods
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

      .images-container
        .images-list
          list-no-styles()
          display flex
          flex-wrap wrap
          gap 5px
          .image-container
            width 30%
            min-width 150px
            max-width 250px
            position relative
            .image
              img-size(100%)
            .button-delete
              button-no-styles()
              svg-inside(40px, 0, 0)
              centered-absolute-transform()
              opacity 0
              pointer-events none
              padding-top 10px
              trans()
            &:hover > .button-delete
              opacity 1
              pointer-events unset
              padding-top 0
            &.button-plus
              border 1px dashed black
              hover-effect()
              min-height 100px
              .drag-n-drop-loader
                width 100%
                height 100%
                .image
                  position absolute
                  centered-absolute-transform()
                  width unset
                  height unset

      .categories-container
        list-no-styles()
        padding 10px

        display flex
        flex-direction column
        gap 5px
        .category-container
          display flex
          justify-content space-between
          align-items center
          gap 10px
          .title
            font-medium()
          .button-add
          .button-delete
            button-no-fill()
            padding 5px
            img
              margin 0

      .header
        font-large-extra()
        font-upper()

        margin-bottom 10px
        line-height 1
      .location
        svg-inside(1lh)
        font-upper()
        font-small()
        font-thin()

        margin-bottom 25px
      .cost
        font-large-extra()
        font-bold-extra()
        font-spaced()

        margin-bottom 20px
      .desc
        font-small()
        font-thin()
        margin-bottom 80px

      .characters-container
        list-no-styles()
        padding 10px

        display flex
        flex-direction column
        .character
          display flex
          gap 10px
          align-items center
          justify-content space-between
          padding-block 15px
          border-bottom 1px solid colorBorder
          .info-header
            margin 0
          .title
            font-thin()
            font-upper()
            font-small-extra()
            font-spaced()

            color colorText3
          .value
            font-small-extra()
            font-semibold()
            text-align right
          .button-add
          .button-delete
            button-no-fill()
            padding 5px
            img
              margin 0

  .button-save
    button-emp2()
    centered-margin()
    width fit-content
</style>

<template>
  <div class="root-page">
    <router-link :to="{ name: 'admin' }">
      <section class="page-title">
        <img src="/static/icons/arrow-left.svg" alt="arrow left" />
        Ко всем товарам
      </section>
    </router-link>

    <section class="goods" @input="onInput">
      <div class="left-column">
        <InputComponent v-model="goods.title" title="Название" placeholder="Название товара" />
        <InputComponent v-model="goods.description" title="Описание" placeholder="Несколько предложений о товаре" />
        <InputComponent
          v-model="goods.fromLocation"
          title="Место происхождения"
          placeholder="Страна / регион / город" />
        <InputSwitch v-model="goods.isWeighed" title="Штучный или весовой" on-state-title="КГ" off-state-title="ШТ" />
        <InputComponent
          v-model="goods.amountMin"
          :title="`Минимальный заказ в ${goods.isWeighed ? 'кг' : 'шт'}`"
          placeholder="1"
          type="number" />
        <InputComponent
          v-model="goods.amountStep"
          :title="`Минимальный шаг заказа в ${goods.isWeighed ? 'кг' : 'шт'}`"
          placeholder="1"
          type="number" />
        <InputComponent
          v-model="goods.amountLeft"
          :title="`Имеется на складе, ${goods.isWeighed ? 'кг' : 'шт'}`"
          placeholder="120"
          type="number" />
        <InputComponent
          v-model="goods.cost"
          :title="`Цена за ${goods.isWeighed ? 'кг' : 'шт'}`"
          placeholder="1000"
          type="number" />
        <InputSwitch v-model="goods.isOnSale" title="В продаже?" on-state-title="ДА" off-state-title="НЕТ" />
      </div>

      <div class="right-column">
        <section class="images-container">
          <header class="info-header">Картинки товара</header>
          <p class="info">Сохраняются сразу, без нажатия на кнопку "сохранить"!</p>

          <ul class="images-list">
            <li v-for="(image, idx) in goods.images" :key="image.id" class="image-container">
              <ImageFallback
                class="image"
                :src="`${IMAGES_URL_BASE_PATH}${image.path}`"
                :fallback-src="DEFAULT_GOODS_IMAGE"
                alt="preview" />
              <button class="button-delete" @click="deleteGoodsImage(idx)" >
                <img src="/static/icons/trashbox.svg" alt="delete" />
              </button>
            </li>
            <li class="image-container button-plus">
              <DragNDropLoader
                @load="uploadGoodsImage"
                @error="$popups.error"
                :compress-size="1024"
                class="drag-n-drop-loader"
              >
                <div class="image">
                  <img src="/static/icons/plus-thin.svg" alt="plus" />
                </div>
              </DragNDropLoader>
            </li>
          </ul>
        </section>

        <ul class="categories-container">
          <header class="info-header">Категории товара</header>

          <li class="category-container" v-for="(category, idx) in goods.categories">
            <div class="title">{{ category.title }}</div>
            <button class="button-delete" @click="goods.categories.splice(idx, 1)">
              <img src="/static/icons/trashbox.svg" alt="delete" />
            </button>
          </li>
          <li class="category-container">
            <SelectList
              v-model="newCategoryId"
              :list="
                $globals?.categories?.map?.(category => ({
                  id: category.id,
                  name: category.title,
                  value: category.id,
                }))
              " />
            <button
              class="button-add"
              @click="
                () => {
                  if (newCategoryId === undefined || goods.categories.findIndex(c => c.id === newCategoryId) !== -1) {
                    newCategoryId = undefined;
                    return;
                  }
                  goods.categories.push({
                    id: newCategoryId,
                    title: $globals.categories.find(c => c.id === newCategoryId).title,
                  });
                  newCategoryId = undefined;
                }
              ">
              <img src="/static/icons/plus-thin.svg" alt="add" />
            </button>
          </li>
        </ul>

        <ul class="characters-container">
          <header class="info-header">Характеристики</header>
          <li class="character" v-for="(characterValue, characterName) in goods.characters">
            <p class="title">{{ characterName }}</p>
            <p class="value">{{ characterValue }}</p>
            <button class="button-delete" @click="delete goods.characters[characterName]">
              <img src="/static/icons/trashbox.svg" alt="delete" />
            </button>
          </li>
          <li class="character">
            <InputComponent class="title" v-model="newCharacter.title" placeholder="Характеристика" />
            <InputComponent class="value" v-model="newCharacter.value" placeholder="Значение" />
            <button
              class="button-add"
              @click="
                goods.characters[newCharacter.title] = newCharacter.value;
                newCharacter.title = '';
                newCharacter.value = '';
              ">
              <img src="/static/icons/plus-thin.svg" alt="add" />
            </button>
          </li>
        </ul>

        <div class="info" v-if="goodsId">Создан: {{ dateTimeFormatter(goods.createdDate) }}</div>
      </div>
    </section>

    <button class="button-save" v-if="goodsId !== undefined" @click="updateGoodsData">Сохранить изменения</button>
    <button class="button-save" v-else @click="createGoods">Создать товар</button>

    <CircleLinesLoading v-if="loading" centered />
  </div>
</template>

<script lang="ts">
import { Goods } from '~/utils/models';

import DEFAULT_GOODS_IMAGE from '#/images/ocean-bg.jpg';
import { IMAGES_URL_BASE_PATH } from '~/constants';
import CircleLinesLoading from '~/components/loaders/CircleLinesLoading.vue';
import ImageFallback from '~/components/ImageFallback.vue';
import InputComponent from '~/components/InputComponent.vue';
import InputSwitch from '~/components/InputSwitch.vue';
import SelectList from '~/components/SelectList.vue';
import DragNDropLoader from "@sergtyapkin/image-uploader/vue"
import { dateTimeFormatter } from '~/utils/utils';

export default {
  components: { DragNDropLoader, SelectList, InputSwitch, InputComponent, ImageFallback, CircleLinesLoading },

  data() {
    return {
      goodsId: this.$route.params.id as string,

      goods: {} as Goods,
      newCategoryId: undefined as undefined | string,
      newCharacter: {
        title: '',
        value: '',
      },

      loading: false,

      DEFAULT_GOODS_IMAGE,
      IMAGES_URL_BASE_PATH,
    };
  },

  computed: {},

  async mounted() {
    if (this.goodsId !== undefined) {
      await this.updateGoods();
    } else {
      this.goods.categories = [];
      this.goods.images = [];
      this.goods.characters = {};
    }
  },

  methods: {
    dateTimeFormatter,
    async updateGoods() {
      this.goods = (await this.$request(
        this,
        this.$api.getGoods,
        [this.goodsId],
        `Не удалось получить товар`,
      )) as Goods;
    },

    async updateGoodsData() {
      await this.$request(
        this,
        this.$api.updateGoods,
        [
          this.goods.id,
          this.goods.title,
          this.goods.description!,
          this.goods.fromLocation!,
          this.goods.amountLeft!,
          this.goods.amountStep,
          this.goods.amountMin,
          this.goods.isWeighed,
          this.goods.cost,
          this.goods.isOnSale,
          this.goods.characters!,
        ],
        `Не удалось обновить данные товара`,
        () => {
          window.onbeforeunload = null;
          this.$router.push({name: 'admin'});
        }
      );
    },

    async createGoods() {
      await this.$request(
        this,
        this.$api.createGoods,
        [
          this.goods.title,
          this.goods.description!,
          this.goods.fromLocation!,
          this.goods.amountLeft!,
          this.goods.amountStep,
          this.goods.amountMin,
          this.goods.isWeighed,
          this.goods.cost,
          this.goods.isOnSale,
          this.goods.characters!,
        ],
        `Не удалось создать товар`,
        () => {
          window.onbeforeunload = null;
          this.$router.push({name: 'admin'});
        }
      );
    },

    async uploadGoodsImage(dataUrl: string) {
      await this.$request(
        this,
        this.$api.uploadGoodsImage,
        [this.goods.id, dataUrl],
        `Не удалось загрузить картинку`,
        () => {
          this.updateGoods();
        }
      );
    },

    async deleteGoodsImage(idx: number) {
      if (!(await this.$modals.confirm('Точно удаляем картинку?', 'Восстановить не получится'))) {
        return;
      }
      await this.$request(
        this,
        this.$api.deleteImage,
        [this.goods.images[idx].id],
        `Не удалось удалить картинку`,
        () => {
          this.goods.images.splice(idx, 1);
        }
      );
    },

    onInput() {
      window.onbeforeunload = () => {};
    },
  },
};
</script>
