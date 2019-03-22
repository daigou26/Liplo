<template>
  <v-layout
    white
    row
    align-center
    wrap
  >
    <v-flex xs12>
      <v-img
        :src="imageUrl"
        :aspect-ratio="imageRatio"
      ></v-img>
    </v-flex>
    <v-flex xs10 offset-xs1 class="break">
      <v-layout
        white
        row
        wrap
      >
        <v-flex
          xs12
          :class="{
            'pa-5': $vuetify.breakpoint.mdAndUp,
            'pa-3': $vuetify.breakpoint.smOnly,
            'py-3': $vuetify.breakpoint.xsOnly,
          }"
        >
          <!-- companyImage & Name -->
          <div class="mb-5">
            <v-avatar
              class="grey lighten-3"
            >
              <v-img :src="companyImageUrl" :size="40"></v-img>
            </v-avatar>
            <span class="title textColor font-weight-bold align-center px-3">
              {{ companyName }}
            </span>
          </div>
          <!-- mission -->
          <div v-if="mission" class="py-4">
            <p class="headline font-weight-bold textColor">
              Mission
            </p>
            <div>
              <p class="body-text return">{{ mission }}</p>
            </div>
          </div>
          <!-- vision -->
          <div v-if="vision" class="py-4">
            <p class="headline font-weight-bold textColor">
              Vision
            </p>
            <div>
              <p class="body-text return">{{ vision }}</p>
            </div>
          </div>
          <!-- value -->
          <div v-if="value" class="py-4">
            <p class="headline font-weight-bold textColor">
              Value
            </p>
            <div>
              <p class="body-text return">{{ value }}</p>
            </div>
          </div>
          <!-- culture -->
          <div v-if="culture" class="py-4">
            <p class="headline font-weight-bold textColor">
              Culture
            </p>
            <div>
              <p class="body-text return">{{ culture }}</p>
            </div>
          </div>
          <!-- members -->
          <div v-if="members" class="py-4">
            <p class="headline font-weight-bold textColor">
              メンバー
            </p>
            <div>
              <v-card flat>
                <v-card-text class="overflow-hidden py-0">
                  <v-layout row align-content-center class="horiz-scroll">
                    <div
                      v-for="member in members"
                      class="pr-3 pb-2">
                      <div>
                        <v-avatar
                          class="grey lighten-3"
                        >
                          <v-img :src="member.imageUrl" :size="50"></v-img>
                        </v-avatar>
                        <div class="sub-title1 font-weight-bold textColor text-xs-center">
                          {{ member.name }}
                        </div>
                      </div>
                    </div>
                  </v-layout>
                </v-card-text>
              </v-card>
            </div>
          </div>
          <!-- what -->
          <div class="py-4">
            <p class="headline font-weight-bold textColor">
              何をやっているか
            </p>
            <div>
              <p class="body-text return">{{ what }}</p>
              <!-- サービス一覧 -->
              <v-list v-if="services" class="pt-3">
                <template v-for="(service, index) in services">
                    <div class="d-flex pb-3">
                      <v-flex xs4 sm3 lg2>
                        <v-img :src="service.imageUrl" height="100"></v-img>
                      </v-flex>
                      <v-flex xs8 sm9 lg10 class="px-4 break">
                        <div>
                          <span class="font-weight-bold body-text">{{ service.title }}</span>
                        </div>
                        <p　class="textColor return">{{ service.content }}</p>
                        <p class="textColor">{{ service.url }}</p>
                      </v-flex>
                    </div>
                </template>
              </v-list>
            </div>
          </div>
          <!-- why -->
          <div class="py-4">
            <p class="headline font-weight-bold textColor">
              なぜやっているか
            </p>
            <div>
              <p class="body-text return">{{ why }}</p>
            </div>
          </div>
          <!-- review -->
          <div v-if="reviews" class="py-4">
            <p class="headline font-weight-bold textColor">
              レビュー({{ reviews.rating.count }})
            </p>
            <div class="py-3">
              <!-- sm以下の場合は、チャートを使わない -->
              <div class="hidden-md-and-up pb-5">
                <div class="d-flex">
                  <v-flex xs7 sm6>
                    <span class="subheading font-weight-bold textColor pr-2">成長できるか</span>
                  </v-flex>
                  <v-flex xs5 sm6 text-sm-left text-xs-right>
                    <v-rating small readonly v-model="reviews.rating.growth"/>
                  </v-flex>
                </div>
                <div class="d-flex">
                  <v-flex xs7 sm6>
                    <span class="subheading font-weight-bold textColor pr-2">仕事内容</span>
                  </v-flex>
                  <v-flex xs5 sm6 text-sm-left text-xs-right>
                    <v-rating small readonly v-model="reviews.rating.job"/>
                  </v-flex>
                </div>
                <div class="d-flex">
                  <v-flex xs7 sm6>
                    <span class="subheading font-weight-bold textColor pr-2">裁量度</span>
                  </v-flex>
                  <v-flex xs5 sm6 text-sm-left text-xs-right>
                    <v-rating small readonly v-model="reviews.rating.discretion"/>
                  </v-flex>
                </div>
                <div class="d-flex">
                  <v-flex xs7 sm6>
                    <span class="subheading font-weight-bold textColor pr-2">出勤時間の柔軟性</span>
                  </v-flex>
                  <v-flex xs5 sm6 text-sm-left text-xs-right>
                    <v-rating small readonly v-model="reviews.rating.flexibleSchedule"/>
                  </v-flex>
                </div>
                <div class="d-flex">
                  <v-flex xs7 sm6>
                    <span class="subheading font-weight-bold textColor pr-2">勤務中の自由度</span>
                  </v-flex>
                  <v-flex xs5 sm6 text-sm-left text-xs-right>
                    <v-rating small readonly v-model="reviews.rating.flexibility"/>
                  </v-flex>
                </div>
                <div class="d-flex">
                  <v-flex xs7 sm6>
                    <span class="subheading font-weight-bold textColor pr-2">メンター</span>
                  </v-flex>
                  <v-flex xs5 sm6 text-sm-left text-xs-right>
                    <v-rating small readonly v-model="reviews.rating.mentor"/>
                  </v-flex>
                </div>
                <div class="d-flex">
                  <v-flex xs7 sm6>
                    <span class="subheading font-weight-bold textColor pr-2">雰囲気</span>
                  </v-flex>
                  <v-flex xs5 sm6 text-sm-left text-xs-right>
                    <v-rating small readonly v-model="reviews.rating.atmosphere"/>
                  </v-flex>
                </div>
              </div>
              <div class="d-flex">
                <!-- comments -->
                <v-flex
                  md8
                  xs12
                  :class="{'pr-4': $vuetify.breakpoint.mdOnly}"
                >
                  <v-list>
                    <template v-for="(item, index) in reviews.comments">
                      <div class="py-2">
                        <div class="font-weight-bold body-text">
                          <v-avatar
                            class="grey lighten-3"
                            :size="25"
                          >
                            <!-- <v-img :src="companyImageUrl" :size="15"></v-img> -->
                            <v-icon style="font-size: 15px">person</v-icon>
                          </v-avatar>
                          {{ item.occupation }}
                        </div>
                        <p class="py-3 body-text return">{{ item.content }}</p>
                      </div>
                    </template>
                  </v-list>
                  <div
                    v-if="reviews.rating.count > 3"
                    class="d-inline-flex teal--text font-weight-bold clickable"
                    @click="reviewsButtonClicked"
                  >
                    レビューをすべて見る
                  </div>
                </v-flex>
                <!-- chart -->
                <v-flex md4 hidden-sm-and-down>
                  <radar-chart v-if="showChart && chartData" :data="chartData" :options="chartOptions" />
                </v-flex>
              </div>
            </div>
          </div>
          <!-- 募集 -->
          <div class="py-4 mb-5">
            <p class="headline font-weight-bold textColor">
              募集
            </p>
            <div>
              <v-card flat>
                <v-card-text class="overflow-hidden py-0">
                  <v-layout align-content-center class="horiz-scroll">
                    <div
                      v-for="media in mediaList"
                      class="pr-3 pb-2"
                    >
                      <div>
                        <img :src="media.src" height="133" width="200"/>
                        <div class="sub-title1 font-weight-bold textColor">
                          エンジニア、デザイナー募集
                        </div>
                      </div>
                    </div>
                  </v-layout>
                </v-card-text>
              </v-card>
            </div>
          </div>
          <!-- 企業情報 -->
          <div class="py-4">
            <p class="headline font-weight-bold textColor">
              企業情報
            </p>
            <div class="break">
              <v-list>
                <div>
                  <div class="pb-3 d-inline-flex">
                    <v-icon>place</v-icon>
                    <div class="pl-2">
                      {{ location }}
                    </div>
                  </div>
                </div>
                <div>
                  <div class="pb-3 d-inline-flex">
                    <v-icon>schedule</v-icon>
                    <div class="pl-2">
                      {{ foundedDate }}に設立
                    </div>
                  </div>
                </div>
                <div>
                  <div class="pb-3 d-inline-flex">
                    <v-icon>email</v-icon>
                    <div class="pl-2">
                      {{ email }}
                    </div>
                  </div>
                </div>
                <div>
                  <div class="pb-3 d-inline-flex">
                    <v-icon>link</v-icon>
                    <div class="pl-2">
                      {{ url }}
                    </div>
                  </div>
                </div>
              </v-list>
            </div>
          </div>
        </v-flex>
      </v-layout>
    </v-flex>
    <div v-if="reviews" class="text-xs-center">
      <v-dialog
        v-model="reviewsDialog"
        :fullscreen="$vuetify.breakpoint.xsOnly"
        width="500"
      >
        <v-card class="py-3 px-3">
          <v-btn
            fab
            small
            color="white"
            @click="reviewsDialog=false"
          >
            <v-icon>close</v-icon>
          </v-btn>
          <v-flex
            xs12
            :class="{'px-2': $vuetify.breakpoint.smAndUp, 'mt-4': $vuetify.breakpoint.xsOnly}"
          >
            <v-container>
              <v-layout
                column
                justify-center
              >
                <div>
                  <p class="headline font-weight-bold textColor">
                    レビュー{{ reviews.rating.count }}件
                  </p>
                  <v-list class="px-2">
                    <template v-for="(item, index) in allReviews">
                      <div class="py-2">
                        <div class="font-weight-bold body-text">
                          <v-avatar
                            class="grey lighten-3"
                            :size="25"
                          >
                            <!-- <v-img :src="companyImageUrl" :size="15"></v-img> -->
                            <v-icon style="font-size: 15px">person</v-icon>
                          </v-avatar>
                          {{ item.occupation }}
                        </div>
                        <v-rating small readonly v-model="item.all" class="pt-2"/>
                        <p class="py-3 body-text return">{{ item.content }}</p>
                      </div>
                    </template>
                  </v-list>
                  <div v-if="allReviews != null && reviews.rating.count > allReviews.length" class="text-xs-center">
                    <v-btn
                      fab
                      small
                      color="white"
                      @click="queryReviews({companyId: companyId, reviews: allReviews})"
                    >
                      <v-icon>arrow_downward</v-icon>
                    </v-btn>
                  </div>
                </div>
              </v-layout>
            </v-container>
          </v-flex>
        </v-card>
      </v-dialog>
    </div>
  </v-layout>
