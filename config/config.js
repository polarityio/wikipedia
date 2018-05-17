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
    request: {
        // Provide the path to your certFile. Leave an empty string to ignore this option.
        // Relative paths are relative to the VT integration's root directory
        cert: '',
        // Provide the path to your private key. Leave an empty string to ignore this option.
        // Relative paths are relative to the VT integration's root directory
        key: '',
        // Provide the key passphrase if required.  Leave an empty string to ignore this option.
        // Relative paths are relative to the VT integration's root directory
        passphrase: '',
        // Provide the Certificate Authority. Leave an empty string to ignore this option.
        // Relative paths are relative to the VT integration's root directory
        ca: '',
        // An HTTP proxy to be used. Supports proxy Auth with Basic Auth, identical to support for
        // the url parameter (by embedding the auth info in the uri)
        proxy: ''
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
