module.exports = function(RED) {

    function initGetContact(conditionSet) {
        this.conditionSet = conditionSet;
    }
    let SFMCRestClient = require('fuel-rest');

    function getContacts(config) {
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
                const payload = new initGetContact(msg[config.filter]);
                const options = {
                    method: 'POST',
                    uri: restEndpoint + '/contacts/v1/contacts/search',
                    body: payload,
                    json: true
                };

                restClient
                    .post(options)
                    .then((response) => {
                        msg.result = response.body;
                        node.send([msg, response.body.items, undefined]);
                    })
                    .catch((err) => {
                        msg.result = err;
                        node.send([msg, undefined, err]);
                    });
            } catch (ex) {
                node.error(ex, {
                    payload: JSON.parse(JSON.stringify(ex))
                });
            }
        });
    }
    RED.nodes.registerType('getContacts', getContacts);
};