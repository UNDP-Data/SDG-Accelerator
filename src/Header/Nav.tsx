import styled from 'styled-components';
import { NavLink, useParams } from 'react-router-dom';
import { Select } from 'antd';
import { COUNTRYOPTION } from '../Constants';

interface Props {
  pageURL: string;
}

const NavBarEl = styled.div`
  background-color: var(--black-100);
  border-bottom: 1px solid var(--black-500);
  z-index: 1000;
  postion: absolute;
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
  const params = useParams();
  return (
    <NavBarEl>
      <ContainerEl>
        <div>
          <Select
            showSearch
            value={COUNTRYOPTION[COUNTRYOPTION.findIndex((d) => d.code === params.country)].countryName}
            listHeight={400}
          >
            {
              COUNTRYOPTION.map((d) => (
                <Select.Option key={d.countryName}>
                  <NavLink
                    to={`../${COUNTRYOPTION[COUNTRYOPTION.findIndex((el) => el.countryName === d.countryName)].code}${pageURL}`}
                  >
                    {d.countryName}
                  </NavLink>
                </Select.Option>
              ))
            }
          </Select>
        </div>
        <NavContainer>
          <NavEl>
            <NavLink
              to={`../${params.country}/current-sdg-gaps`}
              style={({ isActive }) => ({
                paddingBottom: isActive ? '8px' : '',
                borderBottom: isActive ? '#006EB5 solid 3px' : '',
                color: !isActive ? 'var(--primaty-blue)' : '',
              })}
            >
              Current SDG Gaps
            </NavLink>
          </NavEl>
          <NavEl>
            <NavLink
              to={`../${params.country}/sdg-priorities`}
              style={({ isActive }) => ({
                paddingBottom: isActive ? '8px' : '',
                borderBottom: isActive ? '#006EB5 solid 3px' : '',
                color: !isActive ? 'var(--primaty-blue)' : '',
              })}
            >
              SDG Priorities
            </NavLink>
          </NavEl>
          <NavEl>
            <NavLink
              to={`../${params.country}/future-scenarios`}
              style={({ isActive }) => ({
                paddingBottom: isActive ? '8px' : '',
                borderBottom: isActive ? '#006EB5 solid 3px' : '',
                color: !isActive ? 'var(--primaty-blue)' : '',
              })}
            >
              Future Scenarios
            </NavLink>
          </NavEl>
        </NavContainer>
      </ContainerEl>
    </NavBarEl>
  );
};
