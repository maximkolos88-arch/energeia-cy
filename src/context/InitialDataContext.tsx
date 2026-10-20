import React, { createContext, useContext } from 'react';
import { NewsItem, DirectoryMember, MagazineIssue, AcademyCourse } from '../models/types';

export interface InitialData {
  newsItems?: NewsItem[];
  directoryMembers?: DirectoryMember[];
  magazines?: MagazineIssue[];
  courses?: AcademyCourse[];
  selectedArticle?: NewsItem | null;
}

const InitialDataContext = createContext<InitialData | undefined>(undefined);

export const InitialDataProvider: React.FC<{ value?: InitialData; children: React.ReactNode }> = ({ value, children }) => {
  return (
    <InitialDataContext.Provider value={value}>
      {children}
    </InitialDataContext.Provider>
  );
};

export const useInitialData = (): InitialData | undefined => {
  return useContext(InitialDataContext);
};
