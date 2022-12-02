/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import { Input, Modal } from 'antd';
import { NavLink } from 'react-router-dom';
import { useState } from 'react';
import sortBy from 'lodash.sortby';
import CountryTaxonomy from '../Data/countryTaxonomy.json';
import '../style/modalStyle.css';
import '../style/inputStyle.css';
import '../style/footerStyle.css';
import UNDPLogo from '../img/logo.png';
import GlobeWhite from '../img/globe-white.svg';
import FAOLogo from '../img/logos/FAO_logo.svg';
import UNWomenLogo from '../img/logos/UN_Women_logo.svg';
import UNLogo from '../img/logos/United_Nations_logo.svg';
import EuropeanCommissionLogo from '../img/logos/European_Commision_logo.svg';

export const Footer = () => {
  const [searchText, setSearchText] = useState<string | null>(null);
  const [openCountryModal, setOpenCountryModal] = useState(false);
  return (
    <>
      <div>
        <footer>
          <div className='flex-hor-align-center' style={{ borderTop: '1px solid var(--gray-400)', padding: 'var(--spacing-09) 0', backgroundColor: 'var(--gray-100)' }}>
            <div style={{ padding: '0 0.75rem', maxWidth: '83.33333%', margin: 'auto' }}>
              <h6 className='undp-typography' style={{ textAlign: 'center' }}>This platform is powered by data and methodology from</h6>
            </div>
            <div
              className='flex-div flew-wrap margin-top-05 flex-hor-align-center'
              style={{
                padding: '0 0.75rem', maxWidth: '83.33333%', margin: 'auto', gap: '2.5rem',
              }}
            >
              <img alt='fao_logo' src={FAOLogo} style={{ height: '3.5rem' }} />
              <img alt='un_women_logo' src={UNWomenLogo} style={{ height: '3.5rem' }} />
              <img alt='un_logo' src={UNLogo} style={{ height: '3.5rem' }} />
              <img alt='european_commission_logo' src={EuropeanCommissionLogo} style={{ height: '3.5rem' }} />
            </div>
          </div>
          <div className='undp-footer'>
            <div className='flex-div flex-space-between margin-bottom-07' style={{ padding: '0 0.75rem var(--spacing-09) 0.75rem', borderBottom: '1px solid var(--white)' }}>
              <div className='flex-div flex-vert-align-center' style={{ margin: 0 }}>
                <img alt='undp logo' src={UNDPLogo} style={{ width: '72px' }} />
                <h5 className='undp-typography margin-bottom-00'>
                  UNDP
                  <br />
                  Data Futures Platform
                </h5>
              </div>
              <div>
                <div className='margin-bottom-05' style={{ textAlign: 'right' }}>
                  <img style={{ cursor: 'pointer' }} onClick={() => { setOpenCountryModal(true); }} src={GlobeWhite} alt='icon-global' width='24px' height='24px' />
                </div>
                <div className='margin-bottom-03 '>
                  <a className='undp-footer-link undp-footer-right-link' href='mailto:data@undp.org' target='_blank' rel='noreferrer'>Contact Us</a>
                </div>
                <div className='margin-bottom-03'>
                  <a className='undp-footer-link undp-footer-right-link' href='https://data.undp.org/' target='_blank' rel='noreferrer'>Data Futures Platform</a>
                </div>
                <div>
                  <a className='undp-footer-link undp-footer-right-link' href='/' target='_blank' rel='noreferrer'>Methodology</a>
                </div>
              </div>
            </div>
            <p className='small-font margin-top-05' style={{ padding: '0 0.75rem' }}>© 2021 United Nations Development Programme</p>
          </div>
        </footer>
      </div>
      <Modal
        className='undp-modal'
        title='Select a country'
        open={openCountryModal}
        onCancel={() => { setOpenCountryModal(false); }}
        onOk={() => { setOpenCountryModal(false); }}
      >
        <div
          className='margin-top-07 flex-div flex-wrap'
          style={{
            width: '75vw', minWidth: '60rem', maxWidth: '90rem',
          }}
        >
          <Input className='undp-input margin-bottom-05' placeholder='Search a country' onChange={(value) => { setSearchText(value.target.value); }} />
          {
            searchText ? sortBy(CountryTaxonomy, 'Country or Area').filter((d) => d['Country or Area'].toLowerCase().includes(searchText.toLowerCase())).map((d, i) => (
              <div
                style={{ width: 'calc(33.33% - 0.667rem)' }}
                key={i}
              >
                <NavLink
                  key={i}
                  to={`../sdg-push-diagnostic/${d['Alpha-3 code-1']}`}
                  className='undp-style'
                  onClick={() => { setOpenCountryModal(false); }}
                >
                  {d['Country or Area']}
                </NavLink>
              </div>
            )) : sortBy(CountryTaxonomy, 'Country or Area').map((d, i) => (
              <div
                style={{ width: 'calc(33.33% - 0.667rem)' }}
                key={i}
              >
                <NavLink
                  key={i}
                  to={`../sdg-push-diagnostic/${d['Alpha-3 code-1']}`}
                  className='undp-style'
                  onClick={() => { setOpenCountryModal(false); }}
                >
                  {d['Country or Area']}
                </NavLink>
              </div>
            ))
          }
        </div>
      </Modal>
    </>
  );
};