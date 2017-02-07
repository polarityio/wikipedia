module.exports = {
    "name": "Wikipedia",
    "acronym": "Wiki",
    "logging": { level: 'debug'},
    "styles": [
        "./styles/wiki.less"
    ],
    "block": {
        "component": {
            "file": "./components/block.js"
        },
        "template": {
            "file": "./template/wiki.hbs"
        }
    },
    "options":[
            {
                "key"          : "profile",
                "name"         : "Search parameters",
                "description"  : "Specify the search parameters for Wikipedia open Search. Options are: 'strict', 'normal', 'fuzzy' or 'classic'",
                "default"      : "fuzzy",
                "type"         : "text",
                "userCanEdit"  : true,
                "adminOnly"    : false
            },
            {
                "key"          : "relatedCount",
                "name"         : "Related topics",
                "description"  : "The number of related wiki topics to show.",
                "default"      : "5",
                "type"         : "text",
                "userCanEdit"  : true,
                "adminOnly"    : false
            }
        ]
};
