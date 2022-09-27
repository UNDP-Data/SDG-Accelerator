/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/interactive-supports-focus */
/* eslint-disable jsx-a11y/anchor-is-valid */
import styled from 'styled-components';
import { NavLink, useParams } from 'react-router-dom';
import { useState } from 'react';
import { Modal } from 'antd';
import sortBy from 'lodash.sortby';
import CountryTaxonomy from '../Data/countryTaxonomy.json';

interface Props {
  pageURL: string;
}

const NavBarEl = styled.div`
  background-color: var(--black-100);
  border-bottom: 1px solid var(--black-500);
  z-index: 8;
  position: sticky;
  top: 11.5rem;
`;

const ContainerEl = styled.div`
  display: flex;
  max-width: 128rem;
  margin: auto;
  justify-content: space-between;
  align-items: center;
`;

interface NavElProps {
  selected?: boolean;
}

const NavEl = styled.div<NavElProps>`
  font-size: 1.8rem;
  font-weight: normal;
  padding: 1.5rem 0 1rem 0;
  margin: 0 1.5rem;
  &:first-of-type {
    margin-left: 0;
  }
  &:last-of-type {
    margin-right: 0;
  }
  cursor: pointer;
  &:hover {
    color: var(--primary-blue)
  }
`;

const CountryEl = styled.div`
  display: flex;
  align-items: baseline;
  font-size: 2.8rem;
  font-weight: bold;
  color: var(--primary-blue);
`;

const ButtonEl = styled.button`
  background-color: transparent;
  border: 0;
  color: var(--black-550);
  padding: 0;
  font-size: 1.2rem;
  margin-left: 1rem;
  cursor: pointer;
  font-weight: normal;
  &:hover{
    font-weight: bold;
  }
`;

const NavContainer = styled.div`
  display: flex;
`;

const ModalBody = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 2rem;
  div {
    width: calc(33.33% - 1.35rem);
  } 
  a {
    color: var(--black-700);
    font-size: 1.4rem;
    &:hover{
      font-weight: bold;
    }
  } 
`;

const ModalHead = styled.div`
  margin-bottom: 2rem;
  font-size: 2.4rem;
`;

export const Nav = (props: Props) => {
  // eslint-disable-next-line no-unused-vars
  const { pageURL } = props;
  const countrySelected = useParams().country || 'ZAF';
  const countryName = CountryTaxonomy.findIndex((d) => d['Alpha-3 code-1'] === countrySelected) !== -1 ? CountryTaxonomy[CountryTaxonomy.findIndex((d) => d['Alpha-3 code-1'] === countrySelected)]['Country or Area'] : 'NA';
  const [open, setOpen] = useState(false);
  const countrySorted = sortBy(CountryTaxonomy, 'Country or Area');
  return (
    <>
      <NavBarEl>
        <ContainerEl>
          <CountryEl>
            {countryName}
            <ButtonEl onClick={() => { setOpen(true); }}>
              Change Country
            </ButtonEl>
          </CountryEl>
          <NavContainer>
            <NavEl>
              <NavLink
                to={`../diagnostic-simulator/current-sdg-gaps/${countrySelected}`}
                style={({ isActive }) => ({
                  paddingBottom: isActive ? '8px' : '',
                  borderBottom: isActive ? '#006EB5 solid 3px' : '',
                  color: !isActive ? 'var(--primaty-blue)' : '',
                })}
              >
                Current Gaps
              </NavLink>
            </NavEl>
            <NavEl>
              <NavLink
                to={`../diagnostic-simulator/acceleration-Opportunities/${countrySelected}`}
                style={({ isActive }) => ({
                  paddingBottom: isActive ? '8px' : '',
                  borderBottom: isActive ? '#006EB5 solid 3px' : '',
                  color: !isActive ? 'var(--primaty-blue)' : '',
                })}
              >
                Current Priorities
              </NavLink>
            </NavEl>
            <NavEl>
              <NavLink
                to={`../diagnostic-simulator/future-scenarios/${countrySelected}`}
                style={({ isActive }) => ({
                  paddingBottom: isActive ? '8px' : '',
                  borderBottom: isActive ? '#006EB5 solid 3px' : '',
                  color: !isActive ? 'var(--primaty-blue)' : '',
                })}
              >
                SDG Push
              </NavLink>
            </NavEl>
          </NavContainer>
        </ContainerEl>
      </NavBarEl>
      <>
        <Modal
          title='Select a country'
          visible={open}
          width='90%'
          onOk={() => {
            setOpen(false);
          }}
          onCancel={() => {
            setOpen(false);
          }}
          className='undp-modal'
        >
          <ModalHead>Select a country</ModalHead>
          <ModalBody>
            {
              countrySorted.map((d, i) => (
                <div role='button' key={i} onClick={() => { setOpen(false); }}>
                  <NavLink
                    to={`../diagnostic-simulator/${pageURL}/${d['Alpha-3 code-1']}`}
                  >
                    {d['Country or Area']}
                  </NavLink>
                </div>
              ))
            }
          </ModalBody>
        </Modal>
      </>
    </>
  );
};
