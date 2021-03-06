import fetchJsonP from 'fetch-jsonp';

export default class Api {
    static headers() {
      return {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'dataType': 'json',
      }
    }
  
    static get(route) {
      return this.xhr(route, null, 'GET');
    }
  
    static put(route, params) {
      return this.xhr(route, params, 'PUT')
    }
  
    static post(route, params) {
      return this.xhr(route, params, 'POST')
    }
  
    static delete(route, params) {
      return this.xhr(route, params, 'DELETE')
    }
  
    static xhr(route, params, verb) {
      const host = 'http://www.recipepuppy.com'
      const url = `${host}${route}`
      let options = Object.assign({    jsonpCallback: 'custom_callback',
    },{ method: verb }, params ? { body: JSON.stringify(params) } : null );
      options.headers = Api.headers()
      // return fetch(url, options).then( resp => {
      //   let json = resp.json();
      //   if (resp.ok) {
      //     return json
      //   }
      //   return json.then(err => {throw err});
      // }).then( json => json.results );
      var callback = 'c'+Math.floor((Math.random()*100000000)+1);
      
      return fetchJsonP(url, {'jsonpCallbackFunction':callback}).then( resp => {
        let json = resp.json();
        if (resp.ok) {
          return json
        }
        return json.then(err => {throw err});
      }).then( json => json.results);
    }
  }