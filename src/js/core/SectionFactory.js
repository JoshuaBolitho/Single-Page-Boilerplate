/*******************************************************
**  
**  Dynamically serves pre-declared sections within the
**	config.
**
*******************************************************/

import config from 'config/Config';

class SectionFactory {
    
    constructor (className, classData) {

        var section;

        // in case of dual class namimg, internal sections take priority
        if (config.internal_section_classes[className]) {
            section = new config.internal_section_classes[className](className, classData);
        } else {
            section = new config.section_classes[className](className, classData);
        }

        // check if class has been registered to factory
        if (!section) {
            console.log('\n Error: Class "' + className + '" is not registered to the SectionFactory. This requires manual section input.');
            return;
        }

       return section;
    }
}

export default SectionFactory;