import { userInfo, tokenOwner } from './utility.js';

export let userDB = {};
export let tokenDB = {};

export let fillUsernames = async function(addresses) {
    // TODO make user info reactive
    let toQuery = {};
    for (let addr of addresses) {
        if (addr && !userDB[addr]) {
            toQuery[addr] = 1;
        }
    }

    for (let user of await userInfo(Object.keys(toQuery))) {
        userDB[user.safeAddress.toLowerCase()] = {avatarUrl: user.avatarUrl, username: user.username};
    }
};

export let fillTokens = async function(tokens) {
    let toQuery = {};
    for (let token of tokens) {
        token = token.toLowerCase();
        if (token && !tokenDB[token]) {
            toQuery[token] = 1;
        }
    }
    for (let token of Object.keys(toQuery)) {
        tokenDB[token] = await tokenOwner(token);
    }
}