</template>

<script>
import { mapActions, mapState } from 'vuex'

export default {
  data: () => ({
    reviewsDialog: false,
    chartOptions: {
      responsive: true,
      maintainAspectRatio: false,
      legend: {
        display: false
      },
      scale: {
        ticks: {
            min: 1,
            max: 5,
        }
      }
    },
    showChart: false,
    mediaList: [
      {id: 1, name: "1.png", src: "https://placeimg.com/200/200/animals"},
      {id: 2, name: "1.png", src: "https://placeimg.com/200/200/arch"},
      {id: 3, name: "1.png", src: "https://placeimg.com/200/200/nature"},
      {id: 4, name: "1.png", src: "https://placeimg.com/200/200/people"},
      {id: 5, name: "1.png", src: "https://placeimg.com/200/200/tech"},
      {id: 6, name: "1.png", src: "https://placeimg.com/200/200/animals"},
      {id: 7, name: "1.png", src: "https://placeimg.com/200/200/animals"},
    ],
  }),
  computed: {
    imageRatio() {
      switch (this.$vuetify.breakpoint.name) {
        case 'xs': return '2'
        case 'sm': return '2.5'
        case 'md': return '3.5'
        case 'lg': return '3.5'
        case 'xl': return '3.5'
      }
    },
    ...mapState({
      imageUrl: state => state.company.imageUrl,
      companyId: state => state.company.companyId,
      companyName: state => state.company.companyName,
      companyImageUrl: state => state.company.companyImageUrl,
      email: state => state.company.email,
      members: state => state.company.members,
      location: state => state.company.location,
      foundedDate: state => state.company.foundedDate,
      url: state => state.company.url,
      mission: state => state.company.mission,
      vision: state => state.company.vision,
      value: state => state.company.value,
      culture: state => state.company.culture,
      system: state => state.company.system,
      why: state => state.company.why,
      what: state => state.company.what,
      services: state => state.company.services,
      welfare: state => state.company.welfare,
      workday: state => state.company.workday,
      occupation: state => state.company.occupation,
      features: state => state.company.features,
      reviews: state => state.company.reviews,
      chartData: state => state.company.chartData,
      allReviews: state => state.reviews.reviews,
    }),
  },
  mounted() {
    this.showChart = true
    this.queryCompany({nuxt: this.$nuxt, params: this.$route.params})
  },
  methods: {
    reviewsButtonClicked() {
      this.reviewsDialog = true
      if (this.allReviews == null) {
        this.queryReviews({companyId: this.companyId, reviews: null})
      }
    },
    ...mapActions({
      queryCompany: 'company/queryCompany',
      queryReviews: 'reviews/queryReviews',
    }),
  }
}
</script>
