module.exports = function(RED) {
    let SFMCRestClient = require('fuel-rest');

    function ContactEvent(config) {
        RED.nodes.createNode(this, config);
        let sfmcConfig = RED.nodes.getNode(config.sfmcConfig);
        let node = this;
        let restClient = new SFMCRestClient({
            auth: {
                // options you want passed when Fuel Auth is initialized
                clientId: sfmcConfig.credentials.clientId,
                clientSecret: sfmcConfig.credentials.clientSecret
            },
            restEndpoint: `https://${sfmcConfig.credentials.tenant}.rest.marketingcloudapis.com`
        });
        this.on('input', function(msg) {


            const options = {
                method: 'POST',
                url: 'https://www.exacttargetapis.com/interaction/v1/events',
                body: msg[config.payloadKey],
                json: true
            };

            restClient.post(options)
                .then((response) => {
                    node.send({
                        payload: response.body.Results
                    });
                })
                .catch((err) =>
                    node.error(err, {
                        payload: JSON.parse(JSON.stringify(err))
                    })
                );
        })
        ;
    }
    RED.nodes.registerType('contact-event', ContactEvent);
};