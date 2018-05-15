"use strict";

var HospitalItem = function (text) {
    if (text) {
        var obj = JSON.parse(text);
        this.url = obj.url;
        this.name = obj.name;
        this.evidence = obj.evidence;
        this.author = obj.author;
    } else {
        this.url = "";
        this.author = "";
        this.name = "";
        this.evidence = "";
    }
};

HospitalItem.prototype = {
    toString: function () {
        return JSON.stringify(this);
    }
};

var PTHospital = function () {
    LocalContractStorage.defineMapProperty(this, "repo", {
        parse: function (text) {
            return new HospitalItem(text);
        },
        stringify: function (o) {
            return o.toString();
        }
    });
};

PTHospital.prototype = {
    init: function () {
        //init
    },

    save: function (url, name, evidence) {

        url = url.trim();
        name = name.trim();
        evidence = evidence.trim();
        if (url === "" || name === "" || evidence==="") {
            throw new Error("empty url/name/evidence");
        }
        // may use short url if meet length limit
        if (name.length > 64 || url.length > 64 || evidence.length>64) {
            throw new Error("url/name/evidence limit length")
        }

        var from = Blockchain.transaction.from;
        var item = this.repo.get(url);
        if (item) {
            throw new Error(url+ " has been occupied");
        }

        item = new HospitalItem();
        item.author = from;
        item.url = url;
        item.name = name;
        item.evidence = evidence;

        this.repo.put(url, item);
    },

    get: function (url) {
        url = url.trim();
        if (url === "") {
            throw new Error("empty url")
        }
        return this.repo.get(url);
    }
};
module.exports = PTHospital;