<style lang="stylus" scoped>
@import '../../styles/constants.styl'
@import '../../styles/components.styl'
@import '../../styles/buttons.styl'
@import '../../styles/fonts.styl'
@import '../../styles/utils.styl'
@import '../../styles/animations.styl'
@import '../../styles/scrollbars.styl'

.root-page-entities
  overflow hidden
  max-width 100%

  .block
    block-bg-shadow()

    display flex
    gap 10px
    margin-block 10px
</style>

<template>
  <div class="root-page-entities">
    <CircleLoading v-if="loading" centered />

    <transition name="opacity" mode="out-in">
      <div v-if="!isShowDeleting">
        <component :is="componentTable" :data="entities" @select="onSelectEntity" />

        <AdminButtonsBlock
          adding
          saving
          @add="onAdd"
          @save="onUpdate"
          :entity-name="entityName"
          :adding-fields="addingFields"
          ref="buttonsBlock"
        />
      </div>

      <div v-else>
        <component :is="componentTable" :data="entities" v-model="selectedEntities" />

        <AdminButtonsBlock deleting @delete="onDeleteSelected" entity-name="выбранных" />
      </div>
    </transition>

    <section class="block">
      <div>Множественное удаление</div>
      <Checkbox v-model="isShowDeleting" />
    </section>
  </div>
</template>

<script lang="ts">
import CircleLoading from '~/components/loaders/CircleLoading.vue';
import AdminButtonsBlock, { AddingField } from '~/components/AdminButtonsBlock.vue';
import Checkbox from '~/components/Checkbox.vue';
import { PropType } from 'vue';

export default {
  components: { Checkbox, AdminButtonsBlock, CircleLoading },

  props: {
    componentTable: {
      type: Object as any,
      required: true,
    },
    entityName: {
      type: String,
      required: true,
    },
    addingFields: {
      type: Array as PropType<AddingField[]>,
      required: true,
    },

    getFooFieldName: {
      type: String,
      required: true,
    },
    getAllFoo: {
      type: Function as PropType<() => any>,
      required: true,
    },
    updateByIdFoo: {
      type: Function as PropType<(id: string, data: any) => any>,
      required: true,
    },
    deleteByIdFoo: {
      type: Function as PropType<(id: string) => any>,
      required: true,
    },
    createFoo: {
      type: Function as PropType<(data: any) => any>,
      required: true,
    },
  },

  data() {
    return {
      loading: false,
      isShowDeleting: false,

      entities: [] as any[],
      selectedEntities: [] as any[],
    };
  },

  mounted() {
    this.getAllEntities();
  },

  methods: {
    async getAllEntities() {
      this.entities = (
        await this.$request(this, this.getAllFoo, [], `Не удалось получить список сущностей "${this.entityName}"`, {
          [this.getFooFieldName]: [],
        })
      )[this.getFooFieldName];
    },

    async onUpdate(data: any) {
      this.selectedEntities.forEach(entity => {
        this.$request(
          this,
          this.updateByIdFoo,
          [entity.id, data],
          `Не удалось удалить информацию о сущности "${this.entityName}"`,
        );
      });

      (this.$refs.buttonsBlock as typeof AdminButtonsBlock).clearFields(data);
      await this.getAllEntities();
    },

    async onDeleteSelected() {
      this.selectedEntities.forEach(entity => {
        this.$request(
          this,
          this.deleteByIdFoo,
          [entity.id],
          `Не удалось удалить информацию о сущности "${this.entityName}"`,
        );
      });

      await this.getAllEntities();
    },

    async onAdd(data: any) {
      await this.$request(this, this.createFoo, [data], `Не удалось добавить сущность "${this.entityName}"`);

      await this.getAllEntities();
    },

    onSelectEntity(data: any) {
      (this.$refs.buttonsBlock as typeof AdminButtonsBlock).setFields(data);
    },
  },
};
</script>
