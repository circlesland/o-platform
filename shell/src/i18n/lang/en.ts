export const en = {
  en: {
    common: {
      trusted: "trusted",
      untrusted: "untrusted",
      you: "you",
      tokens: "tokens",
      date: "Date",
      from: "from",
      to: "to",
      block: "Block",
      yes: "Yes",
      no: "No",
    },
    dapps: {
      "o-banking": {
        atoms: {
          transferConfirmation: {
            paymentPath: "Payment Path",
            recipientAddress: "Recipient Address",
          },
          transferSummary: {
            paymentPath: "Payment Path",
            amount: "Amount",
            recipientAddress: "Recipient Address",
            transactionHash: "Transaction Hash",
            block: "Block",
          },
        },
        pages: {
          assets: {
            loadingTokens: "Loading Tokens...",
          },
          crcDetail: {
            individualCircles: "Individual Circles",
            loadingTokens: "Loading Tokens...",
          },
          transactionDetail: {
            paymentPath: "Payment Path",
            fullAmountCrc: "Full amount in CRC",
            amountCircles: "Amount Circles",
            from: "from",
            to: "to",
            ubi: "Universal Basic Income",
            transactionHash: "Transaction Hash",
          },
        },
        processes: {
          setTrust: {
            editorContent: {
              recipient: {
                title: "Select the person you want to trust",
                placeholder: "Select",
                submitButtonText: "Set Trust",
              },
              limit: {
                title: "Please enter the Amount",
                submitButtonText: "Submit",
              },
              message: {
                title: "Transfer Message",
                submitButtonText: "Submit",
              },
              confirm: {
                title: "Confirm",
                submitButtonText: "Confirm",
              },
              success: {
                title: "It's Done",
                submitButtonText: "Close",
              },
            },
            checkTrustLimit: {
              contextMessage:
                "'As soon as you trust yourself, you will know how to live.' --Johann Wolfgang von Goethe",
            },
            setTrust: {
              message: "Updating trust ..",
            },
            showSuccess: {
              html: "<p>Trust changed</p>",
            },
            success: {
              return: "yeah!",
            },
          },
          showAssetDetail: {
            success: {
              return: "yeah!",
            },
          },
          showProfile: {
            success: {
              return: "yeah!",
            },
          },
          showTransaction: {
            success: {
              return: "yeah!",
            },
          },
          transfer: {
            strings: {
              labelRecipientAddress: "Select the recipient you want to send money to",
              tokensLabel: "Please enter the amount",
              currencyCircles: "CRC",
              currencyXdai: "xDai",
              summaryLabel: "Summary",
              messageLabel: "Purpose of transfer",
            },
            editorContent: {
              recipient: {
                title: "Select the recipient you want to send money to",
                placeholder: "Recipient",
                submitButtonText: "Enter Name",
              },
              recipientSafeAddress: {
                title: "Enter the recipients safe address",
                description: "Here you can enter the recipients safe address directly.",
                placeholder: "Safe Address",
                submitButtonText: "Next",
              },
              currency: {
                title: "Please enter the amount in Euro",
                submitButtonText: "Submit",
              },
              message: {
                title: "Transfer Message",
                submitButtonText: "Submit",
              },
              confirm: {
                title: "You are about to transfer",
                submitButtonText: "Send Money",
              },
              success: {
                title: "Transfer successful",
                submitButtonText: "Close",
              },
            },
            recipientAddress: {
              submitButtonText: "Check send limit",
            },
            tokens: {
              dataSchema: {
                min: "Please enter at least 0.1",
                typeError: "Please enter a valid number.",
                required: "Please enter a valid amount.",
                positive: "Please enter a valid amount.",
              },
              currency: "Please select a valid currency",
            },
            findMaxFlow: {
              entry: {
                message: "Calculating the maximum transfer amount ..",
              },
              invoke: {
                error: "No recipient address on context",
              },
            },
            findTransferPath: {
              entry: {
                message: "Finding your paths to the payment receiver ..",
              },
              invoke: "Finding your paths to the payment receiver ..",
            },
            checkAmount: {
              contextMessages: "The chosen amount exceeds the maximum transferable amount of ({formattedMax}).",
            },
          },
          transferXdai: {
            entry: {
              message: "Processing xDai transfer ..",
            },
          },
        },
      },
      "o-contacts": {
        atoms: {
          chatListItems: {
            crcHubTransfer: {
              getValues: {
                icon: "cash",
                ifIn: "Sent you",
                ifOut: {
                  youSent: "You sent",
                  to: "to",
                },
              },
            },
            crcTrust: {
              getValues: {
                icon: "shield-check",
                untrustedYou: "untrusted you",
                trustedYou: "trusted you",
                youUntrusted: "You untrusted",
                youTrusted: "You trusted",
              },
            },
            erc20Transfer: {
              getValues: {
                icon: "cash",
                ifIn: {
                  title: {
                    sentYou: "sent you",
                    tokens: "tokens",
                  },
                },
                ifOut: {
                  youSent: "You sent",
                  tokensTo: "tokens to",
                },
              },
            },
            invitationRedeemed: {
              getValues: {
                icon: "shield-check",
                invitationRedeemed: {
                  title: "redeemed your invitation.",
                },
              },
            },
          },
          chatListCard: {
            mutualTrust: "mutual trust",
            trustedByYou: "trusted by you",
            isTrustingYou: "is trusting you",
            notTrusted: "not trusted",
            trusted: "trusted",
            untrusted: "untrusted",
            you: "you",
            You: "You",
            sentYou: "sent you",
            tokens: "tokens",
            token: "token",
            wrote: "wrote:",
            redeemedYourInvitation: "redeemed your invitation",
            invitedYouTo: "invited you to",
            youSent: "You sent",
            youWrote: "You wrote:",
            invitedYouToCirclesLand: "invited you to CirclesLand.",
            youInvited: "You invited",
            to: "to",
          },
          contactCard: {
            mutualTrust: "mutual trust",
            trustedByYou: "trusted by you",
            isTrustingYou: "is trusting you",
            notTrusted: "not trusted",
          },
        },
        pages: {
          chatDetail: {
            mutualTrust: "Mutual trust",
            youTrust: "You trust",
            trustsYou: "trusts you",
            placeholder: "Your Message",
          },
          contacts: {
            loadingContacts: "Loading contacts...",
          },
          profile: {
            mutualTrust: "mutual trust",
            trustedByYou: "trusted by you",
            isTrustingYou: "is trusting you",
            notTrusted: "not trusted",
            verify: "Verify",
            revoke: "Revoke verification",
            accountVerified: "Account verified",
            verifiedClickToRevoke: "Unverify",
            accountVerificationRevoked: "Account verification revoked",
            revokedUppercase: "REVOKED",
            trust: "Trust",
            mutualFriends: "Mutual friends",
            noMutualFriends: "No mutual friends",
            memberAt: "Member at",
            members: "Members",
            verifiedBy: "Verified by",
            passion: "Passion",
            address: "Address",
            profile: "PROFILE",
          },
          chat: {
            loadingConversations: "Loading conversations...",
            error: "An error occurred while loading the recent activities:",
          },
        },
      },
      "o-coop": {
        molecules: {
          switchProfile: "Switch Profile",
        },
        pages: {
          organisationDetail: {
            profile: "PROFILE",
            trust: "Trust",
            isTrustingYou: "is trusting you",
            description: "Description",
            address: "Address",
            members: "Members",
            loading: "...loading",
          },
        },
        processes: {
          addMembers: {
            memberAddress: {
              title: "Select the person you want to add",
              placeholder: "Select",
              submitButtonText: "Add",
            },
          },
          createOrganisations: {
            notLoggedOn: "You're not logged on",
            noEoa: "You have no eoa",
            notUnlockedPrivateKey: "The private key is not unlocked",
            couldNotSend: "Couldn't send the invitation transaction",
            createOrganisationContext: {
              name: {
                title: "What is the name of your organisation?",
                description: "DESCRIPTION",
                placeholder: "Name",
                submitButtonText: "Save",
                enterOrganisationName: "Please enter an organisation name.",
              },
              country: {
                title: "Where is you organisation located?",
                description: "DESCRIPTION",
                placeholder: "City",
                submitButtonText: "Save",
              },
              description: {
                title: "Describe your organisation in a few sentences?",
                description: "DESCRIPTION",
                placeholder: "Description",
                submitButtonText: "Save",
                maximumChars: "The maximum amount of characters allowed is 150.",
              },
              avatar: {
                title: "Profile Image",
                description: "Show the World who you are",
                placeholder: "Upload Image",
                submitButtonText: "Upload Image",
              },
              deployOrganisation: {
                notUnlockedKey: "The private key is not unlocked",
                needFullAccountSetup: "You need a fully set-up circles account to create an organisation.",
              },
              signupOrganisation: {
                notUnlockedKey: "The private key is not unlocked",
              },
            },
            deployOrganisation: {
              progress: "Deploying your organisation.. This can take a moment.",
            },
          },
        },
      },
      "o-dashboard": {
        atoms: {
          dashboardHeader: {
            welcome: "Welcome ",
          },
        },
        pages: {
          home: {
            totalCitizens: "Total Citizens",
            verifiedCitizens: "Verified Citizens",
            passport: "passport",
            tickets: "My tickets",
            contacts: "contacts",
            chat: "chat",
            banking: "banking",
            market: "market",
            verified: "verified",
            gallery: "nft gallery",
          },
          invites: {
            invites: "Invites",
            canInvite: "Here are your Codes to invite other people. ",
            onlyOnce: "Can only be claimed once",
            canNotInvite1: "In order to be able to invite others, you'll have to get verified.",
            canNotInvite2: "Once this has been done, you will receive 9 Invites.",
            canNotInvite3: "As we are currently still in a testing phase, we are verifying new citizens manually.",
            canNotInvite4: "You can request to be verified in our",
            discord: "Discord Channel",
            invitationNotClaimed: "Invitation has not yet been claimed",
          },
        },
      },
      "o-homepage": {
        atoms: {
          menu: {
            chat: "Chat",
            forum: "Forum",
            blog: "Blog",
            whitepaper: "Whitepaper",
            logIn: "Log in",
          },
          sidebar: {
            home: "Home",
            chat: "Chat",
            forum: "Forum",
            blog: "Blog",
            whitepaper: "Whitepaper",
            logIn: "Log in",
          },
        },
        components: {
          citizenCards: {
            mostRecentCitizens: "Most recent citizens",
            showMoreCitizens: "Show more citizens",
            citizen: "citizen",
            from: "from",
            passion1: "my passion is ...",
            passion2: "... and i will accept every month 240 Circles pursuing it",
          },
          citizens: {
            totalCitizens: "total citizens",
          },
          countries: {
            leaderBoardRanking: "Leaderboard ranking",
            allOverTheWorld: "All over the World",
            seeAdvancedCountries:
              "See which countries are most progressively advancing the universal basic income economy.",
            country: "Country",
            citizens: "Citizens",
            showAllCountries: "Show all countries",
          },
          dreams: {
            ourCitizens: "our citizens",
            followingTheirPassions: "Following their passions",
            seePassionsOtherCitizens:
              "See the passion other Circlesland citizens are pursuing, when they receive their universal basic income in Circles",
            isDreaming:
              "...is dreaming of 'building the universal basic income economy of tomorrow, building the universal basic income economy'",
          },
          footer: {
            beFree: "Be free to live th life you deserve",
            navigation: "Navigation",
            home: "Home",
            citizens: "Citizens",
            countries: "Countries",
            milestones: "Milestones",
            links: "Links",
            blog: "Blog",
            forum: "Forum",
            chat: "Chat",
            whitepaper: "Whitepaper",
            social: "Social",
            termsOfService: "Terms Of Service",
            dataPrivacy: "Data Privacy",
            impressum: "Impressum - Legal",
          },
          introAnimation: {
            thisIsCirclesLand: "This is CirclesLand",
            circlesLandUnlocks: "CirclesLand is here to unlock all our potential",
            introducing:
              "Introducing the next generation of a fully opensource, digital and borderless country-as-a-service platform, starting with Circles a new universal basic income currency to secure our most basic needs.",
            learnMore: "Learn more",
          },
          milestones: {
            citizen: "citizen",
            reachedOn: "reached on ",
            citizenToReach: "citizen to reach milestone",
            showAllMilestones: "show all milestones",
          },
          mission: {
            yourPassionIsTheMotor: "Your passion is the motor into a thriving new economy empowering all",
            byStarting:
              "By starting to follow your passion and accepting Circles as payment for it, you create your own joyful space towards an eventful, manifold and fulfilled life for everyone.",
          },
          progress: {
            joinNow: "Join Now",
          },
          steps: {
            howDoesItWork: "HOW DOES IT WORK?",
            becomeCitizen: "Become a citizen of CirclesLand",
            introducing:
              "Introducing the next generation of your 100% opensource, digital and borderless country-as-a-service platform, unlocking your new Circles universal basic income to secure the most basic needs for all of us.",
            createPassport: "1. Create Passport",
            createPassportDescription: "While signing up you create a self-sovereign and portable identity passport.",
            getInvited: "2. Get invited",
            getInvitedDescription:
              "To receive your very first personalized Circles you need to get invited by another citizen.",
            unlockUbi: "3. Unlock UBI",
            unlockUbiDescription:
              "Once you got successfully invited, you receive every month universal basic income in Circles.",
          },
          videoHeader: {
            beFree: "BE FREE",
            togetherWeBuild: "Together we build the universal basic income economy today",
            playVideo: "play video",
          },
        },
        pages: {
          imprint: {
            imprint: "imprint",
          },
          learn: {
            youGotUs: "You got us!",
            excuse1: "We're currently actively working on this.",
            excuse2: "All Data will be re-set when we launch.",
            login: "Login",
          },
          privacy: {
            youGotUs: "You got us!",
            excuse1: "We're currently actively working on this.",
            excuse2: "All Data will be re-set when we launch.",
          },
        },
      },
      "o-marketplace": {
        atoms: {
          offerCard: {
            pickUpOnly: "Store Pick Up Only",
            details: "Details",
          },
          transactionItemCard: {
            sending: "sending",
          },
        },
        molecules: {
          checkoutConfirm: {
            yourPickupCode: "Your Pick-Up Code",
            howToPickup1: "This is your PickUp Code. Show it to the lovely person at our shop to receive your items.",

            toSeeCode1: "To see your ",
            toSeeCode2: "PickUp Code",
            toSeeCode3: " at any time after the purchase, go to ",
            toSeeCode4: "My purchases",
            toSeeCode5: " and click on the Purchase",
            pickupLocation: "You can now go to the counter and show your QR code to pick up your items.",
          },
          checkoutSummary: {
            to: "to",
            paymentPath: "Payment Path",
            total: "Total:",
            tax: "19% Sales Tax included:",
            storePickupLocation: "Store Pick Up Location:",
            storeAddress: "Basic Income Lab GmbH<br/>Reifenstuelstrasse. 6<br/>80469 M??nchen",
            storeHours: "Shop hours: Mo - Fr   14:00 - 20:00",
            toSeeCode1: "To see your ",
            toSeeCode2: "PickUp Code",
            toSeeCode3: " at any time after the purchase, go to ",
            toSeeCode4: "My purchases",
            toSeeCode5: " and click on the Purchase",
          },
        },
        pages: {
          categories: {
            loadingOffers: "Loading offers...",
            error: "An error occurred while loading the recent activities:",
            noOffers: "No Offers",
          },
          categoryDetail: {
            loadingOffers: "Loading offers...",
            error: "An error occurred while loading the recent activities:",
            noOffers: "No Offers",
          },
          myOffers: {
            loadingOffers: "Loading offers...",
            error: "An error occurred while loading the recent activities:",
            noOffers: "No Offers",
          },
          myPurchases: {
            loadingPurchases: "Loading purchases...",
            noPurchases: "No purchases",
            paid: "paid",
            cancelled: "cancelled",
            paymentPending: "payment pending",
            pickupCode: "pick-up code",
            entranceCode: "ticket code",
            pickedUp: " picked up ",
          },
          myPurchaseDetail: {
            chat: "Chat",
            iPickedUp: "I picked up the order",
            iHaventPickedUp: "I haven't picked up the order yet",
            transaction: "Transaction",
            downloadInvoice: "Download Invoice",
            purchaseDetails: "Purchase Details",
            purchaseDate: "Purchase Date: ",
            loadingPurchases: "Loading purchases...",
            yourPickupCode: "Your Pick-Up Code",
            yourPickupNumber: "Your Order-Number:",
            showThisCode: "show this code to the seller when you pick up your Order.",
            noCode: "No pickup code yet ..",
            location: "Pick-Up Location for this Order is:",
          },
          "myTicketDetail": {
            "chat": "Chat",
            "transaction": "Transaction",
            "downloadInvoice": "Download Invoice",
            "purchaseDetails": "Ticket details",
            "purchaseDate": "Purchase Date: ",
            "loadingPurchases": "Loading ticket...",
            "yourPickupCode": "Your ticket code",
            "yourPickupNumber": "Your ticket number:",
            "showThisCode": "show this code on the event's check-in or door.",
            "noCode": "No ticket code yet ..",
            "location": "The location of this event is:"
          },
          mySaleDetail: {
            chat: "Chat",
            iHandedOut: "Confirm Order picked up.",
            iHaventHandedOut: "Order Picked up, click to revert.",
            transaction: "Transaction",
            downloadInvoice: "Download Invoice",
            saleDetails: "Sale Details",
            saleDate: "Sale Date: ",
            loadingSales: "Loading sales...",
            pickupCode: "Pick-Up Code",
            noCode: "No pickup code yte ..",
          },
          mySales: {
            loadingSales: "Loading sales...",
            noSales: "No sales",
            paid: "paid",
            cancelled: "cancelled",
            paymentPending: "payment pending",
            pickupCode: "pick-up code",
            pickedUp: "picked up ",
            notPickedUp: "not picked up ",
          },
          offerDetail: {
            loadingOffers: "Loading offers...",
            error: "An error occurred while loading the recent activities:",
            storePickup: "Store Pick Up at:",
            location: "Location",
            addToCart: "Add to Cart",
            notFound: "Not found",
          },
          scanPurchase: {
            verifyingOrder: "verifying Order...",
            invalidOrderCode: "invalid Order Code, please try a different one.",
            purchaseMarkedAsDelivered: "Purchase marked as delivered",
            scanToHandOut: "Scan to hand out purchase",
            cameraDefault: "Camera: Environment Facing (default)",
            cameraUserFacing: "Camera: User Facing",
            detectedQrCode: "Detected QR Code: ",
            none: "None",
          },
          shoppingCart: {
            cart: "Cart",
            total: "Total:",
            checkOut: "Check Out",
            yourCartIsEmpty: "Your cart is empty!",
            continueShopping: "Continue Shopping",
          },
        },
        functions: {
          liquidity: {
            maxLiquidityToSellerExceeded:
              "Oops, it looks like your balance is not enough to cover this order. <br />Try to remove some items or have a friend send you some circles :)",
          },
        },
        processes: {
          purchases: {
            editorContent: {
              summary: {
                title: "Check out",
                description: "Please review your order",
                submitButtonText: "Buy now",
              },
              success: {
                title: "Check out successful",
                description: "Thank you for your purchase.",
                submitButtonText: "Close",
              },
            },
            createPurchase: {
              message: "Processing your purchase ..",
            },
            calculatePaths: {
              message: "Checking transferable circle amount ..",
              errorMessage: "Your don't have enough trust paths to the following sellers: ",
            },
            pay: {
              message: "Sending Circles ..",
              paymentOfInvoice: "Payment of invoice ",
            },
          },
          upsertOffer: {
            editorContent: {
              title: {
                title: "Title",
                description: "Enter the title of what you are selling. keep it short & sweet.",
                placeholder: "Title",
                submitButtonText: "Next",
              },
              description: {
                title: "Description",
                description:
                  "Describe your item in detail. Make it sound sexy. Try to make it fit into 500 Characters.",
                placeholder: "Item description",
                submitButtonText: "Next",
              },
              offerLocation: {
                title: "Item location",
                description: "Select the City from which this item is being sold.",
                placeholder: "City",
                submitButtonText: "Next",
              },
              offerCategory: {
                title: "Select a Category",
                description: "Choose a category for your listing so it's easier to find.",
                placeholder: "Category",
                submitButtonText: "Next",
              },
              offerUnit: {
                title: "Select a Unit",
                description: "Choose a unit for your listing so it's easy to understand the amount.",
                placeholder: "Unit",
                submitButtonText: "Next",
              },
              offerPrice: {
                title: "Price",
                description: "Please enter the amount of circles your want for your item.",
                placeholder: "Price",
                submitButtonText: "Next",
              },
              offerUnitAmount: {
                title: "Amount",
                description: "Please enter how many of these items you are selling.",
                placeholder: "e.g. 1",
                submitButtonText: "Next",
              },
              offerDelivery: {
                title: "Delivery",
                description: "Please choose the delivery method for your offer.",
                submitButtonText: "Next",
              },
              offerImage: {
                title: "Add a Picture",
                description: "Adding a Picture to your offer increases the change of being sold by 90%",
                submitButtonText: "Publish Offer",
              },
            },
          },
        },
      },
      "o-onboarding": {
        processes: {
          connectOrCreate: {
            promptConnectOrCreate: {
              editorContent: {
                info: {
                  title: "Create Safe",
                  description: "In the next steps you can create your account on the blockchain ..",
                  submitButtonText: "Next",
                },
                connectOrCreate: {
                  title: "Setup your account",
                  description: "Create new or import an existing Circles account?",
                },
              },
              processDefinition: {
                connectOrCreate: {
                  options: {
                    newSafe: "Create new",
                    importSafe: "Import existing",
                  },
                },
                newSafe: {
                  message: "Please wait while we create your Safe on the Blockchain.",
                },
                privateKeyNotUnlocked: "The private key is not unlocked",
                couldNotUpdate: "Couldn't update the profile with the generated eoa: ${result}",
                errorWhileDeploying: "An error occurred while deploying your safe:",
              },
            },
          },
          invitation: {
            buyInvitation: {
              editorContent: {
                info: {
                  title: "Get invited",
                  description: "Find somebody who can give you an invite code to join.",
                  submitButtonText: "I have a code",
                },
                checkInviteCode: {
                  title: "Enter invitation code",
                  description: "Please enter you invitation code below to get started.",
                  submitButtonText: "Verify",
                },
                dataSchemaRequired: "Please enter a valid invitation code to proceed",
                couldNotClaimInvitation: "Couldn't claim an invitation: {contextMessages}",
              },
            },
            promptGetInvited: {
              editorContent: {
                info: {
                  title: "Get Invited",
                  description: "find somebody who can give you an invite code to join.",
                  submitButtonText: "I have a code",
                },
                checkInviteCode: {
                  title: "Enter invitation code",
                  description:
                    "Please enter you invitation code below to get started.<br/>If you get stuck here you can <a href='/#/passport/actions/logout' class='link link-primary'>Log out</a> and try again.",
                  submitButtonText: "Verify",
                },
              },
              dataSchemaRequired: "Please enter a valid invitation code to proceed.",
              couldNotClaimInvitation: "Couldn't claim an invitation: {contextMessages}",
            },
            promptRedeemInvitation: {
              editorContent: {
                info: {
                  title: "Redeem your invitation",
                  description: "We will now redeem your invitation. This could take a while...",
                  submitButtonText: "Next",
                },
                waitUntilRedeemed: {
                  title: "Please Wait",
                  description:
                    "Please wait until your invitation transaction got confirmed and try again in a few seconds.",
                  submitButtonText: "Try again",
                },
              },
              redeemInvitation: {
                message: "Please wait, redeeming your Invitation...",
                error: "Couldn't redeem your invitation. Please reload the page and try again.",
                onError: "The following error occurred while redeeming you claimed invitation:",
              },
              checkIfRedeemed: {
                notYetRedeemed: "Invitation is not yet redeemed.",
              },
            },
          },
          registration: {
            promptRegistration: {
              editorContent: {
                newsletter: {
                  title: "Newsletter",
                  description:
                    "Do you want to subscribe to our monthly newsletter to stay up to date with the developments around the basic income economy?",
                },
              },
              noThanks: "No thanks",
              yesPlease: "Yes please",
            },
          },
          unlockKey: {
            unlockKey: {
              enterDecryptionPinParams: {
                title: "Please enter your pin",
                description: "The pin will be used to decrypt your private key on your device.",
                placeholder: "Enter Pin",
                submitButtonText: "Unlock",
              },
              dataSchemaRequired: "Please enter a encryptingPin to protect your private key.",
              couldNotDecrypt: "Couldn't decrypt your key. Have you entered the correct pin?",
            },
          },
          connectSafe: {
            editorContent: {
              seedPhrase: {
                title: "CONNECT RECOVERY CODE",
                description:
                  "Please enter your 24 secret recovery code (seedphrase) <br /><br /><span class='text-xs'>Your secret recovery code will be stored only in your device</span>",
                placeholder: "Recovery Code",
                submitButtonText: "Connect recovery code",
              },
              addOwnerInfo: {
                title: "Add owner to safe",
                description:
                  "We'll add your new key as owner to your existing safe. Your previous key will stay an owner as well.",
                submitButtonText: "Proceed",
              },
              accountIsDeadInfo: {
                title: "Safe deactivated",
                description:
                  "The selected safe received no UBI for more than 90 days and was deactivated. You can still use your Circles and transfer them to your new safe.",
                submitButtonText: "Create new safe",
              },
            },
            safeInfoFromSeedphrase: {
              seedphraseError: "The seedphrase cannot be converted to a private key. Please double check it.",
              foundNoSafes: "Found no safes with a positive CRC balance that are owned by ",
            },
            selectSafe: {
              title: "We found multiple safes for your key",
              description: "Please select the one you want to connect with your circles.land profile",
              submitButtonText: "Connect",
            },
            addNewOwnerInfo: "We will add a new owner to your safe. No worries we keep your old key as owner too.",
            addNewOwner: "Adding new owner ..",
            updateRegistration: {
              importingYourOrganisations: "Importing your organisations ..",
              addingYouAsOwner: "Adding you as owner to {orgaName} ..",
            },
            publishEvent: "Updating your profile ..",
          },
          fromCirclesLand: {
            seedPhraseParams: {
              label: "Please enter your seedphrase",
              placeholder: "Seedphrase",
              submitButtonText: "Store on this device",
            },
            checkSeedphrase: {
              errors: {
                cannotConvertToPrivateKey:
                  "The seedphrase cannot be converted to a private key. Please double check it.",
                cannotConvertToEthereum:
                  "The key that was generated from the seedphrase cannot be converted to an ethereum account.",
                errorWhileTryingToFindSafe: "An error occurred while we tried to find your safe: {error}",
                couldNotFindSafe: "We couldn't find a safe for your account {accountAddress}",
              },
            },
            chooseSafeAddress: {
              label: "We found multiple safes for your account. Please select the one you want to connect.",
              placeholder: "Click to select a safe",
              submitButtonText: "Connect",
            },
            checkSafeAddress: {
              error: "Couldn't determine the owner of safe {addressToCheck}. Is the address right?",
            },
          },
          loginWithTorus: {
            loginOptions: {
              google: {
                label: "Login with Google",
              },
              apple: {
                label: "Login with Apple",
              },
              github: {
                label: "Login with Github",
              },
              email: {
                label: "Login with E-Mail",
              },
            },
            showInviteMessage: {
              title: "Welcome",
              submitButtonText: "Next",
              htmlContext: "</b> invited you to CirclesLand.<br/><br/>Click 'Next' to Login",
              loginButton: "Login",
            },
            chooseFlowParams: {
              title: "Welcome to Circles Land",
              description:
                "Please choose a sign-in option<br/> <small>By choosing one of the sign-in options you agree to our <a href='https://coda.io/@circlesland/terms' target='_blank' class='link' alt='privacy'>Terms of Service</a>.</small>",
            },
            pleaseWaitWeSigningYouIn: "Please wait, we're Signing you in",
            enterEncryptionPinParams: {
              title: "Set a PIN to protect your account",
              description:
                "The pin will be used to encrypt your private key on your device. NOTE: This won't help against a sophisticated attacker but prevents casual theft. ",
              placeholder: "Enter Pin",
              submitButtonText: "Store private key on this device",
              stringRequired: "Please enter a pin to protect your private key.",
            },
            enterDecryptionPinParams: {
              title: "Please enter your pin",
              description: "The pin will be used to decrypt your private key on your device.",
              placeholder: "Enter Pin",
              submitButtonText: "Unlock",
              stringRequired: "Please enter a encryptingPin to protect your private key",
            },
            invalidPin: "Invalid Pin",
          },
        },
      },
      "o-passport": {
        atoms: {
          accountCard: {
            secretRecoveryCode: "Secret recovery code",
          },
        },
        pages: {
          account: {
            subTitle: "Main Account holder",
          },
          exchangeToken: {
            pleaseWait: "Please wait. We're logging you in.",
          },
          home: {
            passion: "Passion",
            noPassionSet: "No passion set.",
            address: "Blockchain address",
            postAddress: "Post address (only visible to you)",
            qrcode: "Show QR Code to others to be scanned with 'Scan to trust'",
          },
          settings: {
            notifications: "Would you like to receive our Newsletter?",
            emailAddress: "Email Address",
            receiveNewsletter: "Yes",
            currencyDisplay: "CURRENCY DISPLAY",
            settingsSaved: "Settings Saved",
          },
        },
        processes: {
          identify: {
            acquireSession: {
              authenticate: {
                authenticate2: {
                  strings: {
                    labelLoginEmail:
                      "Welcome to CirclesLand. <br/><span class='text-base text-light-dark font-normal block mt-3'>A pleasure you found your way here. Please provide your email address to Sign-In</span>",
                    labelVerificationCode:
                      "Please enter pin<br/><span class='text-base text-light-dark font-normal block mt-3'>We have send you a 6 digit login pin to your mail ${email}.</span><br/><span class='text-light-dark text-xs font-normal'> It may take a moment. Also check your spam folder</span>",
                    placeholder: "email",
                  },
                  editorContent: {
                    email: {
                      title: "Welcome to CirclesLand",
                      description: "A pleasure you found your way here. Please provide your email address to Sign-In.",
                      placeholder: "Email address",
                      submitButtonText: "Let me in",
                    },
                    terms_privacy: {
                      title: "Terms & Privacy",
                      description:
                        "CirclesLand is built on a blockchain, which by design is a transparent and permanent decentralized database. With your signup you agree that your profile, transactions and friend connections will be irrevocably public.<br/><br/><span class='text-xs'>For details read our <a href='https://blog.circles.land/terms-of-service' class='text-primary' target='_blank' alt='privacy policy & terms of service'>privacy policy & terms of service</a></span>",
                      submitButtonText: "I read and accept them",
                    },
                    verification: {
                      title: "Welcome to CirclesLand",
                      description: "A pleasure you found your way here. Please provide your email address to Sign-In",
                      placeholder: "Email address",
                      submitButtonText: "Let me in",
                    },
                    code: {
                      title: "Please enter encryptingPin",
                      description:
                        "We have send you a 6 digit login encryptingPin to your mail.<br/><br/><span class='text-xs'>It may take a moment. Also check your spam folder.</span>",
                      placeholder: "Enter Pin",
                      submitButtonText: "Login",
                    },
                  },
                  acquireSession: {
                    message: "Requesting the challenge",
                    errors: {
                      contextsPropertyNotSet:
                        "The context's 'eoaAddress' property is not set but required by this step",
                      privateKeyNotUnlocked: "The private key is not unlocked",
                      couldNotGetSession: "Couldn't get a session using a signed challenge.",
                    },
                  },
                  errorRequestingChallenge: {
                    error: "An error occurred while requesting an auth-challenge.",
                    submitButtonText: "Try again",
                  },
                },
              },
              acquireSession2: {
                acquireSession: {
                  message: "Starting the session ..",
                  error: {
                    contextsPropertyNotSet: "The context's 'eoaAddress' property is not set but required by this step",
                    privateKeyNotUnlocked: "The private key is not unlocked",
                    couldNotGetSession: "Couldn't get a session using a signed challenge.",
                  },
                  errorRequestingChallenge: {
                    error: "An error occurred while requesting an auth-challenge.",
                    submitButtonText: "Try again",
                  },
                },
              },
            },
            checks: {
              hasKey: {
                error: "Couldn't load the private key from the localStorage.",
              },
            },
            conds: {
              hasKey: {
                error: "Couldn't load the private key from the localStorage.",
              },
            },
            connectSafe: {
              connectSafe2: {
                editorContent: {
                  seedPhrase: {
                    title: "CONNECT RECOVERY CODE",
                    description:
                      "Please enter your 24 secret recovery code (seedphrase)<br /><br /><span class='text-xs'>Your secret recovery code will be stored only in your device</span>",
                    placeholder: "Recovery Code",
                    submitButtonText: "Connect recovery code",
                  },
                  selectExistingKey: {
                    title: "PLEASE CHOOSE A KEY",
                    description: "We found the some keys on your device. Please select the one you want to use:",
                    placeholder: "Recovery Code",
                    submitButtonText: "Use Key",
                  },
                  unlockPin: {
                    title: "Please enter PIN",
                    description: "Please enter the PIN for your key",
                    placeholder: "Enter PIN",
                    submitButtonText: "Login",
                  },
                },
                unlockKeyPin: {
                  label: "Please enter the PIN for key '{eoaName}'",
                  submitButtonText: "Unlock",
                  dataSchema: "Please enter your one time token.",
                },
                unlockKey: {
                  errors: {
                    wtf: "WTF?!",
                    wrongPin: "Wrong pin?",
                  },
                },
                checkSeedphrase: {
                  contextMessage1: "The seedphrase cannot be converted to a private key. Please double check it.",
                  contextMessage2:
                    "The key that was generated from the seedphrase cannot be converted to an ethereum account.",
                  contextMessage3: "An error occurred while we tried to find your safe: {error}",
                  contextMessage4: "We couldn't find a safe for your account {accountAddress}",
                },
                safeAddress: {
                  label: "We found multiple safes for your account. Please select the one you want to connect.",
                  placeholder: "Click to select safe",
                  submitButtonText: "Connect",
                },
                checkSafeAddress: {
                  contextMessage:
                    "Couldn't determine the owner of safe {contextDataSafeAddress}. Is the address right?",
                },
              },
            },
            createSafe: {
              createSafe: {
                strings: {
                  choiceConnect: "Connect",
                  choiceCreate: "Create",
                  labelExportSeedphrase:
                    "Your Secret Recovery Code is the<span class='text-alert'>only key</span> which can access your safe. It is your <span class='text-alert'>full responsibility</span> to <span class='text-alert'>protect</span> this code like a <span class='text-alert'>password</span>.<br /><br /><span class='text-xs'>If you loose it or forget it, all your <span class='text-alert'>money is lost forever</span>.</span>",
                  buttonExportSeedphrase: "I stored it securely",
                  labelCheckSeedphrase:
                    "Keep in mind, everyone who knows your Secret Recovery Code can access all your funds! Did you store your Secret Recovery Code in a password manager or have you written it down on a paper, that you put into a secret place? <strong class='text-primary block mt-3'>Repeat your Secret Recovery Code</strong>",
                  buttonCheckSeedphrase: "Really, I did it!",
                },
                editorContent: {
                  seedphrase: {
                    title: "READ CAREFULLY<br/>Secret Recovery Code",
                    description:
                      "Your Secret Recovery Code is the<span class='text-alert'>only key</span>which can access your safe. It is your<span class='text-alert'>full responsibility</span>to<span class='text-alert'>protect</span>this code like a<span class='text-alert'>password</span>.<br /><br /><span class='text-xs'>If you loose it or forget it, all your<span class='text-alert'>money is lost forever</span>.</span>",
                    submitButtonText: "Next",
                  },
                  seedphraseCheck: {
                    title: "SAFE Code SECURELY",
                    description:
                      "Keep in mind, <span class='text-alert'>everyone who knows</span> your Secret Recovery Code can <span class='text-alert'>access all you money</span>.<br /><br /><span class='text-xs'>Please save your Secret Recovery Code in your notes <span class='text-alert'>(not secure)</span>, a password manager <span class='text-alert'>(secure)</span> or write it down on a paper and put it in your safe <span class='text-alert'>(most secure)</span>.",
                    submitButtonText: "I stored my Code securely",
                  },
                },
                pleaseEnterSecretCode: "Please enter your Secret Recovery Code.",
              },
            },
            identify2: {
              strings: {
                choiceYesLabel: "Connect",
                choiceNoLabel: "Create New",
              },
              editorContent: {
                title: "Connect or Create?",
                description: "Do you already have a circles Safe address or would you like to create one?",
              },
              getInvite: {
                htmlContext:
                  "<section class='mb-8'><div class='w-full px-2 pb-4 -mt-3 bg-white rounded-sm'><div class='px-4 py-2 mr-4 -ml-3 text-center ' /><div style='text-align: center'><p class='w-64 m-auto mt-2 text-2xl font-bold  text-gradient'>You're almost there.</p><p class='mt-4 text'>To activate your citizenship you need to be invited.<br/>Send your profile link to a CirclesLand citizen to unlock your basic income.</p><div class='mt-4 mb-4 text-xs break-all' id='clipboard'><input type='text' class='hidden' value='${profileLink}' /><div class='inline-block text-2xl'><button class='btn btn-primary'>Copy profile Link</button></div><div class='block mt-2 text-sm text-light '>${profileLink}</div></div><p class='text'>If you don't know anybody who has Circles yet, ask nicely in our <a href='https://discord.gg/4DBbRCMnFZ' target='_blank' class='btn-link'>Discord</a> if someone can activate your citizenship.</p><p class='pb-4 mt-4 text-xs text-light'>alternatively, <a href='#/home/become-a-hub' class='btn-link'>unlock yourself</a> and grow a new local community</a></p><div class='mr-1 text-primary' /></div></div></section>",
                submitButtonText: "Close",
              },
            },
          },
          invite: {
            invite: {
              editorContent: {
                amount: {
                  title: "How many invites do you want to send?",
                },
              },
              promptChoice: {
                labelOneInvite: "1 invite",
                labelFiveInvites: "5 invites",
                labelTwentyFiveInvites: "25 invites",
              },
            },
          },
          authenticateSso: {
            couldNotRequestAuthCode: "Couldn't request a delegate authentication code from the api: {error}",
            couldNotRequestChallenge: "Couldn't request a challenge from the auth-server: {error}",
            authCodeAlreadyExpired: "The {context} is already expired.",
          },
          logout: {
            editorContent: {
              title: "Log out",
              description:
                "Please enter your Secret Recovery Code to logout. If you haven't stored your Secret Recovery Code at a safe place yet, do it now and come back again later to log-out.",
              submitButtonText: "Log out",
            },
          },
          upsertIdentity: {
            editorContent: {
              info: {
                title: "your lifetime is precious",
                description:
                  "So we make it count! Your passionate heart generates 24 Circles a day. Welcome to a world where your life time buys goods and services! Enjoy your freedom to spend your time however you want!",
                submitButtonText: "Be free!",
              },
              "mint": {
                "title": "Mint your NFT",
                "description": "Write something nice here ...",
                "submitButtonText": "Do it!"
              },
              firstName: {
                title: "What is your first name?",
                description: "Hello you beautiful creature!",
                placeholder: "First Name",
                submitButtonText: "Save",
              },
              lastName: {
                title: "What is your last name?",
                description: "And may I change it to mine?",
                placeholder: "Last name",
                submitButtonText: "Save",
              },
              dream: {
                title: "Share your passion",
                description: "What will you do different in your life with a monthly basic income?",
                placeholder: "I will ...",
                submitButtonText: "Save",
              },
              city: {
                title: "Where do you live?",
                description: "You are adding splendor to your city!",
                placeholder: "Last name",
                submitButtonText: "Save",
              },
              emailAddress: {
                title: "how can we reach you?",
                description: "You will only receive love letters and other unimportant stuff from us!",
                placeholder: "your@emailaddress.net",
                submitButtonText: "Beam me up!",
              },
              imageView: {
                title: "Profile Image",
                description: "Show the world who you are",
                placeholder: "Upload image",
                submitButtonText: "Save image",
              },
              newsletter: {
                title: "Subscribe to news?",
                description: "We are spilling the tea about wild parties and hot new products, interested?",
              },
            },
            requiredName: "Please enter your first name.",
            maximumChars: "The maximum amount of characters allowed is 150.",
          },
        },
      },
      "o-stats": {
        pages: {
          home: {
            loadingStats: "Loading stats ...",
            anErrorOccurred: "An error occurred while loading the status:",
            globalStats: "Global stats",
            myStats: "My stats",
            noStats: "No stats",
          },
        },
      },
      "o-verification": {
        atoms: {
          verificationCard: {
            subtitle: "Verified by {name} on {date}",
          },
        },
        pages: {
          verificationDetail: {
            profile: "PROFILE",
            trust: "Trust",
            isTrustingYou: "is trusting you",
            description: "Description",
            address: "Address",
            members: "Members",
            loading: "...loading",
          },
        },
        processes: {
          verify: {
            title: "Select the person you want to add",
            placeholder: "Select",
            submitButtonText: "Add",
          },
        },
      },
    },
    shared: {
      api: {
        loadProfileByProfileId: {
          error: "Couldn't find a profile with id '{profileId}'.",
        },
        promptFile: {
          saveImage: "Save Image",
          pleaseSpecifyValidFile: "Please specify a valid file.",
          uploadingFile: "Uploading your file ..",
          contextDataErrorUploadFile:
            "<b>Oops.</b><br/>We couldn't upload your file.<br/><br/>Please make sure that your file doesn't exceed the maximum allowed file size of 4 MB.<br/>Either choose a different file or skip it for now.",
          tryAgain: "Try again",
        },
        uploadFile: {
          noOkStatusFromFileServer: "Got a not-ok status from the file server: {status}",
          couldNotUpload: "Couldn't upload the file",
        },
      },
      atoms: {
        copyClipboard: {
          copiedToClipboard: "Copied to Clipboard!",
        },
        error: {
          processEncounteredAnError: "The Process encountered an error",
          noErrorDetailsAvailable: " No error details available. See the console for more details.",
          pleaseTryToReload: "Please try to reload the page or contact us on Discord ",
          ifTheProblemPersists: " if the problem persists",
        },
        facetec: {
          enrollmentProcess: {
            sessionWasNotCompleted: "Session was not completed successfully, cancelling.  Session Status: ",
            noSessionId: "No sessionId",
            unexpectedApiResponse: "Unexpected API response, cancelling out.",
            noSessionResult: "No _sessionResult.",
          },
        },
      },
      molecules: {
        lists: {
          eventList: {
            loading: "Loading...",
          },
          list: {
            loading: "Loading...",
          },
        },
        nextNav: {
          components: {
            loginPill: {
              signInNow: "SIGN IN NOW",
            },
          },
        },
        select: {
          virtualList: {
            missingTemplate: "Missing template",
          },
        },
        dappFrame: {
          errors: {
            pageFromBackStackNotFound: "The page from the back stack couldn't be found: {error}",
            pageFromBackStackIsNoPage: "The page from the back stack is not a page: {error}",
            couldNotFindRoot: "Couldn't find the root. Stack item was: {item}",
            couldNotFindParams: "Couldn't find a routable for params: \\n{params}",
          },
        },
        filterList: {
          home: "Home",
          logout: "Logout",
        },
        processContainer: {
          editorContent: {
            title: "Do you really want to cancel?",
          },
          yes: "Yes",
          no: "No",
          error: "Can only sink evens in response to a previously bubbled event.",
          cancel: "Cancel",
        },
        processNav: {
          close: "Close",
        },
        prompt: {
          nothingToDisplay:
            "Hmm... Nothing to display here. Seems like the 'prompt' attribute of the Prompt.svelte component is not set.",
        },
        text: {
          noText: ">> No Text <<",
        },
        notificationViewer: {
          molecules: {
            genericEventCard: {
              title: "Error: Couldn't find a view for event type '{eventType}'.",
              subTitle: "...but look on the bright side: we're all healthy :)",
            },
            notificationProfile: {
              passion: "Passion",
            },
            notificationViewChatMessage: {
              from: "from",
            },
            notificationViewInvitationRedeemed: {
              acceptedYourInvitation: "Accepted your invitation to Circles.Land",
            },
            notificationViewMembershipAccepted: {
              acceptedYourInvitation: "Accepted your invitation to",
            },
            notificationViewMembershipOffer: {
              invitedYouTo: "invited you to",
            },
            notificationViewMutualFriends: {
              error: "no Data...",
              loadingMutualFriends: "...loading mutual Friends",
              mutualFriends: "Mutual Friends",
              noMutualFriends: "No mutual Friends.",
            },
            notificationViewTransfer: {
              from: "from",
            },
            notificationViewTrust: {
              hasRemovedTheirTrustToYou: " has removed their trust to you.",
              isTrustingYouNow: " is trusting you now.",
            },
            notificationViewUbi: {
              caChing: "Ca-ching!",
            },
            notificationViewWelcome: {
              welcomeToCirclesLand: "Welcome to CirclesLand",
              duSchoenerMensch: "du sch??ner Mensch",
            },
          },
        },
      },
      functions: {
        generateNavManifest: {
          back: "back",
          skip: "skip",
        },
      },
      pages: {
        notFound: {
          notfound: "404.",
          sorryCouldNotFindPage: "Sorry, we couldn't find this page.",
          doNotWorry:
            "Don't worry, sometimes even we make mistakes. You can find plenty of other things on our homepage.",
          backToHome: "Back to Home",
        },
      },
      pathfinder: {
        app: {
          visualizingFlowOf: "Visualizing flow of {flow}",
        },
        circlesTransferFinder: {
          showNow: "Show now",
        },
      },
      processes: {
        showNotifications: {
          strings: {
            crcHubTransfer: "Received",
            crcTrust: "New trust",
            crc_untrust: "Trust removed",
            chatMessage: "New Message",
            crcMinting: "Received new Basic Income",
            membershipOffer: "Invitation to Organisation",
            membershipAccepted: "Invitation Accepted",
          },
          editorContent: {
            title: "What is you first name?",
            submitButtonText: "OK",
          },
          submitButtonText: "Got it",
          yeah: "yeah!",
        },
      },
      stores: {
        purchases: {
          errors: {
            couldNotComplete: "Couldn't complete the purchase.",
            couldNotRevoke: "Couldn't revoke the completion status.",
          },
        },
        sales: {
          errors: {
            couldNotComplete: "Couldn't complete the sale.",
            couldNotRevoke: "Couldn't revoke the completion status.",
          },
        },
        transactions: {
          errors: {
            couldNotLoadData: "Couldn't load data for the following reasons: {error}",
          },
        },
      },
      apiConnection: {
        errors: {
          couldNotFindType: "Couldn't fine the {type} in the query result.",
          noOrMoreThanOneDefinitions:
            "The query contains none or more than one definition. Only 1 definition per query is supported.",
          noSelectionSet: "The query definition doesn't contain a 'selectionSet'.",
          noOrMoreThanOneSelection:
            "The query definition contains none or more than one selection. Only 1 selection is supported.",
          selectionHasNoName:
            "The selection doesn't have a name. Cannot find the data-holding property of the graphql response.",
          someThingWentWrong: "{error}",
          returnedFragmentDefinitionNode:
            "A FragmentDefinitionNode was returned when a OperationDefinitionNode was expected.",
        },
      },
      currency: {
        errors: {
          argumentMissing: "argument missing: amount",
        },
      },
      notificationViewer: {
        answer: "Answer",
        sayThanks: "Say Thanks",
        trust: "Trust {profile}",
        ok: "OK",
      },
      ubiTimer2: {
        errors: {
          couldNotLoadYourProfile: "Couldn't load your profile",
          yourPrivateKeyIsLocked: "Your private key is locked.",
          cannotGetUbi: "Cannot get the ubi. The context.tokenAddress is empty.",
        },
      },
      userActions: {
        errors: {
          couldNotLoadYourProfile: "Couldn't load your profile",
        },
        chat: "Chat",
        sendMoney: "Send Money",
        untrust: "Untrust",
        trust: "Trust",
      },
    },
  },
};
