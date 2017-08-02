import 'whatwg-fetch'

const APP_HOST = `${process.env.APP_HOST}`;

const API_VERSION = APP_HOST + '/cms';

/**
 * 发送一个获取JSON的GET请求
 * @param {string} api 不包含host与basePath的url，可包含{pathName}形式的path参数
 * @param {Object} query 可选
 * @param {Object} pathValues 可选
 * @param {boolean} https 可选
 * @returns {void}
 */
export function getJson(api,query,pathValues){
    api = API_VERSION + api;
    api = applyQuery(api,query);
    api = applyPathValues(api,pathValues);
    //const headparams = getHeadParams();
    // let headParams = (headparams) ?
    //                     Object.assign({},headparams,{'Accept':'application/json'}) :
    //                     Object.assign({},{'Accept':'application/json'});
    return fetch(api,{
        credentials:'include',
        method:'get',
        headers:{'Accept':'application/json'}
    }).then(res => {
        //console.log(res);
        return res.json()
    })
}

export function getJsonWithFilter(api,query,pathValues){
    api = API_VERSION + api;
    api = applyQuery(api,query);
    api = applyPathValues(api,pathValues);
    //const headparams = getHeadParams();
    // let headParams = (headparams) ?
    //                     Object.assign({},headparams,{'Accept':'application/json'}) :
    //                     Object.assign({},{'Accept':'application/json'});
    return fetch(api,{
        credentials:'include',
        method:'get',
        headers:{'Accept':'application/json'}
    }).then(res => {
        //console.log(res);
        return res.json()
    }).then(interceptor);
}

export function postJson(api,data){
    api = API_VERSION + api;

    // let d = new FormData();
    // for(let key in data){
    //     d.append(key,data[key])
    // }

    //const headparams = getHeadParams();
    // let headParams = (headparams) ?
    //                     Object.assign({},headparams,{'Accept':'application/json'}) :
    //                     Object.assign({},{'Accept':'application/json'});
    return fetch(api,{
        credentials:'include',
        method:'post',
        headers:{'Accept':'application/json'},
        body:JSON.stringify(data)
    }).then(res => {
        //console.log(res);
        return res.json()
    })
}

/**
 * 发送一个获取JSON的GET请求
 * @param {string} api 不包含host与basePath的url，可包含{pathName}形式的path参数
 * @param {Object} data 可选
 * @param {Object} pathValues 可选
 * @param {boolean} https 可选
 * @returns {void}
 */


/**
 * 请求地址
 * @param {string} api
 * @param {string} basePath
 * @param {boolean} https
 * @returns {string}
 */
function applyBasePath(api, basePath, https) {
    if (typeof api !== 'string') {
        throw new Error('api must be string');
    }

    if (typeof basePath !== 'string') {
        throw new Error('basePath must be string');
    }

    const patten1 = /.*\/$/;
    const patten2 = /^\/.*/;

    if (patten1.test(basePath) && patten2.test(api)) {
        api = api.substring(1);
    }

    let proto = https ? 'https://' : 'http://';

    return proto + basePath + api;
}

/**
 * 请求参数
 * @param {string} api
 * @param {Object} pathValues
 * return {string}
 */
function applyPathValues(api, pathValues) {
    if (pathValues) {
        const rex = /{\w+}/g;

        let matched = api.match(rex);
        for (let match of matched) {
            let pathName = match.substr(1, match.length - 2);
            if (pathValues[pathName]) {
                api = api.replace(match, '' + pathValues[pathName]);
            }
        }
    }

    return api;
}

/**
 * @param {string} api
 * @param {Object} query
 * @returns {string}
 */
function applyQuery(api, query) {
    if (!query) {
        return api;
    }

    if (api.indexOf('?') < 0) {
        api += '?';
    }

    for (let key in query) {
        if (query.hasOwnProperty(key)) {
            if (api.indexOf('?') !== api.length-1 && api.indexOf('&') !== api.length) {
                api += '&';
            }
            api = api + `${key}=` + encodeURIComponent(query[key]);
        }
    }
    return api;
}

function interceptor(json) {
    if (json.resultCode !== 0) {
        if(json.resultCode == 10){
            if(checkApp()){
                return kf.login(function(){kf.refresh()});
            }else{
                isInstalled()
            }
            
        }
        return json.result;
    }
    return json.result;
}