module.exports = function(grunt){
	grunt.initConfig({
		express:{
			options: {},
			dev: {
				options: {
					script: 'index.js'
				}
			},
			production: {
				options: {
					script: 'index.js'
				}
			}
		},
		sass: {
			dist:{
				files:{
					'app/public/dist/styles.css' : 'app/public/css/styles.scss'
				}
			},
			options: {
				livereload: false
			}
		},
		concat: {
			dist:{
				src: ['app/public/js/**/*.js',
							'!app/public/js/**/*.spec.js'],
				dest: 'app/public/dist/scripts.js'
			}
		},
		jshint:{
			options: {
				jshintrc: '.jshintrc'
			},
			all: ['app/public/js/**/*.js']

		},
		watch: {
			options: {
				livereload: true
			},
			express: {
				files: ['index.js', 'app/routes/**/*.js'],
				tasks: ['express:dev'],
				options: {
					spawn: false
				}
			},
			public: {
				files: ['app/public/**/*.css', 'app/public/**/*.html']
			},
			css: {
				files: 'app/public/css/**/*.scss',
				tasks: ['sass']
			},
			js: {
				files: 'app/public/js/**/*.js',
				tasks: ['jshint', 'concat']
			}
		}
	})

	grunt.loadNpmTasks('grunt-express-server')
	grunt.loadNpmTasks('grunt-contrib-watch')
	grunt.loadNpmTasks('grunt-sass')
	grunt.loadNpmTasks('grunt-contrib-concat')
	grunt.loadNpmTasks('grunt-contrib-jshint')

	grunt.registerTask('default', ['express:dev', 'watch'])
	grunt.registerTask('production', ['sass', 'jshint', 'concat'])
}
