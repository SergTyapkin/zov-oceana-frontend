<style lang="stylus" scoped>
@import '../styles/constants.styl'
@import '../styles/components.styl'
@import '../styles/utils.styl'
@import '../styles/fonts.styl'
@import '../styles/scrollbars.styl'

bg-color = colorBlockBg
bg-color-hover = mix(colorBlockBg, colorEmp2, 90%)
bg-color-selected = mix(colorBlockBg, colorEmp2, 85%)
bg-color-selected-hover = mix(colorBlockBg, colorEmp2, 90%)

max-list-height = 200px

field()
  font-small-extra()

  cursor pointer
  display flex
  align-items center
  padding 10px 15px
  transition background-color 0.1s ease


.select-root
  user-select none
  position relative
  z-index 999
  transform translateY(calc(var(--overflow-y-length) * -1px)) translateX(calc(var(--overflow-x-length) * -1px))
  min-width 100px
  margin 0
  padding 0
  transition transform 0.2s ease
  &:has(.title.shown)
    padding-top 10px

  .title
    font-small-extra()

    pointer-events none
    position absolute
    top -1lh
    left 0
    color colorText5
    opacity 0
    transition all 0.2s ease
    &.shown
      top calc(-1lh + 10px)
      opacity 1

  &:hover
    .title
      opacity 1

  .error-text
    font-small()

    position absolute
    top calc(100% + 3px)
    color colorError
    opacity 0
    trans()

  .selected-item
    input()
    field()

    justify-content space-between
    width 100%
    color colorText1
    &.default
      color colorText2

    &:hover
      background bg-color-selected-hover

    img
      img-size(20px)

      transition transform 0.3s ease

  &.big-font
    .selected-item
      font-small()

  &.unrolled
    .title
      top calc(-1lh - 4px)
      color colorText1
      opacity 1
      &.shown
        top calc(-1lh + 6px)

    .selected-item
      background bg-color-selected

    img
      transform rotate(-180deg)

  &[readonly]:not([readonly="false"])
    pointer-events none
    user-select text

    .title
      opacity 0.8

    .selected-item
      padding-left 10px
      border none

      img
        display none

  &[disabled]:not([disabled="false"])
    pointer-events none
    user-select text
    opacity 0.6

    .title
      opacity 0.8

    .selected-item
      img
        display none

  &.error
    .title
    .selected-item
      color colorError
    .error-text
      opacity 1

.list
  scrollable()

  position absolute
  z-index 999
  overflow-y auto
  width fit-content
  max-height max-list-height
  margin 0
  padding 0
  border-top none
  list-style none
  box-shadow 0 0 10px colorShadow

  .item
    field()

    padding 10px
    color colorText1
    background bg-color

    &.default
      color colorText2

    &.selected
      letter-spacing 1px
      background bg-color-selected

    &:hover
      background bg-color-hover

    &.selected:hover
      background bg-color-selected-hover

    &:not(:first-child)
      border-top 1px solid colorBorder

  &.big-font
    .item
      font-small()

// ======================
// ----- Dropdown -------
.dropdown-enter-active
  animation dropdown 0.3s

.dropdown-leave-active
  animation dropdown 0.3s reverse forwards


@keyframes dropdown
  0%
    transform-origin 50% 0
    transform scale(0.95)
    opacity 0

  100%
    transform-origin 50% 0
    transform scale(1)
    opacity 1
</style>

