<template>
    <div class="m-rank-exam m-rank m-sideblock">
        <div class="m-sideblock-header">
            <i class="u-icon el-icon-s-data"></i>
            <a class="u-title" href="/exam" target="_blank">{{ $t('题库试卷热榜') }}</a>
            <a href="/exam/" class="u-more" :title="$t('查看更多')" target="_blank"
                ><i class="el-icon-more"></i
            ></a>
        </div>
        <ul class="u-list">
            <li v-for="(item, i) in data" :key="i">
                <a class="u-link" :href="item.id | postLink" target="_blank">
                    <span class="u-order" :class="highlight(i)">{{
                        i + 1
                    }}</span>
                    <span class="u-name">{{ item.title }}</span>
                    <span class="u-per">
                        <em class="u-count">+ {{ item.views }}</em>
                    </span>
                </a>
            </li>
        </ul>
    </div>
</template>

<script>
import { getRank,getPapers } from "@/service/rank";
import highlight from "@/utils/highlight";
import { getLink } from "@jx3box/jx3box-common/js/utils";
export default {
    name: "examrank",
    props: [],
    data: function() {
        return {
            data: [],
            ids : [],
            views : []
        };
    },
    computed: {},
    methods: {
        highlight,
    },
    filters: {
        postLink: function(pid) {
            return getLink("paper", pid);
        },
    },
    created: function() {
        getRank("paper").then(([ids,views]) => {
            this.ids = ids
            this.views = views
            getPapers(ids.join(',')).then((res) => {
                let list = res.data.data || []
                let data = []
                list.forEach((item,i) => {
                    if (item) {
                        item.views = views[i]
                        data.push(item)
                    }
                });
                this.data = data;
            });
        });
    },
    components: {},
};
</script>
