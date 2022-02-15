import {contacts} from "../stores/contacts";
import {displayableName} from "../functions/stringHelper";
import {AvataarGenerator} from "../avataarGenerator";

export let userDB = {};
export let tokenDB = {};

export let fillUsernames = async function(addresses) {
    await Promise.all(addresses.map(async o => {
       const contact = await contacts.findBySafeAddress(o);
       if (!contact) {
           userDB[o] = {
               avatarUrl: AvataarGenerator.generate(o),
               username: displayableName(o)
           }
       } else {
           userDB[contact.contactAddress] = {
               avatarUrl: contact.contactAddress_Profile.avatarUrl,
               username: displayableName(contact.contactAddress_Profile.firstName, contact.contactAddress_Profile.lastName)
           }
       }
    }));
};

export let fillTokens = async function(tokensAndOwners) {
    tokensAndOwners.forEach(o => tokenDB[o.token] = o.tokenOwner);
}
