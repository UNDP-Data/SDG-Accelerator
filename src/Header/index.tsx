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
import GlobeBlue from '../img/globe-icon.svg';

interface Props {
  country?: string;
}

export const Header = (props: Props) => {
  const { country } = props;
  const [showMenu, setShowMenu] = useState(false);
  const countryFullName = country && CountryTaxonomy.findIndex((d) => d['Alpha-3 code-1'] === country) !== -1 ? CountryTaxonomy[CountryTaxonomy.findIndex((d) => d['Alpha-3 code-1'] === country)]['Country or Area'] : undefined;
  const [searchText, setSearchText] = useState<string | null>(null);
  const [openHeaderCountryModal, setOpenHeaderCountryModal] = useState(false);
  return (
    <>
      <div>
        <header className='undp-country-header'>
          <div className='undp-header-bg flex-space-between'>
            <div className='flex-div flex-vert-align-center flex-space-between'>
              <div className='flex-div flex-vert-align-center nav-top-left'>
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
                        className={({ isActive }) => (isActive ? 'header-link-active' : 'header-link')}
                      >
                        SDG Trends
                      </NavLink>
                      <NavLink
                        to={`../sdg-push-diagnostic/${country}/current-priorities`}
                        className={({ isActive }) => (isActive ? 'header-link-active' : 'header-link')}
                      >
                        Current Priorities
                      </NavLink>
                      <NavLink
                        to={`../sdg-push-diagnostic/${country}/future-scenarios`}
                        className={({ isActive }) => (isActive ? 'header-link-active' : 'header-link')}
                      >
                        Future Scenarios
                      </NavLink>
                      <NavLink
                        to={`../sdg-push-diagnostic/${country}/synergies-and-tradeoffs`}
                        className={({ isActive }) => (isActive ? 'header-link-active' : 'header-link')}
                      >
                        SDG Interlinkages
                      </NavLink>
                    </div>
                  ) : null
              }
              <div className='flex-div nav-top-right'>
                {
                  country
                    ? (
                      <button
                        type='button'
                        className={showMenu ? 'undp-menu-hamburger is-active' : 'undp-menu-hamburger'}
                        aria-label='menu-icon'
                        onClick={() => { setShowMenu(!showMenu); }}
                      >
                        <span className='undp-hamburger-line undp-line-top' />
                        <span className='undp-hamburger-line undp-line-middle' />
                        <span className='undp-hamburger-line undp-line-bottom' />
                        Nav Toggle
                      </button>
                    ) : null
                }
                <div style={{
                  height: '24px', justifyContent: 'flex-end', textAlign: 'right',
                }}
                >
                  <img style={{ cursor: 'pointer' }} onClick={() => { setOpenHeaderCountryModal(true); }} src={GlobeBlue} alt='Global Icon' />
                </div>
              </div>
            </div>
          </div>
          {
            country ? (
              <div className={showMenu ? 'undp-mobile-nav mobile-nav-show' : 'undp-mobile-nav'}>
                <div>
                  <NavLink
                    className='undp-button button-tertiary button-arrow header-link'
                    onClick={() => (setShowMenu(false))}
                    to={`../sdg-push-diagnostic/${country}/sdg-trends`}
                    style={{
                      color: 'var(--black)',
                      backgroundColor: 'transparent',
                      justifyContent: 'flex-start',
                    }}
                  >
                    SDG Trends
                  </NavLink>
                </div>
                <div>
                  <NavLink
                    className='undp-button button-tertiary button-arrow header-link'
                    onClick={() => (setShowMenu(false))}
                    to={`../sdg-push-diagnostic/${country}/current-priorities`}
                    style={{
                      color: 'var(--black)',
                      backgroundColor: 'transparent',
                      justifyContent: 'flex-start',
                    }}
                  >
                    Current Priorities
                  </NavLink>
                </div>
                <div>
                  <NavLink
                    className='undp-button button-tertiary button-arrow header-link'
                    onClick={() => (setShowMenu(false))}
                    to={`../sdg-push-diagnostic/${country}/future-scenarios`}
                    style={{
                      color: 'var(--black)',
                      backgroundColor: 'transparent',
                      justifyContent: 'flex-start',
                    }}
                  >
                    Future Scenarios
                  </NavLink>
                </div>
                <div>
                  <NavLink
                    className='undp-button button-tertiary button-arrow header-link'
                    onClick={() => (setShowMenu(false))}
                    to={`../sdg-push-diagnostic/${country}/synergies-and-tradeoffs`}
                    style={{
                      color: 'var(--black)',
                      backgroundColor: 'transparent',
                      justifyContent: 'flex-start',
                    }}
                  >
                    SDG Interlinkages
                  </NavLink>
                </div>
              </div>
            ) : null
          }
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
