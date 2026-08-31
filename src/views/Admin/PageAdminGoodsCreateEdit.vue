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

        color colorTextInvert2

      .images-container
        .images-list
          list-no-styles()

          display flex
          flex-wrap wrap
          gap 5px
          margin-top 10px
          .image-container
            position relative
            width 30%
            min-width 150px
            max-width 250px
            background colorBgLight
            .image
              img-size(100%)
            .button-delete
              button-no-styles()
              svg-inside(40px, 0, 0)
              centered-absolute-transform()

              pointer-events none
              padding-top 10px
              opacity 0
              trans()
            &:hover > .button-delete
              pointer-events unset
              padding-top 0
              opacity 1

            // === стили для drag-n-drop ===
            &.dragging
              opacity 0.5
              transform scale(0.95)
            
            &.drag-over
              border 2px solid colorEmp1
              background colorBlockBg

            &.button-plus
              min-height 100px
              border 1px dashed black
              hover-effect()
              .drag-n-drop-loader
                width 100%
                height 100%
                .image
                  position absolute
                  centered-absolute-transform()

                  width unset
                  height unset

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

  .button-save
    button-emp2()
    centered-margin()

    width fit-content
</style>

<template>
  <div class="root-page">
    <router-link :to="{ name: 'admin' }">
      <section class="page-title">
        <img src="/static/icons/arrow-left.svg" alt="arrow left">
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
          placeholder="Страна / регион / город"
        />
        <InputSwitch v-model="goods.isWeighed" title="Штучный или весовой" on-state-title="КГ" off-state-title="ШТ" />
        <InputComponent
          v-model="goods.amountMin"
          :title="`Минимальный заказ в ${goods.isWeighed ? 'кг' : 'шт'}`"
          placeholder="1"
          type="number"
        />
        <InputComponent
          v-model="goods.amountStep"
          :title="`Минимальный шаг заказа в ${goods.isWeighed ? 'кг' : 'шт'}`"
          placeholder="1"
          type="number"
        />
        <InputComponent
          v-model="goods.amountLeft"
          :title="`Имеется на складе, ${goods.isWeighed ? 'кг' : 'шт'}`"
          placeholder="120"
          type="number"
        />
        <InputComponent
          v-model="goods.cost"
          :title="`Цена за ${goods.isWeighed ? 'кг' : 'шт'}`"
          placeholder="1000"
          type="number"
        />
        <InputSwitch v-model="goods.isOnSale" title="В продаже?" on-state-title="ДА" off-state-title="НЕТ" />
        <InputSwitch v-model="goods.isDelicates" title="Деликатес?" on-state-title="ДА" off-state-title="НЕТ" />

        <button class="button-save" v-if="!isCreate" @click="updateGoodsData">Сохранить изменения</button>
      </div>

      <div class="right-column">
        <section v-if="!isCreate" class="images-container">
          <header class="info-header">Картинки товара</header>
          <p class="info">Как и всё ниже, сохраняются сразу, без нажатия на кнопку "сохранить"</p>

          <ul class="images-list">
            <li 
              v-for="(image, idx) in goods.images" 
              :key="image.id" 
              class="image-container"
              draggable="true"
              :class="{ 
                dragging: draggedImage?.id === image.id,
                'drag-over': dragOverTarget?.id === image.id
              }"
              @dragstart="handleDragStart($event, image)"
              @dragend="handleDragEnd"
              @dragover.prevent
              @dragenter="handleDragEnter(image)"
              @dragleave="handleDragLeave"
              @drop="handleDrop($event, image)"
            >
              <ImageFallback
                class="image"
                :src="`${IMAGES_URL_BASE_PATH}${image.path}`"
                :fallback-src="DEFAULT_GOODS_IMAGE"
                alt="preview"
              />
              <button class="button-delete" @click="deleteGoodsImage(idx)">
                <img src="/static/icons/trashbox.svg" alt="delete">
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
                  <img src="/static/icons/plus-thin.svg" alt="plus">
                </div>
              </DragNDropLoader>
            </li>
          </ul>
        </section>

        <TableComponent
          :content="goods.categories ?? []"
          title="Категории товара"
          :clickable="false"
          :fields="[
            // { name: '#', from: 'id' },
            { name: 'Название', from: 'title', availableValues: $globals.categories.map(c => ({name: c.title, value: c.id})) },
          ]"
          removable
          addable
          :on-add-callback="async (itemToAdd: {[key: string]: any}) => {
            // Внутри title у нас id, потому что мы так указали в :fields выше
            const categoryFound = $globals.categories.find(g => g.id === itemToAdd?.title);
            if (!itemToAdd || !categoryFound) {
              return false;
            }
            goods.categories.push(deepClone(categoryFound));

            return !!(await updateGoodsData());
          }"
          :on-remove-callback="async (itemToRemove: {[key: string]: any}) => {
            const existingIdx = goods.categories.findIndex(g => g.id === itemToRemove?.id);
            if (!itemToRemove || existingIdx === -1) {
              return false;
            }
            goods.categories.splice(existingIdx, 1);

            return !!(await updateGoodsData());
          }"
        />

        <TableComponent
          :content="Object.entries(goods.characters ?? {})"
          title="Характеристики"
          :clickable="false"
          :fields="[
            // { name: '#', from: 'id' },
            { name: 'Название', from: 0 },
            { name: 'Значение', from: 1 },
          ]"
          removable
          addable
          :on-add-callback="async (itemToAdd: {[key: string]: any}) => {
            if (!itemToAdd[0] || !itemToAdd[1] || !goods.characters) return false;

            goods.characters[itemToAdd[0]] = itemToAdd[1];
            return !!(await updateGoodsData());
          }"
          :on-remove-callback="async (itemToRemove: {[key: string]: any}) => {
            if (!goods.characters) return false;

            delete goods.characters[itemToRemove[0]];
            return !!(await updateGoodsData());
          }"
        />

        <div class="info" v-if="goodsId">
          Создан: {{ dateTimeFormatter(goods.createdDate) }} <br>
          #ID: {{ goods.id }} <br>
        </div>
      </div>
    </section>

    <button class="button-save" v-if="isCreate" @click="createGoods">Создать товар</button>

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
import TableComponent from '~/components/tables/TableComponent.vue';
import DragNDropLoader from "@sergtyapkin/image-uploader/vue"
import { dateTimeFormatter, deepClone } from '~/utils/utils';

