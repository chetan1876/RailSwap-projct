const { getIO } = require("../../config/socket");

const emitEvent = (event, data) => {

    const io = getIO();

    io.emit(event, data);

};

module.exports = {
    emitEvent,
};