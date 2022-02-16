export const en = {
  "en": {
    "common": {
      "empty": " ",
      "trusted": "trusted",
      "untrusted": "untrusted",
      "you": "you",
      "tokens": "tokens"
    },
    "dapps": {
      "o-banking": {
        "atoms": {
          "transferConfirmation": {
            "paymentPath": "Payment Path",
            "recipientAddress": "Recipient Address"
          },
          "transferSummary": {
            "paymentPath": "Payment Path",
            "amount": "Amount",
            "recipientAddress": "Recipient Address",
            "transactionHash": "Transaction Hash"
          }
        },
        "pages": {
          "assets": {
            "loadingTokens": "Loading Tokens..."
          },
          "crcDetail": {
            "individualCircles": "Individual Circles",
            "loadingTokens": "Loading Tokens..."
          },
          "transactionDetail": {
            "paymentPath": "Payment Path",
            "fullAmountCrc": "Full amount in CRC",
            "amountCircles": "Amount Circles"
          }
        },
        "processes": {
          "setTrust": {
            "editorContent": {
              "recipient": {
                "title": "Select the person you want to trust",
                "description": " ",
                "placeholder": "Select",
                "submitButtonText": "Set Trust"
              },
              "limit": {
                "title": "Please enter ther Amount",
                "description": " ",
                "submitButtonText": "Submit"
              },
              "message": {
                "title": "Transfer Message",
                "description": " ",
                "submitButtonText": "Submit"
              },
              "confirm": {
                "title": "Confirm",
                "description": " ",
                "submitButtonText": "Confirm"
              },
              "success": {
                "title": "Trust successful",
                "description": " ",
                "submitButtonText": "Close"
              }
            },
            "checkTrustLimit": {
              "contextMessage": "'As soon as you trust yourself, you will know how to live.' --Johann Wolfgang von Goethe"
            },
            "setTrust": {
              "message": "Updating trust .."
            },
            "showSuccess": {
              "html": "<p>Trust changed</p>"
            },
            "success": {
              "return": "yeah!"
            }
          },
          "showAssetDetail": {
            "success": {
              "return": "yeah!"
            }
          },
          "showProfile": {
            "success": {
              "return": "yeah!"
            }
          },
          "showTransaction": {
            "success": {
              "return": "yeah!"
            }
          },
          "transfer": {
            "strings": {
              "labelRecipientAddress": "Select the recipient you want to send money to",
              "tokensLabel": "Please enter the amount",
              "currencyCircles": "CRC",
              "currencyXdai": "xDai",
              "summaryLabel": "Summary",
              "messageLabel": "Purpose of transfer"
            },
            "editorContent": {
              "recipient": {
                "title": "Select the recipient you want to send money to",
                "description": " ",
                "placeholder": "Recipient",
                "submitButtonText": "Enter Name"
              },
              "recipientSafeAddress": {
                "title": "Enter the recipients safe address",
                "description": "Here you can enter the recipients safe address directly.",
                "placeholder": "Safe Address",
                "submitButtonText": "Next"
              },
              "currency": {
                "title": "Please enter ther Amount in Euro",
                "description": " ",
                "submitButtonText": "Submit"
              },
              "message": {
                "title": "Transfer Message",
                "description": " ",
                "submitButtonText": "Submit"
              },
              "confirm": {
                "title": "You are about to transfer",
                "description": " ",
                "submitButtonText": "Send Money"
              },
              "success": {
                "title": "Transfer successful",
                "description": " ",
                "submitButtonText": "Close"
              }
            },
            "recipientAddress": {
              "submitButtonText": "Check send limit"
            },
            "tokens": {
              "dataSchema": {
                "min": "Please enter at least 0.1",
                "typeError": "Please enter a valid number.",
                "required": "Please enter a valid amount.",
                "positive": "Please enter a valid amounr."
              },
              "currency": "Please select a vlid currency"
            },
            "findMaxFlow": {
              "entry": {
                "message": "Calcilating the maximum transfer amoubt .."
              },
              "invoke": { "error": "No recipient address on context" }
            },
            "checkAmount": {
              "contextMessages": "The chosen amount exceeds the maximum transfarable amount of ({formattedMax})."
            }
          },
          "trasnferXdai": {
            "entry": {
              "message": "Processing xDai transfer .."
            }
          }
        }
      },
      "o-contacts": {
        "atoms": {
          "chatListItems": {
            "crcHubTransfer": {
              "getValues": {
                "icon": "sendmoney",
                "title": " ",
                "titleClass": " ",
                "text": " ",
                "ifIn": "Sent you",
                "ifOut": {
                  "youSent": "You sent",
                  "to": "to"
                }
              }
            },
            "crcTrust": {
              "getValues": {
                "icon": "trust",
                "title": " ",
                "titleClass": " ",
                "untrustedYou": "untrusted you",
                "trustedYou": "trusted you",
                "youUntrusted": "You untrusted",
                "youTrusted": "You trusted"
              }
            },
            "erc20Transfer": {
              "getValues": {
                "icon": "sendmoney",
                "title": " ",
                "titleClass": " ",
                "text": " ",
                "ifIn": {
                  "title": {
                    "sentYou": "sent you",
                    "tokens": "tokens"
                  }
                },
                "ifOut": {
                  "youSent": "You sent",
                  "tokensTo": "tokens to"
                }
              }
            },
            "invitationRedeemed": {
              "getValues": {
                "icon": "trust",
                "title": " ",
                "titleClass": " ",
                "text": " ",
                "invitationRedeemed": {
                  "title": "redeemed your invitation."
                }
              }
            }
          },
          "chatListCard": {
            "trustStatus": " ",
            "mutualTrust": "mutual trust",
            "trustedByYou": "trusted by you",
            "isTrustingYou": "is trusting you",
            "notTrusted": "not trusted",
            "trusted": "trusted",
            "untrusted": "untrusted",
            "you": "you",
            "You": "You",
            "sentYou": "sent you",
            "tokens": "tokens",
            "token": "token",
            "wrote": "wrote:",
            "redeemedYourInvatition": "redeemed your invatition",
            "invitedYouTo": "invited you to",
            "youSent": "You sent",
            "youWrote": "You wrote:",
            "invitedYouToCirclesLand": "invited you to CirclesLand.",
            "youInvited": "You invited",
            "to": "to"
          },
          "contactCard": {
            "mutualTrust": "mutual trust",
            "trustedByYou": "trusted by you",
            "isTrustingYou": "is trusting you",
            "notTrusted": "not trusted"
          }
        },
        "pages": {
          "chatDetail": {
            "mutualTrust": "Mutual trust",
            "youTrust": "You trust",
            "trustsYou": "trusts you",
            "placeholder": "Your Message"
          },
          "contacts": {
            "loadingContacts": "Loading contacts..."
          },
          "profile": {
            "mutualTrust": "mutual trust",
            "trustedByYou": "trusted by you",
            "isTrustingYou": "is trusting you",
            "notTrusted": "not trusted",
            "verify": "Veryfy",
            "revoke": "revoke Verification",
            "accountVeryfied": "Account verified",
            "verifiedClickToRevoke": "Verified. click to Revoke",
            "accountVerificationRevoked": "Account verification revoked",
            "revokedUppercase": "REVOKED",
            "trust": "Trust",
            "mutualFriends": "Mutual friends",
            "noMutualFriends": "No mutual friends",
            "memberAt": "Member at",
            "verifiedBy": "Verified by",
            "passion": "Passion",
            "address": "Address"
          },
          "chat": {
            "loadingConversations": "Loading conversations...",
            "error": "An error occured while loading the recent activities:"
          }
        }
      },
      "o-coop": {
        "molecules": {
          "switchProfile": "Switch Profile"
        },
        "pages": {
          "organisationDetail": {
            "profile": "PROFILE",
            "trust": "Trust",
            "isTrustingYou": "is trusting you",
            "description": "Description",
            "address": "Address",
            "members": "Members",
            "loading": "...loading"
          }
        },
        "processes": {
          "addMembers": {
            "memberAddress": {
              "title": "Select the person you want to add",
              "description": " ",
              "placeholder": "Select",
              "submitButtonText": "Add"
            }
          },
          "createOrganisations": {
            "notLoggedOn": "You're not logged on",
            "noEoa": "You have no eoa",
            "notUnlockedPrivateKey": "The private key is not unlocked",
            //"availableForTransfer": "You have not enough funds on '{me.circlesSafeOwner}'. Max. transferable amount is {web3.utils.fromWei(availableForTransfer, 'ether')}",
            "couldNotSend": "Couldn't send the invitation transaction",
            "createOrganisationContext": {
              "name": {
                "title": "What is the name of your organisation?",
                "description": "DESCRIPTION",
                "placeholder": "Name",
                "submitButtonText": "Save",
                "enterOrganisationName": "Please enter an organisation name."
              },
              "country": {
                "title": "Where is you organisation located?",
                "description": "DESCRIPTION",
                "placeholder": "City",
                "submitButtonText": "Save"
              },
              "description": {
                "title": "Describe your organisation in a few sentences?",
                "description": "DESCRIPTION",
                "placeholder": "Description",
                "submitButtonText": "Save",
                "maximumChars": "The maximum amount of characters allowed is 150."
              },
              "avatar": {
                "title": "Profile Image",
                "description": "Show the World who you are",
                "placeholder": "Uplade Image",
                "submitButtonText": "Uplade Image"
              },
              "deployOrganisation": {
                "notUnlockedKey": "The private key is not unlocked",
                "needFullAccountSetup": "You need a fully set-up circles account to create an organisation."
              },
              "signupOrganisation": {
                "notUnlockedKey": "The private key is not unlocked"
              }
            }
          },
          "createRegions": {
            "notLoggedOn": "You're not logged on",
            "noEoa": "Your have no eoa",
            "notUnlockedKey": "The privat key is not unlocked",
            "notEnoughPart1": "You have not enough funds on ",
            "notEnoughPart2": ". Max. transfarable amount is ",
            "couldNotSendInvitation": "Couldn't send the invitaion transaction",
            "createRegionContext": {
              "name": {
                "title": "What is the name of you organisation?",
                "description": "DESCRIPTION",
                "placeholder": "Name",
                "SubmitButtonText": "Save",
                "enterOrganisationName": "Please enter an organisation name"
              },
              "country": {
                "title": "Where is your organisation located?",
                "description": "DESCRIPTION",
                "placeholder": "City",
                "submitButtonText": "Save"
              },
              "description": { 
                "title": "Describe your organisation in a few sentences?",
                "description": "DESCRIPTION",
                "placeholder": "Description",
                "submitButtonText": "Save",
                "maxChars": "The maximum amount of characters allowed is 150."
              },
              "avatar": {
                "title": "Profile Image",
                "description": "Show the World who you are",
                "placeholder": "Uplade Image",
                "submitButtonText": "Uplade Image"
              },
              "deployOrganisation": {
                "notUnlockedKey": "The private key is not unlocked",
                "needFullAccountSetup": "You need a fully set-up circles account to create an organisation."
              }
            }
          }
        }
      },
      "o-dashboard": {
        "atoms": {
          "dashboardHeader": {
            "welcome": "Welcome "
          }
        },
        "pages": {
          "home": {
            "totalCitizens": "Total Citizens",
            "verifiedCitizens": "Verified Citizens",
            "passport": "passport",
            "contacts": "contacts",
            "chat": "chat",
            "banking": "banking",
            "market": "market",
            "verified": "verified"
          },
          "invites": {
            "invites": "Invites",
            "canInvite": "Here are your Codes to invite other people. ",
            "onlyOnce": "Can only be claimed once",
            "canNotInvite1": "In order to be able to invite others, you'll have to get verified.",
            "canNotInvite2": "Once this has been done, you will receive 9 Invites.",
            "canNotInvite3": "As we are currently still in a testing phase, we are verifying new citizens manually.",
            "canNotInvite4": "You can request to be verified in our",
            "discord": "Discord Channel",
            "invitationNotClaimed": "Invitation has not yet been claimed"
          }
        }
      },
      "o-homepage": {
        "atoms": {
          "menu": {
            "chat": "Chat",
            "forum": "Forum",
            "blog": "Blog",
            "whitepaper": "Whitepaper",
            "logIn": "Log in"
          },
          "sidebar": {
            "home": "Home",
            "chat": "Chat",
            "forum": "Forum",
            "blog": "Blog",
            "whitepaper": "Whitepaper",
            "logIn": "Log in"
          }
        },
        "components": {
          "citizenCards": {
            "mostRecentCitizens": "Most recent citizens",
            "showMoreCitizens": "Show more citizens",
            "citizen": "citizen",
            "from": "from",
            "passion1": "my passion is ...",
            "passion2": "... and i will accept every month 240 Circles purusing it"
          },
          "citizens": {
            "totalCitizens": "total citizens"
          },
          "countries": {
            "leaderBoardRanking": "Leaderboard ranking",
            "allOverTheWorld": "All over the World",
            "seeAdvancedCountries": "See whos countries are most progressively advancing the universal basic income economy in their home countries.",
            "country": "Country",
            "citizens": "Citizens",
            "showAllCountries": "Show all countries"
          },
          "dreams": {
            "ourCitizens": "our citizens",
            "followingTheirPassions": "Following their passions",
            "seePassionsOtherCitizens": "See the passion other Circlesland citizens are pursuing, when they receive their universal basic income in Circles",
            "isDreaming": "...is dreaming of 'building the universal basic income economy of tomorrow, building the universal basic income economy'"
          },
          "footer": {
            "beFree": "Be free to live th life you deserve",
            "navigation": "Navigation",
            "home": "Home",
            "citizens": "Citizens",
            "countries": "Countries",
            "milestones": "Milestones",
            "links": "Links",
            "blog": "Blog",
            "forum": "Forum",
            "chat": "Chat",
            "whitepaper": "Whitepaper",
            "social": "Social",
            "termsOfService": "Terms Of Service",
            "dataPrivacy": "Data Privacy",
            "impressum": "Impressum - Legal"
          },
          "introAnimation": {
            "thisIsCirclesLand": "This is CirclesLand",
            "circlesLandunlocks": "CirclesLand is here to unlock all our potential",
            "introducing": "Introducing the next generation of a fully opensource, digital and borderless country-as-a-service platform, starting with Circles a new universal basic income currency to secure our most basic needs.",
            "learnMore": "Learn more"
          },
          "milestones": {
            "citizen": "citizen",
            "reachedOn": "reached on ",
            "citizenToReach": "citizen to reach milestone",
            "showAllMilestones": "show all milestones"
          },
          "mission": {
            "yourPassionIsTheMotor": "Your passion is the motor into a thriving new economy empowering all",
            "byStarting": "By starting to follow your passion and accepting Circles as payment for it, you create your own joyful space towards an eventful, manifold and fulfilled life for everyone."
          },
          "progress": {
            "joinNow": "Join Now"
          },
          "steps": {
            "howDoesItWork": "HOW DOES IT WORK?",
            "becomeCitizen": "Become a citizen of CirclesLand",
            "intoducing": "Introducing the next generation of your 100% opensource, digital and borderless country-as-a-service platform, unlocking your new Circles universal basic income to secure the most basic needs for all of us.",
            "createPassport": "1. Create Passport",
            "createPassportDescription": "While signing up you create a self-sovereign and portable identity passport.",
            "getInvited": "2. Get invited",
            "getinvitedDescription": "To receive your very first personalized Circles you need to get invited by another citizen.",
            "unlockUbi": "3. Unlock UBI",
            "unlockUbiDescription": "Once you got successfully invited, you receive every month universal basic invome in Circles."
          },
          "videoHeader": {
            "beFree": "BE FREE",
            "togetherWeBuild": "Together we build the universal basic income economy today",
            "playVideo": "play video"
          }
        },
        "pages": {
          "imprint": {
            "imprint": "imprint"
          },
          "learn": {
            "youGotUs": "You got us!",
            "excuse1": "We're currently actively working on this.",
            "excuse2": "All Data will be re-set when we launch.",
            "login": "Login"
          },
          "privacy": {
            "youGotUs": "You got us!",
            "excuse1": "We're currently actively working on this.",
            "excuse2": "All Data will be re-set when we launch.",
          }
        }
      },
      "o-maketplace": "",
      "o-onboardeing": "",
      "o-passport": "",
      "o-stats": "",
      "o-verification": ""
    },
    "shared": {}
  }
}