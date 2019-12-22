const https = require('https');
class HTTPSHelper {
    constructor(host, token, debug = false) {
        this.host = host;
        this.token = token;
        this.debug = debug;
    }
    GET(path) {
        return new Promise((resolve, reject) => {
            const options = {
                hostname: this.host,
                path: path
            }
            if (this.token)
                options.headers = { 'Authorization': this.token };
            https.get(options, (res) => {
                if (this.debug)
                    console.debug(`statusCode: ${res.statusCode}`)
                var data = '';
                res.on('data', (d) => {
                    data += d;
                })
                res.on('end',() =>{
                    resolve(data)
                })
            }).on('error', (err) => {
                reject(err);
            });
        });
    }
    async GETJson(path) {
        return JSON.parse(await this.GET(path));
    }
    POST(path, body) {
        body = (typeof body == 'string') ? body : JSON.stringify(body);
        return new Promise((resolve, reject) => {
            const options = {
                hostname: this.host,
                path: path,
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Content-Length': body.length
                }
            }
            if (this.token)
                options.headers.Authorization = this.token;
            const req = https.request(options, (res) => {
                if (this.debug)
                    console.debug(`statusCode: ${res.statusCode}`)
                var data = '';
                res.on('data', (d) => {
                    data += d;
                })
                res.on('end',() =>{
                    resolve(data)
                })
            })

            req.on('error', (err) => {
                reject(err)
            })

            req.write(body)
            req.end()
        });
    }
    async POSTJson(path, body) {
        return JSON.parse(await this.POST(path,body));
    }
}
HTTPSHelper.getPath = (fullURI) => {
    var URIParts = fullURI.replace(/http(s?):\/\//, '').split('/');
    URIParts.shift();
    return '/' + URIParts.join('/');
};
HTTPSHelper.getHost = (fullURI) => {
    var URIParts = fullURI.replace(/http(s?):\/\//, '').split('/');
    return URIParts.shift();
}
HTTPSHelper.GET = (URL, token = null) => {
    var [host, path] = [HTTPSHelper.getHost(URL), HTTPSHelper.getPath(URL)]
    return new HTTPSHelper(host, token).GET(path)
}
HTTPSHelper.GETJson = async (URL, token = null) => JSON.parse(await HTTPSHelper.GET(URL,token));
HTTPSHelper.POST = (URL, body, token = null) => {
    var [host, path] = [HTTPSHelper.getHost(URL), HTTPSHelper.getPath(URL)]
    return new HTTPSHelper(host, token).POST(path, body)
}
HTTPSHelper.POSTJson = async (URL, body, token = null) => JSON.parse(await HTTPSHelper.POST(URL,body,token))
module.exports = HTTPSHelper;