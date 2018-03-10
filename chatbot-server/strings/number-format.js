var self = module.exports = {
    init : function () {
        self.currency = new Intl.NumberFormat('en-US');
        self.percentage = new Intl.NumberFormat({
            maximumFractionDigits: 2
        })
    }
};