/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import { Input, Modal } from 'antd';
import { NavLink } from 'react-router-dom';
import { useState } from 'react';
import sortBy from 'lodash.sortby';
import CountryTaxonomy from '../Data/countryTaxonomy.json';
import IMAGES from '../img/images';

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
              className='flex-div flex-wrap margin-top-05 flex-hor-align-center'
              style={{
                padding: '0 0.75rem', maxWidth: '83.33333%', margin: 'auto', gap: '2.5rem',
              }}
            >
              <img alt='fao_logo' src={IMAGES.faoLogo} style={{ height: '3.5rem' }} />
              <img alt='un_women_logo' src={IMAGES.unWomenLogo} style={{ height: '3.5rem' }} />
              <img alt='un_logo' src={IMAGES.unLogo} style={{ height: '3.5rem' }} />
              <img alt='european_commission_logo' src={IMAGES.ecLogo} style={{ height: '3.5rem' }} />
            </div>
          </div>
          <div className='undp-footer'>
            <div className='flex-div flex-space-between margin-bottom-07 flex-wrap' style={{ padding: '0 0.75rem var(--spacing-09) 0.75rem', borderBottom: '1px solid var(--white)' }}>
              <div
                className='flex-div flex-vert-align-center'
                style={{ margin: 0 }}
              >
                <a href='https://www.undp.org/' target='_blank' rel='noreferrer'>
                  <img alt='undp logo' src={IMAGES.undpLogoWhite} style={{ width: '60px' }} />
                </a>
                <h5 className='undp-typography margin-bottom-00'>
                  United Nations
                  <br />
                  Development Programme
                </h5>
              </div>
              <div className='undp-footer-right-container'>
                <div className='margin-bottom-05'>
                  <img style={{ cursor: 'pointer' }} onClick={() => { setOpenCountryModal(true); }} src={IMAGES.globeWhite} alt='icon-global' width='24px' height='24px' />
                </div>
                <div className='margin-bottom-03 '>
                  <a className='undp-footer-link undp-footer-right-link' href='mailto:data@undp.org' target='_blank' rel='noreferrer'>Contact Us</a>
                </div>
                <div className='margin-bottom-03'>
                  <a className='undp-footer-link undp-footer-right-link' href='https://data.undp.org/' target='_blank' rel='noreferrer'>Data Futures Platform</a>
                </div>
                <div className='margin-bottom-03'>
                  <a className='undp-footer-link undp-footer-right-link' href='https://sdgigeneralstorage.blob.core.windows.net/sdg-push/Methodology.pdf' target='_blank' rel='noreferrer'>Methodology</a>
                </div>
                <div>
                  <a className='undp-footer-link undp-footer-right-link' href='https://www.undp.org/copyright-terms-use' target='_blank' rel='noreferrer'>Terms Of Use</a>
                </div>
              </div>
            </div>
            <div className='flex-div flex-space-between'>
              <div>
                <p
                  className='undp-typography margin-top-05 margin-bottom-00'
                  style={{ padding: '0 0.75rem', fontSize: '1rem' }}
                >
                  © 2023 United Nations Development Programme
                </p>
              </div>
            </div>
          </div>
        </footer>
      </div>
      <Modal
        className='undp-modal'
        title='Select a country'
        open={openCountryModal}
        onCancel={() => { setOpenCountryModal(false); }}
        onOk={() => { setOpenCountryModal(false); }}
        width='80vw'
      >
        <div
          className='margin-top-07 flex-div flex-wrap'
          style={{
            maxWidth: '90rem',
            justifyContent: 'space-between',
          }}
        >
          <Input className='undp-input margin-bottom-05' placeholder='Search a country' onChange={(value) => { setSearchText(value.target.value); }} />
          {
            searchText ? sortBy(CountryTaxonomy, 'Country or Area').filter((d) => d['Country or Area'].toLowerCase().includes(searchText.toLowerCase())).map((d, i) => (
              <div
                style={{ width: 'calc(33.33% - 1rem)' }}
                key={i}
              >
                <NavLink
                  key={i}
                  to={d['Alpha-3 code-1'] === 'IDN' ? '../IDNWithCountryGovInput' : `../${d['Alpha-3 code-1']}`}
                  className='undp-style'
                  onClick={() => { setOpenCountryModal(false); }}
                >
                  {d['Country or Area']}
                </NavLink>
              </div>
            )) : sortBy(CountryTaxonomy, 'Country or Area').map((d, i) => (
              <div
                style={{ width: 'calc(33.33% - 1rem)' }}
                key={i}
              >
                <NavLink
                  key={i}
                  to={d['Alpha-3 code-1'] === 'IDN' ? '../IDNWithCountryGovInput' : `../${d['Alpha-3 code-1']}`}
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
