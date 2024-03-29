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
            color="indigo"
            small
          >
            <v-layout pt-3>
              <v-flex>
                <strong class="text-color">1. 企業情報入力、募集作成</strong>
                <div class="pt-2 light-text-color">
                  まずはじめに、企業情報を入力しましょう。
                  <div>
                    企業情報を入力したら、募集を作成し、応募が来るのを待ちましょう。
                  </div>
                </div>
              </v-flex>
            </v-layout>
          </v-timeline-item>
          <!-- スカウト -->
          <v-timeline-item
            color="blue"
            small
          >
            <v-layout pt-3>
              <v-flex>
                <strong class="text-color">2. スカウト</strong>
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
                <strong class="text-color">3. 選考</strong>
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
                <strong class="text-color">4. インターン採用</strong>
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
                <strong class="text-color">5. フィードバック</strong>
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
                <strong class="text-color">6. パスの発行</strong>
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
                <strong class="text-color">7. 契約</strong>
                <div class="pt-2 light-text-color">
                  候補者がパスを使用したら、契約（内定契約、雇用契約など）をしてください。
                  <div>
                    パスの使用前に、メッセージにて労働条件（給料、労働時間、勤務開始日など）の確認が来る場合があるので、
                    候補者に労働条件などをお伝えください。
                  </div>
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
                <strong class="text-color">8. 入社</strong>
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
  head () {
    return {
      title: '基本的な使い方 - ヘルプ',
      meta: [
        { name: 'robots', content: 'noindex' },
      ],
    }
  },
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
