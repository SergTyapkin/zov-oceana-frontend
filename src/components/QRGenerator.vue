<style lang="stylus" scoped>
@import '../styles/constants.styl'
@import '../styles/buttons.styl'
@import '../styles/fonts.styl'
@import '../styles/utils.styl'
@import '../styles/animations.styl'

.qr-generator
  overflow hidden
  display block
  width 100%
  height 100%
</style>

<template>
  <img class="qr-generator" :src="qrCodeDataUrl" alt="qr-code">
</template>

<script lang="ts">
import QRCode from 'qrcode';


export default {
  components: {},

  props: {
    text: {
      type: String,
      default: '',
    },
    errorCorrection: {
      type: String,
      default: 'L',
    },
  },

  data() {
    return {
      qrCodeDataUrl: null as string | null,
      currentText: this.$props.text || '',
      errorCorrectionLevel: this.$props.errorCorrection,
    };
  },

  mounted() {
    this.regenerate(this.currentText);
  },

  unmounted() {
  },

  methods: {
    async regenerate(text?: string) {
      if (!text) {
        this.qrCodeDataUrl = null;
        return;
      }
      if (text !== undefined) this.currentText = text;
      else if (!this.currentText) this.currentText = '';

      try {
        this.qrCodeDataUrl = (await QRCode.toDataURL(
          text,
          {
            width: 400,
            margin: 2,
            color: {
              dark: '#000000',
              light: '#ffffff',
            },
            errorCorrectionLevel: this.errorCorrectionLevel,
          }
        ));
      } catch (err) {
        this.$popups.error('Не удалось сгенерировать QR код', err);
      }
    },
  },

  watch: {
    text(newVal: string) {
      this.regenerate(newVal);
    },
  }
};
</script>
