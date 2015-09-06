// Generated on 2015-09-04 using generator-nodejs 2.1.0
module.exports = function(grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        // complexity: {
        //     generic: {
        //         src: ['app/**/*.js'],
        //         options: {
        //             errorsOnly: false,
        //             cyclometric: 6, // default is 3
        //             halstead: 16, // default is 8
        //             maintainability: 100 // default is 100
        //         }
        //     }
        // },
        // jshint: {
        //     all: ['Gruntfile.js', 'app/**/*.js', 'test/**/*.js'],
        //     options: {
        //         jshintrc: '.jshintrc'
        //     }
        // },
        jsbeautifier: {
            files: ['**/*.js', '!node_modules/**/*.js', '!public/javascripts/library/*.js'],
        },
        mochacli: {
            all: ['test/**/*.js'],
            options: {
                reporter: 'spec',
                ui: 'tdd'
            }
        },
        nodemon: {
            dev: {
                script: './bin/www',
                options: {
                    ignore: ['node_modules/**', 'public/**'],
                }
            }
        },
        watch: {
            js: {
                files: ['**/*.js', '!node_modules/**/*.js'],
                tasks: ['ci'],
                options: {
                    nospawn: true
                }
            },
        },
        concurrent: {
            dev: {
                tasks: ['nodemon', 'watch'],
                options: {
                    logConcurrentOutput: true
                }
            }
        },
    });

    grunt.loadNpmTasks('grunt-concurrent');
    grunt.loadNpmTasks('grunt-nodemon');
    grunt.loadNpmTasks('grunt-complexity');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-mocha-cli');
    grunt.loadNpmTasks('grunt-jsbeautifier');
    grunt.registerTask('test', [ /* 'complexity', */ 'jsbeautifier', /* 'jshint', */ 'mochacli', 'concurrent', ]);
    grunt.registerTask('ci', [ /* 'complexity', */ 'jsbeautifier', /* 'jshint', */ 'mochacli']);
    grunt.registerTask('default', ['test']);
};
