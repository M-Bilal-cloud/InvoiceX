export const catchError = (res, error, statusCode = 500) => {
    res.status(statusCode).json({
        ok: false,
        message: error.message
    });  
}