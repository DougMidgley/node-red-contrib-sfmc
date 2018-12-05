module.exports = function(RED) {
    function MarketingCloudConfig(n) {
        RED.nodes.createNode(this, n);
        this.name = n.name;
        this.clientId = n.clientId;
        this.clientSecret = n.clientSecret;
        this.tenant = n.tenant;
    }
    RED.nodes.registerType(
        'sfmc',
        MarketingCloudConfig,
        {
            credentials: {
                clientId: {type: 'text'},
                clientSecret: {type: 'password'},
                tenant: {type: 'text'}
            }
        }
    );
};