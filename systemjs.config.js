var map = {
    'app': 'app',
    'rxjs': 'node_modules/rxjs',
    '@angular': 'node_modules/@angular',
    'symbol-observable': 'node_modules/symbol-observable'
};

var packages = {
    'app': {
        main: 'main',
        defaultExtension: 'js'
    },
    'rxjs': {
        main: 'bundles/Rx.umd.min.js',
        defaultExtension: 'js'
    },
    'symbol-observable': {
        main: 'index.js',
        defaultExtension: 'js'
    }
};

[
    'common',
    'compiler',
    'core',
    'forms',
    'platform-browser',
    'platform-browser-dynamic'
].forEach(name => {
    packages[`@angular/${name}`] = {
        main: `bundles/${name}.umd.min.js`,
        defaultExtension: 'js'
    };
});

System.config({
    map: map,
    packages: packages
});
