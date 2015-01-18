module.exports = function(grunt) {

  // Project Configuration
  grunt
      .initConfig({
        pkg : grunt.file.readJSON('package.json'),
        clean : {
          src : [ 'dist/*' ]
        },
        connect : {
          server : {
            options : {
              base : 'dist/',
              port : 9000
            }
          }
        },
        compress: {
          main: {
            options: {
              archive: 'dist/issuetracker.tar.gz'
            },
            files: [ {
              expand: true,
              cwd: 'dist/',
              src: ['**']
            } ]
          }
        },
        copy : {
          main : {
            files : [ {
              expand : true,
              cwd : 'src/main/app/',
              src : [ '*' ],
              dest : 'dist/',
              filter : 'isFile'
            }, {
              expand : true,
              cwd : 'src/main/',
              src : [ 'app/**', '!app/**/*.html', '!app/js/**', '!app/templates/**' ],
              dest : 'dist/assets/'
            }, {
              expand : true,
              src : [ 'lib/**' ],
              dest : 'dist/assets/'
            } ]
          }
        },
        jshint : {
          gruntfile : [ 'Gruntfile.js' ],
          main : [ 'src/main/app/**/*.js' ]
        },
        jst : {
          compile : {
            options : {
              namespace : 'IssueTrackerTemplates',
              processName : function(filePath) {
                return filePath.replace(/^src\/main\/app\/templates\//, '')
                               .replace(/\.html$/,'');
              }
            },
            files : {
              'dist/assets/app/js/app-templates-<%= pkg.version %>.js' : 'src/main/app/templates/*.html'
            }
          }
        },
        uglify : {
          options : {
            banner : '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n',
            sourceMap : true,
            sourceMapName : 'dist/assets/app/js/app-<%= pkg.version %>.map'
          },
          main : {
            files : {
              'dist/assets/app/js/app-<%= pkg.version %>.min.js': ['src/main/app/Application.js', 'src/main/app/js/**/*.js']
            }
          }
        },
        watch : {
          src : {
            files : [ 'src/**/*', 'lib/**/*' ],
            tasks : [ 'dist' ]
          }
        }
      });

  // Load Plugins
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-compress');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-jst');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');

  // Define Tasks
  grunt.registerTask('default', [ 'jshint', 'clean', 'copy', 'jst', 'uglify' ]);
  grunt.registerTask('dist', [ 'default', 'compress' ]);
  grunt.registerTask('run', [ 'default', 'connect:server', 'watch' ]);

};
