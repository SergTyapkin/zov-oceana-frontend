<style scoped lang="stylus">
@import '../../styles/constants.styl'
@import '../../styles/components.styl'
@import '../../styles/buttons.styl'
@import '../../styles/fonts.styl'
@import '../../styles/utils.styl'
@import '../../styles/animations.styl'
@import '../../styles/scrollbars.styl'

</style>

<template>
  <div class="root-page-admin-categories">
    <TableComponent
      :content="$globals.categories"
      title="Категории"
      :clickable="true"
      :fields="[
        { name: '#', from: 'id', addable: false },
        { name: 'Название', from: 'title' },
        { name: 'Описание', from: 'description' },
      ]"
      removable
      addable
      :on-add-callback="async (itemToAdd: {[key: string]: any}) => {
        return !!(await createCategory(itemToAdd.title, itemToAdd.description));
      }"
      :on-remove-callback="async (itemToRemove: {[key: string]: any}) => {
        return !!(await deleteCategory(itemToRemove.id));
      }"
    />

    <CircleLinesLoading v-if="loading" centered />
  </div>
</template>

<script lang="ts">
import CircleLinesLoading from '~/components/loaders/CircleLinesLoading.vue';
import TableComponent from '~/components/tables/TableComponent.vue';
import { Category } from '~/utils/models';

export default {
  components: { CircleLinesLoading, TableComponent },

  data() {
    return {
      loading: false,
    };
  },

  mounted() {
    this.updateCategories();
  },

  methods: {
    async updateCategories() {
      await this.$store.dispatch('GET_GLOBALS');
      this.$forceUpdate();
    },

    async createCategory(title: string, description: string) {
      if (!title) return;
      const res = await this.$request(this, this.$api.createCategory, [title, description], `Не удалось создать категорию`);

      await this.updateCategories();
      return res;
    },

    async renameCategory(category: Category) {
      const title = await this.$modals.prompt('Изменение категории', 'Введите название категории', category.title);
      if (!title) {
        return;
      }
      const description = await this.$modals.prompt('Изменение категории', 'Введите описание категории', category.description);

      const res = await this.$request(this, this.$api.updateCategory, [category.id, title, description], `Не удалось изменить категорию`);

      await this.updateCategories();
      return res;
    },

    async deleteCategory(id: string) {
      if (!(await this.$modals.confirm('Удаление категории', 'Вы точно уверены? Она пропадёт из всех товаров, восстановить не получится'))) {
        return;
      }

      const res = await this.$request(this, this.$api.deleteCategory, [id], `Не удалось удалить категорию`);

      await this.updateCategories();
      return res;
    },
  },
};
</script>
