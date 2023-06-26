
(() => {
    const goodies = {
        ...require('./extras/univariate-to-png'),
    };

    if (typeof window !== 'undefined') {
        for (let name in goodies) {
            console.log('copy '+name+'to window');
            window[name] = goodies[name];
        }
    } else {
        module.exports = goodies;
    }
})()
