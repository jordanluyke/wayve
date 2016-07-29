(global => {
    var map = {
        'app': 'app',
        'rxjs': 'node_modules/rxjs',
        '@angular': 'node_modules/@angular',
        'symbol-observable': 'node_modules/symbol-observable'
    };

    var packages = {
        'app': {
            main: 'main.js',
            defaultExtension: 'js'
        },
       'rxjs': {
            defaultExtension: 'js'
        },
        'symbol-observable': {
            defaultExtension: 'js',
            main: 'index.js',
        }
    };

    [
        'common',
        'compiler',
        'core',
        'platform-browser',
        'platform-browser-dynamic'
    ].forEach(function(name) {
        packages['@angular/'+name] = {
            main: '/bundles/' + name + '.umd.js',
            defaultExtension: 'js'
        };
    })

    var config = {
        map: map,
        packages: packages
    }

    if(global.filterSystemConfig)
        global.filterSystemConfig(config);

    System.config(config);
})(this);
