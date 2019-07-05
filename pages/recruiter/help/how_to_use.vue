<template>
  <v-layout
    white
    row
    wrap
  >
    <v-flex v-if="isRefreshing == null || isRefreshing" xs12 py-5>
      <v-layout justify-center>
        Now Loading...
      </v-layout>
    </v-flex>
    <v-flex v-else xs10 offset-xs1>
      <div
        class="pt-5 pb-3 title font-weight-bold text-color"
        :class="{'px-5': $vuetify.breakpoint.smAndUp}"
      >
        サービスの使い方
      </div>
      <div :class="{'mx-5 pb-4': $vuetify.breakpoint.smAndUp}">
        <v-timeline
          align-top
          dense
          class="my-3 mx-3"
        >
          <!-- スカウト -->
          <v-timeline-item
            color="blue"
            small
          >
            <v-layout pt-3>
              <v-flex>
                <strong class="text-color">1. スカウト</strong>
                <div class="pt-2 light-text-color">
                  ユーザー検索画面で、気になる求職者を見つけたら、スカウトを送りましょう。
                  <div>
                    スカウトを送ると、候補者管理画面でステータスなどが管理できるようになります。
                  </div>
                </div>
              </v-flex>
            </v-layout>
          </v-timeline-item>
          <!-- 選考 -->
          <v-timeline-item
            color="cyan"
            small
          >
            <v-layout pt-3>
              <v-flex>
                <strong class="text-color">2. 選考</strong>
                <div class="pt-2 light-text-color">
                  候補者から返信が来たら、選考を始めましょう。
                  <div>
                    選考を始めたら、候補者管理画面でステータスを選考中に変更してください。
                  </div>
                </div>
              </v-flex>
            </v-layout>
          </v-timeline-item>
          <!-- インターン -->
          <v-timeline-item
            color="teal"
            small
          >
            <v-layout pt-3>
              <v-flex>
                <strong class="text-color">3. インターン採用</strong>
                <div class="pt-2 light-text-color">
                  選考を終え、インターンに採用することに決めたら、
                  候補者管理画面でステータスをインターンに変更してください。
                </div>
              </v-flex>
            </v-layout>
          </v-timeline-item>
          <!-- フィードバック -->
          <v-timeline-item
            color="orange"
            small
          >
            <v-layout pt-3>
              <v-flex>
                <strong class="text-color">4. フィードバック</strong>
                <div class="pt-2 light-text-color">
                  インターン終了後、候補者にフィードバックを送りましょう。
                  <div>
                    フィードバックは、候補者のステータスをインターンから変更する時に入力することが出来ます。
                    また、ステータス変更時に入力しなかった場合でも、
                    サイドバーのフィードバックから入力することが出来ます。
                  </div>
                </div>
              </v-flex>
            </v-layout>
          </v-timeline-item>
          <!-- パス -->
          <v-timeline-item
            color="red"
            small
          >
            <v-layout pt-3>
              <v-flex>
                <strong class="text-color">5. パスの発行</strong>
                <div class="pt-2 light-text-color">
                  インターン終了後、魅力的な候補者にパスを送りましょう。
                  <div>
                    パスを送るときは、ステータスをパスに変更し、
                    パスの種類や有効期限などを入力して更新してください。
                  </div>
                </div>
              </v-flex>
            </v-layout>
          </v-timeline-item>
          <!-- 契約 -->
          <v-timeline-item
            color="pink"
            small
          >
            <v-layout pt-3>
              <v-flex>
                <strong class="text-color">6. 契約</strong>
                <div class="pt-2 light-text-color">
                  候補者がパスを使用したら、メッセージにて労働条件などを候補者に提示し、
                  お互いが同意してから、契約をしてください。
                  <div>
                    契約が済みましたら、ステータスを採用予定に変更してください。
                  </div>
                </div>
              </v-flex>
            </v-layout>
          </v-timeline-item>
          <!-- 入社 -->
          <v-timeline-item
            color="purple"
            small
          >
            <v-layout pt-3>
              <v-flex>
                <strong class="text-color">7. 入社</strong>
                <div class="pt-2 light-text-color">
                  候補者が入社しましたら、ステータスを入社に変更してください。
                  ステータスを変更すると、その候補者は、候補者リストに表示されなくなります。
                </div>
              </v-flex>
            </v-layout>
          </v-timeline-item>
        </v-timeline>
      </div>
    </v-flex>
  </v-layout>
</template>

<script>
import { mapActions, mapState } from 'vuex'
export default {
  computed: {
    breakpoint() {
      return this.$vuetify.breakpoint.name
    },
    ...mapState({
      isRefreshing: state => state.isRefreshing,
      uid: state => state.uid,
      type: state => state.profile.type,
    })
  },
}
</script>
