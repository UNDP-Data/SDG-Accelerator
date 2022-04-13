import { Modal, Select } from 'antd';
import { NavLink } from 'react-router-dom';
import { COUNTRYOPTION } from './Constants';

export const HomePage = () => (
  <>
    <Modal
      title='Select A Country'
      visible
      className='countryModal'
      closable={false}
      centered
      maskStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.8)' }}
    >
      <Select
        listHeight={400}
        placeholder='Select A Country from the list'
        className='homeDropDown'
      >
        {
        COUNTRYOPTION.map((d) => (
          <Select.Option key={d.countryName}>
            <NavLink
              to={`../${COUNTRYOPTION[COUNTRYOPTION.findIndex((el) => el.countryName === d.countryName)].code}/current-sdg-gaps`}
            >
              {d.countryName}
            </NavLink>
          </Select.Option>
        ))
      }
      </Select>
    </Modal>
  </>
);
