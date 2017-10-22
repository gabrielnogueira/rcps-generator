const Generator = require('yeoman-generator');
const chalk = require('chalk');
const yosay = require('yosay');
const mkdirp = require('mkdirp');
const path = require('path');
const fse = require('fs-extra');

module.exports = class extends Generator {
  constructor(args, opts){
    super(args, opts);
    this.argument('platform1', { type: String, required:false });
    this.argument('platform2', { type: String, required:false });
    this.argument('platform3', { type: String, required:false });
    this.argument('platform4', { type: String, required:false });
  }

  prompting() {

    const {platform1, platform2, platform3, platform4} = this.options
    this.options.platforms =[platform1, platform2, platform3, platform4].map(plat => plat || '' ).join(' ').trim();

    const prompts = [];
    
    if(!this.options.platforms){
      prompts.push({
        type: 'input',
        name: 'platforms',
        message: 'Platform name: ',
        default: this.options.platforms || 'web'
      })
    }

    return this.prompt(prompts).then(props => {
      this.props = props;
    });
  }

  writing() {
    const platforms = this.props.platforms? this.props.platforms.split(' ') : this.options.platforms.split(' ');

    const APP_NAME = this.options.APP_NAME || undefined;

    var copyConfig = ({fileFrom, fileTo}) =>{
      if(fileFrom){
        this.fs.copyTpl(
          this.templatePath(fileFrom),
          this.destinationPath((fileTo || fileFrom)),
          {...this.options}
        );
      }
    }
  
    var copyDir = ({dirFrom, dirTo}) =>{
      if(dirFrom){
        fse.copy(
          this.templatePath(dirFrom),
          this.destinationPath((dirTo || dirFrom)),
          {...this.options}
        );
      }      
    }
  
    var createDir = (dirName) =>{
      mkdirp.sync(path.join(process.cwd(), dirName));
      return dirName
    }

    var getDynamicPath = (path) => {
      return APP_NAME ? APP_NAME + '/' + path : path ;
    }

    var createWeb = () => {
      copyDir({dirFrom:'web', dirTo:createDir(getDynamicPath('src/platforms/web'))});
    }

    var createDesktop = () => {
      copyDir({dirFrom:'desktop', dirTo: createDir(getDynamicPath('src/platforms/desktop'))});
    }

    var createMobile = () => {
      copyDir({dirFrom:'mobile', dirTo:createDir(getDynamicPath('src/platforms/mobile'))});
    }

    var createMobileWeb = () => {
      copyDir({dirFrom:'native-web', dirTo:createDir(getDynamicPath('src/platforms/native-web'))});
    }

    platforms.map(platform => {
      switch(platform){
        case 'web':
          createWeb();
        break;
        case 'desktop':
          createDesktop();
        break;
        case 'mobile':
          createMobile();
        break;
        case 'mobile-web':
          createMobileWeb();
        break;
        case 'all':{
          createWeb();
          createDesktop();
          createMobile();
          createMobileWeb();
        }
        break;
        default:
          this.log('Cant found platform: ' + platform);
        break
      }
    })

    if(platforms.filter(element => element != undefined && element != null).length == 0){
      copyConfig({dirFrom:'base', dirTo:createDir(getDynamicPath('src/platforms'))})
      copyDir({dirFrom:'web', dirTo:createDir(getDynamicPath('src/platforms/web'))});
    }
  }

};
