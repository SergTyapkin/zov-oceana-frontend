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
  padding-top 0

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
</style>

<template>
  <div class="root-page-admin-users">

    <UsersTable
      :data="users"
      row-click-redirect-name="adminUserEdit"
    />

    <CircleLinesLoading v-if="loading" centered />
  </div>
</template>

<script lang="ts">
import CircleLinesLoading from '~/components/loaders/CircleLinesLoading.vue';
import UsersTable from '~/components/tables/UsersTable.vue';
import { User } from '~/utils/models';

export default {
  components: { CircleLinesLoading, UsersTable },

  data() {
    return {
      users: [] as User[],

      loading: false,
    };
  },

  computed: {
  },

  mounted() {
    this.updateUsers();
  },

  methods: {
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
