/*
 *
 * TermsOfUsePage
 *
 */

import React from 'react';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import PageContainer from '../../components/PageContainer';

export class TermsOfUsePage extends React.Component { // eslint-disable-line react/prefer-stateless-function
  render() {
    return (
      <div>
        <Helmet
          title="TermsOfUsePage"
          meta={[
            { name: 'description', content: 'Description of TermsOfUsePage' },
          ]}
        />
        <PageContainer>
          <div className="t-body">
            <h3 style={{ textAlign: 'center' }}>Clap Online Pty Ltd</h3>
            <p>Welcome to clapit, which is owned and operated by Clap Online Pty Ltd (ACN 604 803 367). By using the clapit website, app or services (collectively, clapit), you are agreeing to comply with and be bound by these Terms of Use, which together with our Privacy Policy govern Clap Online Pty Ltd’s relationship with you in connection with clapit. Should you not agree with any of these Terms of Use, please do not use clapit.</p>
            <p>The terms ‘us’, ‘our’ or ‘we’ refer to Clap Online Pty Ltd, the owner of the clapit website, apps and service, whose registered office is located at c/- Ash Street Partners Pty Ltd, Level 18, 9 Castlereagh Street, Sydney NSW 2000, Australia. The term ‘you’ or ‘your’ refers to the user. The term ‘content’ includes, without limitation, any text, graphics, images, video, audio, logos, information, software or other material.</p>
            <h3>clapit generally</h3>
            <ol>
              <li>clapit and the content available via clapit is for your general information and use only. clapit is subject to change without prior notice.</li>
              <li>Neither we nor any third parties provide any warranty or guarantee as to the performance, accuracy, timeliness, completeness or suitability of clapit or the information and materials found or offered on clapit for any particular purpose. You hereby acknowledge that such information and materials may contain mistakes, inaccuracies or errors and we expressly exclude any liability for such to the fullest extent permissible by law.</li>
              <li>The availability of clapit may be affected or interrupted due to maintenance, upgrades, repairs, telecommunications failures and other factors and we will have no liability for any lack of availability.</li>
              <li>clapit may include links to other websites or apps which are not controlled by us. These links are provided for your convenience to provide you with further information. You acknowledge that they are used at your own risk. They do not signify that we recommend or endorse the websites or apps. We have no control over the nature, content and availability of those websites and apps.</li>
              <li>While we take steps to prevent the Clap button being misused or gamed, we cannot guarantee that this will happen.</li>
              <li>We do not endorse, and are not responsible for, content available on or via clapit and we do not have any obligation to monitor, pre-screen, edit or remove any such content.</li>
            </ol>
            <h3>ownership and licence of content</h3>
            <ol start="7">
              <li>clapit contains material which is owned by or licensed to us. This material includes, but is not limited to, the content, design, layout, appearance, look and graphics of the clapit website and the app. Any reproduction of this material is prohibited other than in accordance with the clapit copyright notice, which forms part of these Terms of Use.</li>
              <li>You hereby grant us a perpetual, irrevocable, non-exclusive, fully paid, royalty-free, sub-licensable and worldwide licence to use, publish, communicate to the public and otherwise exploit content you post to clapit. You acknowledge that we may re-format or otherwise alter content you post for display on clapit.</li>
              <li>If you or any third party retains any moral rights in any content you post or contribute to clapit, you hereby unconditionally and irrevocably:
                <ol type="a">
                  <li>consent to all or any acts or omissions by us or our licensees, successors and assigns in relation to the content which may infringe any such moral rights;</li>
                  <li>agree that you do not require that any personally identifying information be used in connection with such content, or any derivative works of or upgrades or updates thereto;</li>
                  <li>agree that you have no objection to the publication, use, modification, deletion and exploitation of such content by us or our licensees, successors and assigns; and</li>
                  <li>release us and our licensees, successors and assigns from any claims that you could otherwise assert by virtue of any such moral rights.</li>
                </ol>
              </li>
            </ol>
            <h3>conditions of access to clapit</h3>
            <ol start="10">
              <li>Unauthorised or improper use of clapit may be a criminal offence and/or give rise to a claim for damages.</li>
              <li>You must:
                <ol type="a">
                  <li>comply with all applicable laws, including, without limitation, privacy laws, criminal laws, defamation laws, intellectual property laws and regulatory requirements;</li>
                  <li>only post, submit or upload any content on clapit which is accurate and up-to-date;</li>
                  <li>review and comply with our Privacy Policy;</li>
                  <li>review and comply with any notices sent by us;</li>
                  <li>keep your password secure and confidential;</li>
                  <li>not create an account for anyone other than yourself, unless you are expressly authorised to do so on behalf of an employer or client;</li>
                  <li>not create accounts through unauthorised means, including but not limited to using an automated device, script, bot, spider, crawler or scraper;</li>
                  <li>not permit anyone else to use your account or use anyone else’s account; and</li>
                  <li>not sell or transfer your clapit account to anyone else or charge anyone else for access to clapit.</li>
                </ol>
              </li>
              <li>You must comply at all times with any Community Guidelines we make available on our website from time to time.</li>
              <li>You must not post, submit or upload any content to clapit or use clapit to promote or link to any content which:
                <ol type="a">
                  <li>is false, violent, threatening, illegal, tortious, infringing, inaccurate, inappropriate, defamatory, discriminatory, hateful, pornographic, contains nudity or is sexually suggestive or otherwise objectionable;</li>
                  <li>is required by law or regulation to be age-restricted;</li>
                  <li>includes information that you do not have the right to disclose;</li>
                  <li>infringes any other agreement to which you are a party, any rights of clapit or any third party or any other law;</li>
                  <li>includes any unsolicited or unauthorised advertising or promotional materials or other forms of commercial or harassing communications to any clapit users;</li>
                  <li>contains or redirects to software viruses, worms, spyware, malware, Trojan horse or computer codes that interrupt, interfere or are destructive to the functionality or display of clapit or browsers or devices on which clapit is being used; or</li>
                  <li>contains private or confidential information, including but without limitation, your or any other person’s credit card information, personal identification information, non-public phone numbers or non-public email addresses.</li>
                </ol>
              </li>
              <li>You must not:
                <ol type="a">
                  <li>stalk, bully, abuse, harass, threaten, impersonate or intimidate others, or attempt to restrict another user from using clapit;</li>
                  <li>use the information found on clapit except as permitted in these Terms of Use;</li>
                  <li>misuse or attempt to game the Clap button;</li>
                  <li>use automated means to activate the Clap button or to access any content on clapit, including crawling, scraping, caching or otherwise (except as may be the result of standard search engine protocols or technologies used by a search engine);</li>
                  <li>use clapit to send or post unsolicited commercial electronic messages (i.e. spam) or unlawful marketing or pyramid schemes;</li>
                  <li>change, modify, adapt or alter clapit or create, change, modify or alter another website so as to falsely imply that it is associated with clapit or its services;</li>
                  <li>attempt to gain unauthorised access to clapit, its services, its related systems or networks or another user’s account or assist others to do so;</li>
                  <li>do anything that could overburden or otherwise adversely impact clapit or its proper operation; or</li>
                  <li>authorise, encourage or facilitate violations of these Terms of Use.</li>
                </ol>
              </li>
            </ol>
            <h3>clapit’s rights and obligations</h3>
            <ol start="15">
              <li>clapit may, in its sole discretion:
                <ol type="a">
                  <li>modify, amend, suspend or discontinue clapit;</li>
                  <li>refuse access to clapit;</li>
                  <li>force forfeiture of any username for any reason;</li>
                  <li>remove any content from clapit if deemed by clapit to be contrary to these Terms of Use, any applicable law or for any other reason in our sole discretion.</li>
                </ol>
              </li>
              <li>If clapit terminates your access, or you deactivate your account, then:
                <ol type="a">
                  <li>your photos, comments, likes, friendships, and all other data will no longer be accessible through your account, but those materials and data may persist and appear within clapit, including where your content has been reshared by others; and</li>
                  <li>all licenses and other rights granted to you in these Terms of Use will cease with immediate effect.</li>
                </ol>
              </li>
              <li>clapit does not give any express warranty as to the suitability or availability of our products or services.</li>
              <li>clapit does not give any implied warranties, except for those implied under the Competition and Consumer Act 2010 (Cth).</li>
            </ol>
            <h3>warranties and acknowledgements</h3>
            <ol start="19">
              <li>You represent and warrant to us that:
                <ol type="a">
                  <li>you are an individual at least 16 years of age;</li>
                  <li>you are not restricted from using clapit;</li>
                  <li>you will only maintain one clapit account at any given time;</li>
                  <li>you have full power and authority to enter into these Terms of Use;</li>
                  <li>by entering into these Terms of Use you will not breach any other agreement to which you are a party, any rights of clapit or any third party or any law.</li>
                  <li>you are entitled to post, upload or submit to clapit all content that you post, upload or submit to clapit and that such content is not confidential nor in breach of any agreement, intellectual property rights or other third party rights or any other law, and that our use of such content on clapit and as contemplated under these Terms of Use will not breach any intellectual property rights or other third party rights and you will pay any royalties or fees applicable to any such use.</li>
                </ol>
              </li>
              <li>You acknowledge and agree that:
                <ol type="a">
                  <li>clapit should not be used to store or backup content and any content you post, upload or submit to clapit is at your own risk of loss;</li>
                  <li>clapit is not responsible for misuse or misappropriation of any content you post, upload or submit to clapit;</li>
                  <li>clapit is not responsible for the content that may be posted, uploaded or submitted to clapit by you or anyone else and is not responsible for any loss or damage whatsoever and howsoever arising that may be caused to you or anyone else by the posting, uploading or submitting of such content;</li>
                  <li>clapit is not liable for identity theft or any other misuse of your identity or information by others;</li>
                  <li>we do not guarantee continuous, uninterrupted or secure access to clapit services;</li>
                  <li>we are released from any liability howsoever arising in relation to a dispute between you and any other user of clapit products or services or any content appearing on or made available via clapit; and</li>
                  <li>if you are dissatisfied with the products or services provide by clapit you can close your account and terminate these Terms of Use and such termination will be your sole and exclusive remedy.</li>
                </ol>
              </li>
            </ol>
            <h3>release</h3>
            <ol start="21">
              <li>If you have a dispute with one or more clapit users, you release us, our related bodies corporate, employees, agents and directors from any loss, damage, claim or demands of any kind arising out of or in any way connected with such dispute.</li>
            </ol>
            <h3>indemnity</h3>
            <ol start="22">
              <li>You indemnify and hold us harmless against any loss, damage, claim, action, penalty, liability, cost, charge, expense, outgoing or payment (including, without limitation, legal costs and expenses on a full indemnity basis) which we suffer, incur or are liable for at any time under or in connection with:
                <ol type="a">
                  <li>the breach of these Terms of Use or any applicable law by you;</li>
                  <li>any content you post, submit or upload on clapit; and</li>
                  <li>your use of clapit and any activity which you undertake by using clapit.</li>
                </ol>
              </li>
            </ol>
            <h3>liability</h3>
            <ol start="23">
              <li>Your use of any information or materials on or available through clapit is entirely at your own risk, for which we shall not be liable. It shall be your own responsibility to ensure that any products, services or information available through clapit meet your specific requirements.
                <ol type="a">
                  <li>To the maximum extent permitted by law:</li>
                  <li>notwithstanding any other clause of this Agreement, in no circumstances will we be liable in contract, tort (including negligence or breach of statutory duty) or otherwise for loss (whether direct or indirect) of profits, business, or anticipated savings, corruption, reputation, goodwill, loss or destruction of data or for any indirect, special or consequential loss whatsoever;</li>
                  <li>any and all liability we have to you for any reason (including negligence or breach of statutory duty) will not in any event exceed AUD100 in the aggregate; and</li>
                  <li>we exclude all conditions, warranties or guarantees express or implied under general law or custom including of merchantability and fitness for a particular purpose,</li>
                </ol>
                <p>provided that nothing in this Agreement excludes or limits any implied condition, warranty or guarantee the exclusion or limitation of which would contravene any statute or cause any part of this Agreement to be void or unenforceable, including under the Competition and Consumer Act 2010 (Cth) (Non-excludable Condition).</p></li>
              <li>To the extent permitted by Law, you agree that our total liability to you or a person claiming through you for breach of a Non-excludable Condition is limited at our option to supplying the Services again or paying for the cost of doing so.</li>
            </ol>
            <h3>general</h3>
            <ol start="26">
              <li>Your use of clapit and any dispute arising out of your use of it is subject to the laws of New South Wales, Australia and you submit to the exclusive jurisdiction of the courts of New South Wales, Australia and courts authorised to hear appeals from such courts.</li>
              <li>clapit has no responsibility or liability to you in respect of any third party product or service described on or available through clapit unless otherwise agreed. You must refer to the individual warranty or other terms relevant to any particular product or service.</li>
              <li>No delay by us in enforcing any of the terms or conditions of this Agreement will affect or restrict our rights and powers arising under this Agreement. No waiver of any term or condition of this Agreement will be effective unless made in writing.</li>
              <li>If any provision of this Agreement is held to be invalid, in whole or in part, such provision (or relevant part, as the case may be) will be deemed not to form part of this Agreement. In any event, the enforceability of the remainder of this Agreement will not be affected.</li>
              <li>These Terms of Use may be amended from time to time. Your continued use of clapit following any such amendments will be deemed to be confirmation that you accept those amendments.</li>
            </ol>
            <p><strong>Copyright Infringement Claims</strong></p>
            <p>The Digital Millennium Copyright Act of 1998 (the “DMCA”) provides recourse for copyright owners who believe that material appearing on the Internet infringes their rights under U.S. copyright law. If you believe in good faith that materials available on clapit infringe your copyright, you (or your agent) may send to us a written notice by mail, e-mail or fax, requesting that we remove such material or block access to it. If you believe in good faith that someone has wrongly filed a notice of copyright infringement against you, the DMCA permits you to send to us a counter-notice. Notices and counter-notices must meet the then-current statutory requirements imposed by the DMCA. See <a href="http://www.copyright.gov/" target="_blank" data-saferedirecturl="https://www.google.com/url?hl=en&amp;q=http://www.copyright.gov/&amp;source=gmail&amp;ust=1476574221054000&amp;usg=AFQjCNGt1x28SPavy_vpu-BOqyhyFI6oPg">http://www.copyright.gov/</a> for details. Notices and counter-notices must be sent in writing to Clap Online Pty Ltd as follows: By mail to Paul Bedwell ℅ Ash Street, Level 18, 9 Castlereagh St, Sydney NSW 2000, Australia; by e-mail to <a href="mailto:pj@clapit.com" target="_blank">pj@clapit.com</a>. Paul Bedwell’s phone number is <a href="tel:%2B61%28405%29%20225-110" target="_blank">+61(405) 225-110</a>.</p>
          </div>
        </PageContainer>
      </div>
    );
  }
}


function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

export default connect(null, mapDispatchToProps)(TermsOfUsePage);
