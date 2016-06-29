'use strict';

/* common plugins */
const gulp = require('gulp');
const sourcemaps = require('gulp-sourcemaps');
const concat = require('gulp-concat');
const watch= require('gulp-watch');
const clean = require('gulp-clean');
/* css plugins */
const sass = require('gulp-sass');
const prefixer = require('gulp-autoprefixer');
const cssmin = require('gulp-minify-css');
/* js plugins */
const plumber = require('gulp-plumber');
const ngAnnotate = require('gulp-ng-annotate');
const babel = require('gulp-babel');
const uglify = require('gulp-uglify');
const addsrc = require('gulp-add-src');
const insert = require('gulp-insert');
/* sprite and image plugins */
const spritesmith = require('gulp.spritesmith');
const imagemin = require('gulp-imagemin');
/* server */
const browserSync = require("browser-sync");
const reload = browserSync.reload.bind(null, {stream: true});

/* contants */
const PATH = {
	SRC: {
		HTML: 'src/**/*.html',
		STYLES: [
			'src/main_styles/sprite.sass', 
			'src/main_styles/variables.sass',
			'src/main_styles/mixins.sass',
			'src/main_styles/main.sass',
			'src/components/**/*.sass'
			],
		SCRIPTS_LIB: [
			'src/bower_components/angular/angular.min.js',
			'src/bower_components/angular-ui-router/release/angular-ui-router.min.js'
			],
		SCRIPTS: [
			'src/main_scripts/app.js',
			'src/main_scripts/!(app.js)*.js',
			'src/components/**/*.js'
			],
		SPRITES: 'src/sprites/*.png',
		IMAGES: 'src/img/*.*',
		ROOT: 'src/'
	},
	SPRITES_STYLE: 'src/main_styles/',
	WATCH: {
		SASS: 'src/**/*.sass',
		JS: 'src/**/*.js'
	},
	BUILD: 'build/',
	IMAGES: 'build/img/'
};

const SERVER_CONFIG = {
	server: {
		baseDir: PATH.BUILD
	},
	tunnel: true,
	host: 'localhost',
	port: 100,
	logPrefix: 'Igor'
};

const BABEL_CONFIG = { presets: ['es2015'] };

/* tasks */

gulp.task('default', ['build'], () =>
	gulp.start(['server', 'watch'])
);

gulp.task('server', () => browserSync(SERVER_CONFIG) );

gulp.task('build', ['clean'], () => 
	gulp.start( ['html', 'sprites', 'images', 'scripts', 'scripts_lib'] ) 
);

gulp.task('html', () => 
		gulp
			.src(PATH.SRC.HTML)
			.pipe(gulp.dest(PATH.BUILD))
			.pipe(reload())
);

gulp.task('scripts', () => 
	gulp
		.src(PATH.SRC.SCRIPTS)
		.pipe(sourcemaps.init())
		.pipe(plumber())
		.pipe(concat('main.js'))
		.pipe(insert.prepend('(function(){'))
		.pipe(insert.append('})();'))
		.pipe(ngAnnotate())
		.pipe(babel(BABEL_CONFIG))
		.pipe(uglify())
		.pipe(sourcemaps.write())
		.pipe(gulp.dest(PATH.BUILD))
		.pipe(reload())
);

gulp.task('scripts_lib', () => 
	gulp
		.src(PATH.SRC.SCRIPTS_LIB)
		.pipe(concat('lib.js'))
		.pipe(gulp.dest(PATH.BUILD))
);

gulp.task('styles', () => 
		gulp
			.src(PATH.SRC.STYLES)
			.pipe(sourcemaps.init())
			.pipe(concat('main.sass'))
			.pipe(sass().on('error', sass.logError))
			.pipe(prefixer())
			.pipe(cssmin())
			.pipe(sourcemaps.write())
			.pipe(gulp.dest(PATH.BUILD))
			.pipe(reload())
);

gulp.task('images', () =>
		gulp
			.src(PATH.SRC.IMAGES)
			.pipe(imagemin())
			.pipe(gulp.dest(PATH.IMAGES))
);

gulp.task('sprites', () => {
	var spriteData = gulp
						.src(PATH.SRC.SPRITES) 
						.pipe(spritesmith({
							imgName: 'sprite.png',
							cssName: 'sprite.sass',
							cssFormat: 'sass',
							algorithm: 'top-down',
							padding: 2,
							cssVarMap: function (sprite) {sprite.name = 'sprite_' + sprite.name;}
						}));
	spriteData.img.pipe(gulp.dest(PATH.IMAGES)); 
	spriteData.css.pipe(gulp.dest(PATH.SPRITES_STYLE)); 
	gulp.start('styles');
	return spriteData;
});

gulp.task('watch', () => {
	watch([PATH.WATCH.SASS], () => gulp.start('styles') );
	watch([PATH.WATCH.JS], () => gulp.start('scripts') );
	watch([PATH.SRC.HTML], () => gulp.start('html') );
	watch([PATH.SRC.SPRITES], () => gulp.start('sprites') );
	watch([PATH.SRC.IMAGES], () => gulp.start('images') );
});

gulp.task('clean',  () =>
	gulp
		.src(PATH.BUILD, {read: false})
		.pipe(clean())
);