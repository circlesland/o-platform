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
            "amountCircles": "Amount Circles",
            "from": "from",
            "to": "to",
            "ubi": "Universal Basic Income"
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
            "address": "Address",
            "profile": "PROFILE"
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
      "o-marketplace": {
        "atoms": {
          "offerCard": {
            "pickUpOnly": "Store Pick Up Only",
            "details": "Details"
          },
          "transactionItemCard": {
            "sending": "sending"
          }
        },
        "molecules": {
          "checkoutConfirm": {
            "importantInformation": "Important Information",
            "yourPickupCode": "Your Pick-Up Code",
            "howToPickup1": "After your transaction has been completely verified ",
            "howToPickup2": "(wich may take a couple minutes)",
            "howToPickup3": ", you will get a ",
            "howToPickup4": "PickUp Code",
            "howToPickup5": ", wich you will need to ",
            "howToPickup6": "show to the seller",
            "howToPickup7": " when you pick up your Order at the Store.",
            "toSeeCode1": "To see your ",
            "toSeeCode2": "PickUp Code",
            "toSeeCode3": " at any time after the purchase, go to ",
            "toSeeCode4": "My purchases",
            "toSeeCode5": " and click on the Purchase",
            "pickupLocation": "Pick-Up Location for this Order is:"
          },
          "checkoutSummary": {
            "to": "to",
            "paymentPath": "Payment Path",
            "total": "Total:",
            "tax": "19% Sales Tax included:",
            "importantInformation": "Important Information",
            "howToPickup1": "After a successful purchase, we will show you a ",
            "howToPickup2": "PickUp Code",
            "howToPickup3": ", wich you will need to ",
            "howToPickup4": "show to the seller",
            "howToPickup5": " when you pick up your Order at the Store.",
            "toSeeCode1": "To see your ",
            "toSeeCode2": "PickUp Code",
            "toSeeCode3": " at any time after the purchase, go to ",
            "toSeeCode4": "My purchases",
            "toSeeCode5": " and click on the Purchase"
          }
        },
        "pages": {
          "categories": {
            "loadingOffers": "Loading offers...",
            "error": "An error occured while loading the recent activities:",
            "noOffers": "No Offers"
          },
          "categoryDetail": {
            "loadingOffers": "Loading offers...",
            "error": "An error occured while loading the recent activities:",
            "noOffers": "No Offers"
          },
          "myOffers": {
            "loadingOffers": "Loading offers...",
            "error": "An error occured while loading the recent activities:",
            "noOffers": "No Offers"
          },
          "myPurchases": {
            "loadingPurchases": "Loading purchases...",
            "noPurchases": "No purchases",
            "paid": "paid",
            "cancelled": "cancelled",
            "paymentPending": "payment pending",
            "pickupCode": "pick-up code",
            "pickedUp": " picked up "
          },
          "myPurchaseDetail": {
            "chat": "Chat",
            "iPickedUp": "I picked up the order",
            "iHaventPickedUp": "I haven't picked up the order yet",
            "transaction": "Transaction",
            "downloadInvoice": "Download Invoice",
            "purchaseDetails": "Purchase Details",
            "purchaseDate": "Purchase Date: ",
            "loadingPurchases": "Loading purchases...",
            "yourPickupCode": "Your Pick-Up Code",
            "showThisCode": "show this code to the seller when you pick up your Order at the Store.",
            "noCode": "No pickup code yet ..",
            "location": "Pick-Up Location for this Order is:"
          },
          "mySaleDetail": {
            "chat": "Chat",
            "iHandedOut": "I handed out the order",
            "iHaventHandedOut": "I haven't handed out the order yet",
            "transaction": "Transaction",
            "downloadInvoice": "Download Invoice",
            "saleDetails": "Sale Details",
            "saleDate": "Sale Date: ",
            "loadingSales": "Loading sales...",
            "pickupCode": "Pick-Up Code",
            "noCode": "No pickup code yte .."
          },
          "mySales": {
            "loadingSales": "Loading sales...",
            "noSales": "No sales",
            "paid": "paid",
            "cancelled": "cancelled",
            "paymentPending": "payment pending",
            "pickupCode": "pick-up code",
            "pickedUp": " picked up "
          },
          "offerDetail": {
            "loadingOffers": "Loading offers...",
            "error": "An error occured while loading the recent activities:",
            "storePickup": "Store Pick Up at:",
            "location": "Location",
            "addToCart": "Add to Cart",
            "notFound": "Not found"
          },
          "scanPurchase": {
            "verifyingOrder": "verifying Order...",
            "invalitOrderCode": "invalid Order Code, please try a different one.",
            "purchaseMarkedAsDelivered": "Purchase marked as delivered",
            "scanToHandOut": "Scan to hand out purchase",
            "cameraDefault": "Camera: Environment Facing (default)",
            "cameraUserFacing": "Camera: User Facing",
            "detectedQrCode": "Detected QR Code: ",
            "none": "None"
          },
          "shoppingCart": {
            "cart": "Cart",
            "total": "Total:",
            "checkOut": "Check Out",
            "yourCartIsEmpty": "Your cart is empty!",
            "continueShopping": "Continue Shopping"
          }
        },
        "processes": {
          "purchases": {
            "editorContent": {
              "summary": {
                "title": "Check out",
                "description": "Your are about to transfer",
                "placeholder": " ",
                "submitButtonText": "Buy now"
              },
              "success": {
                "title": "Check out successful",
                "description": "Thank you for your purchase.",
                "placeholder": " ",
                "submitButtonText": "Close"
              }
            },
            "createPurchase": {
              "message": "Processing your purchase .."
            },
            "calculatePaths": {
              "message": "Checking transferable circle amount ..",
              "errorMessage": "Your don't have enough trust paths to the following sellers: "
            },
            "pay": {
              "message": "Sending Circles ..",
              "paymentOfInvoice": "Payment of invoice "
            }
          },
          "upsertOffer": {
            "editorContent": {
              "title": {
                "title": "Title",
                "description": "Enter the title of what you are selling. keep it short & sweet.",
                "placeholder": "Title",
                "submitButtonText": "Next"
              },
              "description": {
                "title": "Description",
                "descrption": "Describe your item in detail. Make it sound sexy. Try to make it fit into 500 Characters.",
                "placeholder": "Item description",
                "submitButtonText": "Next"
              },
              "offerLocation": {
                "title": "Item location",
                "description": "Select the City from which this item is being sold.",
                "placeholder": "City",
                "subnitButtonText": "Next"
              },
              "offerCategory": {
                "title": "Select a Category",
                "description": "Choose a category for your listing so it's easier to find.",
                "placeholder": "Category",
                "submitButtonText": "Next"
              },
              "offerUnit": {
                "title": "Select a Unit",
                "descrrption": "Choose a unit for your listing so it's easy to understand the amount.",
                "placeholder": "Unit",
                "submitButtonText": "Next"
              },
              "offerPrice": {
                "title": "Price",
                "description": "Please enter the amount of circles your want for your item.",
                "placeholder": "Price",
                "submitButtonText": "Next"
              },
              "offerUnitAmount": {
                "title": "Amount",
                "description": "Please enter how many of these items you are selling.",
                "placeholder": "e.g. 1",
                "submitButtonText": "Next"
              },
              "offerDelivery": {
                "title": "Delivery",
                "desctiption": "Please choose the delivery method for your offer.",
                "placeholder": " ",
                "submitButtonText": "Next"
              },
              "offerImage": {
                "title": "Add a Picture",
                "description": "Adding a Picture to your offer increases the change of being sold by 90%",
                "placeholder": " ",
                "submitButtonText": "Publish Offer"
              }
            }
          }
        }
      },
      "o-onboarding": {
        "processes": {
          "connectOrCreate": {
            "promptConnectOrCreate": {
              "editorContent": {
                "info": {
                  "title": "Create Safer",
                  "descriptopn": "In the next steps you can create your account on the blockchain ..",
                  "submitButtonText": "Next"
                },
                "connectOrCfreate": {
                  "title": "Connect or create?",
                  "description": "Choose your screnario",
                  "placeholder": " ",
                  "submitButtonText": " "
                }
              },
              "processDefinition": {
                "connectOrCreate": {
                  "options": {
                    "newSafe": "I'm new, create everything for me",
                    "importSafe": "I already have a safe"
                  }
                },
                "newSafe": {
                  "message": "Please wait while we create your Safe on the Blockchain."
                },
                "privateKeyNotUnlocked": "The private key is not unlocked",
                "couldNotUpdate": "Couldn't update the profile with the generated eoa: ${result}",
                "errorWhileDeploying": "An error occured while deploying your safe:",
              }
            }
          },
          "invitation": {
            "buyInvitation": {
              "editorContent": {
                "info": {
                  "title": "Get invited",
                  "description": "Find somebody who can give you an invite code to join.",
                  "submitButtonText": "I have a code"
                },
                "checkInviteCode": {
                  "title": "Enter invitation code",
                  "description": "Please enter you invitation code below to get started.",
                  "submitButtonText": "Verify"
                },
                "dataShcemaRequired": "Please enter a valid invitation code to proceed",
                "couldNotClaimInvitation": "Couldn't claim an invitation: {contextMessages}"
              }
            },
            "promptGetInvited": {
              "editorContent": {
                "info": {
                  "title": "Get Invited",
                  "description": "find somebody who can give you an invite code to join.",
                  "submitButtonText": "I have a code"
                },
                "checkInviteCode": {
                  "title": "Enter invitation code",
                  "description": "Please enter you invitation code below to get started.",
                  "submitButtonText": "Verify"
                }
              },
              "dataSchemaRequired": "Please enter a valid invitation code to proceed.",
              "couldNotClaimInvitation": "Couldn't claim an invitation: {contextMessages}"
            },
            "promptRedeemInvitation": {
              "editorContent": {
                "info": {
                  "title": "Redeem your invitation",
                  "description": "We will now redeem your invitation. This could take a while...",
                  "submitButtonText": "Next"
                },
                "waitUntilRedeemed": {
                  "title": "Please Wait",
                  "description": "Please wait until your invitation transaction got confirmed and try again in a frew seconds.",
                  "submitButtonText": "Try again"
                }
              },
              "redeemInvitation": {
                "message": "Please wait, redeeming your Invitation...",
                "error": "Couldn't redeem an invitation: {contextMessages}",
                "onError": "The following error occurred while redeeming you claimed invitation:"
              },
              "checkIfRedeemed": {
                "notYetRedeemed": "Invitation is not yet redeemed."
              }
            }
          },
          "registration": {
            "promptRegistration": {
              "editorContent": {
                "newsletter": {
                  "title": "Newsletter",
                  "description": "Do you want to subscribe to our monthly newsletter to stay up to date with the developments around the basic income economy?",
                  "placeholder": " ",
                  "submitButtonText": " ",
                }
              },
              "noThanks": "No thanks",
              "yesPlease": "Yes please",

            }
          },
          "unlockKey": {
            "unlockKey": {
              "enterDecryptionPinParams": {
                "title": "Please enter your pin",
                "description": "The pin will be used to decrypt your private key on your device.",
                "placeholder": "Enter Pin",
                "submitButtonText": "Unlock"
              },
              "dataSchemaRequired": "Please enter a encryptingPin to protect your private key.",
              "couldNotDecrypt": "Couldn't decrypt your key. Have you entered the correct pin?"
            }
          },
          "connectSafe": {
            "editorContent": {
              "seedPhrase": {
                "title": "CONNECT RECOVERY CODE",
                "description": "Please enter your 24 secret recovery code (seedphrase) <br /><br /><span class='text-xs'>Your secret recovery code will be stored only in your device</span>",
                "placeholder": "Recovery Code",
                "submitButtonText": "Connectr recovery code"
              },
              "addOwnerInfo": {
                "title": "Add owner to safe",
                "description": "We'll add your new key as owner to your existing safe. Your previous key will stay an owner as well.",
                "placeholder": " ",
                "submitButtonText": "Proceed"
              },
              "accountIsDeadInfo": {
                "title": "Safe deactivated",
                "description": "The selected safe received no UBI for more than 90 days and was deactivated. You can still use your Circles and transfer them to your new safe.",
                "placeholder": " ",
                "submitButtonText": "Create new safe"
              }
            },
            "safeInfoFromSeedphrase": {
              "seedphraseError": "The seedphrase cannot be converted to a private key. Please double check it.",
              "foundNoSafes": "Found no safes with a positive CRC balance that are owned by "
            },
            "selectSafe": {
              "title": "We found multiple safes for your key",
              "description": "Please select the one you want to connect with your circles.land profile",
              "submitButtonText": "Connect",
              "placeholder": " "
            },
            "addNewOwnerInfo": "We will add a new owner to your safe. No worries we keep your old key as owner too.",
            "addNewOwner": "Adding new owner ..",
            "updateRegistration": {
              "importingYourOrganisations": "Importing your organisations ..",
              "addingYouAsAwoner": "Adding you as owner to {orgaName} .."
            },
            "publishEvent": "Updating your profile .."
          },
          "fromCirclesLand": {
            "seedPhraseParams": {
              "label": "Please enter your seedphrase",
              "placeholder": "Seedphrase",
              "submitButtonText": "Store on this device"
            },
            "checkSeedphrase": {
              "errors": {
                "cannotConvertToPrivateKey": "The seedphrase cannot be converted to a private key. Please double check it.",
                "cannotConvertToEthereum": "The key that was generated from the seedphrase cannot be converted to an ethereum account.",
                "errorWhileTryingToFindSafe": "An error occurred while we tried to find your safe: {error}",
                "couldNotFindSafe": "We couldn't find a safe for your account {accountAddress}"
              }
            },
            "chooseSafeAddress": {
              "label": "We found multiple safes for your account. Please select the one you want to connect.",
              "placeholder": "Click to select a safe",
              "submitButtonText": "Connect"
            },
            "checkSafeAddress": {
              "error": "Couldn't determine the owner of safe {addressToCheck}. Is the address right?"
            }
          },
          "loginWithTorus": {
            "loginOptions": {
              "google": {
                "label": "Login with Google"
              },
              "apple": {
                "label": "Login with Apple"
              },
              "github": {
                "label": "Login with Github"
              },
              "email": {
                "label": "Login with E-Mail"
              }
            },
            "showInviteMessage": {
              "title": "Welcome",
              "submitButtonText": "Next",
              "htmlContext": "</b> invited you to CirclesLand.<br/><br/>Click 'Next' to Login",
              "loginButton": "Login"
            },
            "chooseFlowParams": {
              "title": "Welcome to Circles Land",
              "description": "Please choose a sign-in option<br/> <small>By choosing one of the sign-in options you agree to our <a href='https://coda.io/@circlesland/terms' target='_blank' class='link' alt='privacy'>Terms of Service</a>.</small>",
              "placeholder": " ",
              "submitButtonText": " "
            },
            "pleaseWaitWeSigningYouIn": "Please wait, we're Signing you in",
            "enterEncryptionPinParams": {
              "title": "Set a PIN to protect your account",
              "description": "The pin will be used to encrypt your private key on your device. NOTE: This won't help against a sophisticated attacker but prevents casual theft. ",
              "placeholder": "Enter Pin",
              "submitButtonText": "Store private key on this device",
              "stringRequired": "Please enter a pin to protect your private key."
            },
            "enterDecryptionPinParams": {
              "title": "Please enter your pin",
              "description": "The pin will be used to decrypt your private key on your device.",
              "placeholder": "Enter Pin",
              "submitButtonText": "Unlock",
              "stringRequired": "Please enter a encryptingPin to protect your private key"
            },
            "invalidPn": "Invalid Pin"
          }
        }
      },
      "o-passport": {
        "atoms": {
          "accountCard": {
            "secretRecoveryCode": "Secret recovery code"
          }
        },
        "pages": {
          "account": {
            "subTitle": "Main Account holder"
          },
          "exchangeToken": {
            "pleaseWait": "Please wait. We're logging you in."
          },
          "home": {
            "passion": "Passion",
            "noPassionSet": "No passion set.",
            "address": "Address"
          },
          "settings": {
            "notifications": "NOTIFICATIONS",
            "receiveEmailNotifications": "Receive E-Mail Notifications",
            "currencyDisplay": "CURRENCY DISPLAY"
          }
        },
        "processes": {
          "identify": {
            "aquireSession": {
              "authenkticate": {
                "authenticate2": {
                  "strings": {
                    "labelLoginEmail": "Welcome to CirclesLand. <br/><span class='text-base text-light-dark font-normal block mt-3'>A pleasure you found your way here. Please provide your email address to Sign-In</span>",
                    "labelVerificationCode": "Please enter pin<br/><span class='text-base text-light-dark font-normal block mt-3'>We have send you a 6 digit login pin to your mail ${email}.</span><br/><span class='text-light-dark text-xs font-normal'> It may take a moment. Also check your spam folder</span>",
                    "placeholder": "email"
                  },
                  "editorContent": {
                    "email": {
                      "title": "Welcome to CirclesLand",
                      "description": "A pleasure you found your way here. Please provide your email address to Sign-In.",
                      "placeholder": "Email address",
                      "submitButtonText": "Let me in"
                    },
                    "terms_privacy": {
                      "title": "Terms & Privavy",
                      "description": "CirclesLand is built on a blockchain, which by design is a transparent and permanent decentralized database. With your signup you agree that your profile, transactions and friend connections will be irrevocably public.<br/><br/><span class='text-xs'>For details read our <a href='https://blog.circles.land/terms-of-service' class='text-primary' target='_blank' alt='privacy policy & terms of service'>privacy policy & terms of service</a></span>",
                      "submitButtonText": "I read and accept them"
                    },
                    "verification": {
                      "title": "Welcome to CirclesLand",
                      "description": "A pleasure you found your way here. Please provide your email address to Sign-In",
                      "placeholder": "Email address",
                      "submitButtonText": "Let me in"
                    },
                    "code": {
                      "title": "Please enter encryptingPin",
                      "description": "We have send you a 6 digit login encryptingPin to your mail.<br/><br/><span class='text-xs'>It may take a moment. Also check your spam folder.</span>",
                      "placeholder": "Enter Pin",
                      "submitButtonText": "Login"
                    }
                  },
                  "acquireSession": {
                    "message": "Requesting the challenge",
                    "errors": {
                      "contextsPropertyNotSet": "The context's 'eoaAddress' property is not set but required by this step",
                      "privateKeyNotUnlocked": "The private key is not unlocked",
                      "couldNotGetSession": "Couldn't get a session using a signed challenge."
                    }
                  },
                  "errorRequestingChallenge": {
                    "error": "An error occurred while requesting an auth-challenge.",
                    "submitButtonText": "Try again"
                  }
                }
              },
              "acquireSession2": {
                "acquireSession": {
                  "message": "Sarting the session ..",
                  "error": {
                    "contextsPropertyNotSet": "The context's 'eoaAddress' property is not set but required by this step",
                    "privateKeyNotUnlocked": "The private key is not unlocked",
                    "couldNotGetSession": "Couldn't get a session using a signed challenge."
                  },
                  "errorRequestingChallenge": {
                    "error": "An error occurred while requesting an auth-challenge.",
                    "submitButtonText": "Try again"
                  }
                }
              }
            },
            "checks": {
              "hasKey": {
                "error": "Couldn't load the private key from the localStorage."
              }
            },
            "conds": {
              "hasKey": {
                "error": "Couldn't load the private key from the localStorage."
              }
            },
            "connectSafe": {
              "connectSafe2": {
                "editorContemt": {
                  "seedPhrase": {
                    "title": "CONNECT RECOVERY CODE",
                    "description": "Please enter your 24 secret recovery code (seedphrase)<br /><br /><span class='text-xs'>Your secret recovery code will be stored only in your device</span>",
                    "placeholder": "Recovery Code",
                    "submitButtonText": "Connect recovery code"
                  },
                  "selectExistingKey": {
                    "title": "PLEASE CHOOSE A KEY",
                    "description": "We found the some keys on your device. Please select the one you want to use:",
                    "placeholder": "Recovery Code",
                    "submitButtonText": "Use Key"
                  },
                  "unlockPin": {
                    "title": "Please entern encryptingPin",
                    "description": "Please enter the encryptingPin for your key",
                    "placeholder": "Enter Pin",
                    "submitButtonText": "Login"
                  }
                },
                "unlockKeyPin": {
                  "label": "Plase enter the PIN for key '{eoaName}'",
                  "submitButtonText": "Unlock",
                  "dataSchema": "Please enter your one time token."
                },
                "unlockKey": {
                  "errors": {
                    "wtf": "WTF?!",
                    "wrongPin": "Wrong pin?"
                  }
                },
                "checkSeedphrase": {
                  "contextMessage1": "The seedphrase cannot be converted to a private key. Please double check it.",
                  "contextMessage2": "The key that was generated from the seedphrase cannot be converted to an ethereum account.",
                  "contextMessage3": "An error occurred while we tried to find your safe: {error}",
                  "contextMessage4": "We couldn't find a safe for your account {accountAddress}"
                },
                "safeAddress": {
                  "label": "We found multiple safes for your account. Please select the one you want to connect.",
                  "placeholder": "Click to select safe",
                  "submitButtonText": "Connect"
                },
                "checkSafeAddress": {
                  "contextMessage": "Couldn't determine the owner of safe {contextDataSafeAddress}. Is the address right?"
                }
              }
            },
            "createSafe": {
              "createSafe": {
                "strings": {
                  "choiceConnect": "Connect",
                  "choiceCreate": "Create",
                  "labelExportSeedphrase": "Your Secret Recovery Code is the<span class='text-alert'>only key</span> which can access your safe. It is your <span class='text-alert'>full responsibility</span> to <span class='text-alert'>protect</span> this code like a <span class='text-alert'>password</span>.<br /><br /><span class='text-xs'>If you loose it or forget it, all your <span class='text-alert'>money is lost forever</span>.</span>",
                  "buttonExportSeedphrase": "I stored it scurely",
                  "labelCheckSeedphrase": "Keep in mind, everyone who knows your Secret Recovery Code can access all your funds! Did you store your Secret Recovery Code in a password manager or have you written it down on a paper, that you put into a secret place? <strong class='text-primary block mt-3'>Repeat your Secret Recovery Code</strong>",
                  "buttonCheckSeedphrase": "Really, I did it!"
                },
                "editorContent": {
                  "seedphrase": {
                    "title": "READ CAREFULLY<br/>Secret Recovery Code",
                    "description": "Your Secret Recovery Code is the<span class='text-alert'>only key</span>which can access your safe. It is your<span class='text-alert'>full responsibility</span>to<span class='text-alert'>protect</span>this code like a<span class='text-alert'>password</span>.<br /><br /><span class='text-xs'>If you loose it or forget it, all your<span class='text-alert'>money is lost forever</span>.</span>",
                    "submitButtonText": "Next"
                  },
                  "seedphraseCheck": {
                    "title": "SAFE Code SECURELY",
                    "description": "Keep in mind, <span class='text-alert'>everyone who knows</span> your Secret Recovery Code can <span class='text-alert'>access all you money</span>.<br /><br /><span class='text-xs'>Please save your Secret Recovery Code in your notes <span class='text-alert'>(not secure)</span>, a password manager <span class='text-alert'>(secure)</span> or write it down on a paper and put it in your safe <span class='text-alert'>(most secure)</span>.",
                    "submitButtonText": "I stored my Code securely"
                  } 
                },
                "pleaseEnterSecretCode": "Please enter your Secret Recovery Code."
              }
            },
            "identidy2": {
              "strings": {
                "choiceYesLabel": "Connect",
                "choiceNoLabel": "Create New"
              },
              "editorContent": {
                "title": "Connect or Create?",
                "description": "Do you already have a circles Safe address or would you like to create one?"
              },
              "getInvite": {
                "htmlContext": "<section class='mb-8'><div class='w-full px-2 pb-4 -mt-3 bg-white rounded-sm'><div class='px-4 py-2 mr-4 -ml-3 text-center ' /><div style='text-align: center'><p class='w-64 m-auto mt-2 text-2xl font-bold  text-gradient'>You're almost there.</p><p class='mt-4 text'>To activate your citizenship you need to be invited.<br/>Send your profile link to a CirclesLand citizen to unlock your basic income.</p><div class='mt-4 mb-4 text-xs break-all' id='clipboard'><input type='text' class='hidden' value='${profileLink}' /><div class='inline-block text-2xl'><button class='btn btn-primary'>Copy profile Link</button></div><div class='block mt-2 text-sm text-light '>${profileLink}</div></div><p class='text'>If you don't know anybody who has Circles yet, ask nicely in our <a href='https://discord.gg/4DBbRCMnFZ' target='_blank' class='btn-link'>Discord</a> if someone can activate your citizenship.</p><p class='pb-4 mt-4 text-xs text-light'>alternatively, <a href='#/home/become-a-hub' class='btn-link'>unlock yourself</a> and grow a new local community</a></p><div class='mr-1 text-primary' /></div></div></section>",
                "submitButtonText": "Close"
              }
            }
          },
          "invite": {
            "invite": {
              "editorContent": {
                "amount": {
                  "title": "How many invites do you want to send?"
                }
              },
              "promptChoice": {
                "labelOneInvite": "1 invite",
                "labelFiveInvites": "5 invites",
                "labelTwentyfiveInvites": "25 invites"
              }
            }
          },
          "authenticateSso": {
            "couldNotRequestAuthCode": "Couldn't request a delegate authentication code from the api: {error}",
            "couldNotRequestChallenge": "Couldn't request a challenge from the auth-server: {error}",
            "authCodeAlreadyExpired": "The {context} is already expired."
          },
          "logout": {
            "editorContent": {
              "title": "Log out",
              "description": "Please enter your Secret Recovery Code to logout. If you haven't stored your Secret Recovery Code at a safe place yet, do it now and come back again later to log-out.",
              "submitButtonText": "Log out"
            }
          },
          "upsertIdentity": {
            "editorContent": {
              "firstName": {
                "title": "What is your first name?",
                "description": "Welcome, you are finally a citizan of CirclesLand. Glad to have you here.",
                "placeholder": "First Name",
                "submitButtonText": "Save"
              },
              "lastName": {
                "title": "What is your last name?",
                "description": "Display your full name in your profile to become more trust worthy.",
                "placeholder": "Last name",
                "submitButtonText": "Save"
              },
              "deram": {
                "title": "Share you passion",
                "description": "What will you do, create, build or offer to grow the basic income economy and accept Circles as payment for it?",
                "placeholder": "Your passion",
                "submitButtonText": "Start growing"
              },
              "city": {
                "title": "Vote for your City",
                "description": "Advance your city in the basic income ranking and push the political discourse in your area.",
                "placeholder": "Last name",
                "submitButtonText": "Submit vote"
              },
              "imageView": {
                "title": "Profile Image",
                "description": "Show the World who you are",
                "placeholder": "Upload Image",
                "submitButtonText": "Upload Image",
              },
              "newsletter": {
                "title": "Newsletter",
                "description": "Do you want to subscribe to our monthly newsletter to stay up to date with the developments around the basic income economy?"
              }
            },
            "requiredName": "Please enter your first name.",
            "maximumChars": "The maximum amount of characters allowed is 150."
          }
        }
      },
      "o-stats": {
        "pages": {
          "home": {
            "loadingStats": "Loading stats ...",
            "anErrorOccurred": "An error occurred while loading the status:",
            "globalStats": "Global stats",
            "myStats": "My stats",
            "noStats": "No stats"
          }
        }
      },
      "o-verification": {
        "atoms": {
          "verificationCard": {
            "subtitle": "Verified by {name} on {date}"
          }
        },
        "pages": {
          "verificationDetail": {
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
          "verify": {
              "title": "Select the person you want to add",
              "placeholder": "Select",
              "submitButtonText": "Add"
          }
        }
      }
    },
    "shared": {}
  }
} 