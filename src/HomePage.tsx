/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/interactive-supports-focus */
/* eslint-disable jsx-a11y/anchor-is-valid */
import { DownOutlined } from '@ant-design/icons';
import { Dropdown, Menu, Modal } from 'antd';
import CountryTaxonomy from './Data/countryTaxonomy.json';

const menu = (
  <Menu>
    {
      CountryTaxonomy.map((d, i) => (
        <Menu.Item key={i}>
          <a rel='noopener noreferrer' href={`../current-sdg-gaps/${d['Alpha-3 code-1']}`}>
            {d['Country or Area']}
          </a>
        </Menu.Item>
      ))
    }
  </Menu>
);
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
      <Dropdown
        overlay={menu}
        arrow
        trigger={['hover', 'click']}
      >
        <a role='menuitem' className='modalSelect' onClick={(e) => e.preventDefault()}>
          <>
            Click or Hover Here to Select a Country
            {' '}
            <DownOutlined />
          </>
        </a>
      </Dropdown>
    </Modal>
  </>
);
