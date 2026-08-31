<style lang="stylus" scoped>
@import '../styles/constants.styl'
@import '../styles/components.styl'
@import '../styles/buttons.styl'
@import '../styles/fonts.styl'
@import '../styles/utils.styl'
@import '../styles/animations.styl'
@import '../styles/scrollbars.styl'

.root-admin-block
  block-bg-shadow()

  margin-top 50px

  header
    font-large()

    margin-bottom 10px

  .adding-section
    .field
      margin-block 10px
      .title
        font-medium()
        .optional-marker
          margin-left 5px
          color colorEmp2
      .description
        font-small()

        color colorText2
      input
        input()

        height unset
        padding 5px 10px

  .buttons-container
    display flex
    flex-wrap wrap
    gap 10px
    .button-delete
      button-attention()
    .button-add
    .button-save
      button-emp1()
</style>

<template>
  <section class="root-admin-block">
    <header>Администрирование</header>

    <section v-if="adding" class="adding-section">
      <div class="field" v-for="field in addingFields">
        <div class="title">{{ field.title }}<span v-if="!field.optional" class="optional-marker">*</span></div>
        <div class="description">{{ field.options?.join(' / ') }}</div>
        <input v-model="addingFieldsValues[field.key]" :type="field.type || 'text'">
      </div>
    </section>

    <div class="buttons-container">
      <button v-if="adding" class="button-add" @click="onAdd">Добавить {{ entityName }}</button>
      <button v-if="editing" class="button-add" @click="onAdd">Сохранить {{ entityName }}</button>
      <button v-if="saving" class="button-save" @click="onSave">Сохранить {{ entityName }}</button>
      <button v-if="deleting" class="button-delete" @click="onDelete">Удалить {{ entityName }}</button>
    </div>
  </section>
</template>

<script lang="ts">
import { PropType } from 'vue';

export type AddingField = {
  title: string,
  key: string,
  default?: string,
  type?: string,
  options?: string[],
  optional?: boolean,
};


export default {
  emits: ['edit', 'add', 'save', 'delete'],

  props: {
    adding: Boolean,
    saving: Boolean,
    editing: Boolean,
    deleting: Boolean,

    entityName: {
      type: String,
      default: '',
    },

    addingFields: {
      type: Array as PropType<AddingField[]>,
      default: () => [],
    },
  },

  data() {
    return {
      addingFieldsValues: {} as {[key: string]: any},
    }
  },

  mounted() {
    if (this.addingFields) {
      this.addingFields.forEach(field => {
        const defaultVal = field.default;
        this.addingFieldsValues[field.key] = defaultVal ?? undefined;
      });
    }
  },

  methods: {
    async onDelete() {
      if (!(await this.$modals.confirm('Вы уверены?'))) {
        return;
      }
      this.$emit('delete');
    },

    async onSave() {
      this.$emit('save', this.addingFieldsValues);
    },

    async onEdit() {
      this.onAdd('edit');
    },

    async onAdd(_overrideEventName?: string) {
      let err = false;
      this.addingFields.forEach(field => {
        if (!field.optional && !this.addingFieldsValues[field.key]) {
          err = true;
        }
      });
      if (err) {
        this.$popups.error('Ошибка заполенния', 'Заполните все обязательные поля');
        return;
      }
      // @ts-expect-error _overrideEventName is in 'emits'
      this.$emit(_overrideEventName ?? 'add', this.addingFieldsValues);
    },

    setFields(fields: {[key: string]: any}) {
      Object.entries(fields).forEach(([key, value]) => {
        if (this.addingFields.findIndex(f => f.key === key) !== -1) {
          this.addingFieldsValues[key] = value;
        }
      });
    },

    clearFields() {
      this.addingFieldsValues = {};
    }
  }
};
</script>
