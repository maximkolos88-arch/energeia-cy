import React from 'react';
import { NewsFeedScreen } from '../components/NewsFeedScreen';

export interface ResearchFeedLayoutProps {
  language?: string;
  path?: string;
}

export const ResearchFeedLayout: React.FC<ResearchFeedLayoutProps> = ({
  language = 'en',
  path = '/research',
}) => {
  return (
    <div className="w-full bg-white dark:bg-[#131314] text-[#1F1F1F] dark:text-[#E3E3E3] transition-colors">
      <NewsFeedScreen language={language} path={path} />
    </div>
  );
};
