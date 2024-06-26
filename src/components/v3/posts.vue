<template>
    <div class="m-v2-post m-sideblock">
        <div class="m-guide-header m-sideblock-header">
            <div class="u-left">
                <i class="u-icon el-icon-s-management"></i>
                <span class="u-title">{{ $t('最新作品') }}</span>
                <mini-bread class="u-bread" name="index_topics" />
            </div>
            <div class="u-right">
                <a :href="more_link" class="u-more" target="_blank" rel="noopener noreferrer" :title="$t('查看全部')">
                    <i class="el-icon-more"></i>
                </a>
            </div>
        </div>
        <div class="m-v2-post-box">
            <div class="m-v2-post-header">
                <el-tabs v-model="type">
                    <el-tab-pane name="all">
                        <span slot="label">{{ $t('全部') }}</span>
                    </el-tab-pane>
                    <el-tab-pane
                        :label="item.label"
                        :name="item.slug"
                        v-for="(item, i) in links"
                        :key="i"
                    ></el-tab-pane>
                </el-tabs>
            </div>
            <div class="m-v2-post-wrapper" v-loading="loading">
                <div
                    class="m-v2-post-content"
                    v-if="isPost"
                >
                    <a
                        class="u-post"
                        v-for="(item, i) in data"
                        :key="i"
                        :href="getLink(item.post_type, item.ID)"
                        :target="target"
                        v-reporter="{
                            data: { href: reportLink(getLink(item.post_type, item.ID)), category: item.post_type, aggregate: aggregate },
                            caller: 'index_lastest_artwork_click',
                        }"
                    >
                        <el-image
                            class="u-avatar"
                            :src="showPostAvatar(item)"
                            fit="cover"
                            :alt="item.author_info && item.author_info.display_name"
                        ></el-image>
                        <div class="u-info">
                            <i class="el-icon-collection-tag"></i>
                            <span class="u-type" target="_blank">{{ $t(formatTypeName(item.post_type)) }}</span>
                            ／
                            <span class="u-author" :href="authorLink(item.post_author)" target="_blank">{{
                                (item.author_info && item.author_info.display_name) || $t('匿名')
                            }}</span>
                            <span class="u-date">
                                <i class="el-icon-refresh"></i>
                                {{ dateFormat(item.post_modified) }}
                            </span>
                        </div>
                        <span class="u-title">
                            <i class="el-icon-reading"></i>
                            {{ item.post_title || $t('无标题') }}
                        </span>
                    </a>
                </div>
                <div v-else class="m-v2-post-content">
                    <a
                        class="u-post"
                        v-for="(item, i) in data"
                        :key="i"
                        :href="getLink(item.type, item.source_id)"
                        :target="target"
                        v-reporter="{
                            data: { href: reportLink(getLink(item.type, item.source_id)), category: item.type, aggregate: aggregate },
                            caller: 'index_lastest_artwork_click',
                        }"
                    >
                        <el-image class="u-avatar" :src="showWikiAvatar(item)" fit="cover"></el-image>
                        <div class="u-info">
                            <i class="el-icon-collection-tag"></i>
                            <span class="u-type" target="_blank">{{ $t(formatTypeName(item.type)) }}</span>
                            ／
                            <span class="u-author" :href="authorLink(item.user_id)" target="_blank">{{
                                item.user_nickname || $t('匿名')
                            }}</span>
                            <span class="u-date">
                                <i class="el-icon-refresh"></i>
                                {{ wikiDate(item.updated) }}
                            </span>
                        </div>
                        <span class="u-title">
                            <i class="el-icon-reading"></i>
                            {{ item.title || $t('无标题') }}
                        </span>
                    </a>
                </div>
            </div>
            <div class="m-v2-post-more">
                <a :href="more_link" class="u-more" v-reporter="{
                    data: {
                        href: report_link,
                    },
                    caller: 'index_lastest_artwork_more'
                }">{{ $t('查看更多') }}&raquo;</a>
            </div>
        </div>
    </div>
</template>

