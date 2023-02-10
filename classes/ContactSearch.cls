public with sharing class ContactSearch {
    @AuraEnabled(cacheable=true)
    public static List<Contact> searchForContacts(String phoneNumber){
        try {
            System.debug('This is a debug '+phoneNumber);
            return [
                select Name, Phone from Contact where phone =: phoneNumber
            ];
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
    // public static List<Contact> searchForContacts(string phone) {
    //     List<Contact> contactList = [select ID, Name from Contact where phone=: phone];
    //     return contactList;
    // }

}