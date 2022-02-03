const withQuery = (model, request) => {
    const query = request.query;
    if (query.hasOwnProperty('with')) {
        const paths = model.schema.paths;
        if (typeof query.with === 'string') {
            const path = query.with;
            model = populatePath(model, path, paths);
        } else {
            query.with.forEach(path => {
                model = populatePath(model, path, paths)
            });
        }
    }

    return model;
}

const populatePath = (model, path, schemaPaths) => {
    // TODO: Make this work for infinitely nest subdocuments
    let subPath = false;
    if (path.includes('.')) {
        subPath = path;
        path = path.split('.')[0];
    }
    if (schemaPaths.hasOwnProperty(path)) {
        if (subPath) {
            model.populate(subPath);
        }
        return model.populate(path, {}, schemaPaths[path].options.ref);
    }
}

module.exports = withQuery;