<template>
  <div
    class="select-root"
    ref="root"
    :class="{ unrolled: isUnrolled, error, 'big-font': bigFont }"
    :disabled="disabled"
    :readonly="readonly"
    :style="{
      '--overflow-y-length': overflowYLength,
      '--overflow-x-length': overflowXLength,
    }"
  >
    <div class="selected-item" @click.stop="toggleOpen" :class="{default: currentSelectedIdx === undefined}">
      {{ currentSelectedIdx !== undefined ? list[currentSelectedIdx]?.name : (placeholder || 'Не выбрано') }}
      <img src="/static/icons/chevron-down.svg" alt="chevron">
    </div>

    <Teleport to="body">
      <transition name="dropdown" :duration="75">
        <ul 
          v-if="isUnrolled"
          ref="dropdownList"
          class="list scrollable"
          :class="{'big-font': bigFont}"
          :style="menuStyle"
        >
          <InputSearch
            ref="inputSearch"
            v-if="withSearch"
            placeholder="Поиск..."
            v-model="searchText"
            :small-font="!bigFont"
            @keydown.enter="onEnterWhileSearch"
          />
          <li
            v-if="canBeNull"
            class="item default"
            :class="{ selected: currentSelectedIdx === undefined }"
            @click.stop="selectItemByIdx(undefined)"
          >
            {{ placeholder || 'Не выбрано' }}
          </li>
          <li
            v-for="(item, idx) in filteredList"
            class="item"
            :class="{ selected: idx === currentSelectedIdx }"
            @click.stop="selectFilteredItemByIdx(idx)"
          >
            {{ item.name }}
          </li>
        </ul>
      </transition>
    </Teleport>
      
    <span class="title" :class="{shown: titleAlwaysShown}">{{ title }}</span>
    <span class="error-text">{{ errorText || 'Ошибка' }}</span>
  </div>
</template>

<script lang="ts">
import {PropType} from "vue";
import InputSearch from "./InputSearch.vue";


type MenuPosition = {
  position: 'fixed';
  left: string;
  top: string;
  minWidth: string;
  maxWidth: string;
};

