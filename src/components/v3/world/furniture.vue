<template>
    <div class="m-world-block m-world-furniture">
        <div class="u-item">
            <div>{{ $t('园宅会赛') }}</div>
            <div class="u-furniture">
                <!-- <el-tooltip popper-class="m-next-match" v-if="furnitureCategory || furnitureProperty"> -->
                <!-- <div :class="{ 'u-next-match': furnitureNextMatch }" slot="content" v-html="nextMatch"></div> -->
                {{ furnitureProperty && furnitureProperty.content }}
                <!-- </el-tooltip> -->
            </div>
        </div>
        <div class="u-item">
            <div>{{ $t('评审分类') }}</div>
            <div class="u-furniture">
                <a class="u-pet" href="/furniture?match=1" target="_blank">{{
                    formatContent(furnitureCategory && furnitureCategory.content)
                }}</a>
            </div>
        </div>
        <!-- <div class="u-item" v-html="nextMatch"></div> -->
    </div>
</template>

<script>
import dayjs from "dayjs";
import isoWeek from "dayjs/plugin/isoWeek";
dayjs.extend(isoWeek);
import { getFurniture } from "@/service/spider";
export default {
    name: "furniture",
    props: {
        date: {
            type: String,
            default: dayjs().format("YYYY-MM-DD"),
        },
        client: {
            type: String,
            default: "std",
        },
    },
    data() {
        return {
            furniture: [],
        };
    },
    computed: {
        // 园宅会赛显示text
        furnitureCategory: function () {
            return this.furniture?.find((item) => item?.subtype === "category");
        },
        // 园宅会赛类型
        furnitureProperty: function () {
            return this.furniture?.find((item) => item?.subtype === "property");
        },
        furnitureNextMatch: function () {
            return this.furniture?.find((item) => item?.subtype === "next_match");
            // return ''
        },
        nextMatch: function () {
            return `
                下期园宅会赛：</br>
                ${this.nl2br(this.furnitureNextMatch && this.furnitureNextMatch.content) || "暂无数据"}
            `;
        },
    },
    watch: {
        date: {
            immediate: true,
            handler() {
                if (this.client === "std") this.loadFurniture();
            },
        },
    },
    methods: {
        // 园宅会赛
        setFurniture(res) {
            let data = res.data.data;

            try {
                this.furniture = data;
            } catch (e) {
                this.furniture = [];
            }
        },
        loadFurniture: function () {
            try {
                let furniture = sessionStorage.getItem("furniture");

                furniture = furniture && JSON.parse(furniture);

                if (furniture) {
                    this.setFurniture(furniture);
                } else {
                    const params = {
                        subtypes: "category,property,next_match",
                        start: dayjs().startOf("isoWeek").format("YYYY-MM-DD"),
                        end: dayjs().endOf("isoWeek").format("YYYY-MM-DD"),
                    };
                    getFurniture(params).then((res) => {
                        this.setFurniture(res);

                        // 当家园会赛数据不存在时，不存储
                        if (res.data?.data?.length && res.data.data.every((item) => item)) {
                            sessionStorage.setItem("furniture", JSON.stringify(res));
                        }
                    });
                }
            } catch (e) {
                console.error(e);
                this.furniture = [];
            }
        },
        nl2br(str) {
            return str ? this.formatContent(str.replace(/\\n|\n/g, "<br>")) : '';
        },
        formatContent(str) {
            return str ? str.replace("+", "") : '';
        },
    },
};
</script>
