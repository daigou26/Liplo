<template>
  <div class="container">
    <div v-if="error.statusCode === 404" class="text-xs-center">
      <div
        class="font-weight-bold teal--text"
        :class="{
          'display-4 pt-5': $vuetify.breakpoint.smAndUp,
          'display-3 pt-3': $vuetify.breakpoint.xsOnly,
        }"
       >
        404
      </div>
      <div
        class="pt-5 font-weight-bold display-1"
      >
       Page Not Found
      </div>
    </div>
    <div v-else class="text-xs-center">
      <div
        class="pt-5 font-weight-bold"
        :class="{
          'display-2': $vuetify.breakpoint.smAndUp,
          'display-1': $vuetify.breakpoint.xsOnly,
        }"
      >
       エラーが発生しました
      </div>
    </div>
    <div
      class="pl-4 textColor text-xs-center"
      :class="{
        'pt-5': $vuetify.breakpoint.smAndUp,
        'pt-4': $vuetify.breakpoint.xsOnly,
      }"
    >
      <div class="font-weight-bold">
        エラーコード： {{ error.statusCode }}
      </div>
      <v-btn class="mt-3" outline color="teal" to="/">HOME</v-btn>
      <div class="pt-4">
        <nuxt-link to="/contact" class="link-text teal--text">お問い合わせ</nuxt-link>
        <span class="light-text-color">/</span>
        <nuxt-link to="/feedback" class="link-text teal--text">フィードバック</nuxt-link>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ['error'],
}
</script>