export default {
  components: { DragNDropLoader, InputSwitch, InputComponent, ImageFallback, CircleLinesLoading, TableComponent },

  data() {
    return {
      goodsId: this.$route.params.id as string,

      goods: {
        isWeighed: false,
        isOnSale: false,
        isDelicates: false,
      } as Goods,
      newCategoryId: undefined as undefined | string,
      newCharacter: {
        title: '',
        value: '',
      },

      loading: false,

      DEFAULT_GOODS_IMAGE,
      IMAGES_URL_BASE_PATH,

      draggedImage: null as null | { id: string; sortingKey: string },
      dragOverTarget: null as null | { id: string; sortingKey: string },
    };
  },

  computed: {
    isCreate() {
      return this.goodsId === undefined;
    },
  },

  async mounted() {
    if (this.isCreate) {
      this.goods.categories = [];
      this.goods.images = [];
      this.goods.characters = {};
    } else {
      await this.updateGoods();
    }
  },

  methods: {
    dateTimeFormatter,
    deepClone,
    
    async updateGoods() {
      this.goods = (await this.$request(
        this,
        this.$api.getGoods,
        [this.goodsId],
        `Не удалось получить товар`,
      )) as Goods;
    },

    async updateGoodsData() {
      return await this.$request(
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
          this.goods.isDelicates,
          this.goods.characters!,
          this.goods.images,
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
          this.goods.isDelicates,
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
      if (!dataUrl) return;
      
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

    // === Методы для drag-n-drop перетаскивания картинок ===
    handleDragStart(event: DragEvent, image: { id: string; sortingKey: string }) {
      this.draggedImage = image;
      if (event.dataTransfer) {
        event.dataTransfer.effectAllowed = 'move';
      }
    },

    handleDragEnd() {
      this.draggedImage = null;
      this.dragOverTarget = null;
    },

    handleDragEnter(image: { id: string; sortingKey: string }) {
      if (this.draggedImage && this.draggedImage.id !== image.id) {
        this.dragOverTarget = image;
      }
    },

    handleDragLeave() {
      this.dragOverTarget = null;
    },

    handleDrop(event: DragEvent, targetImage: { id: string; sortingKey: string }) {
      event.preventDefault();
      this.dragOverTarget = null;

      if (!this.draggedImage || this.draggedImage.id === targetImage.id) {
        return;
      }

      const images = this.goods.images;
      const currentIndex = images.findIndex(img => img.id === this.draggedImage!.id);
      const targetIndex = images.findIndex(img => img.id === targetImage.id);

      if (currentIndex === -1 || targetIndex === -1) {
        return;
      }

      // Перемещаем элемент
      const [removed] = images.splice(currentIndex, 1);
      images.splice(targetIndex, 0, removed);

      // Обновляем sortingKey для всех изображений
      images.forEach((img, index) => {
        img.sortingKey = index;
      });

      this.draggedImage = null;
    },
  },
};
</script>