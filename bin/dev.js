#!/usr/bin/env node

var fs = require('fs-extra');
var glob = require('glob');
var chokidar = require('chokidar');
var pug = require('pug');
var less = require('less');
var childProcess = require('child_process');
var bs = require('browser-sync').create();

fs.removeSync('site');

// ts

childProcess.execSync('tsc');

glob('**/*.ts', {
    ignore: [
        'node_modules/**/*',
        'site/**/*'
    ]
}, (err, files) => {
    chokidar.watch(files)
        .on('change', () => childProcess.execSync('tsc'));
});

// pug

(() => {
    var build = () => fs.outputFileSync('site/index.html', pug.renderFile('views/index.pug', {
        pretty: true
    }));
    build();
    glob('views/*.pug', (err, files) => {
        chokidar.watch(files)
            .on('change', () => build());
    });
})();


(() => {
    var files = glob.sync('app/**/*.pug');
    var build = (file) => {
        var dir = file.split('/').slice(0, -1).join('/');
        fs.mkdirpSync('site/' + dir);
        var outFile = 'site/' + file.split('.')[0] + '.html';
        fs.outputFileSync(outFile, pug.renderFile(file, {
            pretty: true
        }));
    }
    files.forEach(file => {
        build(file);
        chokidar.watch(file)
            .on('change', () => build(file));
    });
})();

// less

(() => {
    var build = () => {
        less.render(fs.readFileSync('less/client.less', 'utf8'))
            .then(
                data => fs.outputFileSync('site/css/client.css', data.css),
                err => console.log(err)
            );

        glob.sync('app/**/*.less').forEach(file => {
            var dir = file.split('/').slice(0, -1).join('/');
            fs.mkdirpSync('site/' + dir);
            var outFile = 'site/' + file.split('.')[0] + '.css';
            less.render(fs.readFileSync(file, 'utf8'))
                .then(
                    data => fs.outputFileSync(outFile, data.css),
                    err => console.log(err)
                );
        });
    }

    build();
    chokidar.watch(glob.sync('**/*.less'))
        .on('change', () => build());
})();

// copy

fs.copySync('public', 'site');

[
    'node_modules/es6-shim',
    'node_modules/zone.js',
    'node_modules/reflect-metadata',
    'node_modules/systemjs',
    'node_modules/rxjs',
    'node_modules/symbol-observable',
    'node_modules/@angular',
    //
    'node_modules/jquery',
    'node_modules/bootstrap',
    'node_modules/roboto-fontface',
    'node_modules/font-awesome',
    'node_modules/octicons'
].forEach(dir => fs.copySync(dir, 'site/' + dir));

// serve

bs.init({
    files: [{
        match: 'site/**/*',
        fn: (event, file) => {
            if(event === 'change')
                bs.reload();
        },
        options: {
            ignored: [
                'site/node_modules',
                'site/fonts'
            ]
        }
    }],
    notify: false,
    port: 4000,
    server: './site',
    ui: false
});
