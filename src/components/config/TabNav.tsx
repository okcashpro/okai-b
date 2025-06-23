import React from 'react';
import { TabButton } from './TabButton';

interface TabNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  tabs: { id: string; label: string }[];
}

export function TabNav({ activeTab, onTabChange, tabs }: TabNavProps) {
  return (
    <div className="border-b border-gray-700">
      <div className="flex">
        {tabs.map(tab => (
          <TabButton
            key={tab.id}
            isActive={activeTab === tab.id}
            onClick={() => onTabChange(tab.id)}
          >
            {tab.label}
          </TabButton>
        ))}
      </div>
    </div>
  );
}