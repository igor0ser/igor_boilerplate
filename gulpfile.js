'use strict';

const gulp = require('gulp');
/* common plugins */
const sourcemaps = require('gulp-sourcemaps');
const watch= require('gulp-watch');
const clean = require('gulp-clean');
/* css plugins */
const sass = require('gulp-sass');
const prefixer = require('gulp-autoprefixer');
const cssmin = require('gulp-minify-css');
/* js plugins */
const injectFile = require("gulp-inject-file");
const jsmin = require('gulp-jsmin');
const babel = require('gulp-babel');
/* sprite and image plugins */
const spritesmith = require('gulp.spritesmith');
const imagemin = require('gulp-imagemin');
/* server */
const browserSync = require("browser-sync");
const reload = browserSync.reload.bind(null, {stream: true});

/* contants */
const PATH = {
	SRC: {
		HTML: 'src/index.html',
		SASS: 'src/main.sass',
		JS: 'src/main.js',
		SPRITES: 'src/sprites/*.png',
		STYLES: 'src/styles/',
		IMG: 'src/img/*.*',
		ROOT: 'src/'
	},
	BUILD: 'build/',
	IMG: 'build/img/'
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

const INJECT_CONFIG = { pattern: '// \\s*inject:<filename>' };
const BABEL_CONFIG = { presets: ['es2015'] };

/* tasks */

gulp.task('default', ['server', 'build', 'watch'] );

gulp.task('server', () => browserSync(SERVER_CONFIG) );

gulp.task('build', ['clean'], () => 
	gulp.start( ['html', 'spr', 'img', 'js'] ) 
);

gulp.task('html', () => 
		gulp
			.src(PATH.SRC.HTML)
			.pipe(gulp.dest(PATH.BUILD))
			.pipe(reload())
);

gulp.task('js', () => 
	gulp
		.src(PATH.SRC.JS)
		.pipe(injectFile(INJECT_CONFIG))
		.pipe(sourcemaps.init())
		.pipe(babel(BABEL_CONFIG))
		.pipe(jsmin())
		.pipe(sourcemaps.write())
		.pipe(gulp.dest(PATH.BUILD))
		.pipe(reload())
);

gulp.task('css', () => 
		gulp
			.src(PATH.SRC.SASS)
			.pipe(sourcemaps.init())
			.pipe(sass().on('error', sass.logError))
			.pipe(prefixer())
			.pipe(cssmin())
			.pipe(sourcemaps.write())
			.pipe(gulp.dest(PATH.BUILD))
			.pipe(reload())
);

gulp.task('img', () =>
		gulp
			.src(PATH.SRC.IMG)
			.pipe(imagemin())
			.pipe(gulp.dest(PATH.IMG))
);

gulp.task('spr', () => {
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
	spriteData.img.pipe(gulp.dest(PATH.IMG)); 
	spriteData.css.pipe(gulp.dest(PATH.SRC.STYLES)); 
	gulp.start('css');
	return spriteData;
});

gulp.task('watch', () => {
	watch([PATH.SRC.HTML], () => gulp.start('html') );
	watch([PATH.SRC.SASS], () => gulp.start('css') );
	watch([PATH.SRC.SPRITES], () => gulp.start('spr') );
	watch([PATH.SRC.IMG], () => gulp.start('img') );
});

gulp.task('clean',  () =>
	gulp
		.src(PATH.BUILD, {read: false})
		.pipe(clean())
);