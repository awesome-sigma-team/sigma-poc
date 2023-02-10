({
    handleMessage: function (component, event, helper) {
        console.log('HandleMessage called !!');
        var message = event.getParams();
        component.set('v.message', message.payload.value);
        if(message.name==="getContactNameFromPhoneNumber") {
            var action = cmp.get("c.searchForContacts");
            action.setParams({ phoneNumber : message.payload.value });
            action.setCallback(this, function(response) {
                var responseValue = response.getReturnValue();
                console.log('AURA: ', responseValue);
                // cmp.set("v.accs",responseValue);
                component.find("jsApp").message({name:'contactName', value: responseValue[0].Name});
            })

            $A.enqueueAction(action);

        }
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