<script>
import { getPosts } from "@/service/index";
import { getWikiPosts } from "@/service/cms";
import { buildTarget, authorLink, showAvatar, getLink, getTypeLabel } from "@jx3box/jx3box-common/js/utils";
import { __postType } from "@jx3box/jx3box-common/data/jx3box.json";
import { showRecently } from "@/utils/moment";
import Mini_bread from "../content/mini_bread.vue";
import { reportNow } from "@jx3box/jx3box-common/js/reporter"


export default {
    name: "v2-post",
    props: [],
    data: function () {
        const t = this.$i18n.t.bind(this.$i18n);
        return {
            data: [],
            target: buildTarget(),
            type: "all",
            length: 7,
            links: [
                {
                    label: t("宏库"),
                    slug: "macro",
                },
                {
                    label: t("职业"),
                    slug: "bps",
                },
                {
                    label: t("竞技"),
                    slug: "pvp",
                },
                {
                    label: t("副本"),
                    slug: "fb",
                },
                {
                    label: t("资源"),
                    slug: "tool",
                },
                {
                    label: t("茶馆"),
                    slug: "bbs",
                },
                {
                    label: t("成就"),
                    slug: "achievement",
                },
                {
                    label: t("物品"),
                    slug: "item",
                },
                {
                    label: t("任务"),
                    slug: "quest",
                },
                {
                    label: t("通识"),
                    slug: "knowledge",
                },
            ],
            loading: false,
            aggregate: []
        };
    },
    computed: {
        client: function () {
            return this.$store.state.client;
        },
        more_link: function () {
            return this.type == "all" ? "/bbs" : "/" + this.type;
        },
        isPost: function () {
            return Object.keys(__postType).includes(this.type) || this.type == "all";
        },
        userId: function () {
            return User.getInfo().uid;
        },
        report_link: function () {
            const prefix = this.client == 'std' ? 'www' : 'origin';
            return `${prefix}:${this.more_link}`
        },
    },
    methods: {
        loadData: function () {
            let type = this.type == "all" ? "" : this.type;
            this.loading = true;
            if (this.isPost) {
                this.loadPost(type);
            } else {
                this.loadWiki(type);
            }
        },
        getLink,
        authorLink,
        formatTypeName: function (type) {
            return getTypeLabel(type);
        },
        dateFormat: function (val) {
            return showRecently(val);
        },
        showPostAvatar: function (item) {
            let val = item.author_info && item.author_info.user_avatar;
            return showAvatar(val);
        },
        showWikiAvatar: function ({ user }) {
            let val = user ? user.user_avatar : "";
            return showAvatar(val);
        },
        wikiDate: function (val) {
            return showRecently(new Date(val * 1000));
        },
        loadPost: function (type) {
            getPosts(this.client, type, this.length)
                .then((res) => {
                    this.data = res.data.data.list || [];

                    this.aggregate = this.data.map(item => this.reportLink(getLink(item.post_type, item.ID)))
                    this.sendReporter();
                })
                .finally(() => {
                    this.loading = false;
                });
        },
        loadWiki: function (type) {
            getWikiPosts({
                type,
                per: this.length,
                client: this.client,
            })
                .then((res) => {
                    this.data = res.data.data.list || [];

                    this.aggregate = this.data.map(item => this.reportLink(getLink(item.type, item.source_id)));
                    this.sendReporter();
                })
                .finally(() => {
                    this.loading = false;
                });
        },
        sendReporter() {
            reportNow({ caller: "index_lastest_artwork_load", data: {
                aggregate: this.aggregate,
                category: this.type
            }});
        },
        reportLink(link) {
            const prefix = this.client == 'std' ? 'www' : 'origin';
            return `${prefix}:${link}`
        }
    },
    watch: {
        type: function () {
            this.loadData();
        },
    },
    mounted: function () {
        this.loadData();
    },
    components: {
        "mini-bread": Mini_bread,
    },
};
</script>

<style lang="less">
@import "../../assets/css/v2/posts.less";
</style>
