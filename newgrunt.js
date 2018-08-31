/* global require, module */

var path = require('path');

module.exports = function(grunt) {
    'use strict';

	// Load grunt tasks automatically
	require('load-grunt-tasks')(grunt);
    grunt.loadNpmTasks('grunt-browser-sync');
    grunt.loadNpmTasks('grunt-contrib-watch');

    var pkg = grunt.file.readJSON('package.json');

	var appConfig = {
		app: require('./bower.json').appPath || 'app',
		dist: 'dist'
	};

    var banner = '/*!\n' +
        ' * ====================================================\n' +
        ' * <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
        '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
        '<%= pkg.homepage ? " * " + pkg.homepage + "\\n" : "" %>' +
        ' * GitHub: <%= pkg.repository.url %> \n' +
        ' * Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
        ' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %>\n' +
        ' * ====================================================\n' +
        ' */\n\n';

    var expose = '\nuse(\'expose-editor\');\n';

    // Project configuration.
    grunt.initConfig({

        // Metadata.
        pkg: pkg,

	    yeoman: appConfig,

        clean: {
            last: [
	            '.tmp',
	            'dist/*.js',
	            'dist/*.css',
	            'dist/*.css.map'
            ],
	        clstmp: ['.tmp']
        },

        // resolve dependence
        dependence: {
            options: {
                base: 'src',
                entrance: 'expose-editor'
            },
            merge: {
                files: [{
                    src: [
                        'src/**/*.js'
                    ],
                    dest: '.tmp/scripts/kityminder.editor.logic.js'
                }]
            }
        },

        // browser sync for dev
		browserSync: {
            bsFiles: {
                dist: 'dist/css/*.css',
                src: 'src/**'
            },
            options: {
                server: {
                    baseDir: './',
                    index: 'index.html',
                    watchTask: true
                }
            }
		},

        // concat
        concat: {
            closure: {
                options: {
                    banner: banner + '(function () {\n',
                    footer: expose + '})();'
                },
                files: {
	                'dist/kityminder.editor1.js': [
		                '.tmp/scripts/kityminder.editor.logic.js',
		                '.tmp/scripts/kityminder.app.annotated.js',
		                '.tmp/scripts/templates.annotated.js',
		                '.tmp/scripts/service/*.js',
		                '.tmp/scripts/filter/*.js',
                        '.tmp/scripts/dialog/**/*.js',
		                '.tmp/scripts/directive/**/*.js'
	                ]
                }
            },
            dist: {
                src: [
                    'bower_components/jquery/dist/jquery.js',
                    'bower_components/bootstrap/dist/js/bootstrap.js',
                    'bower_components/angular/angular.js',
                    'bower_components/angular-bootstrap/ui-bootstrap-tpls.js',
                    'bower_components/codemirror/lib/codemirror.js',
                    'bower_components/codemirror/mode/xml/xml.js',
                    'bower_components/codemirror/mode/javascript/javascript.js',
                    'bower_components/codemirror/mode/css/css.js',
                    'bower_components/codemirror/mode/htmlmixed/htmlmixed.js',
                    'bower_components/codemirror/mode/markdown/markdown.js',
                    'bower_components/codemirror/addon/mode/overlay.js',
                    'bower_components/codemirror/mode/gfm/gfm.js',
                    'bower_components/angular-ui-codemirror/ui-codemirror.js',
                    'bower_components/marked/lib/marked.js',
                    'bower_components/kity/dist/kity.min.js',
                    'bower_components/hotbox/hotbox.js',
                    'bower_components/json-diff/json-diff.js',
                    'node_modules/kityminder-core/dist/kityminder.core.js',
                    'bower_components/color-picker/dist/color-picker.js'
                ],
                dest: 'dist/kityminder.editor2.js'
            }
        },

        uglify: {
            options: {
                banner: banner
            },
            minimize: {
                files: [{
	                src: 'dist/kityminder.editor.js',
	                dest: 'dist/kityminder.editor.min.js'
                }]
            }
        },

        less: {
            compile: {
                options: {
                    sourceMap: true,
	                sourceMapURL: 'kityminder.editor.css.map',
                    sourceMapFilename: 'dist/kityminder.editor.css.map'
                },
                files: [{
                    dest: 'dist/kityminder.editor.css',
                    src: 'less/editor.less'
                }]
            }
        },

	    cssmin: {
	        dist: {
	            files: {
	                'dist/kityminder.editor.min.css': 'dist/kityminder.editor.css'
	         }
	       }
	    },

	    ngtemplates: {
		    kityminderEditor: {
			    src: ['ui/directive/**/*.html', 'ui/dialog/**/*.html'],
			    dest: 'ui/templates.js',
			    options: {
				    htmlmin: {
					    collapseBooleanAttributes: true,
					    collapseWhitespace: true,
					    removeComments: true
				    }
			    }
		    }
	    },

	    // Automatically inject Bower components into the app
	    wiredep: {
		    dev: {
			    src: ['index.html'],
			    devDependencies: true
		    },
		    dist: {
			    src: ['dist/index.html']
		    }
	    },

	    // Copies remaining files to places other tasks can use
	    copy: {
		    dist: {
				files: [{
				    expand: true,
				    cwd: 'ui',
					src: 'images/*',
				    dest: 'dist'

			    }]
		    }
	    },


	    // ng-annotate tries to make the code safe for minification automatically
	    // by using the Angular long form for dependency injection.
	    ngAnnotate: {
		    dist: {
			    files: [{
				    expand: true,
				    cwd: 'ui/',
				    src: '**/*.js',
				    ext: '.annotated.js',
				    extDot: 'last',
				    dest: '.tmp/scripts/'
			    }]
		    }
	    }


    });

    // Build task(s).
	grunt.registerTask('build', ['clean:last',
		//'wiredep:dist',
        'ngtemplates', 'dependence', 'ngAnnotate', 'concat', 'uglify', 'less', 'cssmin', 'copy', 'clean:clstmp']);

	grunt.registerTask('dev', ['clean:last',
        //'wiredep:dev',
        'ngtemplates', 'dependence', 'ngAnnotate', 'concat', 'uglify', 'less', 'cssmin', 'copy', 'clean:clstmp', 'browserSync', 'watch']);
};