import config from 'config/Config';
import DeviceDetect from 'utils/DeviceDetect';
import Model from 'core/Model';
import Router from 'core/Router';
import SectionsController from 'core/SectionsController';
import Menu from 'ui/DefaultMenu';

class App {


    constructor () {

       this.bootStart = Date.now();
       
       console.log('APP CONSTRUCTOR');
       console.log('- begin boot:', this.bootStart, 'ms'); 
    }


    /*************************************************
    ** 
    ** create all the pre-data dependencies
    **
    *************************************************/

    boot () {

       // Description of the clients' environment
       this.deviceDetect = new DeviceDetect();

       // populate main data model, which describes the application structure
       this.model = new Model();
       this.model.loadJSON(config.json_url, this.bootContinued.bind(this));
    }


    /*************************************************
    **
    ** now create data dependent classes
    **
    *************************************************/

    bootContinued () {

        this.router = new Router(this.model.sections);
        this.router.on('ROUTE_CHANGE', this.on_ROUTE_CHANGE.bind(this));

        this.menu = new Menu(this.model.sections, this.router.getRoute());
        this.menu.on('MENU_SELECT', this.router.navigate.bind(this.router));

        this.sectionsController = new SectionsController(this.model.sections);
        this.sectionsController.on('PRELOAD_ENTER', this.on_PRELOAD_ENTER.bind(this));
        this.sectionsController.on('PRELOAD_EXIT', this.on_PRELOAD_EXIT.bind(this));
        this.sectionsController.changeSection(this.router.getRoute());

        // passed manually to children: top to bottom.
        window.addEventListener('resize', this.on_RESIZE.bind(this));
    }


    /*************************************************
    ** 
    **  All navigation needs to begin at router.js. 
    **  This is the function that gets called after a 
    **  valid route request has been granted and is 
    **  used to pass the new state to state related
    **  modules.
    **
    *************************************************/

    on_ROUTE_CHANGE (section) {
        this.sectionsController.changeSection(section);
        this.menu.setSection(section);
    }


    /*************************************************
    ** 
    **  Signals when a section enters/exits preloading 
    **  status, so that other components can 
    **  coordinate.
    **
    *************************************************/

    on_PRELOAD_ENTER (e) {
        this.menu.hide();
    }

    on_PRELOAD_EXIT (e) {
        this.menu.show();
    }


    /*************************************************
    **  
    **  Top level resize
    **
    *************************************************/

    on_RESIZE (e) {

        this.width = window.innerWidth;
        this.height = window.innerHeight;

        this.sectionsController.resize(this.width, this.height);
        this.menu.resize(this.width, this.height);
    }
}

var ROOT = new App();
ROOT.boot();