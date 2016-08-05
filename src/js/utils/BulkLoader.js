/*******************************************************
**  
**  Handles multiple http asset requests in single 
**  calls.
**
**  TODO: add sequencial loading functionality, rather
**  than just having it be parallel:
**  http://www.photo-mark.com/notes/image-preloading/
**
*******************************************************/

import JSONLoader from 'utils/JSONLoader';
import EventEmitter from 'events';

class BulkLoader extends EventEmitter {
    
    
    constructor () {

        super();
        
        this.total = 0;
        this.loaded = 0;
    }


    /*******************************************************
    **  
    **  route prelaod file lists to coordinating function,
    **  relative to type. 
    **
    **  NOTE: only images for now
    **
    *******************************************************/

    loadList (fileList) {

        if (fileList.images && fileList.images.length > 0) {
            this.loadImages(fileList.images, this.on_LOADED);
        }
    }


    loadImages (imgList, callback) {

        var img;

        this.fileLength = imgList.length;
        this.loaded = 0;

        // force browser to cache images
        for (var i = 0; i < this.fileLength; i++) {
            img = new Image();
            img.onerror = this.on_IMAGE_LOAD_ERROR;
            img.onload = this.on_LOADED.bind(this);
            img.src = imgList[i];
        }

        this.total += this.fileLength;
    }


    /*******************************************************
    **  
    **  resets to original state
    **
    *******************************************************/

    clear () {
        this.total = 0;
        this.loaded = 0;
    }


    /*******************************************************
    **  
    **  Load events
    **
    *******************************************************/

    on_IMAGE_LOAD_ERROR (e) {
        console.log('Error loading as image: ' + this.src);
    }

    on_LOADED (e) {

        this.loaded++;
        this.emit('LOAD_PROGRESS', this.loaded/this.total);

        if (this.loaded >= this.total) {
            this.clear();
            this.emit('LOAD_COMPLETE');
        }
    }

}

export default BulkLoader;