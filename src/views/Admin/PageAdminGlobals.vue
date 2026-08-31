<style scoped lang="stylus">
@import '../../styles/constants.styl'
@import '../../styles/components.styl'
@import '../../styles/buttons.styl'
@import '../../styles/fonts.styl'
@import '../../styles/utils.styl'
@import '../../styles/animations.styl'
@import '../../styles/scrollbars.styl'

.root-page-admin-globals
  display flex
  flex-direction column

  .header-info
    font-upper()
    font-medium()
    font-bold()

    margin-bottom 10px

  .block
    page-root()
    padding-bottom 30px
    background colorBgDark
    color colorTextInvert1
    &:nth-child(2n+1)
      background none
      color colorText1
      

  .button-save
    button-emp2()
    
    margin-top 10px
    width fit-content
</style>

<template>
  <div class="root-page-admin-globals">
    <TableComponent
      class="block"
      :content="goodsOnLanding"
      title="Товары на главной странице сайта"
      :clickable="true"
      :fields="[
        { name: '#', from: 'id', addable: false },
        { name: 'Название', from: 'title', availableValues: goods.map(g => ({name: g.title, value: g.id})) },
      ]"
      row-click-redirect-name='adminGoodsEdit'
      removable
      addable
      :on-add-callback="async (itemToAdd: {[key: string]: any}) => {
        // Внутри title у нас id, потому что мы так указали в :fields выше
        const goodsFound = goods.find(g => g.id === itemToAdd?.title);
        if (!itemToAdd || !goodsFound) {
          return false;
        }
        goodsOnLanding.push(deepClone(goodsFound));

        return await updateGlobals();
      }"
      :on-remove-callback="async (itemToRemove: {[key: string]: any}) => {
        const existingIdx = goods.findIndex(g => g.id === itemToRemove?.id);
        if (!itemToRemove || existingIdx === -1) {
          return false;
        }
        if (!(await $modals.confirm('Удаление товара с главной страницы', 'Вы уверены, что хотите убрать этот товар?'))) return false;
        goodsOnLanding.splice(existingIdx, 1);
        
        return await updateGlobals();
      }"
    />

    <div class="block">
      <header class="header-info">Категории товаров</header>
      <PageAdminCategories />
    </div>

    <div class="block">
      <InputSwitch
        v-model="isOnMaintenance"
        title="Сайт на техобслуживании"
        description="В режиме техобслуживания на сайт не сможет зайти вообще никто"
        @input="onInput"
      />

      <button class="button-save" @click="updateGlobals" :disabled="!isOnMaintenanceEdited">Сохранить изменения</button>
    </div>

    <CircleLinesLoading v-if="loading" centered />
  </div>
</template>

<script lang="ts">
import TableComponent from '~/components/tables/TableComponent.vue';
import InputSwitch from '~/components/InputSwitch.vue';
import { Goods } from '~/utils/models';
import { deepClone } from '~/utils/utils';
import CircleLinesLoading from '~/components/loaders/CircleLinesLoading.vue';
import PageAdminCategories from '~/views/Admin/PageAdminCategories.vue';

export default {
  components: { PageAdminCategories, CircleLinesLoading, InputSwitch, TableComponent },

  data() {
    return {
      isOnMaintenance: false,
      goodsOnLanding: [] as Goods[],
      
      goods: [] as Goods[],
      
      isOnMaintenanceEdited: false,
      loading: false,
    };
  },

  mounted() {
    this.isOnMaintenance = this.$globals.isOnMaintenance;
    this.goodsOnLanding = this.$globals.goodsOnLanding;

    this.updateGoods();
  },

  methods: {
    deepClone,

    async updateGoods() {
      this.goods = (
        (await this.$request(this, this.$api.getAllAdminGoodsList, [], `Не удалось получить список товаров`)) as {
          goods: Goods[];
        }
      ).goods;
    },

    async updateGlobals() {
      return (await this.$request(
        this,
        this.$api.updateGlobals,
        [this.isOnMaintenance, this.goodsOnLanding.map(g => g.id)],
        `Не удалось обновить глобальные данные`,
        () => {
          this.isOnMaintenanceEdited = false;
          window.onbeforeunload = null;
          this.$popups.success('Обновлено');
        },
      )) !== undefined;
    },

    onInput() {
      this.isOnMaintenanceEdited = true;
      window.onbeforeunload = () => {};
    },
  },
};
</script>
