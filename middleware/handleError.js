module.exports = (error, request, response, next) => {
    console.error(error);
    console.log(`ERRORNAME => ${error.name}`);
    if ( error.name === 'CastError') {
        response.status(400).send({ error: 'The id is not valid.'}).end();
    }else{
        response.status(500).end()
    }
}