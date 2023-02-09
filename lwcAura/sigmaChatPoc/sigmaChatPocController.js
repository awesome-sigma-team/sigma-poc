({
    handleMessage: function (component, event, helper) {
        console.log('HandleMessage called !!');
        var message = event.getParams();
        component.set('v.message', message.payload.value);
    },

    handleError: function (component, event, helper) {
        var error = event.getParams();
        console.log(error);
    },

    sendMessage : function(component, event, helper) {
        
        var msg = {
            name: "General",
            value: component.get("v.messageToSend")
        };
        component.find("jsApp").message(msg);
    },

})