<style lang="stylus" scoped>
@import '../styles/constants.styl'
@import '../styles/components.styl'
@import '../styles/buttons.styl'
@import '../styles/fonts.styl'
@import '../styles/utils.styl'
@import '../styles/animations.styl'
@import '../styles/scrollbars.styl'


.root-graph
  centered-flex-container()

  position relative
  flex-direction column
  gap 10px
  .arrow
    img-size(30px)

    transform rotate(180deg)
    opacity 0.4
  .user-container
    centered-flex-container()

    flex-direction column
    .name
      font-small-extra()
      font-semibold()

      text-align center
      .info
        font-normal()

        color colorText4
    .bottom-row
      centered-flex-container()
      font-small-extra()

      gap 10px
      color colorText4
      white-space nowrap
      .cost
        display grid
        grid-template-columns auto auto
        gap 0 5px
    &.you
      .cost
        font-semibold()
  .partners-list
    display flex
    flex-wrap wrap
    gap 20px
    justify-content space-evenly
    .user-container.partner
      display grid
      grid-template-columns auto 1fr
      grid-template-rows auto auto
      gap 0 5px
      align-items flex-start
      .cost
        font-small-extra()

        display flex
        gap 5px
        color colorText4
      .avatar
        grid-row 1/-1
      .bottom-row
        grid-column 1/-1
        gap 10px
        justify-content space-between
        margin-top 5px
        .units
          display flex
          gap 5px
          color colorText2
</style>

<template>
  <section class="root-graph" :class="{'not-clickable': !clickable}">
    <template v-if="headUser">
      <router-link :to="{name: 'adminUserEdit', params: {id: headUser.id}}">
        <div class="user-container headUser">
          <div class="bottom-row">
            <UserAvatar class="avatar" :user="headUser" />
            <div class="name">
              {{ headUser.givenName }} {{ headUser.familyName }}
              <div class="info">Ваш наставник</div>
            </div>
          </div>
        </div>
      </router-link>
  
      <img class="arrow" src="/static/icons/arrow-single.svg" alt="arrow-down">
    </template>

    <div class="user-container you">
      <div class="name" v-if="showAsMe">Я ({{ user.givenName }} {{ user.familyName }})</div>
      <div class="name" v-else>{{ user.givenName }} {{ user.familyName }}</div>
      <div class="bottom-row">
        <UserAvatar class="avatar" :user="user" size="25px" size-mobile="25px" />
        <div class="cost"><div class="value">{{ bonusesFormatter(partner?.personalBonuses ?? 0) }}</div></div>
      </div>
    </div>

    <template v-if="partners.length">
      <img class="arrow" src="/static/icons/arrow-much.svg" alt="arrow-down">

      <div class="partners-list">
        <router-link 
          v-for="partnerUser in partners"
          :to="{name: 'adminUserEdit', params: {id: partnerUser.id}}"
          :key="partnerUser.id"
        >
          <div class="user-container partner">
            <UserAvatar class="avatar" :user="partnerUser" size="30px" size-mobile="30px" />
            <div class="name">{{ partnerUser.givenName }} {{ partnerUser.familyName }}</div>
            <div class="cost">Оборот <div class="value minor">{{ bonusesFormatter(partnerUser.branchTotalBonuses) }}</div></div>
            <div class="bottom-row">
              <div class="units">ЛО <div class="value">{{ bonusesFormatter(partnerUser.personalBonuses) }}</div></div>
              <div class="units">ГО <div class="value">{{ bonusesFormatter(partnerUser.groupBonuses) }}</div></div>
            </div>
          </div>
        </router-link>
      </div>
    </template>

    <CircleLoading v-if="loading" centered />
  </section>
</template>

<script lang="ts">
import { bonusesFormatter } from '~/utils/utils';
import UserAvatar from '~/components/UserAvatar.vue';
import CircleLoading from '~/components/loaders/CircleLoading.vue';
import { PropType } from 'vue';
import { Partner, User, UserPartner } from '~/utils/models';

export default {
  emits: ['headUserGotten', 'partnersGotten'],

  components: { UserAvatar, CircleLoading },

  props: {
    user: {
      type: Object as PropType<User>,
      required: true,
    },
    partnerDefault: {
      type: Object as PropType<Partner | undefined>,
      default: undefined,
    },
    showAsMe: Boolean,
    clickable: Boolean,
  },

  data() {
    return {
      headUser: null as User | null,
      partners: [] as UserPartner[],
      partner: this.$props.partnerDefault ?? null as Partner | null,

      loading: false,
    };
  },

  mounted() {
    if (this.user?.id) {
      this.update();
    }
  },

  methods: {
    bonusesFormatter,

    update() {
      this.updatePartners();
      this.updateHeadUser();
      if (!this.partner) {
        this.updatePartner();
      }
    },

    async updatePartner() {
      this.partner = (await this.$request(
        this,
        this.$api.getUserPartnerInfo,
        [this.$user.id],
        `Не удалось получить данные партнера`,
      )) as Partner;
    },

    async updatePartners() {
      this.partners = (
        (await this.$request(
          this,
          this.$api.getUserReferals,
          [this.user.id],
          `Не удалось получить список партнеров`,
        )) as {
          partners: UserPartner[];
        }
      ).partners ?? [];

      this.$emit('partnersGotten', this.partners);
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
