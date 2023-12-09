const SendResponse = (data, statusCode, res) => {
    res.status(statusCode).json(data);
}

module.exports = SendResponse;