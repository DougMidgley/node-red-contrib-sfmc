module.exports = function(RED) {
    let SFMCRestClient = require('fuel-rest');

    function ContactEvent(config) {
        RED.nodes.createNode(this, config);
        let sfmcConfig = RED.nodes.getNode(config.sfmcConfig);
        let node = this;
        const restEndpoint = `https://${
            sfmcConfig.credentials.tenant
        }.rest.marketingcloudapis.com`;
        let restClient = new SFMCRestClient({
            auth: {
                // options you want passed when Fuel Auth is initialized
                clientId: sfmcConfig.credentials.clientId,
                clientSecret: sfmcConfig.credentials.clientSecret
            },
            restEndpoint: restEndpoint
        });
        this.on('input', function(msg) {
            try {
                const options = {
                    method: 'POST',
                    uri: restEndpoint + '/interaction/v1/events',
                    body: msg[config.payloadKey],
                    json: true
                };

                restClient
                    .post(options)
                    .then((response) => {
                        node.send({
                            payload: response.body
                        });
                    })
                    .catch((err) => {
                        node.error(err, {
                            payload: JSON.parse(JSON.stringify(err))
                        });
                    });
            } catch (ex) {
                node.error(ex, {
                    payload: JSON.parse(JSON.stringify(ex))
                });
            }
        });
    }
    RED.nodes.registerType('contact-event', ContactEvent);
};