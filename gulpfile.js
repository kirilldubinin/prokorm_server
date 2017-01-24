'use strict'
 
var fs = require('fs');
var gulp = require('gulp')
var GulpSSH = require('gulp-ssh')
 
var config = {
  host: '54.186.205.111',
  port: 22,
  username: 'ubuntu',
  privateKey: fs.readFileSync('/home/it/.ssh/prokorm_key.pem')
}
 
var gulpSSH = new GulpSSH({
  ignoreErrors: false,
  sshConfig: config
})
 
gulp.task('exec', function () {
  return gulpSSH
    .exec(['cd /usr/share/app/prokorm_server', 'pm2 logs api'], {filePath: 'commands.log'})
    .pipe(gulp.dest('logs'))
})