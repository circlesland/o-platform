<script lang="ts">
import TopNav from "../../../shared/atoms/TopNav.svelte";
import { RuntimeDapp } from "@o-platform/o-interfaces/dist/runtimeDapp";

export let runtimeDapp: RuntimeDapp<any>;
export let routable: RuntimeDapp<any>;
</script>

<TopNav runtimeDapp="{runtimeDapp}" routable="{routable}" />

<div class="pb-20 mx-auto mt-20 md:w-2/3 xl:w-1/2">
  <h1 class="text-4xl">Terms of Service</h1>
  <h2 class="text-stone-500">Last updated: August 2022</h2>
  <p class="mt-6">
    Welcome to Circlesland, please read these Terms carefully before using our Platform. <br />The platform gives an
    understanding about how you can use the universal basic income currency Circles, and how you can participate in this
    community-based basic income protocol. Please use with caution, as this version of circles.land has been identified
    as Beta Software. <br /><br />The purpose of releasing Beta software is to solicit feedback and help us to test new
    features or changes to existing features for a future production releases.<br /><br /> We have no obligation to you
    to further develop or publicly release the Beta Software since some aspects of a particular Beta release may or may
    not be suitable for commercial. If requested buy us, you may provide feedback to a Persona regarding testing and use
    of the Beta Software, including error or bug reports. <br />You agree to grant us a perpetual, non-exclusive,
    royalty free, worldwide license to use, copy, distribute, make derivative works and incorporate your feedback into
    any of our products at our sole discretion.
  </p>

  <h2 class="mt-6 text-2xl">§1 Who we are and how to contact us</h2>
  <ol style="list-style-type:lower-alpha" class="p-2 pl-8">
    <li>
      Circlesland is operated by the Gnosis Limited (”we” or “us”), incorporated in Gibraltar with its registered
      address at World Trade Center, 6 Bayside Rd, Gibraltar. For more information about us, see the Contact Us section
      of this policy.
    </li>
    <li>
      We use open source products and developer materials from various organizations, affiliated persons and entities
      (“Affiliates”) as well as other third parties to provide a Platform to the CirclesUBI Protocol (the “Protocol”).
      The provision of the Platform and the Protocol is based solely on our independent actions.
    </li>
  </ol>

  <h2 class="mt-6 text-2xl">§2 We provide a platform to interact with the CirclesUBI protocol</h2>
  <ol style="list-style-type:lower-alpha" class="p-2 pl-8">
    <li>
      We provide a graphical user interface (the “Platform” or “Portal”) to facilitate you interacting with the
      Protocol.
    </li>
    <li>
      The Protocol was developed by various opensource developers and organisations around the world and is governed by
      smart contracts that allow the creation and minting of CirclesUBI, permissionless peer-to-peer transactions
      between users without the need for intermediaries on the Gnosis Blockchain. We are not a custodian or a
      counterparty to any transactions executed by you on the Protocol. We do not support any other service,
      particularly we do not provide any order matching, guaranteed prices, or similar exchange or trading platform
      services.
    </li>
  </ol>
  <h2 class="mt-6 text-2xl">§3 By using our platform, you accept these terms</h2>
  <ol style="list-style-type:lower-alpha" class="p-2 pl-8">
    <li>
      These are the general terms and conditions ("Terms") that apply to the use of our Platform and the Protocol.
    </li>
    <li>
      By using our Platform, you confirm that you (1) accept and agree to these Terms and that you agree to comply with
      them. If you do not agree, you must not use our Platform.
    </li>
    <li>
      You are responsible for ensuring that all persons who access or use our Platform through your device or internet
      connection are aware of these Terms, and that they comply with them.
    </li>
    <li>
      We may amend these Terms at our sole discretion. We regularly do so. Every time you wish to use our Platform,
      please check these Terms to ensure you understand the terms that apply at that time.
    </li>
    <li>
      We may terminate or suspend your access to our Platform immediately, without prior notice or liability, if you
      breach any clause of the Terms. Upon termination of your access, your right to use the Platform will immediately
      cease. Clauses 7 to 22 and any other term intended so will survive any termination of these Terms.
    </li>
    <li>
      You may have been recommended to the Platform by a third party. We shall not be liable for any agreement or terms
      that may exist between you and the respective third party.
    </li>
    <li>
      By using our platform your agree to our Privacy Policy which you can read here
      https://coda.io/@circlesland/terms/privacy-policy-3. If you do not agree to our Privacy Policy, you are not
      authorized to access or use the Portal.
    </li>
    <li>
      In addition to the foregoing, you also represent and warrant that you are not a citizen or resident of a state,
      country, territory or other jurisdiction where your use of the Portal or the Services would be illegal or
      otherwise violate any applicable law.
    </li>
  </ol>
  <h2 class="mt-6 text-2xl">§4 What you require to use our platform</h2>
  <ol style="list-style-type:lower-alpha" class="p-2 pl-8">
    <li>
      Users may use our Platform to interact with the Protocol and create, mint, trade, buy or sell ERC 20 tokens by
      singing up, getting invited or making transactions running on the Protocol.
    </li>
    <li>
      To use the Platform you require:
      <ol style="list-style-type:lower-roman" class="p-2 pl-8">
        <li>A wallet compatible with the Gnosis Blockchain.</li>
        <li>
          Sufficient xDai in your Wallet, to pay for transactions fees, which are incurred through the Protocol on the
          Gnosis Chain. You will be able to receive xDai through invites from existing platform users.
        </li>
      </ol>
    </li>
  </ol>
  <h2 class="mt-6 text-2xl">§5 No fees levied by us</h2>
  <ol style="list-style-type:lower-alpha" class="p-2 pl-8">
    1. We do not currently levy any fees on users of our Platform but this may change in the future. 2. Users
    interacting with the Gnosis Chain will incur transaction costs. Transaction costs are independent of the Platform
    and go to validating nodes processing the transaction on the networks. We have no control over and do not set the
    transaction costs, and do not benefit from them. The Platform does not change the default suggestion of your wallet
    provider. Users may be able to change the default transaction fee price within their wallet, depending on the wallet
    used.
  </ol>
  <h2 class="mt-6 text-2xl">§6 We may make changes to or suspend or withdraw our platform</h2>
  <ol style="list-style-type:lower-alpha" class="p-2 pl-8">
    <li>
      We may update and change our Platform from time to time. Our Platform is currently made available free of charge.
      We do not guarantee that our Platform will always be available or be uninterrupted or be free of charge. We may
      suspend or withdraw or restrict the availability of all or any part of our Platform for business, operational or
      regulatory reasons at 1-day’s notice or, in case of Force Majeure in accordance with clause 6b, at no notice.
    </li>
    <li>
      Force Majeure shall mean any event, circumstance or cause beyond our reasonable control, which makes the provision
      of our Platform impossible or onerous, including, without limitation:
      <ol style="list-style-type:lower-roman" class="p-2 pl-8">
        <li>acts of God, flood, storm, drought, earthquake or other natural disaster;</li>
        <li>epidemic or pandemic;</li>
        <li>
          terrorist attack, civil war, civil commotion or riots, war, threat of or preparation for war, armed conflict,
          imposition of sanctions, embargo, or breaking off of diplomatic relations;
        </li>
        <li>nuclear, chemical or biological contamination;</li>
        <li>
          any law or any action taken by a government or public authority, including without limitation imposing a
          prohibition, or failing to grant a necessary licence or consent;
        </li>
        <li>collapse of buildings, breakdown of plant or machinery, fire, explosion or accident; and</li>
        <li>strike, industrial action or lockout.</li>
      </ol>
    </li>
    <li>
      You are also responsible for ensuring that all persons who access our Platform through your internet connection
      are aware of these Terms and that they comply with them.
    </li>
  </ol>
  <h2 class="mt-6 text-2xl">§7 You are reponsible to secure your cryptographic assets, we do not take custody</h2>
  <ol style="list-style-type:lower-alpha" class="p-2 pl-8">
    <li>You must control the wallet you use in connection with our Platform.</li>
    <li>
      You are responsible for implementing all appropriate measures for securing the wallet you use for the Platform,
      including any private key(s), seed words or other credentials necessary to access such storage mechanism(s). By
      using our Platform, we do not gain custody of any of your private keys.
    </li>
    <li>
      We shall not be responsible for any security measures relating to the wallet you use for the Platform and exclude
      (to the fullest extent permitted under applicable law) any and all liability for any security breaches or other
      acts or omissions, which result in your loss of access or custody of any cryptographic assets stored thereon.
    </li>
  </ol>
  <h2 class="mt-6 text-2xl">§8 You are responsible for and determine your tax</h2>
  <ol style="list-style-type:lower-alpha" class="p-2 pl-8">
    <li>
      You are solely responsible to determine if your use of the Platform has tax implications for you. By using the
      Platform you agree not to hold us liable for any tax liability you incur arising out of or associated with your
      usage of the Platform or any other action or transaction related thereto.
    </li>
  </ol>
  <h2 class="mt-6 text-2xl">§9 Information on the platform are not advice</h2>
  <ol style="list-style-type:lower-alpha" class="p-2 pl-8">
    <li>
      None of the information available on our Platform, or made otherwise available to you in relation to its use,
      constitutes any legal, tax, financial or other advice. When in doubt as to the action you should take, you should
      consult your legal, financial, tax or other professional advisors.
    </li>
  </ol>
  <h2 class="mt-6 text-2xl">§10 Our intellectual property rights are reserved</h2>
  <ol style="list-style-type:lower-alpha" class="p-2 pl-8">
    <li>
      Subject to the application of the AGNU Affero General Public License v3.0 to the software code of the Platform, we
      are the owner or the licensee of all intellectual property rights of the Platform. Those works are protected by
      intellectual property laws and treaties around the world. All such rights are reserved.
    </li>
    <li>
      Subject to your compliance with these Terms, we grant you a limited, revocable, non-exclusive, non-transferable,
      non-sublicensable licence to access the Platform. This licence does not include any resale, commercial or
      derivative use of our Platform. We reserve and retain all rights not expressly granted to you in these Terms. The
      Platform may not be reproduced, sold, or otherwise exploited for any commercial purpose without our express prior
      written consent. You may not frame or utilize framing techniques to enclose any trademark, logo, or other
      proprietary information of us without our express prior written consent. You may not misuse the Platform and may
      only use it as permitted by law. If you breach our intellectual property rights in violation of these Terms, your
      license to use our Platform will automatically be revoked and terminated immediately.
    </li>
  </ol>
  <h2 class="mt-6 text-2xl">§11 We are not responsible for any bugs and you must not introduce them</h2>
  <ol style="list-style-type:lower-alpha" class="p-2 pl-8">
    <li>We do not guarantee that our Platform will be secure or free from bugs or viruses.</li>
    <li>
      You are responsible for configuring your information technology and computer programmes to access our Platform.
      You should use your own virus protection software.
    </li>
    <li>
      You must not misuse our Platform by knowingly introducing material that is malicious or technologically harmful.
      You must not attempt to gain unauthorised access to our Platform, any server on which our Platform may be stored,
      computer or database connected to our Platform. You must not attack our Platform via a denial-of-service attack or
      a distributed denial-of service attack. By breaching this provision, you would commit a criminal offence. We will
      report any such breach to the relevant law enforcement authorities and we will cooperate with those authorities,
      including, where possible, by disclosing your identity to them. In the event of such a breach, your right to use
      our Platform will cease immediately.
    </li>
  </ol>
  <h2 class="mt-6 text-2xl">§12 Rules about you linking to our platform</h2>
  <ol style="list-style-type:lower-alpha" class="p-2 pl-8">
    <li>
      You may link to our Platform, provided you do so in a way that is fair and legal and does not damage our
      reputation or take advantage of it. You must not establish a link in such a way as to suggest any form of
      association, approval or endorsement on our part where none exists. You must not establish a link to our Platform
      in any website without the website’s authorisation.
    </li>
    <li>
      The website in which you are linking must comply in all respects with the content standards set out in these
      Terms.
    </li>
  </ol>
  <h2 class="mt-6 text-2xl">§13 Your warranties and representations to us</h2>
  <ol style="list-style-type:lower-alpha" class="p-2 pl-8">
    <li>
      By using our Platform you hereby agree, represent and warrant that:
      <ol style="list-style-type:lower-roman" class="p-2 pl-8">
        <li>you have read and understood the Terms and agree to be bound by them;</li>
        <li>
          you do not rely on, and shall have no remedies in respect of, any statement, representation, assurance or
          warranty (whether made innocently or negligently) that is not set out in these Terms;
        </li>
        <li>
          you have reached the legal age of majority applicable to you and you agree to provide legitimate and lawful
          documentation proving such status if we so request;
        </li>
        <li>
          your usage of our Platform is legal under the laws of your jurisdiction or under the laws of any other
          jurisdiction to which you may be subject;
        </li>
        <li>
          you understand the functionality, usage, storage, transmission mechanisms and intricacies associated with
          cryptographic assets, token storage facilities (including wallets), blockchain technology and blockchain-based
          software systems;
        </li>
        <li>
          you understand that transactions on the Ethereum mainnet, the Gnosis Blockchain and Ethereum Virtual Machine
          compatible validation mechanisms are irreversible and may not be erased and that your wallet address and any
          transaction is displayed permanently and publicly and that you relinquish any right of rectification or
          erasure of personal data;
        </li>
        <li>
          you shall comply with any applicable tax obligations in your jurisdiction arising from your use of the
          Platform;
        </li>
        <li>
          you shall not misuse or gain unauthorised access to our Platform by knowingly introducing viruses, Trojan
          horses, worms, time-bombs, keystroke loggers, spyware, adware or any other harmful programs or similar
          computer code designed to adversely affect our Platform and that in the event you do so or otherwise attack
          our Platform, we report any such activity to the relevant law enforcement authorities;
        </li>
        <li>
          you shall not access without authority, interfere with, damage or disrupt any part of our Platform, any
          equipment or network on which our Platform is stored, any software used in the provision of our Platform or
          any equipment or network or software owned or used by any third party;
        </li>
        <li>
          you shall not use our Platform for activities that are unlawful or fraudulent or have such purpose or effect
          or otherwise support any activities that breach applicable local, national or international law or
          regulations;
        </li>
        <li>
          you shall not use our Platform to trade cryptographic assets that are proceeds of criminal or fraudulent
          activity;
        </li>
        <li>
          the Platform, Protocol, the Ethereum and Gnosis Blockchain and Ethereum Virtual Machine compatible validation
          mechanisms are in an early development stage and we accordingly do not guarantee an error-free process and
          give no price or liquidity guarantee;
        </li>
        <li>you are using the Platform at your own risk;</li>
        <li>
          the risks of using the Platform are substantial and include, but are not limited to, the ones set out in the
          APPENDIX, which is hereby expressly incorporated into these Terms, and you are willing to accept the risk of
          loss associated therewith.
        </li>
      </ol>
    </li>
  </ol>
  <h2 class="mt-6 text-2xl">§14 Your indemnification and liability to us</h2>
  <ol style="list-style-type:lower-alpha" class="p-2 pl-8">
    <li>
      You agree to release and indemnify, defend and hold us and any of our Affiliates harmless, as well as any members,
      participants, directors, officers, employees, contractors, shareholders and representatives of any of the
      foregoing, from and against any and all losses, liabilities, damages, costs claims or actions of any kind arising
      or resulting from your use of our Platform, your breach of these Terms, and any of your acts or omissions that
      infringe the rights of any person.
    </li>
    <li>
      We reserve the right, at our own expense, to assume exclusive defence and control of any matter otherwise subject
      to indemnification by you and, in such case, you agree to cooperate with us in the defence of such matter.
    </li>
    <li>
      The indemnity set out here is in addition to, and not in lieu of, any other remedies that may be available to us
      under applicable law.
    </li>
  </ol>
  <h2 class="mt-6 text-2xl">§15 Our liability for loss suffered by you is limited</h2>
  <ol style="list-style-type:lower-alpha" class="p-2 pl-8">
    <li>
      We do not exclude or limit our liability to you where it would be unlawful to do so. This includes liability for
      death or personal injury caused by our negligence or fraud.
    </li>
    <li>
      YOU USE THIS PLATFORM AT YOUR OWN RISK AND YOU ASSUME FULL RESPONSIBILITY FOR SUCH USE. TO THE MAXIMUM EXTENT
      PERMITTED BY APPLICABLE LAW, WE EXCLUDE ALL IMPLIED CONDITIONS, WARRANTIES, REPRESENTATIONS OR OTHER TERMS THAT
      MAY APPLY TO OUR PLATFORM OR ANY OTHER CONTENT ON OUR INTERFACE. WE WILL NOT BE LIABLE TO YOU FOR ANY LOSS OR
      DAMAGE, WHETHER IN CONTRACT, TORT (INCLUDING NEGLIGENCE), BREACH OF STATUTORY DUTY, OR OTHERWISE, EVEN IF
      FORESEEABLE, ARISING UNDER OR IN CONNECTION WITH THE USE OF, OR INABILITY TO USE, OUR PLATFORM; OR THE USE OF OR
      RELIANCE ON ANY CONTENT DISPLAYED ON OUR PLATFORM. WE WILL NOT BE LIABLE FOR LOSS OF PROFITS, SALES, BUSINESS, OR
      REVENUE, BUSINESS INTERRUPTION, ANTICIPATED SAVINGS, BUSINESS OPPORTUNITY, GOODWILL OR REPUTATION OR ANY INDIRECT
      OR CONSEQUENTIAL LOSS OR DAMAGE.
    </li>
  </ol>
  <h2 class="mt-6 text-2xl">§16 How to resolve complaints and disputes</h2>
  <ol style="list-style-type:lower-alpha" class="p-2 pl-8">
    <li>
      If an alleged breach, controversy, claim, dispute or difference arises out of or in connection with the present
      Terms between you and us (a “Dispute”), you agree to seek to resolve the matter with us amicably by referring the
      matter to Circlesland at info@gnosis.io with a detailed description, the date and time the issue arose, your
      handle to contact you on and the outcome you are seeking.
    </li>
    <li>Your right to take legal action remains unaffected by the existence or use of this complaints procedure.</li>
  </ol>
  <h2 class="mt-6 text-2xl">§17 Dispute resolution</h2>
  <ol style="list-style-type:lower-alpha" class="p-2 pl-8">
    <li>
      YOU AGREE AND UNDERSTAND THAT BY ENTERING INTO THIS AGREEMENT, YOU EXPRESSLY WAIVE ANY RIGHT, IF ANY, TO A TRIAL
      BY JURY AND RIGHT TO PARTICIPATE IN A CLASS ACTION LAWSUIT.
    </li>
    <li>
      In the event a Dispute cannot be resolved amicably in accordance with clause 16, you must first refer the Dispute
      to proceedings under the International Chamber of Commerce (“ICC”) Mediation Rules, which Rules are deemed to be
      incorporated by reference into this clause 17. The place of mediation shall be London, United Kingdom. The
      language of the mediation proceedings shall be English.
    </li>
    <li>
      If the Dispute has not been settled pursuant to the ICC Mediation Rules within 40 days following the filing of a
      Request for Mediation in accordance with the ICC Mediation Rules or within such other period as the parties to the
      Dispute may agree in writing, such Dispute shall thereafter be finally settled under the Rules of Arbitration of
      the International Chamber of Commerce by three arbitrators appointed in accordance with the said Rules. The seat
      of Arbitration shall be London, United Kingdom. The governing law of this arbitration clause shall be the laws of
      England and Wales. The language of the arbitration shall be English. The Emergency Arbitrator Provisions shall not
      apply.
    </li>
    <li>
      If the Dispute cannot be resolved for legal reasons in accordance with the procedure in Clause 16, you and we
      agree that the courts of England and Wales shall have exclusive jurisdiction to resolve the Dispute.
    </li>
  </ol>
  <h2 class="mt-6 text-2xl">§18 Governing Law</h2>
  <ol style="list-style-type:lower-alpha" class="p-2 pl-8">
    <li>
      This Agreement shall be governed by and construed in accordance with the substantive laws of England & Wales
      without regard to conflict of laws principles but with the Hague Principles on the Choice of Law in International
      Commercial Contracts hereby incorporated by reference.
    </li>
  </ol>
  <h2 class="mt-6 text-2xl">§19 Third party beneficiaries</h2>
  <ol style="list-style-type:lower-alpha" class="p-2 pl-8">
    <li>
      Clauses 4 to 21 also apply to the benefit of the Affiliates and such benefit also encompasses Protocol-related
      matters.
    </li>
    <li>Subject to 19.1, these Terms do not give rise to any third party rights, which may be enforced against Us.</li>
  </ol>
  <h2 class="mt-6 text-2xl">§20 The terms are our entire agreement with you and we may assign the terms</h2>
  <ol style="list-style-type:lower-alpha" class="p-2 pl-8">
    <li>
      We may assign these Terms to any of our Affiliates or in connection with a merger or other disposition of all or
      substantially all of our assets.
    </li>
    <li>
      These Terms constitute the entire and exclusive agreement between us and you regarding its subject matter, and
      supersede and replace any previous or contemporaneous written or oral contract, promises, assurances, assurances,
      warranty, representation or understanding regarding its subject matter, whether written or oral. You shall have no
      claim for innocent or negligent misrepresentation or misstatement based on any statement in these Terms, though
      nothing in this clause shall limit or exclude any liability for fraud.
    </li>
  </ol>
  <h2 class="mt-6 text-2xl">§21 We waive no rights and do not allow assignment</h2>
  <ol style="list-style-type:lower-alpha" class="p-2 pl-8">
    <li>
      You may not assign, transfer or delegate any of your rights or duties arising out of or in connection with these
      Terms to a third party. Any such assignment or transfer shall be void and shall not impose any obligation or
      liability on us to the assignee or transferee.
    </li>
    <li>
      Any delay or omission by us in relation to the exercise of any right granted by law or under these Terms shall not
      as a result exclude or prevent the later exercise of such a right.
    </li>
  </ol>
  <h2 class="mt-6 text-2xl">§22 Provisions are severable, if found invalid</h2>
  <ol style="list-style-type:lower-alpha" class="p-2 pl-8">
    <li>
      If any provision or part-provision of these Terms is or becomes invalid, illegal or unenforceable, it shall be
      deemed modified to the minimum extent necessary to make it valid, legal and enforceable. If such modification is
      not possible, the relevant provision or part-provision shall be deemed deleted. Any modification to or deletion of
      a provision or part-provision under this clause shall not affect the validity and enforceability of the rest of
      these Terms.
    </li>
  </ol>

  <h2 class="mt-6 text-2xl">APPENDIX</h2>
  <h3 class="mt-6 text-2xl">RISKS</h3>
  <h3 class="mt-6 mb-2 text-xl underline">PRICE FLUCTUATIONS</h3>
  ERC 20 tokens are neither legal tender backed by governments nor by assets. The tokens’ value is highly volatile causing
  price fluctuations, as auctions typically run for some time and trades are not executed instantly.

  <h3 class="mt-6 mb-2 text-xl underline">REGULATORY ACTION</h3>
  We could be impacted by regulatory inquiries or action, which could impede or limit your ability to access or use the Platform.

  <h3 class="mt-6 mb-2 text-xl underline">TECHNICAL UNDERSTANDING</h3>
  Cryptographic assets are described in technical language requiring a comprehensive understanding of computer science and
  mathematics to appreciate the inherent risks.

  <h3 class="mt-6 mb-2 text-xl underline">
    TRANSACTIONS ON ETHEREUM MAINNET, THE GNOSIS BLOCKCHAIN AND ETHEREUM VIRTUAL MACHINE COMPATIBLE VALIDATION
    MECHANISMS ARE IMMUTABLE AND IRREVERSIBLE
  </h3>
  Transactions on Ethereum Mainnet, the Gnosis Blockchain and Ethereum Virtual Machine compatible validation mechanisms are
  generally immutable and irreversible. Any transaction thereon is therefore irrevocable and final as soon as it is settled
  thereon. In the event that you send your tokens to sell to any other destination other than the Protocol smart contracts,
  such tokens may not be returned. We assume no responsibility and shall have no obligation to you if this occurs, including
  but not limited to any responsibility to recover, or assist to recover, any such tokens.

  <h3 class="mt-6 mb-2 text-xl underline">FAILURES WITHIN DATA STORAGE SYSTEMS</h3>
  Our Platform may in part be established on servers at data centre facilities of third party providers and on distributed
  systems for storing and accessing data including IPFS. Where centralised services may be used, we may be required to transfer
  our Platform to different facilities, and may incur service interruption in connection with such relocation. Data centre
  facilities are vulnerable to force majeure events or other failures. Third party providers may suffer breaches of security
  and others may obtain unauthorised access to our server data. Where content is stored via distributed systems, there may
  be interference in content addressing, content linking, indexing and discovery. As techniques used to obtain unauthorised
  access change frequently and generally are not recognised until used against a target, it may not be possible to anticipate
  these techniques or to implement adequate preventive measures.
</div>
