import nodeResolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import babel from 'rollup-plugin-babel'

export default {
    entry: 'site/app/main-aot.js',
    dest: 'site/js/app.js',
    treeshake: true,
    sourceMap: true,
    sourceMapFile: 'site/js/app.js.map',
    format: 'iife',
    context: 'window',
    plugins: [
        nodeResolve({
            jsnext: true,
            module: true
        }),
        commonjs({
            include: [
                'node_modules/rxjs/**',
            ]
        }),
        babel({
            presets: [
                ["es2015", {"modules": false}]
            ],
            plugins: ["external-helpers"],
            compact: true,
            minified: true,
            comments: false
        })
    ]
}
