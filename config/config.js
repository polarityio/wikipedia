module.exports = {
    "name": "Wikipedia",
    "acronym": "Wiki",
    "logging": { level: 'info'},
    "styles": [
        "./styles/wiki.less"
    ],
    "entityTypes": ['string'],
    "block": {
        "component": {
            "file": "./components/wiki.js"
        },
        "template": {
            "file": "./template/wiki.hbs"
        }
    },
    "options":[
            {
                "key"          : "profile",
                "name"         : "Search Profile",
                "description"  : "Specify the search profile for Wikipedia Open Search. Options are: 'strict', 'normal', 'fuzzy' or 'classic'",
                "default"      : "fuzzy",
                "type"         : "text",
                "userCanEdit"  : true,
                "adminOnly"    : false
            },
            {
                "key"          : "relatedCount",
                "name"         : "Related Topics",
                "description"  : "The number of related wiki topics to show.",
                "default"      : "5",
                "type"         : "text",
                "userCanEdit"  : true,
                "adminOnly"    : false
            }
        ]
};
