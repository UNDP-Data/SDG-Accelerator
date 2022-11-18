/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Input, Modal } from 'antd';
import sortBy from 'lodash.sortby';
import CountryTaxonomy from '../Data/countryTaxonomy.json';
import '../style/headerStyle.css';
import '../style/modalStyle.css';
import '../style/inputStyle.css';

interface Props {
  country?: string;
}

export const Header = (props: Props) => {
  const { country } = props;
  const countryFullName = country && CountryTaxonomy.findIndex((d) => d['Alpha-3 code-1'] === country) !== -1 ? CountryTaxonomy[CountryTaxonomy.findIndex((d) => d['Alpha-3 code-1'] === country)]['Country or Area'] : undefined;
  const [searchText, setSearchText] = useState<string | null>(null);
  const [openHeaderCountryModal, setOpenHeaderCountryModal] = useState(false);
  return (
    <>
      <div>
        <header className='undp-country-header'>
          <div className='undp-header-bg flex-space-between'>
            <div className='flex-div flex-vert-align-center flex-space-between'>
              <div className='flex-div flex-vert-align-center'>
                <img src='https://design.undp.org/static/media/undp-logo-blue.4f32e17f.svg' alt='UNDP Logo' />
                <div className='undp-site-title'>
                  {
                    countryFullName
                      ? (
                        <NavLink
                          to='../sdg-push-diagnostic'
                          className='logo-sub-head'
                        >
                          SDG Push Diagnostic
                        </NavLink>
                      ) : null
                  }
                  <span>
                    <NavLink
                      to={country ? `../sdg-push-diagnostic/${country}` : '../sdg-push-diagnostic'}
                    >
                      {countryFullName || 'SDG Push Diagnostic'}
                    </NavLink>
                  </span>
                </div>
              </div>
              {
                country
                  ? (
                    <div className='undp-nav-div'>
                      <NavLink
                        to={`../sdg-push-diagnostic/${country}/sdg-trends`}
                      >
                        SDG Trends
                      </NavLink>
                      <NavLink
                        to={`../sdg-push-diagnostic/${country}/current-priorities`}
                      >
                        Current Priorities
                      </NavLink>
                      <NavLink
                        to={`../sdg-push-diagnostic/${country}/future-scenarios`}
                      >
                        Future Scenarios
                      </NavLink>
                      <NavLink
                        to={`../sdg-push-diagnostic/${country}/synergies-and-tradeoffs`}
                      >
                        SDG Interlinkages
                      </NavLink>
                    </div>
                  ) : null
              }
              <div style={{
                width: '347px', height: '24px', justifyContent: 'flex-end', textAlign: 'right',
              }}
              >
                <img style={{ cursor: 'pointer' }} onClick={() => { setOpenHeaderCountryModal(true); }} src='https://www.undp.org/themes/custom/undpglobal/design-system/images/globe-icon.svg' alt='Global Icon' />
              </div>
            </div>
          </div>
        </header>
      </div>
      <Modal
        className='undp-modal'
        title='Select a country'
        open={openHeaderCountryModal}
        onCancel={() => { setOpenHeaderCountryModal(false); }}
        onOk={() => { setOpenHeaderCountryModal(false); }}
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
                  onClick={() => { setOpenHeaderCountryModal(false); }}
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
                  onClick={() => { setOpenHeaderCountryModal(false); }}
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
