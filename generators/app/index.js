const Generator = require('yeoman-generator');
const chalk = require('chalk');
const yosay = require('yosay');
const mkdirp = require('mkdirp');
const path = require('path');
const fse = require('fs-extra');

module.exports = class extends Generator {

  constructor(args, opts){
    super(args, opts);
    this.argument('directoryName', { type: String, required:false });
    this.argument('platform1', { type: String, required:false });
    this.argument('platform2', { type: String, required:false });
    this.argument('platform3', { type: String, required:false });
    this.argument('platform4', { type: String, required:false });
  }
  prompting() {
    // Have Yeoman greet the user.
    this.log(yosay(
      'Welcome to the brilliant ' + chalk.red('generator-teste-rcps') + ' generator!'
    ));

    const prompts = [];

    if(!this.options.directoryName){
      prompts.push({
        type: 'input',
        name: 'appName',
        message: 'Projet name: ',
        default: this.options.directoryName || 'newProject'
      })
    }

    return this.prompt(prompts).then(props => {
      // To access props later use this.props.someAnswer;
      this.props = props;
    });
  }

  writing() {

    this.options.APP_NAME = this.props.appName || this.options.directoryName;
    const APP_NAME = this.options.APP_NAME;

    var copyConfig = ({fileFrom, fileTo}) => {
      if(fileFrom){
        this.fs.copyTpl(
          this.templatePath(fileFrom),
          this.destinationPath((fileTo || fileFrom)),
          {...this.props, ...this.options}
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
  
    var copyDir = ({dirFrom, dirTo}) =>{
      if(dirFrom){
        fse.copy(
          this.templatePath(dirFrom),
          this.destinationPath((dirTo || dirFrom)),
          {...this.props, ...this.options}
        );
      }      
    }
  
    var copyFile = ({fileFrom, fileTo}) =>{
      if(fileFrom){
        this.fs.copy(
          this.templatePath(fileFrom),
          this.destinationPath((fileTo || fileFrom)),
          {...this.props, ...this.options}
        );
      }      
    }
  
    var createDir = (dirName) =>{
      mkdirp.sync(path.join(process.cwd(), dirName));
      return dirName
    }

    createDir(APP_NAME);

    copyAllConfigsFromDir({dirFrom:'configs', dirTo:APP_NAME});
    copyDir({dirFrom:'base', dirTo:APP_NAME});

    //FAZER LOGICA PRA SÓ PODER CRIAR PLATAFORMA E COMPONENTE E FEATURE NOS PATHS PADRÕES 

    this.composeWith(require.resolve('../platform'), {...this.props, ...this.options});
    
    if(this.options.vscode){
      copyDir({dirFrom:'.vscode', dirTo:APP_NAME + '/.vscode'});
    }

    if(this.options.example){
      this.composeWith(require.resolve('../feature'), {...this.props, ...this.options});
      // this.copyDir({dirFrom:'features', dirTo:this.createDir(APP_NAME + '/src/app/features')});
    }
  }

  install() {
    const directory = path.join(process.cwd(), this.options.APP_NAME);
    process.chdir(directory);
    this.installDependencies();
  }

  end(){
    this.log('\n\n\t All Done! Remember to run ' + chalk.yellowBright.italic.bold('cd ' + this.options.APP_NAME) + ' to enter in your project folder and use subgenerators!\n\n')
  }
};
