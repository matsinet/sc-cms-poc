function whereClause (field, operator, value) {
    switch (operator) {
        case 'eq':
            return {[field]: value};
        case 'ne':
            return { [field]: { $ne: value} }
        case 'gt':
            return { [field]: { $gt: value} }
        case 'gte':
            return { [field]: { $gte: value} }
        case 'lt':
            return { [field]: { $lt: value} }
        case 'lte':
            return { [field]: { $lte: value} }
        case 'in':
            return { [field]: value.split(",") }
    }

}

const whereQuery = (model, request) => {
    const query = request.query;
    if (query.hasOwnProperty('where')) {
        const paths = model.schema.paths;
        if (typeof query.where === 'string') {
            const [operator, field, value] = query.where.split(':');
            if (paths.hasOwnProperty(field)) {
                model.find(whereClause(field, operator, value));
            }
        } else {
            query.where.forEach(where => {
                const [operator, field, value] = where.split(':');
                if (paths.hasOwnProperty(field)) {
                    model.find(whereClause(field, operator, value));
                }
            });
        }
    }
    return model;
}

module.exports = whereQuery;
