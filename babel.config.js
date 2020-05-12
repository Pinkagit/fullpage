const presets = [
    [
        "@babel/env",
        {
            targets: {
                browsers: [
                    "last 1 version",
                    "> 1%",
                    "maintained node versions",
                    "not dead"
                ]
            },
            useBuiltIns: "usage",
            corejs: 2
        },
    ],
];

module.exports = { presets };