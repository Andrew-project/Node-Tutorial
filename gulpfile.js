/**
 * Created by gaoqz on 16/11/28.
 */

// 引入 gulp
var gulp = require('gulp');

// 引入组件
var htmlmin = require('gulp-htmlmin'), //html压缩
    imagemin = require('gulp-imagemin'),//图片压缩
    pngcrush = require('imagemin-pngcrush'),
    sass = require('gulp-sass'),
    minifycss = require('gulp-minify-css'),//css压缩
    stripCssComments = require('gulp-strip-css-comments');
    jshint = require('gulp-jshint'),//js检测
    uglify = require('gulp-uglify'),//js压缩
    concat = require('gulp-concat'),//文件合并
    rename = require('gulp-rename'),//文件更名
    autoprefixer = require('gulp-autoprefixer'),//补充前缀
    spriter = require('gulp-css-spriter'),//雪碧图合成,css内的url添加后缀?__spriter
    rev = require('gulp-rev-append'),//版本号自动更新
    ngAnnotate = require('gulp-ng-annotate'),//angular依赖
    ngmin = require('gulp-ngmin'),//angular依赖
    notify = require('gulp-notify');//提示信息
var replace = require('gulp-replace');
var plumber = require('gulp-plumber');

// 压缩html
gulp.task('html', function () {
    var htmlOptions = {
        removeComments: true,//清除HTML注释
        collapseWhitespace: true,//压缩HTML
        collapseBooleanAttributes: true,//省略布尔属性的值 <input checked="true"/> ==> <input />
        removeEmptyAttributes: true,//删除所有空格作属性值 <input id="" /> ==> <input />
        removeScriptTypeAttributes: true,//删除<script>的type="text/javascript"
        removeStyleLinkTypeAttributes: true,//删除<style>和<link>的type="text/css"
        minifyJS: true,//压缩页面JS
        minifyCSS: true//压缩页面CSS
    };

    return gulp.src('src/**/*.html')
        .pipe(plumber())
        .pipe(rev())
        .pipe(replace('main.css', 'main.min.css'))
        .pipe(replace('all.js', 'all.min.js'))
        .pipe(htmlmin(htmlOptions))
        .pipe(gulp.dest('./test'))
        .pipe(gulp.dest('./pro'))
        .pipe(notify({message: 'html task ok'}));
});

// 压缩图片
gulp.task('img', function () {
    var imgOption = {
        optimizationLevel: 5, //类型：Number  默认：3  取值范围：0-7（优化等级）
        progressive: true, //类型：Boolean 默认：false 无损压缩jpg图片
        interlaced: true, //类型：Boolean 默认：false 隔行扫描gif进行渲染
        multipass: true, //类型：Boolean 默认：false 多次优化svg直到完全优化
        svgoPlugins: [{removeViewBox: false}],//不要移除svg的viewbox属性
        use: [pngcrush()] //使用pngquant深度压缩png图片的imagemin插件
    };
    return gulp.src('src/img/**/*')
        .pipe(plumber())
        .pipe(imagemin(imgOption))
        .pipe(gulp.dest('./test/img/'))
        .pipe(gulp.dest('./pro/img/'))
        .pipe(notify({message: 'img task ok'}));
});

// 编译sass
gulp.task('sass', function () {
    return gulp.src('./src/css/*.scss')
        .pipe(plumber())
        .pipe(sass())
        .pipe(stripCssComments()) // 去掉css注释
        .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
        // css格式化、美化（因为有f2ehint，故在此不再做语法等的检查与修复)
        .pipe(gulp.dest('./src/css'))
        .pipe(notify({message: 'sass task ok'}));
});

