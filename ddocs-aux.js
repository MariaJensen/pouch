
export default {

    putDesignDoc: async function (ddocName, options) {
        
        /** * parameters: 
                * db        PouchDB database object
                * ddocName  The views will live in doc with _id: '_design/' + ddocName
                * options   Object with a 'views' field
                    * views     An array of objects 
                                * viewName              string
                                * mapFunction           function
                                [ * reduceFunction ]    function    
            * effects: 
                *   If no doc with _id: '_design/' + <ddocName> exists in <db>, it will be created 
                    and populated with a 'views' object containing the views of <views>
                *   If the doc exists but has no 'views' object, this object will be created containing the 
                    views of <views> and merged into the doc
                *   If the doc exists and has a 'views' object already, the views of <views> will be merged 
                    into the existing 'views' object in the following way: 
                    *   Views from <views> that are not previously in the 'views' object will be added. 
                    *   Views from <views> that are previously in the 'views' object will overwrite
                        the existing ones
                    *   Existing views that are not in <views> will be kept as they are
            * returns: 
                *   Info on how it all went
        */

        const ddocId = '_design/' + ddocName;

        try {   // if doc already exists: merge views
            
            const doc = await this.get(ddocId); // throws 404 if doc does not exist

            if (!doc.views) {
                doc.views = {};
            }

            options.views.forEach( obj => {

                const view = {
                    map: obj.mapFunction.toString(),
                };

                if (obj.reduceFunction) {
                    view.reduce = obj.reduceFunction.toString();
                }
                
                doc.views[obj.viewName] = view;
            });

            try {
                const saveDoc = await this.put(doc);
                return saveDoc;
            } catch(err) {
                return err;
            }
        
        } catch(err) {  // if doc does not exist: create
            
            if (err.status === 404) {
                
                const doc = {
                    _id: ddocId,
                    views: {},
                };

                options.views.forEach( obj => {
                    
                    const view = {
                        map: obj.mapFunction.toString(),
                    };

                    if (obj.reduceFunction) {
                        view.reduce = obj.reduceFunction.toString();
                    }
                    
                    doc.views[obj.viewName] = view;
                });

                try {
                    const saveDoc = await this.put(doc);
                    return saveDoc;
                } catch(err) {
                    return err;
                }
            }

            return err;
        }
    },

    getAllDesignDocs: async function () {
        
        /** * parameters: 
                *   db  PouchDB database object
            * returns: 
                *   An array of all docs in <db> whose value of the '_id' key starts with '_design/' 
            */

        try {
            const docs = await this.allDocs({
                startkey: '_design',
                endkey: '_design\uffff',
                include_docs: true,
            });
            return docs.rows.map( row => {
                return row.doc;
            });
        } catch(err) {
            return err;
        }
    },

    getDesignDoc: async function (ddocName) {
        try {
            const doc = await this.get('_design/' + ddocName);
            return doc;
        } catch(err) {
            return err;
        }
    },

    deleteDesignDoc: async function (ddocName) {
        try {
            const doc = await this.get('_design/' + ddocName);
            doc._deleted = true;
            const saveDoc = await this.put(doc);
            return saveDoc;
        } catch(err) {
            return err;
        }
    },

    deleteAllViews: async function (ddocName) {
        try {
            const doc = await this.get('_design/' + ddocName);
            doc.views = {};
            const saveDoc = await this.put(doc);
            return saveDoc;
        } catch(err) {
            return err;
        }
    },

    deleteView: async function (ddocName, viewName) {
        try {
            const doc = await this.get('_design/' + ddocName);
            delete doc.views[viewName];
            const saveDoc = await this.put(doc);
            return saveDoc;
        } catch(err) {
            return err;
        }
    },

    getAllViews: async function(ddocName) {
        try {
            const doc = await this.get('_design/' + ddocName);
            return doc.views;
        } catch(err) {
            return err;
        }
    },

    getView: async function (ddocName, viewName) {
        try {
            const doc = await this.get('_design/' + ddocName);
            return doc.views[viewName];
        } catch(err) {
            return err;
        }
    },
}