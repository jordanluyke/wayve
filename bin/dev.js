#!/usr/bin/env node

var fs = require('fs-extra');
var glob = require('glob');
var chokidar = require('chokidar');
var pug = require('pug');
var less = require('less');
var childProcess = require('child_process');
var bs = require('browser-sync').create();
var Builder = require('systemjs-builder');
var argv = process.argv.slice(2);

var args = {
    build: argv[0] == 'build'
};

fs.removeSync('site');

// ts

childProcess.execSync('tsc');

if(!args.build)
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
    if(!args.build)
        glob('views/*.pug', (err, files) => {
            chokidar.watch(files)
                .on('change', () => build());
        });
})();


(() => {
    var files = glob.sync('app/**/*.pug');
    var build = (file) => {
        var dir = file.split('/').slice(0, -1).join('/');
        fs.mkdirpSync(`site/${dir}`);
        var outFile = `site/${file.split('.')[0]}.html`;
        fs.outputFileSync(outFile, pug.renderFile(file, {
            pretty: true
        }));
    }
    files.forEach(file => {
        build(file);
        if(!args.build)
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
            fs.mkdirpSync(`site/${dir}`);
            var outFile = `site/${file.split('.')[0]}.css`;
            less.render(fs.readFileSync(file, 'utf8'))
                .then(
                    data => fs.outputFileSync(outFile, data.css),
                    err => console.log(err)
                );
        });
    }

    build();
    if(!args.build)
        chokidar.watch(glob.sync('**/*.less'))
            .on('change', () => build());
})();

// copy

fs.copySync('public', 'site');

[
    '@angular',
    'rxjs',
    'bootstrap',
    'roboto-fontface',
    'font-awesome',
    'octicons'
].forEach(dir => fs.copySync(`node_modules/${dir}`, `site/node_modules/${dir}`));

// js

fs.outputFileSync('site/js/vendor.js', [
    'node_modules/es6-shim/es6-shim.min.js',
    'node_modules/zone.js/dist/zone.min.js',
    'node_modules/reflect-metadata/Reflect.js',
    'node_modules/jquery/dist/jquery.slim.min.js',
    'node_modules/bootstrap/dist/js/bootstrap.min.js'
].reduce((previous, current) => previous + fs.readFileSync(current, 'utf8') + '\n', ''));

// builder & serve

new Builder('site', 'systemjs.config.js')
    .buildStatic('app', 'site/js/app.js')
    .then(() => {
        if(!args.build)
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
    });
