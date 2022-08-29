/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/interactive-supports-focus */
/* eslint-disable jsx-a11y/anchor-is-valid */
import styled from 'styled-components';
import { NavLink, useParams } from 'react-router-dom';
import { Menu, Dropdown } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import { COUNTRYOPTION } from '../Constants';

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

const NavContainer = styled.div`
  display: flex;
`;
export const Nav = (props: Props) => {
  const { pageURL } = props;
  const countrySelected = useParams().country || 'ZAF';
  const menu = (
    <Menu>
      {
        COUNTRYOPTION.map((d, i) => (
          <Menu.Item key={i}>
            <NavLink
              to={`../diagnostic-simulator/${pageURL}/${d.code}`}
            >
              {d.countryName}
            </NavLink>
          </Menu.Item>
        ))
      }
    </Menu>
  );

  return (
    <NavBarEl>
      <ContainerEl>
        <div>
          <Dropdown
            overlay={menu}
            arrow
            trigger={['hover', 'click']}
            className='countrySelect'
          >
            <a role='menuitem' className='navCountry' onClick={(e) => e.preventDefault()}>
              {COUNTRYOPTION[COUNTRYOPTION.findIndex((d) => d.code === countrySelected)].countryName}
              {' '}
              <DownOutlined />
            </a>
          </Dropdown>
        </div>
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
  );
};
