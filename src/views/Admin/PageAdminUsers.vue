<style scoped lang="stylus">
@import '../../styles/constants.styl'
@import '../../styles/components.styl'
@import '../../styles/buttons.styl'
@import '../../styles/fonts.styl'
@import '../../styles/utils.styl'
@import '../../styles/animations.styl'
@import '../../styles/scrollbars.styl'

.root-page-admin-users
  page-root()

  section.filters
    page-root-disable()
    animation-float()

    display flex
    flex-wrap wrap
    gap 10px
    justify-content space-between
    margin-inline 0
    @media({mobile})
      margin-inline 0

    .search
      flex 1
      min-width 150px
    .category-selector
      min-width 150px

  section.users
    width 100%
    display grid
    grid-template-columns repeat(7, auto)
    box-shadow 0 15px 15px #00000033
    overflow auto
    scrollable()
    .row
      display contents
      > *
        width 100%
        height 100%
        padding 15px 10px
        display flex
        align-items center
        text-align left
        trans()
        &:first-child
          padding-left 25px
        &:last-child
          padding-right 25px
      &:nth-child(2n)
        > *
          background mix(colorBlockBg, transparent, 30%)
      &:not(.header):hover
        > *
          opacity 0.6
      &.header
        font-bold()
        > *
          margin-bottom 10px

      > .status
        font-bold()
        color mix(colorEmp1, transparent, 90%)
      &.red > .status
        color mix(colorError, transparent, 90%)
      &.green > .status
        color mix(colorSuccess, transparent, 90%)
      &.yellow > .status
        color mix(colorEmp1, transparent, 90%)
      &.blue > .status
        color mix(colorEmp2, transparent, 90%)
      &.gray > .status
        color mix(colorTextInvert4, transparent, 90%)
    .info
      font-small()
      color colorText5

  .button-plus
    centered-margin()
    button-emp2()
    margin-top 30px
    width fit-content
</style>

<template>
  <div class="root-page-admin-users">
    <section class="filters" style="--animation-index: 0">
      <InputSearch class="search" placeholder="Найти пользователя..." v-model="filters.searchText" />
      <SelectList
        class="category-selector"
        placeholder="Любой статус"
        can-be-null
        :list="[
          {
            id: 'partners',
            name: 'Партнёры',
            value: true,
          },
          {
            id: 'users',
            name: 'Не партнёры',
            value: false,
          },
          {
            id: 'on-hold',
            name: 'Подал заявку',
            value: undefined,
          },
        ]"
        v-model="filters.isPartners"
      />
    </section>

    <section class="users">
      <div class="row header">
        <div>#</div>
        <div>Имя</div>
        <div>Телефон</div>
        <div>Заказов</div>
        <div>Сумма выкупа</div>
        <div>Партнёр?</div>
        <div>Партнёрский баланс</div>
      </div>

      <router-link
        class="row"
        :to="{ name: 'adminUserEdit', params: { id: user.id } }"
        v-for="user in usersFiltered"
        :key="user.id"
      >
        <div>{{ user.id }}</div>
        <div>{{ user.familyName }} {{ user.givenName }} {{ user.middleName }}</div>
        <div class="tel">{{ telFormatter(user.tel!) }}</div>
        <div>{{ user.ordersCount || '-' }}</div>
        <div>{{ user.totalOrdersCost ? costFormatter(user.totalOrdersCost) : '-' }}</div>
        <div>{{ user.partnerStatus === undefined ? 'Подал заявку' : (user.partnerStatus ? 'Партнер' : '-') }}</div>
        <div>{{ user.partnerStatus === true ? costFormatter(user.partnerBonuses) : '-' }}</div>
      </router-link>

      <div />
      <div />
      <div />
      <div />
      <div v-if="!usersFiltered.length && !loading" class="info">Пользователей не найдено</div>
    </section>

    <CircleLinesLoading v-if="loading" centered />
  </div>
</template>

<script lang="ts">
import SelectList from '~/components/SelectList.vue';
import InputSearch from '~/components/InputSearch.vue';
import CircleLinesLoading from '~/components/loaders/CircleLinesLoading.vue';
import { User } from '~/utils/models';
import { costFormatter, telFormatter } from '~/utils/utils';

export default {
  components: { CircleLinesLoading, SelectList, InputSearch },

  data() {
    return {
      users: [] as User[],

      filters: {
        searchText: '',
        isPartners: null as null | boolean,
      },

      loading: false,
    };
  },

  computed: {
    usersFiltered() {
      return this.users.filter(user => {
        return (
          (!this.filters.searchText || new RegExp(this.filters.searchText, 'i').test(`${user.familyName} ${user.givenName} ${user.middleName}`)) &&
          (this.filters.isPartners === null || user.partnerStatus === this.filters.isPartners)
        );
      });
    },
  },

  mounted() {
    this.updateUsers();
  },

  methods: {
    telFormatter,
    costFormatter,

    async updateUsers() {
      this.users = (
        (await this.$request(this, this.$api.getAllUsersAdmin, [], `Не удалось получить список пользователей`)) as {
          users: User[];
        }
      ).users;
    },
  },

  watch: {},
};
</script>
