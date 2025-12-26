<style lang="stylus" scoped>
@import '../styles/constants.styl'
@import '../styles/components.styl'
@import '../styles/buttons.styl'
@import '../styles/fonts.styl'
@import '../styles/utils.styl'
@import '../styles/animations.styl'
@import '../styles/scrollbars.styl'


.root-transactions-history
  centered-flex-container()
  flex-direction column
  gap 15px
  .arrow
    img-size(30px)
    transform rotate(180deg)
    opacity 0.2
  .user-container
    centered-flex-container()
    flex-direction column
    .name
      font-small-extra()
      color colorText4
      text-align center
    .bottom-row
      centered-flex-container()
      gap 10px
    &.you
      .bottom-row
        .cost
          font-semibold()
  .partners-list
    display flex
    gap 10px
    flex-wrap wrap
    justify-content space-evenly
</style>

<template>
  <section class="root-transactions-history">
    <div v-if="headUser" class="user-container headUser">
      <div class="bottom-row">
        <UserAvatar class="avatar" :user="headUser" />
        <div class="name">{{ headUser.givenName }} {{ headUser.familyName }}</div>
      </div>
    </div>

    <img v-if="headUser" class="arrow" src="/static/icons/arrow-single.svg" alt="arrow-down" />

    <div class="user-container you">
      <div class="name" v-if="showAsMe">Я ({{ user.givenName }} {{ user.familyName }})</div>
      <div class="name" v-else>{{ user.givenName }} {{ user.familyName }}</div>
      <div class="bottom-row">
        <UserAvatar class="avatar" :user="user" />
        <div class="cost">{{ costFormatter(yourMonthlyTotalValue) }}</div>
      </div>
    </div>

    <img v-if="partners.length" class="arrow" src="/static/icons/arrow-much.svg" alt="arrow-down" />

    <div v-if="partners.length" class="partners-list">
      <div v-for="partner in partners" class="user-container partner">
        <div class="name">{{ partner.givenName }} {{ partner.familyName }}</div>
        <div class="bottom-row">
          <UserAvatar class="avatar" :user="partner" />
          <div class="cost">{{ costFormatter(partner.totalValue) }}</div>
        </div>
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import { costFormatter } from '~/utils/utils';
import UserAvatar from '~/components/UserAvatar.vue';
import { PropType } from 'vue';
import { PartnerHistoryTransaction, User, UserPartner } from '~/utils/models';

export default {
  emits: ['historyGotten', 'headUserGotten', 'partnersGotten'],

  components: { UserAvatar },

  props: {
    user: {
      type: Object as PropType<User>,
      required: true,
    },
    showAsMe: Boolean,
  },

  data() {
    return {
      headUser: null as User | null,
      history: [] as PartnerHistoryTransaction[],
      partners: [] as UserPartner[],
    };
  },

  computed: {
    yourMonthlyTotalValue() {
      return this.history.reduce((acc, h) => acc + h.value, 0);
    },
  },

  mounted() {
    if (this.user?.id) {
      this.update();
    }
  },

  methods: {
    costFormatter,

    update() {
      this.updatePartnershipInfo();
      this.updatePartnershipHistory();
      this.updateHeadUser();
    },

    async updatePartnershipInfo() {
      this.partners = (
        (await this.$request(
          this,
          this.$api.getAllPartnerUsers,
          [this.user.id],
          `Не удалось получить список партнеров`,
        )) as {
          partners: User[];
        }
      ).partners;
    },

    async updatePartnershipHistory() {
      this.history = (
        (await this.$request(
          this,
          this.$api.getUserBonusesHistoryMonthly,
          [this.user.id],
          `Не удалось получить информацию по истории партнерства`,
        )) as {
          history: User[];
        }
      ).history;

      this.$emit('historyGotten', this.history);
    },

    async updateHeadUser() {
      if (!this.user.referrerId) {
        this.headUser = null;
        return;
      }
      this.headUser = await this.$request(
        this,
        this.$api.getOtherUser,
        [this.user.referrerId],
        `Не удалось получить информацию про вышестоящего партнера`,
      );

      this.$emit('headUserGotten', this.headUser);
    },
  },

  watch: {
    user() {
      this.update();
    },
  }
};
</script>
