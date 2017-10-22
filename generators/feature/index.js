'use strict';
const Generator = require('yeoman-generator');
const chalk = require('chalk');
const mkdirp = require('mkdirp');
const path = require('path');
const fse = require('fs-extra');

module.exports = class extends Generator {

  constructor(args, opts){
    super(args, opts);
    this.argument('featureName', { type: String, required:false });
  }
  prompting() {

      const prompts = [];

      if(!this.options.example && !this.options.featureName){
        prompts.push({
        type: 'input',
        name: 'featureName',
        message: 'FeatureName name: ',
        default: 'newFeature'
      });
    }
  
    return this.prompt(prompts).then(props => {
      this.props = props;
    });
  }

  writing() {

    var camelizeFirst = (str) => {
      if(!str){
        return str;
      }
      return str.replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, function(match, index) {
        if (+match === 0) return ""; // or if (/\s+/.test(match)) for white spaces
        return match.toUpperCase();
      });
    }

    var camelize = (str) => {
      if(!str){
        return str;
      }
      return str.replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, function(match, index) {
        if (+match === 0) return ""; // or if (/\s+/.test(match)) for white spaces
        return index == 0 ? match.toLowerCase() : match.toUpperCase();
      });
    }

    const APP_NAME = this.options.APP_NAME || undefined;
    this.options.FEATURE_NAME = camelizeFirst(this.props.featureName || this.options.featureName);
    this.options.FEATURE_NAME_LOWER_CASE = camelize(this.options.FEATURE_NAME);
    this.options.FEATURE_NAME_UPPER_CASE = this.options.FEATURE_NAME? this.options.FEATURE_NAME.toUpperCase():undefined;
    const {FEATURE_NAME} = this.options;
    
    var createDir = (dirName) =>{
      mkdirp.sync(path.join(process.cwd(), dirName));
      return dirName
    }

    var getDynamicPath = (path) => {
      return APP_NAME ? APP_NAME + '/' + path : path ;
    }

    var copyConfig = ({fileFrom, fileTo}) =>{
      if(fileFrom){
        this.fs.copyTpl(
          this.templatePath(fileFrom),
          this.destinationPath((fileTo || fileFrom)),
          {...this.options, ...this.props}
        );
      }
    }
  
    var copyDir = ({dirFrom, dirTo}) =>{
      if(dirFrom){
        fse.copy(
          this.templatePath(dirFrom),
          this.destinationPath((dirTo || dirFrom)),
          {...this.options, ...this.props}
        );
      }      
    }

    var copyAllConfigsFromDir = ({dirFrom, dirTo}) => {
      if(dirFrom){
        fse.readdirSync(this.templatePath(dirFrom)).forEach(file => {
          if(dirTo){
            copyConfig({fileFrom:dirFrom + '/' + file, fileTo:dirTo + '/' + file})
          }else{
            copyConfig({fileFrom:dirFrom + '/' + file})
          }
        })
      }
    }

    if(this.options.example){
      copyAllConfigsFromDir({dirFrom:'config', dirTo:createDir(getDynamicPath('src/app/features'))});
      copyDir({dirFrom:'example', dirTo:createDir(getDynamicPath('src/app/features'))});
    }else{
      if(this.options.first){
        copyAllConfigsFromDir({dirFrom:'config', dirTo:createDir(getDynamicPath('src/app/features'))});
      }
      
      //basics feature
      copyAllConfigsFromDir({dirFrom:'base/_featureName', dirTo:createDir(getDynamicPath('src/app/features/' + FEATURE_NAME))})
      copyConfig({fileFrom:'base/config/_featureName.js', fileTo:getDynamicPath('src/app/features/' + FEATURE_NAME + '/' + FEATURE_NAME + '.js')})
      
      //basics redux-abstraction
      copyConfig({fileFrom:'base/redux-abs/config/index.js', fileTo:getDynamicPath('src/app/features/' + FEATURE_NAME + '/redux-abs/index.js')})
      copyConfig({fileFrom:'base/redux-abs/config/_feature-redux-abs.js', fileTo:getDynamicPath('src/app/features/' + FEATURE_NAME + '/redux-abs/' + FEATURE_NAME_LOWER_CASE + '-redux-abs.js')})
    
      //actions  
      copyAllConfigsFromDir({dirFrom:'base/redux-abs/actions', dirTo:createDir(getDynamicPath('src/app/features/' + FEATURE_NAME + '/redux-abs/actions'))})
      copyConfig({fileFrom:'base/redux-abs/config/_feature-actions.js', fileTo:getDynamicPath('src/app/features/' + FEATURE_NAME + '/redux-abs/actions/' + FEATURE_NAME_LOWER_CASE + '-actions.js')})
      
      //constants  
      copyAllConfigsFromDir({dirFrom:'base/redux-abs/constants', dirTo:createDir(getDynamicPath('src/app/features/' + FEATURE_NAME + '/redux-abs/constants'))})
      copyConfig({fileFrom:'base/redux-abs/config/_feature-constants.js', fileTo:getDynamicPath('src/app/features/' + FEATURE_NAME + '/redux-abs/constants/' + FEATURE_NAME_LOWER_CASE + '-constants.js')})

      //logic  
      copyAllConfigsFromDir({dirFrom:'base/redux-abs/logic', dirTo:createDir(getDynamicPath('src/app/features/' + FEATURE_NAME + '/redux-abs/logic'))})
      copyConfig({fileFrom:'base/redux-abs/config/_feature-logic.js', fileTo:getDynamicPath('src/app/features/' + FEATURE_NAME + '/redux-abs/logic/' + FEATURE_NAME_LOWER_CASE + '-logic.js')})
      
      //reducers  
      copyAllConfigsFromDir({dirFrom:'base/redux-abs/reducers', dirTo:createDir(getDynamicPath('src/app/features/' + FEATURE_NAME + '/redux-abs/reducers'))})
      copyConfig({fileFrom:'base/redux-abs/config/_feature-reducers.js', fileTo:getDynamicPath('src/app/features/' + FEATURE_NAME + '/redux-abs/reducers/' + FEATURE_NAME_LOWER_CASE + '-reducers.js')})
      
      //selectors  
      copyAllConfigsFromDir({dirFrom:'base/redux-abs/selectors', dirTo:createDir(getDynamicPath('src/app/features/' + FEATURE_NAME + '/redux-abs/selectors'))})
      copyConfig({fileFrom:'base/redux-abs/config/_feature-selectors.js', fileTo:getDynamicPath('src/app/features/' + FEATURE_NAME + '/redux-abs/selectors/' + FEATURE_NAME_LOWER_CASE + '-selectors.js')})
      
      //services  
      copyAllConfigsFromDir({dirFrom:'base/redux-abs/services', dirTo:createDir(getDynamicPath('src/app/features/' + FEATURE_NAME + '/redux-abs/services'))})
      copyConfig({fileFrom:'base/redux-abs/config/_feature-services.js', fileTo:getDynamicPath('src/app/features/' + FEATURE_NAME + '/redux-abs/services/' + FEATURE_NAME_LOWER_CASE + '-services.js')})
      
    }
  }

};