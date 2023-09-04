import { Tabs } from 'antd';
import { GraphEl } from './GraphEl';

export const InterlinkageOverview = () => {
  const regions = ['Global', 'RBA', 'RBAP', 'RBAS', 'RBEC', 'RBLAC'];
  const incomeGroup = ['Global', 'LIC', 'LMIC', 'UMIC', 'HIC'];

  const mainTabs = [
    {
      key: 'regions',
      label: 'By Regions',
      children: <GraphEl regions={regions} />,
    },
    {
      key: 'incomeGroups',
      label: 'By Income Groups',
      children: <GraphEl regions={incomeGroup} />,
    },
  ];
  return (
    <div className='margin-top-07'>
      <Tabs
        defaultActiveKey='dataExplorer'
        className='undp-tabs'
        items={mainTabs.map((d) => ({
          label: d.label,
          key: d.key,
          children: d.children,
        }))}
      />

    </div>
  );
};
