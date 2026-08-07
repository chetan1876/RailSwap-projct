const logInfo = (message) => {

    console.log(`✅ ${message}`);

};

const logError = (message) => {

    console.error(`❌ ${message}`);

};

const logWarning = (message) => {

    console.warn(`⚠️ ${message}`);

};

module.exports = {

    logInfo,

    logError,

    logWarning,

};