// 合并、压缩、重命名css
gulp.task('css', ['sass'], function () {
    var cssOption = {
        advanced: false,//类型：Boolean 默认：true [是否开启高级优化（合并选择器等）]
        compatibility: '*',//保留ie7及以下兼容写法 类型：String 默认：''or'*' [启用兼容模式； 'ie7'：IE7兼容模式，'ie8'：IE8兼容模式，'*'：IE9+兼容模式]
        keepBreaks: false,//类型：Boolean 默认：false [是否保留换行]
        keepSpecialComments: '*'
        //保留所有特殊前缀 当您用autoprefixer生成的浏览器前缀，如果不加这个参数，有可能将会删除您的部分前缀
    };
    return gulp.src(['src/css/YHZS.css', '!src/css/main.css', '!src/css/main.min.css', '!src/**/iconfont/*', '!src/**/projectIconfont/*'])
        .pipe(plumber())
        .pipe(autoprefixer({
            browsers: ['last 2 versions', 'Android >= 4.0'],
            cascade: true, //是否美化属性值 默认：true 像这样：
            remove: true //是否去掉不必要的前缀 默认：true
        }))
        // .pipe(spriter({
        //     // 生成的spriter的位置
        //     'spriteSheet': './pro/img/sprite.png',
        //     // 生成样式文件图片引用地址的路径
        //     'pathToSpriteSheetFromCSS': '../img/sprite.png'
        // }))
        .pipe(concat('main.css'))
        .pipe(gulp.dest('src/css'))
        .pipe(rename({suffix: '.min'}))
        .pipe(minifycss(cssOption))
        .pipe(gulp.dest('test/css'))
        .pipe(gulp.dest('pro/css'))
        .pipe(notify({message: 'css task ok'}));
});

// iconfont
gulp.task('iconfont', function () {
    return gulp.src(['src/iconfont/*'])
        .pipe(plumber())
        .pipe(gulp.dest('test/css'))
        .pipe(gulp.dest('pro/css'))
        .pipe(notify({message: 'iconfont task ok'}));
});

// 检查js
gulp.task('lint', function () {
    return gulp.src(['!src/**/lib/*.js', '!src/**/**all**.js', 'src/js/**/*.js'])
        .pipe(plumber())
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

// 引用js资源打包
gulp.task('lib', function () {
    return gulp.src(['src/**/lib/*.js'])
        .pipe(plumber())
        .pipe(uglify())
        .pipe(gulp.dest('pro'))
        .pipe(gulp.dest('test'))
        .pipe(notify({message: 'lib task ok'}));
});

// 合并、压缩js文件
gulp.task('js', function () {
    var jsOption = {
        // mangle: {except: ['require', 'exports', 'module', '$']},
        compress: true//类型：Boolean 默认：true 是否完全压缩
        // preserveComments: 'all' //保留所有注释}//排除混淆关键字

    };
    return gulp.src(["src/js/external/**.js",
        "src/js/ng-config/app.js",
        "src/js/factory/**/*.js",
        "src/js/directive/**/*.js",
        "src/js/state/**/*.js",
        "src/js/ng-config/config.js",
        "src/js/ng-config/run.js",
        '!src/**/lib/*.js',
        '!src/js/all.js',
        '!src/js/all.min.js'])
        .pipe(plumber())
        .pipe(concat('all.js'))
        .pipe(ngAnnotate())
        .pipe(ngmin({dynamic: false}))
        .pipe(gulp.dest('src/js'))
        .pipe(rename({suffix: '.min'}))
        .pipe(replace("setEnvirement('debug')", "setEnvirement('app')"))
        .pipe(uglify())
        .pipe(replace('n.showAll();', ''))
        .pipe(gulp.dest('test/js'))
        .pipe(gulp.dest('pro/js'))
        .pipe(notify({message: 'js task ok'}));
});

// 默认任务
gulp.task('default', function () {
    // gulp.run('img', 'sass', 'css', 'lint', 'js', 'html');
    gulp.run('img', 'css', 'lint', 'js', 'html', 'lib', 'iconfont');

    // 监听html文件变化
    // gulp.watch(['src/**/*.html'], ['html']);

    //Watch .scss files
    gulp.watch(['src/css/*.scss','src/css/**/*.scss','src/css/**/**/*.scss'], ['sass']);

    // Watch .css files
    gulp.watch(['src/css/**/*.css', '!src/css/main.css', '!src/css/main.min.css'], ['css']);

    // Watch .js files
    gulp.watch(['src/js/**/*.js', '!src/js/all.js', '!src/js/all.min.js'], ['lint', 'js']);

    // Watch image files
    // gulp.watch('src/images/*', ['img']);
});