export default {
  components: {InputSearch},

  emits: ['input', 'update:modelValue'],

  props: {
    title: {
      type: String,
      default: '',
    },
    placeholder: {
      type: String,
      default: '',
    },
    list: {
      type: Array as PropType<{id?: string, name: string, value: any}[]>,
      required: true,
    },
    selectedIdx: {
      type: Number,
      default: undefined,
    },
    selectedId: {
      type: String,
      default: undefined,
    },
    disabled: Boolean,
    readonly: Boolean,
    opened: Boolean,
    canBeNull: Boolean,
    titleAlwaysShown: Boolean,
    withSearch: Boolean,
    bigFont: Boolean,

    modelValue: {
      type: null as any,
      default: null,
    },
    errorText: {
      type: String,
      default: '',
    },
    error: {
      type: Boolean as PropType<boolean | string>,
      default: false,
    },
  },

  data() {
    return {
      States: {
        default: 0,
        success: 1,
        error: 2,
      },
      state: 0,

      currentSelectedIdx: undefined as number | undefined,
      isUnrolled: this.$props.opened,
      searchText: '',

      overflowYLength: 0,
      overflowXLength: 0,

      menuStyle: { position: 'fixed', left: '0px', top: '0px', minWidth: '0px' } as MenuPosition,
    };
  },

  computed: {
    filteredList() {
      if (!this.searchText) return this.list;
      return this.list.filter(item => new RegExp(this.searchText, 'uig').test(item.name));
    }
  },

  mounted() {
    if (this.$props.selectedIdx !== undefined) {
      this.selectItemByIdx(this.$props.selectedIdx, true);
    } else if (this.$props.selectedId !== undefined) {
      this.selectItemById(this.$props.selectedId, true);
    }
  },

  beforeUnmount() {
    this.removeOpenListeners();
  },

  methods: {
    focus() {
      this.isUnrolled = true;
    },

    selectFilteredItemByIdx(idx: number | undefined, disableEmitting = false, disableUpdating = false) {
      if (idx === undefined) {
        this.selectItemByIdx(idx, disableEmitting, disableUpdating);
        return;
      }
      const item = this.filteredList[idx];
      const idxInList = this.list.findIndex(i => i === item);
      this.selectItemByIdx(idxInList, disableEmitting, disableUpdating);
    },

    selectItemByIdx(idx: number | undefined, disableEmitting = false, disableUpdating = false) {
      this.state = this.States.default;
      this.currentSelectedIdx = idx;

      if (idx !== undefined) {
        if (!disableUpdating) {
          this.$emit('update:modelValue', this.list[idx].value);
        }
        if (!disableEmitting) {
          this.$emit('input', idx, this.list[idx].value);
        }
      } else {
        if (!disableUpdating) {
          this.$emit('update:modelValue', null);
        }
        if (!disableEmitting) {
          this.$emit('input', null, null);
        }
      }
      this.setClose();
    },

    selectItemById(id: string | undefined, disableEmitting = false, disableUpdating = false) {
      const idx = this.list.findIndex(i => i.id === id);
      this.selectItemByIdx(idx === -1 ? undefined : idx, disableEmitting, disableUpdating);
    },

    toggleOpen(): void {
      if (this.isUnrolled) {
        this.setClose();
        return;
      }

      this.isUnrolled = true;
      void this.$nextTick().then(() => {
        (this.$refs.inputSearch as typeof InputSearch | undefined)?.focus?.();
        this.updateMenuPosition();
        document.addEventListener('pointerdown', this.handleDocumentPointerDown, true);
        document.addEventListener('keydown', this.handleDocumentKeydown, true);
        window.addEventListener('resize', this.updateMenuPosition);
        window.addEventListener('scroll', this.updateMenuPosition, true);
        return true;
      });
    },

    setOpen() {
      const rect = (this.$el as HTMLElement).getBoundingClientRect();
      const bottomY = rect.y + rect.height;
      const rightX = rect.x + rect.width;
      const maxHeight = window.innerHeight;
      const maxWidth = window.innerWidth;
      this.overflowYLength = Math.max(bottomY - maxHeight, 0);
      this.overflowXLength = Math.max(rightX - maxWidth, 0);
      this.isUnrolled = true;
    },
    setClose() {
      this.overflowYLength = 0;
      this.isUnrolled = false;
      this.removeOpenListeners();
    },

    updateMenuPosition(): void {
      const trigger = this.$refs.root;
      if (!(trigger instanceof HTMLElement)) return;
      
      const list = this.$refs.dropdownList as HTMLElement | undefined;
      const listWidth = list?.clientWidth || 150;
      const listHeight = list?.clientHeight || 200;

      const bounds = trigger.getBoundingClientRect();
      const left = Math.min(bounds.left, window.innerWidth - listWidth);
      const top = Math.min(bounds.bottom, window.innerHeight - listHeight - 10);
      this.menuStyle = {
        position: 'fixed',
        left: `${left}px`,
        top: `${top}px`,
        minWidth: `${Math.max(bounds.width, 120)}px`,
        maxWidth: `${window.innerWidth - left - 10}px`,
      };
    },

    removeOpenListeners(): void {
      document.removeEventListener('pointerdown', this.handleDocumentPointerDown, true);
      document.removeEventListener('keydown', this.handleDocumentKeydown, true);
      window.removeEventListener('resize', this.updateMenuPosition);
      window.removeEventListener('scroll', this.updateMenuPosition, true);
    },

    handleDocumentPointerDown(event: PointerEvent): void {
      const target = event.target;
      const root = this.$refs.root as HTMLElement | undefined;
      if (!(target instanceof Node) || !(root instanceof HTMLElement)) return;
      const menu = this.$refs.dropdownList as HTMLElement | undefined;
      if (!root.contains(target) && !menu?.contains(target)) this.setClose();
    },
    handleDocumentKeydown(event: KeyboardEvent): void {
      if (event.key === 'Escape') {
        this.setClose();
        (this.$refs.trigger as HTMLElement | undefined)?.focus();
      }
    },
    onEnterWhileSearch() {
      this.selectFilteredItemByIdx(0);
      this.setClose();
    },
  },

  watch: {
    list(from: any, to: any) {
      if (JSON.stringify(from) === JSON.stringify(to)) {
        return;
      }

      if (this.selectedId && this.currentSelectedIdx === undefined) {
        this.currentSelectedIdx = this.list.findIndex(item => String(item.id) === String(this.$props.selectedId));
        if (this.currentSelectedIdx === -1) {
          this.currentSelectedIdx = undefined;
          return;
        }
      }

      if (this.$props.selectedIdx) {
        this.selectItemByIdx(this.$props.selectedIdx, true, true);
      } else if (this.$props.selectedId) {
        this.selectItemById(this.$props.selectedId, true, true);
      }
    },

    modelValue() {
      const idx = this.list.findIndex(i => i.value === this.modelValue);
      this.selectItemByIdx(idx === -1 ? undefined : idx, true, true);
    },
  },
};
</script>
