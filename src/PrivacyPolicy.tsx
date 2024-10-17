import { Link } from 'react-router-dom';

export const PrivacyPolicy = () => (
  <div className='margin-top-13' style={{ padding: 'var(--spacing-09)', backgroundColor: 'var(--gray-200)', borderTop: '1px solid var(--gray-400)' }}>
    <div className='undp-breadcrumb margin-bottom-10 max-width-1440' style={{ marginLeft: 'auto', marginRight: 'auto' }}>
      <Link to='/'>
        SDG Push Diagnostics
      </Link>
      <div className='divider'>/</div>
      <span>
        Privacy Policy
      </span>
    </div>

    <div>
      <h3 className='undp-typography'>Privacy Policy</h3>
      <p className='undp-typography margin-bottom-08'>
        We value your privacy and are committed to protecting your personal data. This privacy policy will inform you about how we handle your data when you visit our website.
      </p>

      <h6 className='undp-typography'>Data Collection and Usage</h6>
      <p className='undp-typography'>
        We use Microsoft Clarity to understand how you interact with our website. Clarity helps us capture behavioral metrics, heatmaps, and session replays to improve our products and services. By using our site, you agree that we and Microsoft can collect and use this data.
        This information helps us optimize our website, enhance user experience, and improve our marketing efforts. We do not collect any personally identifiable information (PII) through Clarity.
      </p>

      <h6 className='undp-typography'>Data Security</h6>
      <p className='undp-typography'>
        We take data security seriously and implement appropriate measures to protect your data from unauthorized access, alteration, or disclosure.
      </p>

      <h6 className='undp-typography'>Third-Party Services</h6>
      <div>
        <p className='undp-typography'>
          For more information about how Microsoft collects and uses your data, please visit the
          {' '}
          <a className='undp-style' href='https://privacy.microsoft.com/en-us/privacystatement' target='_blank' rel='noopener noreferrer'>Microsoft Privacy Statement</a>
          .
        </p>
      </div>

      <h6 className='undp-typography'>Your Consent</h6>
      <p className='undp-typography'>
        By using our website, you consent to our privacy policy and agree to the collection and use of data by us and Microsoft as described.
        {' '}
        <br />
        To learn more go to our
        {' '}
        <a className='undp-style' href='https://www.undp.org/copyright-terms-use#:~:text=General-,Web%20privacy,-Contact%20us%C2%A0' target='_blank' rel='noreferrer'>Web Privacy</a>
        {' '}
        in our Terms of Use.
      </p>

      <h6 className='undp-typography'>Contact Us</h6>

      <p className='undp-typography'>
        If you have any questions or concerns about our privacy policy, please contact us at
        {' '}
        <a className='undp-style' href='mailto:data@undp.org' target='_blank' rel='noreferrer'>data@undp.org</a>
      </p>

    </div>
  </div>
);
