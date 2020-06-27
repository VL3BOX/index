import axios from "axios";
import { __server } from "@jx3box/jx3box-common/js/jx3box.json";
const API_LIST = __server + "post/list";
const API_SINGLE = __server + "post/find";
import failCallback from '../utils/fail'

function getPosts(params,vm) {
    return axios.get(API_LIST, {
        params: params,
    }).catch((err) => {
        failCallback(err,vm)
    })
}
function getPost(pid,vm) {
    return axios.get(API_SINGLE, {
        params: {
            id: pid,
        },
    }).catch((err) => {
        failCallback(err,vm)
    })
}

export { getPosts, getPost };
