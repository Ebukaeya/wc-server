
export const customError = (err, req, res, next) => {
    if(err.status===400){
        res.status(err.status).send({
            status: err.status,
            message: err.message
        })
    }
    if(err.status===404){
        res.status(err.status).send({
            status: err.status,
            message: err.message
        })
    }

}

