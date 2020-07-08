const CookieService = {
  /**
   * @description 获取cookie
   * @param {*} name 名称
   */
  getCookie(name) {
    const cookieName = encodeURIComponent(name) + '=';
    const cookieStart = document.cookie.indexOf(cookieName);
    let cookieValue = null;
    if (cookieStart > -1) {
      let cookieEnd = document.cookie.indexOf(';', cookieStart);
      if (cookieEnd === -1) {
        cookieEnd = document.cookie.length;
      }
      cookieValue = decodeURIComponent(document.cookie.substring(cookieStart + cookieName.length, cookieEnd));
    }
    return cookieValue;
  },
  /**
   * @description 添加cookie
   * @param {*} name 名称
   * @param {} value 值
   * @param {} expires 失效时间
   * @param {} path 路径
   * @param {} domain 域
   * @param {} secure 安全标志
   */
  setCookie(name, value, expires, path, domain, secure) {
    let cookieText = encodeURIComponent(name) + '=' + encodeURIComponent(value);
    if (expires instanceof Date) {
      cookieText += '; expires=' + expires.toUTCString();
    }

    if (typeof expires === 'number') {
      const cur = new Date();
      cur.setTime(cur.getTime() + expires * 24 * 3600 * 1000);
      cookieText += '; expires=' + (expires ? cur.toUTCString() : '');
    }

    if (path) {
      cookieText += '; path=' + path;
    }
    if (domain) {
      cookieText += '; domain=' + domain;
    }
    if (secure) {
      cookieText += '; secure';
    }
    document.cookie = cookieText;
  },
  /**
   * @description 删除cookie
   * @param {*} name 名称
   * @param {} path 路径
   * @param {} domain 域
   * @param {} secure 安全标志
   */
  delCookie(name, path, domain, secure) {
    this.setCookie(name, '', new Date(0), path, domain, secure);
  },
};

export default CookieService;
