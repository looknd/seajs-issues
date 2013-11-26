// Generated by CoffeeScript 1.6.3
(function() {
  var getIssue, http, issueIds, q;

  http = {
    get: function(url, callback) {
      var req;
      req = new XMLHttpRequest;
      req.open("GET", url);
      req.send();
      return req.onload = function() {
        return callback(JSON.parse(req.responseText));
      };
    }
  };

  getIssue = function(number) {
    "https://api.github.com/repos/seajs/seajs/issues/" + number;
    return "mock/" + number;
  };

  issueIds = [240, 242, 258, 259, 260, 262, 538];

  q = function(query) {
    return document.querySelector(query);
  };

  define(function(require) {
    var Ractive, c2m, cache, cirru, issue, issueTmpl, makeTmpl, marked, table, tableTmpl;
    require("hljs");
    Ractive = require("Ractive");
    c2m = require("c2m");
    cirru = require("cirru");
    marked = require("marked");
    cirru.parse.compact = true;
    marked.setOptions({
      highlight: function(code, lang) {
        if (typeof hljs !== "undefined" && hljs !== null) {
          return hljs.highlightAuto(code).value;
        } else {
          return code;
        }
      },
      gfm: true,
      breaks: true
    });
    makeTmpl = function(file) {
      return c2m.render(cirru.parse(file));
    };
    tableTmpl = makeTmpl(require("text!table"));
    issueTmpl = makeTmpl(require("text!issue"));
    table = new Ractive({
      el: q('#content-table'),
      template: tableTmpl,
      data: {
        list: [],
        keypath: void 0,
        renderCursor: function(keypath, num) {
          if (keypath === ("list." + num)) {
            return "pointing";
          } else {
            return "";
          }
        }
      }
    });
    issueIds.map(function(id) {
      return http.get(getIssue(id), function(data) {
        return table.data.list.push(data);
      });
    });
    issue = new Ractive({
      el: q('#article'),
      template: issueTmpl,
      data: {}
    });
    cache = {};
    return table.on({
      load: function(event) {
        var data, html;
        data = event.context;
        table.set("keypath", event.keypath);
        issue.set("html_url", data.html_url);
        issue.set("title", data.title);
        issue.set("updated_at", data.updated_at);
        issue.set("user.login", data.user.login);
        issue.set("user.url", data.user.url);
        if (cache[data.title] != null) {
          return issue.set("body", cache[data.title]);
        } else {
          html = marked(data.body);
          cache[data.title] = html;
          return issue.set("body", html);
        }
      }
    });
  });

}).call(this);

/*
//@ sourceMappingURL=combine.map
*/
