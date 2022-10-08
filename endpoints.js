// Endpoint templates are stored here and POST endpoints are automatically
// generated on program launch.
// Authors: Daniel Chapin (dsc4984)
//
// Format:
// const endpoints = [
//     {
//         path: '/sql',
//         query: 'select ${attribs} from ${table}',
//         params: {
//             attribs: '*',
//             table: undefined
//         }
//     }
// ]
// path is the path of the endpoint
// query is the query string the request makes
// params is an object that contains all POST parameters that will be substituted in to the query.
//        The value in this object is the default value the query should use if it's not specified in the post request.
//        If the default value is undefined, that parameter is considered required. An error will be returned if that param is not supplied.

const endpoints = [
    {
        path: '/sql',
        query: 'select ${attribs} from ${table}',
        params: {
            attribs: '*',
            table: undefined
        }
    },
]

module.exports = { endpoints };
