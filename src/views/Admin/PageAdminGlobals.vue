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
    color colorTextInvert1
    background colorBgDark
    &:nth-child(odd)
      color colorText1
      background colorBgLight

  .button-save
    button-emp2()

    width fit-content
    margin-top 10px
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
        { name: 'Название', from: 'title', availableValues: goods.map(g => ({name: g.title, value: g.id})), addWithSearch: true },
      ]"
      row-click-redirect-name="adminGoodsEdit"
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
        const existingIdx = goodsOnLanding.findIndex(g => g.id === itemToRemove?.id);
        if (!itemToRemove || existingIdx === -1) {
          return false;
        }
        if (!(await $modals.confirm('Удаление товара с главной страницы', 'Вы уверены, что хотите убрать этот товар?'))) return false;
        goodsOnLanding.splice(existingIdx, 1);
        
        return await updateGlobals();
      }"
    />

    <div class="block">
      <PageAdminCategories />
    </div>

    <div class="block">
      <InputComponent 
        title="Курс стоимости в рублях к бонусам"
        description="Курс рублей к бонусам. То есть если выставлен курс 20, а товар стоит 100р, за него начислят 5 бонусов"
        v-model="moneyForBonuses"
        @input="onInput"
      />
      <InputComponent 
        title="Стоимость баночки черной икры в бонусах"
        description="Нужно отдельно для Бонуса Чёрной икры"
        v-model="blackPearlCost"
        @input="onInput"
      />
      <InputSwitch
        v-if="$user.canExecuteSQL"
        v-model="isOnMaintenance"
        title="Сайт на техобслуживании"
        description="В режиме техобслуживания на сайт не сможет зайти вообще никто"
        @input="onInput"
      />

      <button class="button-save" @click="updateGlobals" :disabled="!isEdited">Сохранить изменения</button>
    </div>

    <TableComponent
      class="block"
      :content="qualities"
      title="Квалификации партнёров"
      :fields="[
        { name: '#', from: 'id', addable: false },
        { name: 'Название', from: 'title' },
        { name: 'Дает бонус к уровню', from: 'branchDeepForQuality' },
        { name: 'Процентов', from: 'percentForQuality' },
        { name: 'Требование активных партнеров', from: 'activeCountRequirement' },
        { name: 'Требование кол-во веток', from: 'branchesCountRequirement' },
        { name: 'В каждой размер оборота', from: 'branchesValuesRequirement' },
        { name: 'Требование ЛО', from: 'totalPersonalBonusesRequirement' },
        { name: 'Бонус квалификации, бонусов', from: 'qualityBonusValue' },
        { name: 'Бонус квалификации, максимум выплат', from: 'qualityBonusMaxCount' },
      ]"
      row-click-redirect-name="adminGoodsEdit"
      removable
      addable
      :on-add-callback="async (itemToAdd: {[key: string]: any}) => {
        return await addQuality(itemToAdd as Quality);
      }"
      :on-remove-callback="async (itemToRemove: {[key: string]: any}) => {
        const existingIdx = qualities.findIndex(g => g.id === itemToRemove?.id);
        if (!itemToRemove || existingIdx === -1) {
          return false;
        }
        if (!(await $modals.confirm('Удаление квалификации', 'Вы уверены, что хотите убрать эту квалификацию?'))) return false;
        
        return await deleteQuality(itemToRemove.id);
      }"
    />

    <CircleLinesLoading v-if="loading" centered />
  </div>
</template>

<script lang="ts">
import TableComponent from '~/components/tables/TableComponent.vue';
import InputSwitch from '~/components/InputSwitch.vue';
import InputComponent from '~/components/InputComponent.vue';
import { Goods, Quality } from '~/utils/models';
import { deepClone } from '~/utils/utils';
import CircleLinesLoading from '~/components/loaders/CircleLinesLoading.vue';
import PageAdminCategories from '~/views/Admin/PageAdminCategories.vue';

export default {
  components: { PageAdminCategories, CircleLinesLoading, InputSwitch, TableComponent, InputComponent },

  data() {
    return {
      isOnMaintenance: false,
      goodsOnLanding: [] as Goods[],
      moneyForBonuses: 0,
      blackPearlCost: 0,
      
      goods: [] as Goods[],
      qualities: [] as Quality[],
      
      isEdited: false,
      loading: false,
    };
  },

  mounted() {
    this.isOnMaintenance = this.$globals.isOnMaintenance;
    this.goodsOnLanding = this.$globals.goodsOnLanding;
    this.moneyForBonuses = this.$globals.moneyForBonuses;
    this.blackPearlCost = this.$globals.blackPearlCost;

    this.updateGoods();
    this.updateQualities();
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

    async updateQualities() {
      this.qualities = (
        (await this.$request(this, this.$api.getAllQualities, [], `Не удалось получить список квалификаций`)) as {
          qualities: Quality[];
        }
      ).qualities;
    },

    async updateGlobals() {
      return (await this.$request(
        this,
        this.$api.updateGlobals,
        [this.isOnMaintenance, this.goodsOnLanding.map(g => g.id), this.moneyForBonuses, this.blackPearlCost],
        `Не удалось обновить глобальные данные`,
        () => {
          this.isEdited = false;
          window.onbeforeunload = null;
          this.$popups.success('Обновлено');
        },
      )) !== undefined;
    },

    async addQuality(quality: Quality) {
      return (await this.$request(
        this,
        this.$api.createQuality,
        [quality.title, quality.branchDeepForQuality, quality.percentForQuality, quality.activeCountRequirement, quality.branchesCountRequirement, quality.branchesValuesRequirement, quality.totalPersonalBonusesRequirement, quality.qualityBonusValue, quality.qualityBonusMaxCount],
        `Не удалось создать квалификацю`,
        () => {
          window.onbeforeunload = null;
          this.$popups.success('Квалификация добавлена');
          this.updateQualities();
        },
      )) !== undefined;
    },

    async deleteQuality(qualityId: string) {
      return (await this.$request(
        this,
        this.$api.deleteQuality,
        [qualityId],
        `Не удалось удалить квалификацию`,
        () => {
          this.$popups.success('Квалификация удалена');
          this.updateQualities();
        },
      )) !== undefined;
    },

    onInput() {
      this.isEdited = true;
      window.onbeforeunload = () => {};
    },
  },
};
</script>
