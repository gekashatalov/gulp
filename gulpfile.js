const gulp = require('gulp');
const concat = require('gulp-concat');
const autoprefixer = require('gulp-autoprefixer');
const cleanCSS = require('gulp-clean-css');
const uglify = require('gulp-uglify');
const del = require('del');
const browserSync = require('browser-sync').create();

const cssFiles = [/*задаем массив файлов в таком порядке, в котором они должна слиться воедино*/
    './node_modules/normalize.css/normalize.css',
    './css/style.css'
    ];


const jsFiles = [/*задаем массив файлов в таком порядке, в котором они должна слиться воедино*/
    './script/script.js'
];




function styles() {
    return gulp.src(cssFiles) //подключаем этот массив
            .pipe(concat('all.css')) //файл в который будет собранны все файлы со стилями
            .pipe(autoprefixer({
                overrideBrowserslist: ['> 0.01%'],
                cascade: false
            }))
            .pipe(cleanCSS({
                level: 2
            }))
            .pipe(gulp.dest('./build/css')) // место куда будет сохранятся всё
            .pipe(browserSync.stream()); // следит за измениниями файлов и релоадид страницу
};

function scripts() {
    return gulp.src(jsFiles) //подключаем этот массив
            .pipe(concat('all.js')) //файл в который будет собранны все файлы со стилями
            .pipe(uglify({
                toplevel: true //опция сжатия скрипт файла
            }))
            .pipe(gulp.dest('./build/js')) // место куда будет сохранятся всё
            .pipe(browserSync.stream()); // следит за измениниями файлов и релоадид страницу
};

function watch() {
    browserSync.init({
        server: {
            baseDir: "./"
        },
        //tunnel: true
    });
    gulp.watch('./css/style.css', styles); // отслеживает все файлы стилей и запускает функцию styles на лету
    gulp.watch('./script/script.js', scripts);// отслеживает все файлы скриптов и запускает функцию scripts на лету
    gulp.watch('./*.html', browserSync.reload);// отслеживает все файлы html на измениене и обновляет при этом страницу

};

function clear(){
    return del(['./build/*']) // удалит всё с папки build
};

gulp.task('styles', styles);
gulp.task('scripts', scripts);
gulp.task('watch', watch);
gulp.task('build', gulp.series(clear,                        // series - поочердный запуск (сначала clear а потом остальное)
                                gulp.parallel(styles,scripts)// parallel - паралельный запуск функций
                                ));
gulp.task('dev', gulp.series('build', 'watch'));
