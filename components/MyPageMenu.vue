<template>
  <v-list class="border">
    <template v-for="(item, index) in mypageItems">
      <v-list-tile
        :class="{ 'teal lighten-5': path == '/user/' + item }"
        :to="'./' + item"
      >
        <v-list-tile-content>
          <v-list-tile-title>{{ item }}</v-list-tile-title>
        </v-list-tile-content>
      </v-list-tile>
      <v-divider
        v-if="mypageItems.length != index + 1"
      ></v-divider>
    </template>
  </v-list>
</template>

<script>
export default {
  data: () => ({
    mypageItems: [
      'pass',
      'career',
      'feedbacks',
      'reviews'
    ],
  }),
  computed: {
    path() {
      return this.$route.path
    },
  },
}
</script>
