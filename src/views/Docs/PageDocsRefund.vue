<style scoped lang="stylus">
@import '../../styles/constants.styl'
@import '../../styles/components.styl'
@import '../../styles/buttons.styl'
@import '../../styles/fonts.styl'
@import '../../styles/utils.styl'
@import '../../styles/animations.styl'
@import '../../styles/scrollbars.styl'

.root-page-admin-categories
  // page-root()

  section.filters
    margin-inline 0

    .top-row
      display flex
      flex-wrap wrap
      gap 10px
      justify-content space-between
      .input-group
        display flex
        flex 1
        .search
          flex 1
          min-width 150px
        .category-selector
          min-width 150px

    @media ({mobile})
      margin-inline 0
    page-root-disable()
    animation-float()

  section.goods
    overflow auto
    display grid
    grid-row-gap 10px
    grid-template-columns auto auto 1fr auto auto
    align-items center
    width 100%
    padding 40px 10px 0 10px
    scrollable()
    .row
      display contents
      > *
        padding-inline 10px
        &.button
          button-no-fill()

          width min-content
          padding-inline 10px
          img
            margin 0

        @media ({mobile})
          padding-inline 3px
        trans()
      &.header
        font-bold()
        > *
          margin-bottom 10px
    .info
      font-small()

      color colorText5

  .button-plus
    centered-margin()
    button-emp2()

    width fit-content
    margin-top 30px
</style>

<template>
  <div class="root-page-admin-categories">
    <section class="goods">
      <div class="row header">
        <div>#</div>
        <div>Категория</div>
        <div>Описание</div>
        <div />
        <div />
      </div>

      <div class="row" v-for="category in $globals.categories" :key="category.id">
        <div>{{ category.id }}</div>
        <div>{{ category.title }}</div>
        <div>{{ category.description }}</div>
        <button class="button" @click="renameCategory(category)"><img src="/static/icons/edit.svg" alt="edit"></button>
        <button class="button" @click="deleteCategory(category)"><img src="/static/icons/trashbox.svg" alt="delete"></button>
      </div>

      <div v-if="!$globals.categories.length" class="info">Категорий нет</div>
    </section>
    <button class="button-plus" @click="createCategory()"><img src="/static/icons/plus-thin.svg" alt="plus">Добавить</button>

    <CircleLinesLoading v-if="loading" centered />
  </div>
</template>

<script lang="ts">
import CircleLinesLoading from '~/components/loaders/CircleLinesLoading.vue';
import { Category } from '~/utils/models';

export default {
  components: { CircleLinesLoading },

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

    async createCategory() {
      const title = await this.$modals.prompt('Создание категории', 'Введите название категории');
      if (!title) {
        return;
      }
      const description = await this.$modals.prompt('Создание категории', 'Введите описание категории');

      await this.$request(this, this.$api.createCategory, [title, description], `Не удалось создать категорию`);

      await this.updateCategories();
    },

    async renameCategory(category: Category) {
      const title = await this.$modals.prompt('Изменение категории', 'Введите название категории', category.title);
      if (!title) {
        return;
      }
      const description = await this.$modals.prompt('Изменение категории', 'Введите описание категории', category.description);

      await this.$request(this, this.$api.updateCategory, [category.id, title, description], `Не удалось изменить категорию`);

      await this.updateCategories();
    },

    async deleteCategory(category: Category) {
      if (!(await this.$modals.confirm('Удаление категории', 'Вы точно уверены? Она пропадёт из всех товаров, восстановить не получится'))) {
        return;
      }

      await this.$request(this, this.$api.deleteCategory, [category.id], `Не удалось удалить категорию`);

      await this.updateCategories();
    },
  },
};
</script>
